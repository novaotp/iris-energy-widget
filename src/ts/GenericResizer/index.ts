import WidgetContext, { FontMapping } from "@src/interfaces";
import DataPoint from "@src/ts/DataPoint";
import Renderer from "../DataPoint/Renderer"; // Only for linking purposes
import { Label } from "../../types";

/**
 * The class responsible for overall responsiveness.
 * For the wrappers' displaying, look into the
 * Datapoint's {@link Renderer} class.
 */
export default class GenericResizer {
  /** The widget context */
  private ctx: WidgetContext;
  /** The datapoints */
  private datapoints: Record<Label, DataPoint>
  /** The JQuery element for the rows */
  private rows: JQuery<HTMLElement>;
  /** The JQuery element for the flowchart */
  private flowchart: JQuery<HTMLElement>;
  /** The JQuery element for the wrappers */
  private wrappers: JQuery<HTMLElement>;
  /** The JQuery element for the circles */
  private circles: JQuery<HTMLElement>;
  /** The JQuery element for the row3 */
  private row3: JQuery<HTMLElement>;

  /**
   * @param ctx The widget context
   * @param datapoints The datapoints
   */
  constructor(ctx: WidgetContext, datapoints: Record<Label, DataPoint>) {
    this.ctx = ctx;
    this.datapoints = datapoints;

    this.rows = this.ctx.$container.find('.rows');
    this.flowchart = this.ctx.$container.find('.flowchart');
    this.wrappers = this.ctx.$container.find('.wrapper');
    this.circles = this.ctx.$container.find('.circle');
    this.row3 = this.ctx.$container.find('.row3');
  }

  /** True if the last row (battery and water) is empty, false otherwise. */
  private isLastRowEmpty(): boolean {
    if (this.datapoints.BATTPERCENT.isDataEmpty() &&
      this.datapoints.ENRBATTCHRG.isDataEmpty() &&
      this.datapoints.ENRBATTDISCH.isDataEmpty() &&
      this.datapoints.WATER.isDataEmpty()
    ) {
      return true;
    }

    return false;
  }

  /** Resizes the rows based on the last row */
  private resizeRows(): void {
    if (this.isLastRowEmpty()) {
      this.rows.css("height", this.flowchart.height()! / 2)
      this.row3.css("display", "none")
    } else {
      this.rows.css("height", this.flowchart.height()! / 3)
      this.row3.css("display", "flex")
    }
  }

  /** True if the middle column (solar, battery) is empty, false otherwise. */
  private isMiddleColumnEmpty(): boolean {
    if (this.datapoints.BATTPERCENT.isDataEmpty() &&
      this.datapoints.ENRBATTCHRG.isDataEmpty() &&
      this.datapoints.ENRBATTDISCH.isDataEmpty() &&
      this.datapoints.ENRTOTPROD.isDataEmpty()
    ) {
      return true;
    }

    return false;
  }

  /** Resizes the columns based on the middle one */
  private resizeColumns(): void {
    if (this.isMiddleColumnEmpty()) {
      this.wrappers.css("width", this.flowchart.width()! / 2)
    } else {
      this.wrappers.css("width", this.flowchart.width()! / 3)
    }
  }

  /** Resizes the circles based on the wrapper's size */
  private resizeCircles(): void {
    const minSize = Math.min(this.wrappers.width()!, this.wrappers.height()!) * 0.7;
    this.circles.css("width", minSize).css("height", minSize);
  }

  /** Resizes the fonts after reaching a breakpoint */
  private handleFontSizes(): void {
    const fontMappings: FontMapping[] = [
      { max: 400, size: '10px' },
      { max: 600, size: '12px' }
    ];

    const width = self.ctx.$container.width()!;
    const height = self.ctx.$container.height()!;

    for (let mapping of fontMappings) {
      if (width < mapping.max || height < mapping.max) {
        this.ctx.$container.find('.inner-icon, .usage').css("font-size", mapping.size);
        return; // Return if the font size has been changed
      }
    }

    this.ctx.$container.find('.inner-icon, .usage').css("font-size", '14px'); // Set the font size to 14px by default
  }

  /** Resizes everything */
  public resize(): void {
    this.resizeRows();
    this.resizeColumns();
    this.resizeCircles();
    this.handleFontSizes();
  }
}