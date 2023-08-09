import myHTML from './template.html'
import './style.css'
import DataPoint from './ts/DataPoint';
import GenericResizer from './ts/GenericResizer';
import Updater from './ts/Updater';
import { Label } from './types';

let updater: Updater;
let datapoints: Record<Label, DataPoint>;
let resizer: GenericResizer;

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
  updater = new Updater(self.ctx, datapoints);
  resizer = new GenericResizer(self.ctx, datapoints);
}

self.onDataUpdated = function () {
  self.ctx.detectChanges()
  updater.update();
  resizer.all();
}

self.onResize = function () {
  resizer.all();
}

self.onEditModeChanged = function () {
  updater.update();
  resizer.all();
}