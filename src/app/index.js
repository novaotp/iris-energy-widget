import Resizer from "./js/resizer.class.js"
import updateData from "./js/updateData.js"
import myHTML from './widget.html';
import './widget.css';

let resizer;

self.onInit = function () {
    if (self.ctx === undefined) return;
    self.ctx.$container.find('.master').html(myHTML)
    resizer = new Resizer(self.ctx);
}

self.onDataUpdated = function () {
    self.ctx.detectChanges()
    updateData();
    resizer.resize();
}

self.onResize = function () {
    resizer.resize();
}

self.onEditModeChanged = function () {
    resizer.resize();
}