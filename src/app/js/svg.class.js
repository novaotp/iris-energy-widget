import { v4 as uniqueId } from 'uuid'

export default class SVG {
  /** @private */
  _uniqueID;
  /** @private */
  _map;
  /**
   * @type {"carbon" | "solar" | "gas" | "grid" | "home" | "battery" | "water"}
   * @private
   */
  _from;
  /**
   * @type {"carbon" | "solar" | "gas" | "grid" | "home" | "battery" | "water"}
   * @private
   */
  _to;
  /**
   * @type {"straight" | "curved"}
   * @private
   */
  _type;
  /**
   * @type {string}
   * @private
   */
  _color;
  /**
   * @type {boolean}
   * @private
   */
  _includeCircle;

  constructor(ctx) {
    this.ctx = ctx;
    this._uniqueID = this.__generateUniqueID();
    this._map = this.__centerMap();
    this._from;
    this._to;
    this._type;
    this._color;
    this._includeCircle;
  }

  /** @private */
  __centerMap() {
    const masterWidth = this.ctx.$container.find('.master').width();
    const masterHeight = this.ctx.$container.find('.master').height();
    let rows = 3;
    let columns = 3;

    if (this.ctx.$container.find('.row3').css("display") === "none") {
      rows = 2;
    }

    if (this.ctx.$container.find('.battery-wrapper').css("display") === "none" && this.ctx.$container.find('.solar-wrapper').css("display") === "none") {
      columns = 2;
    }

    const carbon = this.ctx.$container.find('.carbon-wrapper');
    const solar = this.ctx.$container.find('.solar-wrapper');
    const gas = this.ctx.$container.find('.gas-wrapper');
    const grid = this.ctx.$container.find('.grid-wrapper');
    const home = this.ctx.$container.find('.home-wrapper');
    const battery = this.ctx.$container.find('.battery-wrapper');
    const water = this.ctx.$container.find('.water-wrapper');

    return {
      carbon: {
        x: 0 + carbon.width() / 2,
        y: 0 + carbon.height() / 2,
      },
      solar: {
        x: masterWidth / columns + solar.width() / 2,
        y: 0 + solar.height() / 2,
      },
      gas: {
        x: (columns === 2 ? masterWidth / columns : masterWidth / columns * 2) + gas.width() / 2,
        y: 0 + gas.height() / 2,
      },
      grid: {
        x: 0 + grid.width() / 2,
        y: masterHeight / rows + grid.height() / 2,
      },
      home: {
        x: (columns === 2 ? masterWidth / columns : masterWidth / columns * 2) + home.width() / 2,
        y: masterHeight / rows + home.height() / 2,
      },
      battery: {
        x: masterWidth / columns + battery.width() / 2,
        y: masterHeight / rows * 2 + battery.height() / 2,
      },
      water: {
        x: (columns === 2 ? masterWidth / columns : masterWidth / columns * 2) + water.width() / 2,
        y: masterHeight / rows * 2 + water.height() / 2,
      }
    }
  }

  /**
   * @private
   */
  __generateUniqueID() {
    return "pathID" + uniqueId();
  }

  /**
   * @param {"carbon" | "solar" | "gas" | "grid" | "home" | "battery" | "water"} from
   */
  from(from) {
    this._from = from;
    return this;
  }

  /**
   * @param {"carbon" | "solar" | "gas" | "grid" | "home" | "battery" | "water"} to
   */
  to(to) {
    this._to = to;
    return this;
  }

  /**
   * @param {"straight" | "curved"} type
   */
  type(type) {
    this._type = type;
    return this;
  }

  /**
   * @param {string} color
   */
  setColor(color) {
    this._color = color;
    return this;
  }

  /**
   * @param {boolean} include
   */
  includeCircle(include) {
    this._includeCircle = include;
    return this;
  }

  /**
   * End function to generate and return the SVG
   * 
   * @returns {string}
   */
  create() {
    let pathData;
    const from = this._map[this._from];
    const to = this._map[this._to]

    if (this._type === 'straight') {
      pathData = `M${from.x},${from.y} L${to.x},${to.y}`;
    } else if (pathType === 'curved') {
      // Modify this to set the curve appropriately
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      pathData = `M${from.x},${from.y} L${midX},${midY} Q${midX},${midY} ${to.x},${to.y} L${to.x},${to.y}`;
    }

    const viewBoxValue = `0 0 ${this.ctx.$container.find('.master').width()} ${this.ctx.$container.find('.master').height()}`;

    let svg = `
      <svg class="svg-path" preserveAspectRatio="none" viewBox="${viewBoxValue}" xmlns="http://www.w3.org/2000/svg">
          <path id="${this._uniqueID}" d="${pathData}" stroke="${this._color}" fill="transparent" stroke-width="0.4"/>`;

    if (this._includeCircle) {
      svg += `
          <circle id="myCircle" r="1.2" fill="${this._color}">
              <animateMotion repeatCount="indefinite" dur="1s">
                  <mpath href="#${this._uniqueID}"/>
              </animateMotion>
          </circle>`;
    }

    svg += '</svg>';
    return svg;
  }
}
