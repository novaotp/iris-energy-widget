import DataPoint from './ts/DataPoint';
import GenericResizer from './ts/GenericResizer';
import DataUpdater from './ts/DataUpdater';
import { Label, SVGLabel } from './types';
import SVG from './ts/SVG';
import StraightSVG from './ts/SVG/StraightSVG';
import CurvedSVG from './ts/SVG/CurvedSVG';
import WidgetContext, { CircleBorderColor, HTMLIcon, IconColor } from './interfaces';
import './style.css'

let updater: DataUpdater;
let datapoints: Record<Label, DataPoint>;
let resizer: GenericResizer;
let svgs: Record<SVGLabel, SVG>;
/** Function to update the SVGs and their color. Should be moved elsewhere later. */
let updateSVGs = (ctx: WidgetContext): void => {
  for (const [label, svg] of Object.entries(svgs)) {
    svg.setNewColor(ctx.settings.svgPathsColor?.[label as SVGLabel] ?? '#000');
    svg.update();
  }
};
/** Function to update the Datapoints' color, html icons and icon colors. Should be moved elsewhere later. */
let updateDatapointsAdvancedSettings = (ctx: WidgetContext): void => {
  let dpLabel: string;
  let defaultIcon: string;
  for (const [label, dataPoint] of Object.entries(datapoints)) {
    switch (label as Label) {
      case "APPENE":
        dpLabel = "home";
        defaultIcon = "<i class='fa-solid fa-house'></i>";
        break;
      case "CARBON":
        dpLabel = "carbon";
        defaultIcon = "<i class='fa-solid fa-leaf'></i>";
        break;
      case "ENERGYEXP":
      case "ENERGYIMP":
        dpLabel = "grid";
        defaultIcon = "<i class='fa-solid fa-bolt-lightning'></i>";
        break;
      case "GAS":
        dpLabel = "gas";
        defaultIcon = "<i class='fa-solid fa-fire'></i>";
        break;
      case "WATER":
        dpLabel = "water";
        defaultIcon = "<i class='fa-solid fa-droplet'></i>";
        break;
      case "ENRTOTPROD":
        dpLabel = "solar";
        defaultIcon = "<i class='fa-solid fa-solar-panel'></i>";
        break;
      case "ENRBATTCHRG":
      case "BATTPERCENT":
      case "ENRBATTDISCH":
        dpLabel = "battery";
        defaultIcon = "<i class='fa-solid fa-battery-half'></i>";
        break;
      default:
        throw Error("Unknown label");
    }

    dataPoint.setBorderColor(ctx.settings.circleBorderColor?.[dpLabel as CircleBorderColor] ?? '#000')
    dataPoint.setBorderColor(ctx.settings.iconHTML?.[dpLabel as HTMLIcon] ?? defaultIcon)
    dataPoint.setBorderColor(ctx.settings.iconColor?.[dpLabel as IconColor] ?? '#000')
  }
}
/** Function to update the Datapoints' inner colors if they have a superWrapper. Should be moved elsewhere later. */
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
    gridToHome: new StraightSVG(master, 'grid', 'home', "#000"), // Added default color to all, should be removed later.
    carbonToGrid: new StraightSVG(master, 'carbon', 'grid', "#000"),
    solarToBattery: new StraightSVG(master, 'solar', 'battery', "#000"),
    waterToHome: new StraightSVG(master, 'water', 'home', "#000"),
    gasToHome: new StraightSVG(master, 'gas', 'home', "#000"),
    solarToGrid: new CurvedSVG(master, 'solar', 'grid', "#000", 'left', 'top'),
    solarToHome: new CurvedSVG(master, 'solar', 'home', "#000", 'right', 'top'),
    batteryToGrid: new CurvedSVG(master, 'battery', 'grid', "#000", 'left', 'bottom'),
    batteryToHome: new CurvedSVG(master, 'battery', 'home', "#000", 'right', 'bottom'),
  }
}

self.onDataUpdated = function () {
  self.ctx.detectChanges()
  console.log("Color", self.ctx.settings.iconColor)
  console.log("HTML", self.ctx.settings.iconHTML)
  updateDatapointsAdvancedSettings(self.ctx) // Multiple calls, is it necessary ?
  updateInnerColors(self.ctx) // Multiple calls, is it necessary ?
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
  updateDatapointsAdvancedSettings(self.ctx) // Multiple calls, is it necessary ?
  updateInnerColors(self.ctx) // Multiple calls, is it necessary ?
  updateSVGs(self.ctx);
}

self.onEditModeChanged = function () {
  updateDatapointsAdvancedSettings(self.ctx) // Multiple calls, is it necessary ?
  updateInnerColors(self.ctx) // Multiple calls, is it necessary ?
  updater.update();
  resizer.resize();
  updateSVGs(self.ctx);
}