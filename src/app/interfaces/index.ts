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

export interface Coordinates {
  /** The horizontal coordinate */
  x: number;
  /** The vertical coordinate */
  y: number;
}

export type TWrapper = 'carbon' | 'solar' | 'gas' | 'grid' | 'home' | 'battery' | 'water';