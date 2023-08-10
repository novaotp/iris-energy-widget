import WidgetContext, { Wrapper } from '@app/interfaces';
import { v4 as uniqueId } from 'uuid'
import Renderer from './Renderer';

/** A high level class to manage a straight SVG */
export default class StraightSVG {
  /** The widget context */
  private ctx: WidgetContext;
  /** The SVG's unique id */
  private id: string;
  /** The SVG's renderer */
  private renderer: Renderer;

  /**
   * @param ctx The widget context
   * @param from The start position of the SVG
   * @param to The end position of the SVG
   * @param color The color of the SVG (and the circle)
   * @param includeCircle Show the circle or not
   */
  constructor(ctx: WidgetContext, from: Wrapper, to: Wrapper, color: string, includeCircle: boolean = true) {
    this.ctx = ctx;
    this.id = uniqueId();
    this.renderer = new Renderer(ctx, this.id, from, to, color, includeCircle)
  }

  public showUpdated(): void {
    this.renderer.show();
  }

  public hide(): void {
    this.renderer.hide();
  }
}
