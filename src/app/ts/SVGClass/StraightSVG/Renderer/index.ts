import WidgetContext, { CenterMapRecord, Coordinates, Wrapper } from '@app/interfaces';
import { v4 as uniqueId } from 'uuid'
import centerMap from '../../CenterMap';

/** A class to create a straight SVG */
export default class Renderer {
  /** The widget context */
  private ctx: WidgetContext;
  /** The svg's id */
  private svgId: string;
  /** A unique id linking the path and the circle */
  private pathId: string;
  /** from The start position of the SVG */
  private from: Wrapper;
  /** The end position of the SVG */
  private to: Wrapper;
  /** The color of the SVG (and the circle) */
  private color: string;
  /** Show the circle or not */
  private includeCircle: boolean = false;
  /** The JQuery element for the master div */
  private masterDiv: JQuery<HTMLElement>;
  /** The JQuery element for the svg div */
  private svgDiv: JQuery<HTMLElement>;

  /**
   * @param ctx The widget context
   * @param svgId The SVG's unique ID
   * @param from The start position of the SVG
   * @param to The end position of the SVG
   * @param color The color of the SVG (and the circle)
   * @param includeCircle Show the circle or not
   */
  constructor(ctx: WidgetContext, svgId: string, from: Wrapper, to: Wrapper, color: string, includeCircle: boolean = true) {
    this.ctx = ctx;
    this.svgId = svgId;
    this.pathId = uniqueId();
    this.from = from;
    this.to = to;
    this.color = color;
    this.includeCircle = includeCircle;
    this.masterDiv = this.ctx.$container.find('.master');
    this.svgDiv = this.ctx.$container.find('.svg-bg');
  }

  /** Initialize the SVG */
  public init(): void {
    const newMap = centerMap(this.ctx)
    const from: Coordinates = newMap[this.from]
    const to: Coordinates = newMap[this.to]

    const pathData = `M${from.x},${from.y} L${to.x},${to.y}`;
    const viewBoxValue = `0 0 ${this.masterDiv.width()!} ${this.masterDiv.height()!}`;

    let svg = `
      <svg id=${this.svgId} class="svg-path" preserveAspectRatio="none" viewBox="${viewBoxValue}" xmlns="http://www.w3.org/2000/svg">
          <path id="${this.pathId}" d="${pathData}" stroke="${this.color}" fill="transparent" stroke-width="0.4"/>`;

    if (this.includeCircle) {
      svg += `
          <circle id="myCircle" r="1.2" fill="${this.color}">
              <animateMotion repeatCount="indefinite" dur="1s">
                  <mpath href="#${this.pathId}"/>
              </animateMotion>
          </circle>`;
    }

    svg += '</svg>';

    this.svgDiv.html(svg)
  }

  /** Show the SVG on the screen */
  public show(): void {
    this.svgDiv.find(`#${this.svgId}`).remove()
    this.init();
    this.svgDiv.find(`#${this.svgId}`).css("display", "initial")
  }

  /** Hide the SVG */
  public hide(): void {
    this.svgDiv.find(`#${this.svgId}`).css("display", "none")
  }
}
