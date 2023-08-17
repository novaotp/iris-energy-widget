import DataPoint from './ts/DataPoint';
import GenericResizer from './ts/GenericResizer';
import DataUpdater from './ts/DataUpdater';
import { Label, SVGLabel } from './types';
import SVG from './ts/SVG';
import StraightSVG from './ts/SVG/StraightSVG';
import CurvedSVG from './ts/SVG/CurvedSVG';
import WidgetContext, { CircleBorderColor } from './interfaces';

let updater: DataUpdater;
let datapoints: Record<Label, DataPoint>;
let resizer: GenericResizer;
let svgs: Record<SVGLabel, SVG>;
let updateSVGs = (ctx: WidgetContext): void => {
  for (const [label, svg] of Object.entries(svgs)) {
    svg.setNewColor(ctx.settings.svgPathsColor?.[label as SVGLabel] ?? '#000');
    svg.update();
  }
};
let updateDatapointsColor = (ctx: WidgetContext): void => {
  let colorLabel: string;
  for (const [label, dataPoint] of Object.entries(datapoints)) {
    switch (label as Label) {
      case "APPENE":
        colorLabel = "home" as SVGLabel;
        break;
      case "CARBON":
        colorLabel = "carbon" as SVGLabel;
        break;
      case "ENERGYEXP":
      case "ENERGYIMP":
        colorLabel = "grid" as SVGLabel;
        break;
      case "GAS":
        colorLabel = "gas" as SVGLabel;
        break;
      case "WATER":
        colorLabel = "water" as SVGLabel;
        break;
      case "ENRTOTPROD":
        colorLabel = "solar" as SVGLabel;
        break;
      case "ENRBATTCHRG":
      case "BATTPERCENT":
      case "ENRBATTDISCH":
        colorLabel = "battery" as SVGLabel;
        break;
      default:
        throw Error("Unknown label");
    }

    dataPoint.setBorderColor(ctx.settings.circleBorderColor?.[colorLabel as CircleBorderColor] ?? '#000')
  }
}
let updateInnerColors = (ctx: WidgetContext): void => {
  const master = ctx.$container.find('.master');
  master.find('.exported-wrapper').find('.inner-icon, .usage').css("color", ctx.settings.specialInnerColor?.ENERGYEXP ?? '#000').css("fill", ctx.settings.specialInnerColor?.ENERGYEXP ?? '#000');
  master.find('.imported-wrapper').find('.inner-icon, .usage').css("color", ctx.settings.specialInnerColor?.ENERGYIMP ?? '#000').css("fill", ctx.settings.specialInnerColor?.ENERGYIMP ?? '#000');
  master.find('.charging-wrapper').find('.inner-icon, .usage').css("color", ctx.settings.specialInnerColor?.ENRBATTCHRG ?? '#000').css("fill", ctx.settings.specialInnerColor?.ENRBATTCHRG ?? '#000');
  master.find('.discharging-wrapper').find('.inner-icon, .usage').css("color", ctx.settings.specialInnerColor?.ENRBATTDISCH ?? '#000').css("fill", ctx.settings.specialInnerColor?.ENRBATTDISCH ?? '#000');
}

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
  svgs = {
    gridToHome: new StraightSVG(master, 'grid', 'home', "#000"), // Added default color to all
    carbonToGrid: new StraightSVG(master, 'carbon', 'grid', "#000"),
    solarToBattery: new StraightSVG(master, 'solar', 'battery', "#000"),
    waterToHome: new StraightSVG(master, 'water', 'home', "#000"),
    gasToHome: new StraightSVG(master, 'gas', 'home', "#000"),
    solarToGrid: new CurvedSVG(master, 'solar', 'grid', "#000", 'left', 'top'),
    solarToHome: new CurvedSVG(master, 'solar', 'home', "#000", 'right', 'top'),
    batteryToGrid: new CurvedSVG(master, 'battery', 'grid', "#000", 'left', 'bottom'),
    batteryToHome: new CurvedSVG(master, 'battery', 'home', "#000", 'right', 'bottom'),
  }
  console.log("Init", self.ctx.settings)
}

self.onDataUpdated = function () {
  self.ctx.detectChanges()
  console.log("Update", self.ctx.settings)
  updateDatapointsColor(self.ctx)
  updateInnerColors(self.ctx)
  updater.update();
  resizer.resize();
  updateSVGs(self.ctx);
}

self.onResize = function () {
  const breakpoint = 350
  if (self.ctx.$container.width()! < breakpoint || self.ctx.$container.height()! < breakpoint) {
    self.ctx.$container.width(breakpoint).height(breakpoint) // Force minimum size
  }
  resizer.resize();
  updateDatapointsColor(self.ctx)
  updateInnerColors(self.ctx)
  updateSVGs(self.ctx);
}

self.onEditModeChanged = function () {
  updateDatapointsColor(self.ctx)
  updateInnerColors(self.ctx)
  updater.update();
  resizer.resize();
  updateSVGs(self.ctx);
}