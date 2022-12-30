import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DateTime } from 'luxon';
import { client, v2 } from '@datadog/datadog-api-client';
import { UrlMappingCounter, UrlMappingRate } from './urls.map';
import { Response, Request } from 'express';

@Injectable()
export class RequestMetadataInterceptor implements NestInterceptor {
  private metricsApi: v2.MetricsApi;
  private static SEND_METRICS = false;
  private static DATADOG_API_KEY = undefined;
  private static DATADOG_APP_KEY = undefined;

  constructor() {
    if (RequestMetadataInterceptor.SEND_METRICS) {
      const configuration = client.createConfiguration({
        authMethods: {
          apiKeyAuth: RequestMetadataInterceptor.DATADOG_API_KEY,
          appKeyAuth: RequestMetadataInterceptor.DATADOG_APP_KEY,
        },
      });
      this.metricsApi = new v2.MetricsApi(configuration);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startedAt = DateTime.now();
    return next.handle().pipe(
      tap(() => {
        if (RequestMetadataInterceptor.SEND_METRICS) {
          this.postRateMetric(context, startedAt);
          this.postCounterMetric(context);
        }
      }),
    );
  }

  private postRateMetric(context: ExecutionContext, startedAt: DateTime) {
    const rateMetricName = this.getRateMetricName(context);
    if (typeof rateMetricName === 'string') {
      const response: Response = context.switchToHttp().getResponse();
      const requestRateParams: v2.MetricsApiSubmitMetricsRequest = {
        body: {
          series: [
            {
              metric: rateMetricName,
              type: 2,
              unit: 'milliseconds',
              points: [
                {
                  timestamp: Math.ceil(DateTime.now().toUTC().toSeconds()),
                  value: DateTime.now().diff(startedAt, 'milliseconds')
                    .milliseconds,
                },
              ],
              tags: [`http_response_code:${response.statusCode}`],
              resources: [
                {
                  name: response.statusCode.toString(),
                  type: 'http_response_code',
                },
              ],
            } as any,
          ],
        },
      };
      this.metricsApi.submitMetrics(requestRateParams);
    }
  }

  private postCounterMetric(context: ExecutionContext) {
    const rateMetricName = this.getCounterMetricName(context);
    if (typeof rateMetricName === 'string') {
      const response: Response = context.switchToHttp().getResponse();
      const requestRateParams: v2.MetricsApiSubmitMetricsRequest = {
        body: {
          series: [
            {
              metric: rateMetricName,
              type: 1,
              unit: 'hits',
              points: [
                {
                  timestamp: Math.ceil(DateTime.now().toUTC().toSeconds()),
                  value: 1,
                },
              ],
              tags: [`http_response_code:${response.statusCode}`],
              resources: [
                {
                  name: response.statusCode.toString(),
                  type: 'http_response_code',
                },
              ],
            } as any,
          ],
        },
      };
      this.metricsApi.submitMetrics(requestRateParams);
    }
  }

  private getRateMetricName(context: ExecutionContext): string {
    const request: Request = context.switchToHttp().getRequest();
    return UrlMappingRate[`${request.method}:${request.path}`];
  }

  private getCounterMetricName(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    return UrlMappingCounter[`${request.method}:${request.path}`];
  }
}
