import WidgetContext from "../interfaces";

declare global {
  interface Window {
    ctx: WidgetContext;
    onInit(): void;
    onDataUpdated(): void;
    onResize(): void;
    onEditModeChanged(): void;
  }
}