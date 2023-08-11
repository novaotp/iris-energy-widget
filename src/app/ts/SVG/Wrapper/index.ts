import { Coordinates, TWrapper } from "@app/interfaces";

export default class Wrapper {
  master: JQuery<HTMLElement>;
  wrapper: JQuery<HTMLElement>;

  constructor(master: JQuery<HTMLElement>, wrapper: TWrapper) {
    this.master = master;
    this.wrapper = this.master.find(`.${wrapper}-wrapper`);
  }

  public isVisible(): boolean {
    return this.wrapper.css("display") !== "none";
  }

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