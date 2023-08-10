/** A class to handle the rendering of the data */
export default class Renderer {
  /**
   * @param wrapper The JQuery wrapper object
   */
  private wrapper: JQuery<HTMLElement>;
  /**
   * @param superWrapper A JQuery wrapper object that has multiple datapoints
   */
  private superWrapper: JQuery<HTMLElement> | undefined;

  /**
   * @param wrapper The JQuery wrapper object
   * @param superWrapper A JQuery wrapper object that has multiple datapoints (optional)
   */
  constructor(wrapper: JQuery<HTMLElement>, superWrapper?: JQuery<HTMLElement>) {
    this.wrapper = wrapper;
    this.superWrapper = superWrapper;
  }

  /**
   * Displays the latest data on the screen
   * @param show True to show data, false for an empty string
   * @returns The datapoint object
   */
  private hideData(): this {
    this.wrapper.find('.usage').html("");
    return this;
  }

  /**
   * Displays the latest data on the screen
   * @param show True to show data, false for an empty string
   * @returns The datapoint object
   */
  private showData(data: string): this {
    this.wrapper.find('.usage').html(data);
    return this;
  }

  /** Shows the wrapper */
  private showWrapper(): this {
    if (this.superWrapper) {
      this.superWrapper.css("display", "flex")
      this.superWrapper.find('.icon').css("display", "flex")
      this.wrapper.css("display", "flex")
      this.wrapper.find('.inner-icon').css("display", "flex")
    } else {
      this.wrapper.css("display", "flex")
      this.wrapper.find('.icon').css("display", "flex")
    }
    return this;
  }

  /** Hides the wrapper */
  private hideWrapper(): this {
    if (this.superWrapper) {
      this.superWrapper.css("display", "none")
      this.superWrapper.find('.icon').css("display", "none")
      this.wrapper.css("display", "none")
      this.wrapper.find('.inner-icon').css("display", "none")
    } else {
      this.wrapper.css("display", "none")
      this.wrapper.find('.icon').css("display", "none")
    }
    return this;
  }

  /** Hides the data from the screen */
  public hideAll(): void {
    this.hideData().hideWrapper();
  }

  /**
   * Shows the latest data on the screen
   * @param data The data to show
   */
  public showAll(data: string): void {
    this.showData(data).showWrapper();
  }
}