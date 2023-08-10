import myHTML from './template.html'
import './style.css'
import DataPoint from './ts/DataPoint';
import GenericResizer from './ts/GenericResizer';
import DataUpdater from './ts/DataUpdater';
import { Label } from './types';
import StraightSVG from './ts/SVGClass/StraightSVG';

let updater: DataUpdater;
let datapoints: Record<Label, DataPoint>;
let resizer: GenericResizer;
let svg: StraightSVG;
let svg2: StraightSVG;

self.onInit = function () {
  if (self.ctx === undefined) return;
  self.ctx.$container.html(myHTML);
  datapoints = {
    CARBON: new DataPoint(undefined, self.ctx.$container.find('.carbon-wrapper')),
    APPENE: new DataPoint(undefined, self.ctx.$container.find('.home-wrapper')),
    ENERGYEXP: new DataPoint(undefined, self.ctx.$container.find('.exported-wrapper'), self.ctx.$container.find('.grid-wrapper')),
    ENERGYIMP: new DataPoint(undefined, self.ctx.$container.find('.imported-wrapper'), self.ctx.$container.find('.grid-wrapper')),
    ENRTOTPROD: new DataPoint(undefined, self.ctx.$container.find('.solar-wrapper')),
    BATTPERCENT: new DataPoint(undefined, self.ctx.$container.find('.percent-wrapper'), self.ctx.$container.find('.battery-wrapper')),
    ENRBATTCHRG: new DataPoint(undefined, self.ctx.$container.find('.charging-wrapper'), self.ctx.$container.find('.battery-wrapper')),
    ENRBATTDISCH: new DataPoint(undefined, self.ctx.$container.find('.discharging-wrapper'), self.ctx.$container.find('.battery-wrapper')),
    GAS: new DataPoint(undefined, self.ctx.$container.find('.gas-wrapper')),
    WATER: new DataPoint(undefined, self.ctx.$container.find('.water-wrapper')),
  }
  updater = new DataUpdater(self.ctx, datapoints);
  resizer = new GenericResizer(self.ctx, datapoints);
  svg = new StraightSVG(self.ctx, 'grid', 'home', 'blue')
  svg2 = new StraightSVG(self.ctx, 'grid', 'carbon', 'green', false)
}

self.onDataUpdated = function () {
  self.ctx.detectChanges()
  updater.update();
  resizer.resize();
  svg.showUpdated();
  svg2.showUpdated();
}

self.onResize = function () {
  resizer.resize();
}

self.onEditModeChanged = function () {
  updater.update();
  resizer.resize();
}