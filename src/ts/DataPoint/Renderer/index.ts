/** A class to handle the rendering of the data */
export default class Renderer {
  /** The JQuery wrapper object */
  private wrapper: JQuery<HTMLElement>;
  /** A JQuery wrapper object that has multiple datapoints */
  private superWrapper: JQuery<HTMLElement> | undefined;

  /**
   * @param wrapper The JQuery wrapper object
   * @param superWrapper A JQuery wrapper object that has multiple datapoints (optional)
   */
  constructor(wrapper: JQuery<HTMLElement>, superWrapper?: JQuery<HTMLElement>) {
    this.wrapper = wrapper;
    this.superWrapper = superWrapper;
  }

  /** Hides the data on the screen */
  private hideData(): void {
    this.wrapper.find('.usage').html("");
  }

  /** Displays the data on the screen */
  private showData(data: string): void {
    this.wrapper.find('.usage').html(data);
  }

  /** Shows the wrapper */
  private showWrapper(): void {
    if (this.superWrapper) {
      this.superWrapper.css("display", "flex")
      this.superWrapper.find('.icon').css("display", "flex")
      this.wrapper.css("display", "flex")
      this.wrapper.find('.inner-icon').css("display", "flex")
    } else {
      this.wrapper.css("display", "flex")
      this.wrapper.find('.icon').css("display", "flex")
    }
  }

  /** Hides the wrapper */
  private hideWrapper(): void {
    if (this.superWrapper) {
      this.superWrapper.css("display", "none")
      this.superWrapper.find('.icon').css("display", "none")
      this.wrapper.css("display", "none")
      this.wrapper.find('.inner-icon').css("display", "none")
    } else {
      this.wrapper.css("display", "none")
      this.wrapper.find('.icon').css("display", "none")
    }
  }

  /** Hides the data from the screen */
  public hideAll(): void {
    this.hideData()
    this.hideWrapper();
  }

  /**
   * Shows the latest data on the screen
   * @param data The data to show
   */
  public showAll(data: string): void {
    this.showData(data)
    this.showWrapper();
  }
}