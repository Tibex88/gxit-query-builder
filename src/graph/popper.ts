import { ReferenceElement } from "@floating-ui/core";
import { computePosition, flip, shift, limitShift } from "@floating-ui/dom";

export interface PopperInstance {
  update: () => void;
}

export function popperFactory(
  ref: ReferenceElement,
  content: any,
  opts: any,
): PopperInstance {
  const popperOptions = {
    middleware: [flip(), shift({ limiter: limitShift() })],
    ...opts,
  };
  function update() {
    computePosition(ref, content, popperOptions).then(({ x, y }) => {
      Object.assign(content.style, {
        left: `${x}px`,
        top: `${y + 15}px`,
      });
    });
  }
  update();
  return { update };
}
