import { Injectable } from '@nestjs/common';
import { client, v2 } from '@datadog/datadog-api-client';
import { CounterMetric, RateMetric } from '../monitor.metrics';
import { DateTime } from 'luxon';

@Injectable()
export class MetricsService {
  private metricsApi: v2.MetricsApi;
  private static SEND_METRICS = false;
  private static DATADOG_API_KEY = undefined;
  private static DATADOG_APP_KEY = undefined;

  constructor() {
    if (MetricsService.SEND_METRICS) {
      const configuration = client.createConfiguration({
        authMethods: {
          apiKeyAuth: MetricsService.DATADOG_API_KEY,
          appKeyAuth: MetricsService.DATADOG_APP_KEY,
        },
      });
      this.metricsApi = new v2.MetricsApi(configuration);
    }
  }

  public postRate(metric: RateMetric) {
    if (MetricsService.SEND_METRICS) {
      const requestRateParams: v2.MetricsApiSubmitMetricsRequest = {
        body: {
          series: [
            {
              metric: metric.name,
              type: 2,
              unit: 'milliseconds',
              points: [
                {
                  timestamp: Math.ceil(DateTime.now().toUTC().toSeconds()),
                  value: metric.value,
                },
              ],
            } as any,
          ],
        },
      };
      this.metricsApi.submitMetrics(requestRateParams);
    }
  }

  public incrementCounter(metric: CounterMetric) {
    if (MetricsService.SEND_METRICS) {
      const requestCounterParams: v2.MetricsApiSubmitMetricsRequest = {
        body: {
          series: [
            {
              metric: metric.name.toString(),
              type: 1,
              points: [
                {
                  timestamp: Math.ceil(DateTime.now().toUTC().toSeconds()),
                  value: metric.value ? metric.value : 1,
                },
              ],
            } as any,
          ],
        },
      };
      this.metricsApi.submitMetrics(requestCounterParams);
    }
  }
}
