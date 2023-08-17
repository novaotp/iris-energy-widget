import * as uuid from "uuid";
import Wrapper from "./Wrapper";
import { TWrapper } from "@src/types";

/** Represents the base class for SVG elements. */
export default abstract class SVG {
  /** A unique Id for the SVG element. */
  private svgId: string;
  /** A unique Id for the SVG path. */
  private pathId: string;
  /** The master container of the widget. */
  protected master: JQuery<HTMLElement>;
  /** The origin wrapper of the SVG. */
  protected from: Wrapper;
  /** The destination wrapper of the SVG. */
  protected to: Wrapper;
  /** Color for the SVG element. */
  private color: string;

  /**
   * Initializes a new instance of the SVG class.
   * @param master The master container of the widget.
   * @param from The origin wrapper name of the SVG.
   * @param to The destination wrapper name of the SVG.
   * @param color The color for the SVG.
   */
  constructor(master: JQuery<HTMLElement>, from: TWrapper, to: TWrapper, color: string) {
    this.svgId = uuid.v4();
    this.pathId = uuid.v4();

    this.master = master;
    this.from = new Wrapper(master, from);
    this.to = new Wrapper(master, to);
    this.color = color;

    this.init();
  }

  /** Generates the path data from the wrappers */
  protected abstract generatePathData(): string;

  /** Initializes the SVG. */
  protected init(): void {
    const pathData = this.generatePathData();
    const viewBoxValue = this.getViewBoxValue();
    const duration = this.getAnimationSpeed();
    const circleRadius = this.isMasterSizeUnderBreakpoint() ? 4 : 6;
    const keyTimes = "0;0.5;1"
    const keySplines = "0.1 0 0.9 1;0.1 0 0.9 1"

    let svg = `
      <svg id=${this.svgId} class="svg-path" preserveAspectRatio="none" viewBox="${viewBoxValue}" xmlns="http://www.w3.org/2000/svg">
          <path id="${this.pathId}" d="${pathData}" stroke="${this.color}" fill="transparent" stroke-width="2"/>
          <circle id="myCircle" r="${circleRadius}" fill="${this.color}">
              <animateMotion repeatCount="indefinite" dur="${duration}s" keyTimes="${keyTimes}" keySplines="${keySplines}">
                  <mpath href="#${this.pathId}"/>
              </animateMotion>
          </circle>
      </svg>`;

    this.addToDom(svg);
    this.hide();
  }

  /** Updates the SVG. */
  public update(): void {
    if (!this.from.isVisible() || !this.to.isVisible()) {
      this.hide();
      return;
    }

    this.restart();
    this.show();
  }

  public setNewColor(color: string): void {
    this.color = color;
  }

  /**
   * Checks if the master wrapper's size is under a
   * certain breakpoint.
   */
  protected isMasterSizeUnderBreakpoint(): boolean {
    const breakpoint = 350
    return (this.master.height()! < breakpoint || this.master.width()! < breakpoint)
  }

  /** Adds the SVG in the DOM */
  private addToDom(svg: string): void {
    this.master.find('.svg-bg').append(svg);
  }

  /** Restarts the SVG. */
  private restart(): void {
    this.master.find(`#${this.svgId}`).remove();
    this.init();
  }

  /** Gets the viewbox in pixels */
  private getViewBoxValue(): string {
    return `0 0 ${this.master.width()!} ${this.master.height()!}`;
  }

  /** Returns a fixed speed between 1s and 1.5s */
  private getAnimationSpeed(): number {
    const randomValue = (0.5 - Math.random()) / 2; // Range between -0.25 and 0.25
    const baseSpeed = 1.25;

    const speed = baseSpeed + randomValue; // Speed between 1 and 1.5s

    return speed;
  }

  /** Displays the SVG. */
  private show(): void {
    this.master.find(`#${this.svgId}`).css("display", "initial")
  }

  /** Hides the SVG. */
  private hide(): void {
    this.master.find(`#${this.svgId}`).css("display", "none")
  }
}
