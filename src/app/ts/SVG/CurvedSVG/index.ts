import { Coordinates } from "@app/interfaces";
import SVG from "..";
import { TOffsetDirection, TWrapper } from "@app/types";

/** A derived SVG with a curved path */
export default class CurvedSVG extends SVG {
  /** The offset direction relative to the center of the origin wrapper */
  private fromOffsetDirection: TOffsetDirection;
  /** The offset direction relative to the center of the destination wrapper */
  private toOffsetDirection: TOffsetDirection;

  /**
   * @param master The master container of the widget.
   * @param from The origin wrapper name of the SVG.
   * @param to The destination wrapper name of the SVG.
   * @param color The color for the SVG.
   * @param fromOffset The offset relative to the center of the origin wrapper
   * @param toOffset The offset relative to the center of the destination wrapper
   */
  constructor(master: JQuery<HTMLElement>, from: TWrapper, to: TWrapper, color: string, fromOffsetDirection: TOffsetDirection, toOffsetDirection: TOffsetDirection) {
    super(master, from, to, color);

    this.fromOffsetDirection = fromOffsetDirection;
    this.toOffsetDirection = toOffsetDirection;
  }

  private getCoordinatesFromOffsetDirection(offset: number, offsetDirection: TOffsetDirection): Coordinates {
    switch (offsetDirection) {
      case 'top':
        return { x: 0, y: -offset };
      case 'bottom':
        return { x: 0, y: offset };
      case 'left':
        return { x: -offset, y: 0 };
      case 'right':
        return { x: offset, y: 0 };
    }
  }

  protected generatePathData(): string {
    const offset = this.isMasterSizeUnderBreakpoint() ? 10 : 20;

    const fromOffset = this.getCoordinatesFromOffsetDirection(offset, this.fromOffsetDirection);
    const toOffset = this.getCoordinatesFromOffsetDirection(offset, this.toOffsetDirection);

    const from: Coordinates = this.from.getCenterCoordinates(fromOffset);
    const to: Coordinates = this.to.getCenterCoordinates(toOffset);

    const curveMagnitude = 60;

    // Determine points before and after curve for the lines
    const startCurvePoint = {
      x: from.x,
      y: to.y + (from.y < this.master.height()! / 2 ? -curveMagnitude : curveMagnitude)
    };

    const endCurvePoint = {
      x: from.x + (to.x < this.master.width()! / 2 ? -curveMagnitude : curveMagnitude),
      y: to.y
    };

    // Adjusted control points for the curve
    const controlPoint1 = {
      x: from.x,
      y: startCurvePoint.y + (from.y < this.master.height()! / 2 ? curveMagnitude : -curveMagnitude)
    };

    const controlPoint2 = {
      x: endCurvePoint.x,
      y: to.y
    };

    return `M${from.x},${from.y} L${startCurvePoint.x},${startCurvePoint.y} Q${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} L${to.x},${to.y}`;
  }
}