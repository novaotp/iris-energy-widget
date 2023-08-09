import WidgetContext, { DatasourceData } from "@app/interfaces";

/**
 * The datapoint object of a specific set of data
 * @param ctx The widget context
 * @param dataObject The data object
 * @param wrapper The JQuery wrapper object
 * @param superWrapper A JQuery wrapper object that has multiple datapoints (ex. grid, battery)
 */
export default class DataPoint {
  /**
   * @param dataObject The data object
   */
  private dataObject: DatasourceData | undefined;
  /**
   * @param wrapper The JQuery wrapper object
   */
  private wrapper: JQuery<HTMLElement>;
  /**
   * @param superWrapper A JQuery wrapper object that has multiple datapoints
   */
  private superWrapper: JQuery<HTMLElement> | undefined;

  constructor(dataObject: DatasourceData | undefined, wrapper: JQuery<HTMLElement>, superWrapper?: JQuery<HTMLElement>) {
    this.dataObject = dataObject;
    this.wrapper = wrapper;
    this.superWrapper = superWrapper;
  }

  /**
   * Sets the data to a new one
   * @param newDataObject The new data object or undefined
   * @returns The datapoint object
   */
  public setDataObject(newDataObject: DatasourceData | undefined): this {
    this.dataObject = newDataObject;
    return this;
  }

  /**
   * Checks wether the datapoint's data object is empty or not, returning true or false appropriately.
   * @returns True if the data object is empty, false otherwise
   */
  public isDataObjectEmpty(): boolean {
    return this.dataObject === undefined ? true : false;
  }

  /** Get the data's units or an empty string */
  private getUnits(): string {
    return this.dataObject!.dataKey.units;
  }

  /** Get the data's decimals or null */
  private getDecimals(): number | null {
    return this.dataObject!.dataKey.decimals;
  }

  /** Get the data's value, rounded if decimals is not null */
  private getValue(): any {
    const rawValue = this.dataObject!.data[0][1];
    const precision = this.getDecimals();

    if (typeof rawValue === 'number') {
      return precision ? parseFloat(rawValue.toFixed(precision)) : rawValue;
    }

    if (typeof rawValue === 'string') {
      return isNaN(Number(rawValue)) ? rawValue : precision ? parseFloat(parseFloat(rawValue).toFixed(precision)) : parseFloat(rawValue);
    }

    if (typeof rawValue === 'object') {
      return JSON.parse(rawValue);
    }

    return rawValue;
  }

  /** Get the data to display */
  private getData(): string {
    return `${this.getValue()} ${this.getUnits()}`;
  }

  /**
   * Displays the latest data on the screen
   * @param show True to show data, false for an empty string
   * @returns The datapoint object
   */
  public displayData(show: boolean): this {
    this.wrapper.find('.usage').html(show ? this.getData() : "");
    return this;
  }

  /**
   * Sets the display of the energy source
   * @param show True to show the energy source, false otherwise
   */
  public showEnergySource(show: boolean): this {
    if (this.superWrapper) {
      this.superWrapper.css("display", show ? "flex" : "none")
      this.superWrapper.find('.icon').css("display", show ? "flex" : "none")
      this.wrapper.css("display", show ? "flex" : "none")
      this.wrapper.find('.inner-icon').css("display", show ? "flex" : "none")
    } else {
      this.wrapper.css("display", show ? "flex" : "none")
      this.wrapper.find('.icon').css("display", show ? "flex" : "none")
    }
    return this;
  }

  /**
   * Shorthand to enable the datapoint
   * @param newData The latest data
   */
  public enable(newData: DatasourceData): void {
    this.setDataObject(newData).showEnergySource(true).displayData(true);
  }

  /**
   * Shorthand to disable the datapoint
   */
  public disable(): void {
    this.setDataObject(undefined).showEnergySource(false).displayData(false);
  }
}