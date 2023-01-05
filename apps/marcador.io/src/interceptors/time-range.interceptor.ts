import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DateTime } from 'luxon';

interface WaitTime {
  totalCalls: number;
  latencyTimes: number[];
  maxLatencyTime: number;
}

@Injectable()
export class TimeRangeInterceptor implements NestInterceptor {
  private readonly timeRange = new Map<string, WaitTime>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startedAt = DateTime.now();
    return next.handle().pipe(
      tap(() => {
        this.handleWaitTime(startedAt);
      }),
    );
  }

  private handleWaitTime(startedAt: DateTime) {
    const now = DateTime.now();
    const latencyOnRequest = now.diff(startedAt, 'milliseconds').milliseconds;
    const timeKey = `${now.hour}:${now.minute}:${now.second}`;
    const value: WaitTime = this.timeRange.get(timeKey);
    if (typeof value === 'undefined') {
      for (const [key, range] of this.timeRange) {
        if (key !== timeKey) {
          Logger.log(
            `Max latency time: ${
              range.maxLatencyTime
            } ms, Avg latency time: ${Math.round(
              range.latencyTimes.reduce((prev, curr) => prev + curr) /
                range.latencyTimes.length,
            )} ms, Total calls: ${range.totalCalls}`,
          );
        }
      }
      this.timeRange.clear();
      this.timeRange.set(timeKey, {
        latencyTimes: [latencyOnRequest],
        maxLatencyTime: latencyOnRequest,
        totalCalls: 1,
      });
    } else {
      value.totalCalls++;
      value.latencyTimes.push(latencyOnRequest);
      value.maxLatencyTime = Math.max(value.maxLatencyTime, latencyOnRequest);
      this.timeRange.set(timeKey, value);
    }
  }
}
