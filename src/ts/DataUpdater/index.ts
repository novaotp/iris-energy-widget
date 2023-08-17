import WidgetContext, { DatasourceData } from "@src/interfaces";
import DataPoint from "../DataPoint";
import { Label } from "../../types";

/** The class responsible for ensuring that the data on the screen is up to date. */
export default class DataUpdater {
  /** The widget context */
  private ctx: WidgetContext;
  /** The default datapoints */
  private datapoints: Record<Label, DataPoint>;

  /**
   * Initializes a new instance of the DataUpdater class.
   * @param ctx The widget context
   * @param datapoints The default datapoints
   */
  constructor(ctx: WidgetContext, datapoints: Record<Label, DataPoint>) {
    this.ctx = ctx;
    this.datapoints = datapoints;
  }

  /** Returns the context's latest data */
  private getContextData(): DatasourceData[] {
    return this.ctx.defaultSubscription.data;
  }

  /** Disable all the datapoints */
  private disableDatapoints(): void {
    for (const datapoint of Object.values(this.datapoints)) {
      datapoint.disable()
    }
  }

  /** Handle carbon datapoint edge case */
  private handleCarbonDatapoint(): void {
    const data: DatasourceData = this.datapoints.APPENE.getData();
    data.data[0][1] = data.data[0][1] * 0.8 // Set the carbon value to 80% of the apparent energy value
    this.datapoints.CARBON.enable(data);
  }

  /** Handle empty ENERGYIMP edge case */
  private handleENERGYIMPDatapoint(): void {
    if (this.datapoints.ENERGYIMP.isDataEmpty()) {
      const data: DatasourceData = this.datapoints.APPENE.getData();
      this.datapoints.ENERGYIMP.enable(data);
    }
  }

  /** Enable specific datapoints */
  private enableSpecificDatapoints(): void {
    const getLabelFromData = (data: DatasourceData): Label => { return data.dataKey.label.split('-').at(-1)! as Label; }

    const contextData: DatasourceData[] = this.getContextData();

    for (const data of contextData) {
      const label = getLabelFromData(data);

      if (!this.datapoints[label]) {
        console.log("INVALID LABEL FOUND", label);
        continue
      }

      this.datapoints[label].enable(data);
    }

    this.handleCarbonDatapoint();
    this.handleENERGYIMPDatapoint();
  }

  /** The main function */
  public update(): void {
    this.disableDatapoints();
    this.enableSpecificDatapoints();
    console.log("FLOWCHART DIV", this.ctx.$container.find('.flowchart'))
  }
}