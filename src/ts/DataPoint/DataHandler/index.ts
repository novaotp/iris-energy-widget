import { DatasourceData } from "@src/interfaces";

/** An class to handle the setting, retrieval and checking of the data */
export default class DataHandler {
  /** The data */
  public data: DatasourceData | undefined;
  /** A property that indicates wether the data is empty or not */
  public isDataEmpty: boolean = false;

  /**
   * Initializes a new instance of the DataHandler class.
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
   * Sets the data to a new one or undefined
   * @param newData The new data object
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

  /**
   * Helper function to either round or fix a number based on the provided precision
   * @param value The number to round
   * @param precision The number of decimals to fix to
   * @important If the precision is 0, the value will be rounded to the nearest integer
   */
  private roundValue(value: number, precision: number | null): number {
    if (precision === null) return value;
    return precision === 0 ? Math.round(value) : parseFloat(value.toFixed(precision));
  }

  /** Get the data's value, fixed/rounded if decimals is not null */
  private getValue(): any {
    const rawValue = this.data!.data[0][1];
    const precision = this.getDecimals();

    if (typeof rawValue === 'number') {
      return this.roundValue(rawValue, precision);
    }

    if (typeof rawValue === 'string') {
      const numberValue = parseFloat(rawValue);
      if (!isNaN(numberValue)) {
        return this.roundValue(numberValue, precision);
      } else {
        return rawValue;
      }
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