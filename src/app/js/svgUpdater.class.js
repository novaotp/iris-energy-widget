import SVG from "./svg.class.js";

export default class SVGUpdater {
  constructor(ctx) {
    this.ctx = ctx;
    this.container = ctx.$container.find('.svg-bg');
    this.masterDiv = ctx.$container.find('.master');
  }

  init() {
    this.container.empty();

    const svgs = [
      new SVG(this.ctx)
        .from("grid")
        .to("home")
        .type("straight")
        .setColor("rgb(100, 100, 255)")
        .includeCircle(true)
        .create(),
      new SVG()
        .from("grid")
        .to("carbon")
        .type("straight")
        .setColor("green")
        .includeCircle(false)
        .create()
    ]

    svgs.forEach(svg => {
      this.container.append(svg);
    })
  }
}