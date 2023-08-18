import { Coordinates } from "@src/interfaces";
import { TWrapper } from "@src/types";
import SVG from "..";

/** A derived SVG with a straight path */
export default class StraightSVG extends SVG {
  /**
   * Initializes a new instance of the SVG class.
   * @param master The master container of the widget.
   * @param from The origin wrapper name of the SVG.
   * @param to The destination wrapper name of the SVG.
   * @param color The color for the SVG.
   */
  constructor(master: JQuery<HTMLElement>, from: TWrapper, to: TWrapper, color: string) {
    super(master, from, to, color);
  }

  /** Generates a straight path */
  protected generatePathData(): string {
    const from: Coordinates = this.from.getCenterCoordinates();
    const to: Coordinates = this.to.getCenterCoordinates();

    return `M${from.x},${from.y} L${to.x},${to.y}`;
  }
}