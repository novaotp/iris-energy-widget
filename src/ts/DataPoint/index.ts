import { DatasourceData } from "@src/interfaces";
import DataHandler from "./DataHandler";
import Renderer from "./Renderer";

/** A high-level class for handling a datapoint */
export default class DataPoint {
  /** The class responsible for handling the data in the datapoint class */
  private dataHandler: DataHandler;
  /** The class responsible for rendering the datapoint's data */
  private renderer: Renderer;

  /**
   * @param dataObject The data object
   * @param wrapper The JQuery wrapper object
   * @param superWrapper A JQuery wrapper object that has multiple datapoints
   */
  constructor(dataObject: DatasourceData | undefined, wrapper: JQuery<HTMLElement>, superWrapper?: JQuery<HTMLElement>) {
    this.dataHandler = new DataHandler(dataObject);
    this.renderer = new Renderer(wrapper, superWrapper);
  }

  /** Returns a boolean based on wether the data is empty or not */
  public isDataEmpty(): boolean {
    return this.dataHandler.isDataEmpty;
  }

  /** Returns the datapoint's data */
  public getData(): DatasourceData {
    return this.dataHandler.data!;
  }

  public setBorderColor(color: string): void {
    this.renderer.setColor(color)
  }

  /**
   * Enables the datapoint with the given data
   * @param newData The latest data
   */
  public enable(newData: DatasourceData): void {
    this.dataHandler.setDataObject(newData);
    this.renderer.showAll(this.dataHandler.getUsage());
  }

  /** Disables the datapoint */
  public disable(): void {
    this.dataHandler.setDataObject(undefined);
    this.renderer.hideAll();
  }
}