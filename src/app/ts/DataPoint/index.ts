import { DatasourceData } from "@app/interfaces";
import DataHandler from "./DataHandler";
import Renderer from "./Renderer";

/** A high-level class for handling a datapoint */
export default class DataPoint {
  /**
   * @param dataHandler The class responsible for handling the data in the datapoint class
   */
  private dataHandler: DataHandler;
  /**
   * @param renderer The class responsible for rendering the datapoint's data
   */
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

  public isDataEmpty(): boolean {
    return this.dataHandler.isDataEmpty;
  }

  /**
   * Enable the datapoint
   * @param newData The latest data
   */
  public enable(newData: DatasourceData): void {
    this.dataHandler.setDataObject(newData);
    this.renderer.showAll(this.dataHandler.getUsage());
  }

  /** Disable the datapoint */
  public disable(): void {
    this.dataHandler.setDataObject(undefined);
    this.renderer.hideAll();
  }
}