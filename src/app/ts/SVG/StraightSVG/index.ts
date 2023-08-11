import { Coordinates, TWrapper } from "@app/interfaces";
import SVG from "..";
import Wrapper from "../Wrapper";

export default class StraightSVG extends SVG {
  /** The origin wrapper of the SVG. */
  from: Wrapper;
  /** The destination wrapper of the SVG. */
  to: Wrapper;

  /**
   * Initializes a new instance of the SVG class.
   * @param master The master container of the widget.
   * @param from The origin wrapper name of the SVG.
   * @param to The destination wrapper name of the SVG.
   * @param color The color for the SVG.
   * @param includeCircle Whether the SVG includes a circle.
   */
  constructor(master: JQuery<HTMLElement>, from: TWrapper, to: TWrapper, color: string, includeCircle: boolean = true) {
    super(master, color, includeCircle);

    this.from = new Wrapper(master, from);
    this.to = new Wrapper(master, to);

    this.init();
  }

  /** Get the path data from the wrappers */
  private getPathData(): string {
    const from: Coordinates = this.from.getCenterCoordinates();
    const to: Coordinates = this.to.getCenterCoordinates();

    return `M${from.x},${from.y} L${to.x},${to.y}`;
  }

  /**
   * Returns a normalized animation speed
   * @deprecated In favor of a fixed speed.
   * @see {@link getAnimationSpeed}
   */
  private getAnimationSpeed2(): number {
    const value = this.from.getValue();

    const minValue = 0;
    const maxValue = 500;

    const minSpeed = 5;   // Slowest animation (in seconds)
    const maxSpeed = 0.5; // Fastest animation (in seconds)

    // Clamp value between minValue and maxValue to avoid unexpected results
    const clampedValue = Math.max(minValue, Math.min(value, maxValue));

    // Linearly map value to speed
    const speed = ((maxValue - clampedValue) / (maxValue - minValue)) * (minSpeed - maxSpeed) + maxSpeed;

    return speed;
  }

  /** Returns a fixed speed between  */
  private getAnimationSpeed(): number {
    const randomValue = (0.5 - Math.random()) / 2; // Range between -0.25 and 0.25
    const baseSpeed = 1.25;

    const speed = baseSpeed + randomValue; // Speed between 1 and 1.5s

    return speed;
  }

  protected init(): void {
    const pathData = this.getPathData();
    const viewBoxValue = this.getViewBoxValue();
    const duration = this.getAnimationSpeed();

    let svg = `
      <svg id=${this.svgId} class="svg-path" preserveAspectRatio="none" viewBox="${viewBoxValue}" xmlns="http://www.w3.org/2000/svg">
          <path id="${this.pathId}" d="${pathData}" stroke="${this.color}" fill="transparent" stroke-width="2"/>`;

    if (this.includeCircle) {
      svg += `
          <circle id="myCircle" r="6" fill="${this.color}">
              <animateMotion repeatCount="indefinite" dur="${duration}s">
                  <mpath href="#${this.pathId}"/>
              </animateMotion>
          </circle>`;
    }

    svg += '</svg>';

    this.master.find('.svg-bg').append(svg);
    this.hide();
  }

  update(): void {
    if (!this.from.isVisible() || !this.to.isVisible()) {
      this.hide();
      return;
    }

    this.master.find(`#${this.svgId}`).attr("viewBox", this.getViewBoxValue());
    this.master.find(`#${this.pathId}`).attr("d", this.getPathData());
    this.restart();
    this.show();
  }
}