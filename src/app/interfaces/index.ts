export interface IWidgetSubscription {
  loadingData: boolean;
  data: Array<DatasourceData>;
}

export interface DatasourceData {
  datasource: Object;
  dataKey: {
    label: string;
    decimals: number | null;
    units: string;
  };
  data: any[][];
}

export default interface WidgetContext {
  defaultSubscription: IWidgetSubscription;
  $container: JQuery<HTMLElement>;
  detectChanges(): void;
}