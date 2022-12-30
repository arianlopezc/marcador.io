export enum RateMetricName {
  ProcessOperationRate = 'item.operation.rate',
}

export enum CounterMetricName {
  ProcessOperationCounter = 'item.operation.rate',
}

export type RateMetric = {
  name: RateMetricName;
  value: number;
};

export type CounterMetric = {
  name: CounterMetricName;
  value?: number;
};
