/** A class to handle the rendering of the data */
export default class Renderer {
  /** The JQuery wrapper object */
  private wrapper: JQuery<HTMLElement>;
  /** A JQuery wrapper object that has multiple datapoints */
  private superWrapper: JQuery<HTMLElement> | undefined;

  /**
   * Initializes a new instance of the Renderer class.
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

  /** Sets the color of the wrapper/superWrapper */
  public setColor(color: string) {
    if (this.superWrapper) {
      this.superWrapper.find('.circle').css("border-color", color);
    } else {
      this.wrapper.find('.circle').css("border-color", color);
    }
  }

  /** Sets the html icon of the wrapper/superWrapper */
  public setHTMLIcon(html: string) {
    console.log(this.wrapper, html);
    if (this.superWrapper) {
      this.superWrapper.find('.icon').html(html);
    } else {
      this.wrapper.find('.icon').html(html);
    }
  }

  /** Sets the icon color of the wrapper/superWrapper */
  public setIconColor(color: string) {
    if (this.superWrapper) {
      this.superWrapper.find('.icon i').css("fill", color);
    } else {
      this.wrapper.find('.icon i').css("fill", color);
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