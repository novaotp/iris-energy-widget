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
  }

  /**
   * Calls methods to update the visual elements.
   */
  resize() {
    this.setWrapperWidth();
    this.setRowHeight();
    this.setCircleSize();
    this.setSVGs();
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

  /**
   * Adds unique paths for SVG elements.
   * 
   * @private
   */
  __addUniquePaths() {
    /**
     * Generates a unique ID for SVG paths.
     * 
     * @returns {string} A unique ID string.
     * @private
     */
    function __generateUniqueID(prefix = '') {
      return prefix + Math.random().toString(36).slice(2, 11);
    }

    this.svgPathsDiv.each(function () {
      const uniquePathID = __generateUniqueID('path_');
      $(this).find('path').attr('id', uniquePathID);
      $(this).find('animateMotion > mpath').attr('href', `#${uniquePathID}`);
    }.bind(this));
  }

  /**
   * Adjusts the viewBox attribute for SVG elements based on master div dimensions.
   * 
   * @private
   */
  __adaptViewBox() {
    const viewBoxValue = `0 0 ${this.masterDiv.width()} ${this.masterDiv.height()}`;
    this.svgPathsDiv.attr('viewBox', viewBoxValue);
  }

  /**
   * Calls methods related to SVG adjustments.
   */
  setSVGs() {
    this.__addUniquePaths();
    this.__adaptViewBox();
  }
}
