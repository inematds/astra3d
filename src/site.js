import runtime from "./generated/scene-runtime.txt?raw";
import fonts from "./generated/fonts.txt?raw";
import css from "./site.css?raw";
import { buildSite } from "./site-render.js";
export const renderSite = (config) =>
  buildSite(config, { runtime, fonts, css });
