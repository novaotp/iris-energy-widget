import { v4 } from "uuid";

/** Represents the base class for SVG elements. */
export default abstract class SVG {
  /** A unique Id for the SVG element. */
  protected svgId: string;
  /** A unique Id for the SVG path. */
  protected pathId: string;
  /** Color for the SVG element. */
  protected color: string;
  /** Determines if the SVG should include a circle. */
  protected includeCircle: boolean;
  /** The master container of the widget. */
  protected master: JQuery<HTMLElement>;

  /**
   * Initializes a new instance of the SVG class.
   * @param master - The master container of the widget.
   * @param color - The color for the SVG.
   * @param includeCircle - Whether the SVG includes a circle.
   */
  constructor(master: JQuery<HTMLElement>, color: string, includeCircle: boolean = true) {
    this.svgId = v4();
    this.pathId = v4();
    console.log(this.pathId)

    this.master = master;
    this.color = color;
    this.includeCircle = includeCircle;
  }

  /** Initializes the SVG. */
  protected abstract init(): void;

  /** Updates the SVG. */
  public abstract update(): void;

  /** Generate the path data from the wrappers */
  protected abstract generatePathData(): string;

  /** Restarts the SVG. */
  protected restart(): void {
    this.master.find(`#${this.svgId}`).remove();
    this.init();
  }

  /** Get the viewbox in pixels */
  protected getViewBoxValue(): string {
    return `0 0 ${this.master.width()!} ${this.master.height()!}`;
  }

  /** Returns a fixed speed between 1s and 1.5s */
  protected getAnimationSpeed(): number {
    const randomValue = (0.5 - Math.random()) / 2; // Range between -0.25 and 0.25
    const baseSpeed = 1.25;

    const speed = baseSpeed + randomValue; // Speed between 1 and 1.5s

    return speed;
  }

  /** Displays the SVG. */
  protected show(): void {
    this.master.find(`#${this.svgId}`).css("display", "initial")
  }

  /** Hides the SVG. */
  protected hide(): void {
    this.master.find(`#${this.svgId}`).css("display", "none")
  }
}
