import { Coordinates } from "@src/interfaces";
import { TWrapper } from "@src/types";

/** A class that gives a wrapper element some utility functions */
export default class Wrapper {
  /** The master JQuery element */
  private master: JQuery<HTMLElement>;
  /** The wrapper JQuery element */
  private wrapper: JQuery<HTMLElement>;

  /**
   * Initializes a new instance of the Wrapper class.
   * @param master The master JQuery element
   * @param wrapper The wrapper JQuery element
   */
  constructor(master: JQuery<HTMLElement>, wrapper: TWrapper) {
    this.master = master;
    this.wrapper = this.master.find(`.${wrapper}-wrapper`);
  }

  /** Checks if the wrapper is visible, returning true or false appropriately */
  public isVisible(): boolean {
    return this.wrapper.css("display") !== "none";
  }

  /** Returns the center coordinates of the wrapper. */
  public getCenterCoordinates(): Coordinates;
  /**
   * Returns the center coordinates of the wrapper with an added offset.
   * @param offset The offset to add to the center coordinates.
   */
  public getCenterCoordinates(offset: Coordinates): Coordinates;

  public getCenterCoordinates(offset?: Coordinates): Coordinates {
    let totalTop = this.wrapper.offset()!.top;
    let totalLeft = this.wrapper.offset()!.left;

    let $parent = this.wrapper.parent();

    while ($parent.length > 0 && !$parent.is(this.master)) {
      if ($parent.css('position') === 'relative') {
        totalTop += $parent.position().top;
        totalLeft += $parent.position().left;
      }
      $parent = $parent.parent();
    }

    const masterOffset = this.master.offset()!;

    const masterPadding = parseInt(this.master.css("padding-top"), 10);

    const relativeTop = (totalTop - masterOffset.top + this.master.scrollTop()! - masterPadding * 2) / 2;
    const relativeLeft = totalLeft - masterOffset.left + this.master.scrollLeft()! - masterPadding * 2;

    const center = {
      x: relativeLeft + this.wrapper.width()! / 2,
      y: relativeTop + this.wrapper.height()! / 2
    };

    // If offset is provided, adjust the center coordinates
    if (offset) {
      center.x += offset.x;
      center.y += offset.y;
    }

    return center;
  }

}