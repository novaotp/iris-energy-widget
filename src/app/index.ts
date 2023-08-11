import DataPoint from './ts/DataPoint';
import GenericResizer from './ts/GenericResizer';
import DataUpdater from './ts/DataUpdater';
import { Label } from './types';
import SVG from './ts/SVG';
import StraightSVG from './ts/SVG/StraightSVG';

let updater: DataUpdater;
let datapoints: Record<Label, DataPoint>;
let resizer: GenericResizer;
let svgs: Array<SVG>;
let updateSVGs = (): void => {
  svgs.forEach(svg => svg.update())
};

self.onInit = function () {
  if (self.ctx === undefined) return;
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
  const master = self.ctx.$container.find('.master');
  svgs = [
    new StraightSVG(master, 'grid', 'home', "blue"),
    new StraightSVG(master, 'carbon', 'grid', "green"),
    new StraightSVG(master, 'solar', 'battery', "grey"),
    new StraightSVG(master, 'water', 'home', "lightblue"),
    new StraightSVG(master, 'gas', 'home', "black"),
  ]
}

self.onDataUpdated = function () {
  self.ctx.detectChanges()
  updater.update();
  resizer.resize();
  updateSVGs();
}

self.onResize = function () {
  resizer.resize();
  updateSVGs();
}

self.onEditModeChanged = function () {
  updater.update();
  resizer.resize();
  updateSVGs();
}