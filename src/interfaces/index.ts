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

// Same props as SVGLabel
interface svgPathsColor {
  carbonToGrid: string;
  gridToHome: string;
  solarToBattery: string;
  gasToHome: string;
  waterToHome: string;
  solarToGrid: string;
  solarToHome: string;
  batteryToGrid: string;
  batteryToHome: string;
}

export type CircleBorderColor = keyof GenericWrapper;
export type HTMLIcon = keyof GenericWrapper;
export type IconColor = keyof GenericWrapper;

interface GenericWrapper {
  carbon: string;
  solar: string;
  gas: string;
  grid: string;
  home: string;
  battery: string;
  water: string;
}

interface specialInnerColor {
  ENERGYEXP: string;
  ENERGYIMP: string;
  ENRBATTCHRG: string;
  ENRBATTDISCH: string;
}

interface WidgetSettings {
  svgPathsColor?: svgPathsColor;
  circleBorderColor?: GenericWrapper;
  specialInnerColor?: specialInnerColor;
  iconColor?: GenericWrapper;
  iconHTML?: GenericWrapper;
}

export default interface WidgetContext {
  settings: WidgetSettings;
  defaultSubscription: IWidgetSubscription;
  $container: JQuery<HTMLElement>;
  detectChanges(): void;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface FontMapping {
  max: number,
  size: string,
}