import WidgetContext from "@app/interfaces";
import DataPoint from "@app/ts/DataPoint";
import { Label } from "../../types";

export default class GenericResizer {
  private ctx: WidgetContext;
  private datapoints: Record<Label, DataPoint>
  private rows: JQuery<HTMLElement>;
  private flowchart: JQuery<HTMLElement>;
  private wrappers: JQuery<HTMLElement>;
  private circles: JQuery<HTMLElement>;
  private row3: JQuery<HTMLElement>;

  constructor(ctx: WidgetContext, datapoints: Record<Label, DataPoint>) {
    this.ctx = ctx;
    this.datapoints = datapoints;

    this.rows = this.ctx.$container.find('.rows');
    this.flowchart = this.ctx.$container.find('.flowchart');
    this.wrappers = this.ctx.$container.find('.wrapper');
    this.circles = this.ctx.$container.find('.circle');
    this.row3 = this.ctx.$container.find('.row3');
  }

  /**
   * @returns True if the last row (battery and water) is empty, false otherwise.
   */
  private isLastRowEmpty(): boolean {
    if (this.datapoints.BATTPERCENT.isDataObjectEmpty() &&
        this.datapoints.ENRBATTCHRG.isDataObjectEmpty() &&
        this.datapoints.ENRBATTDISCH.isDataObjectEmpty() &&
        this.datapoints.WATER.isDataObjectEmpty()
    ) {
      return true;
    }

    return false;
  }

  private resizeRows() {
    if (this.isLastRowEmpty()) {
      this.rows.css("height", this.flowchart.height()! / 2)
      this.row3.css("display", "none")
    } else {
      this.rows.css("height", this.flowchart.height()! / 3)
      this.row3.css("display", "flex")
    }
  }

  /**
   * @returns True if the middle column (solar, battery) is empty, false otherwise.
   */
  private isMiddleColumnEmpty(): boolean {
    if (this.datapoints.BATTPERCENT.isDataObjectEmpty() &&
        this.datapoints.ENRBATTCHRG.isDataObjectEmpty() &&
        this.datapoints.ENRBATTDISCH.isDataObjectEmpty() &&
        this.datapoints.ENRTOTPROD.isDataObjectEmpty()
    ) {
      return true;
    }

    return false;
  }

  private resizeColumns() {
    if (this.isMiddleColumnEmpty()) {
      this.wrappers.css("width", this.flowchart.width()! / 2)
    } else {
      this.wrappers.css("width", this.flowchart.width()! / 3)
    }
  }

  private resizeCircles() {
    const minSize = Math.min(this.wrappers.width()!, this.wrappers.height()!) * 0.7;
    this.circles.css("width", minSize).css("height", minSize);
  }

  public all() {
    this.resizeRows();
    this.resizeColumns();
    this.resizeCircles();
  }
}