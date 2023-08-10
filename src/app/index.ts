import DataPoint from './ts/DataPoint';
import GenericResizer from './ts/GenericResizer';
import DataUpdater from './ts/DataUpdater';
import { Label } from './types';

let updater: DataUpdater;
let datapoints: Record<Label, DataPoint>;
let resizer: GenericResizer;
let getRelativePosition: any;

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
  getRelativePosition = function(divSelector: string): { top: number, left: number } {
    const $divElement = $(divSelector);
    const $masterElement = $('.master');
  
    // Check if the element is visible
    if (!$divElement.is(':visible')) {
      console.warn(`${divSelector} is not visible.`);
      return { top: -1, left: -1 };
    }
  
    let totalTop = $divElement.offset()!.top;
    let totalLeft = $divElement.offset()!.left;
    
    let $parent = $divElement.parent();
  
    while ($parent.length > 0 && !$parent.is($masterElement)) {
      if ($parent.css('position') === 'relative') {
        totalTop += $parent.position().top;
        totalLeft += $parent.position().left;
      }
      $parent = $parent.parent();
    }
  
    if ($masterElement.length > 0) {
      const masterOffset = $masterElement.offset()!;
      
      const masterPaddingTop = parseInt($masterElement.css("padding-top"), 10);
      const masterPaddingLeft = parseInt($masterElement.css("padding-left"), 10);
      const masterPaddingBottom = parseInt($masterElement.css("padding-bottom"), 10);
      const masterPaddingRight = parseInt($masterElement.css("padding-right"), 10);
  
      const relativeTop = (totalTop - masterOffset.top + $masterElement.scrollTop()! - masterPaddingTop - masterPaddingBottom) / 2;
      const relativeLeft = totalLeft - masterOffset.left + $masterElement.scrollLeft()! - masterPaddingLeft - masterPaddingRight;
  
      return {
        top: relativeTop,
        left: relativeLeft
      };
    } else {
      console.warn('.master is not found or not visible.');
      return { top: -1, left: -1 };
    }
  }
  
  
}

self.onDataUpdated = function () {
  self.ctx.detectChanges()
  updater.update();
  resizer.resize();
  const position = getRelativePosition('.home-wrapper');
  console.log(`Top: ${position.top}, Left: ${position.left}`);
  const position2 = getRelativePosition('.battery-wrapper');
  console.log(`Top: ${position2.top}, Left: ${position2.left}`);
}

self.onResize = function () {
  resizer.resize();
}

self.onEditModeChanged = function () {
  updater.update();
  resizer.resize();
}