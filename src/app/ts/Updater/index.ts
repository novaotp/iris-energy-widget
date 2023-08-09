import WidgetContext, { DatasourceData } from "@app/interfaces";
import DataPoint from "../DataPoint";
import { Label } from "../../types";

/**
 * The Updater class is responsible for ensuring that the data on the screen is up to date.
 * @param ctx The widget context
 * @returns The updater object
 */
export default class Updater {
  /**
   * @param ctx The widget context
   */
  private ctx: WidgetContext;
  /**
   * @param datapoints The default datapoints
   */
  private datapoints: Record<Label, DataPoint>;

  constructor(ctx: WidgetContext, datapoints: Record<Label, DataPoint>) {
    this.ctx = ctx;
    this.datapoints = datapoints;
  }

  /**
   * Returns the context's data
   * @returns The context's data
   */
  private getContextData(): DatasourceData[] {
    return this.ctx.defaultSubscription.data;
  }

  private disableDatapoints() {
    for (const datapoint of Object.values(this.datapoints)) {
      datapoint.disable()
    }
  }

  /** The main function */
  public update(): void {
    const contextData = this.getContextData();

    for (const data of contextData) {
      const label: Label = data.dataKey.label.split('-').at(-1)! as Label;

      // Check if the label exists as a key in this.datapoints
      if (this.datapoints[label]) {
        this.datapoints[label].enable(data);
  
        // Specific handling for the "APPENE" case
        if (label === "APPENE") {
          this.datapoints.CARBON.enable(data);
        }
      } else {
        console.log("INVALID LABEL FOUND", label);
      }
    }
  }
}