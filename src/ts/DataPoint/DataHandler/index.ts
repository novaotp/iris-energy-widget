import { DatasourceData } from "@src/interfaces";

/** An class to handle the setting, retrieval and checking of the data */
export default class DataHandler {
  /**
   * @param data The data
   */
  public data: DatasourceData | undefined;
  /**
   * @param isDataEmpty A property that indicates wether the data is empty or not
   */
  public isDataEmpty: boolean = false;

  /**
   * @param data The data object to handle
   */
  constructor(data: DatasourceData | undefined) {
    this.data = data;
    this.setDataEmpty();
  }

  /** Sets the ```isDataEmpty``` property appropriately */
  private setDataEmpty(): void {
    this.isDataEmpty = this.data === undefined;
  }

  /**
   * Sets the data to a new one
   * @param newData The new data object or undefined
   */
  public setDataObject(newData: DatasourceData | undefined): void {
    this.data = newData;
    this.setDataEmpty();
  }

  /** Get the data's units or an empty string */
  private getUnits(): string {
    return this.data!.dataKey.units ?? "";
  }

  /** Get the data's decimals or null */
  private getDecimals(): number | null {
    return this.data!.dataKey.decimals;
  }

  /** Get the data's value, rounded if decimals is not null */
  private getValue(): any {
    const rawValue = this.data!.data[0][1];
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
  public getUsage(): string {
    return `${this.getValue()} ${this.getUnits()}`;
  }
}