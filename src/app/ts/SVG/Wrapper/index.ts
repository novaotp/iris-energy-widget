import { Coordinates, TWrapper } from "@app/interfaces";

export default class Wrapper {
  private master: JQuery<HTMLElement>;
  private wrapper: JQuery<HTMLElement>;

  constructor(master: JQuery<HTMLElement>, wrapper: TWrapper) {
    this.master = master;
    this.wrapper = this.master.find(`.${wrapper}-wrapper`);
  }

  /** Checks if the wrapper is visible, returning true or false appropriately */
  public isVisible(): boolean {
    return this.wrapper.css("display") !== "none";
  }

  /** Returns the current usage value of the wrapper */
  public getValue(): number {
    return Number(this.wrapper.find('.usage').html().split(" ")[0]);
  }

  /**
   * Returns the center coordinates of the wrapper.
   * Complex but works for every wrapper element, so
   * this is the only way to get the center coordinates.
   */
  public getCenterCoordinates(): Coordinates {
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

    return {
      x: relativeLeft + this.wrapper.width()! / 2,
      y: relativeTop + this.wrapper.height()! / 2
    };
  }
}