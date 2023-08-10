import WidgetContext, { CenterMapRecord } from "@app/interfaces";

/**
 * The class responsible for providing a record of the center positions of the wrappers.
 * 
 * Overly complex. Will break on any changes.
 */
class CenterMap {
  /**
   * @param ctx The widget context
   */
  private ctx: WidgetContext;

  private masterDiv: JQuery<HTMLElement>;
  private carbonDiv: JQuery<HTMLElement>;
  private solarDiv: JQuery<HTMLElement>;
  private gasDiv: JQuery<HTMLElement>;
  private gridDiv: JQuery<HTMLElement>;
  private homeDiv: JQuery<HTMLElement>;
  private batteryDiv: JQuery<HTMLElement>;
  private waterDiv: JQuery<HTMLElement>;
  private row3: JQuery<HTMLElement>;

  /**
   * @param ctx The widget context
   */
  constructor(ctx: WidgetContext) {
    this.ctx = ctx;
    
    this.masterDiv = this.ctx.$container.find('.master');
    this.carbonDiv = this.ctx.$container.find('.carbon-wrapper');
    this.solarDiv = this.ctx.$container.find('.solar-wrapper');
    this.gasDiv = this.ctx.$container.find('.gas-wrapper');
    this.gridDiv = this.ctx.$container.find('.grid-wrapper');
    this.homeDiv = this.ctx.$container.find('.home-wrapper');
    this.batteryDiv = this.ctx.$container.find('.battery-wrapper');
    this.waterDiv = this.ctx.$container.find('.water-wrapper');
    this.row3 = this.ctx.$container.find('.row3');
  }

  /** Get the row and column counts */
  private getRowsAndColumns(): [number, number] {
    const rowCount = this.row3.css("display") === "none" ? 2 : 3;
    const columnCount = (this.batteryDiv.css("display") === "none" && this.solarDiv.css("display") === "none") ? 2 : 3;

    return [rowCount, columnCount]
  }

  /** Returns a record with the center x and y of each datapoint's wrapper */
  public getCenterMap(): CenterMapRecord {
    const masterWidth = this.masterDiv.width()!;
    const masterHeight = this.masterDiv.height()!;
    const [rowCount, columnCount] = this.getRowsAndColumns();

    return {
      carbon: {
        x: 0 + this.carbonDiv.width()! / 2,
        y: 0 + this.carbonDiv.height()! / 2,
      },
      solar: {
        x: masterWidth / columnCount + this.solarDiv.width()! / 2,
        y: 0 + this.solarDiv.height()! / 2,
      },
      gas: {
        x: (columnCount === 2 ? masterWidth / columnCount : masterWidth / columnCount * 2) + this.gasDiv.width()! / 2,
        y: 0 + this.gasDiv.height()! / 2,
      },
      grid: {
        x: 0 + this.gridDiv.width()! / 2,
        y: masterHeight / rowCount + this.gridDiv.height()! / 2,
      },
      home: {
        x: (columnCount === 2 ? masterWidth / columnCount : masterWidth / columnCount * 2) + this.homeDiv.width()! / 2,
        y: masterHeight / rowCount + this.homeDiv.height()! / 2,
      },
      battery: {
        x: masterWidth / columnCount + this.batteryDiv.width()! / 2,
        y: masterHeight / rowCount * 2 + this.batteryDiv.height()! / 2,
      },
      water: {
        x: (columnCount === 2 ? masterWidth / columnCount : masterWidth / columnCount * 2) + this.waterDiv.width()! / 2,
        y: masterHeight / rowCount * 2 + this.waterDiv.height()! / 2,
      }
    }
  }
}

/**
 * Returns a copy of the center map
 * @param ctx The widget context
 */
export default function centerMap(ctx: WidgetContext): CenterMapRecord {
  return new CenterMap(ctx).getCenterMap();
} 