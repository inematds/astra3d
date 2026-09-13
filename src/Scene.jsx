import { useEffect, useRef } from "react";
import { mount } from "./scene/runtime.js";
export default function Scene({ template, color }) {
  const ref = useRef(null);
  useEffect(
    () =>
      mount(ref.current, { template, color, thumbnail: true, motion: "none" }),
    [template, color],
  );
  return (
    <div className="scene-canvas" ref={ref} aria-hidden="true">
      <div className="scene-placeholder" />
    </div>
  );
}
