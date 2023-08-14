import { Coordinates, TWrapper } from "@app/interfaces";
import SVG from "..";

/** A derived SVG with a curved path */
export default class CurvedSVG extends SVG {
  /** The offset relative to the center of the origin wrapper */
  private fromOffset: Coordinates;
  /** The offset relative to the center of the destination wrapper */
  private toOffset: Coordinates;

  /**
   * @param master The master container of the widget.
   * @param from The origin wrapper name of the SVG.
   * @param to The destination wrapper name of the SVG.
   * @param color The color for the SVG.
   * @param fromOffset The offset relative to the center of the origin wrapper
   * @param toOffset The offset relative to the center of the destination wrapper
   */
  constructor(master: JQuery<HTMLElement>, from: TWrapper, to: TWrapper, color: string, fromOffset: Coordinates, toOffset: Coordinates) {
    super(master, from, to, color);

    this.fromOffset = fromOffset;
    this.toOffset = toOffset;
  }

  /* private getCurvaturePoint(): number {
    return this.toOffset.y < 0 ? 35 : 65;
  }

  protected generatePathData(): string {
    const from: Coordinates = this.from.getCenterCoordinates(this.fromOffset);
    const to: Coordinates = this.to.getCenterCoordinates(this.toOffset);

    const curvaturePoint = this.getCurvaturePoint();

    return `M${from.x},${from.y} L${curvaturePoint},${from.y} Q${from.y},${to.x} ${to.x},${curvaturePoint} L${to.x},${to.y}`;
  } */

  protected generatePathData(): string {
    const from: Coordinates = this.from.getCenterCoordinates();
    const to: Coordinates = this.to.getCenterCoordinates();

    return `M${from.x},${from.y} L${to.x},${to.y}`;
  }
}