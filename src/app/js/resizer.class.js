import SVGUpdater from "./svgUpdater.class.js";

export default class Resizer {
  /**
   * Initializes a new instance of the Resizer class.
   * 
   * @param {Object} ctx - The context object containing jQuery references.
   */
  constructor(ctx) {
    this.masterDiv = ctx.$container.find('.master');
    this.wrappersDiv = ctx.$container.find('.wrapper');
    this.circlesDiv = ctx.$container.find('.circle');
    this.svgPathsDiv = ctx.$container.find('.svg-path');
    this.flowchartDiv = ctx.$container.find('.flowchart');
    this.solarWrapperDiv = ctx.$container.find('.solar-wrapper');
    this.batteryWrapperDiv = ctx.$container.find('.battery-wrapper');
    this.rowsDiv = ctx.$container.find('.rows');
    this.row3Div = ctx.$container.find('.row3');
    this.ctx = ctx;
  }

  /**
   * Calls methods to update the visual elements.
   */
  resize() {
    this.setWrapperWidth();
    this.setRowHeight();
    this.setCircleSize();
    new SVGUpdater(ctx).init();
  }

  /**
   * Determines the number of columns based on the visibility of certain divs.
   * 
   * @returns {number} The count of columns.
   * @private
   */
  __getColumnCount() {
    if (this.solarWrapperDiv.css("display") === "none" && this.batteryWrapperDiv.css("display") === "none") {
      return 2;
    }
    return 3;
  }

  /**
   * Adjusts the width of the wrapper divs based on the number of columns.
   */
  setWrapperWidth() {
    this.wrappersDiv.css("width", `${this.flowchartDiv.width() / this.__getColumnCount()}px`);
  }

  /**
   * Determines the number of rows based on the visibility of certain divs.
   * 
   * @returns {number} The count of rows.
   * @private
   */
  __getRowCount() {
    if (this.row3Div.css("display") === "none") {
      return 2;
    }
    return 3;
  }

  /**
   * Adjusts the height of rows based on the number of rows.
   */
  setRowHeight() {
    this.rowsDiv.css("height", `${this.flowchartDiv.height() / this.__getRowCount()}px`);
  }

  /**
   * Determines the size for the circle div.
   * 
   * @returns {number} The calculated size for the circle div.
   * @private
   */
  __getCircleSize() {
    return Math.min(this.wrappersDiv.width(), this.wrappersDiv.height()) * 0.6;
  }

  /**
   * Sets the size of the circle div based on calculations.
   */
  setCircleSize() {
    const size = this.__getCircleSize();
    this.circlesDiv.width(size).height(size);
  }
}