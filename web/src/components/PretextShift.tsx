import { createSignal, onMount, onCleanup, For, createEffect } from 'solid-js';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

type PretextShiftProps = {
  text: string;
  font?: string; // canvas font format, e.g. "18px 'Patrick Hand'"
  lineHeight?: number; // pixel line-height
  class?: string;
  delay?: number; // base delay offset in ms
};

export default function PretextShift(props: PretextShiftProps) {
  const [lines, setLines] = createSignal<{ text: string; width: number }[]>([]);
  let containerRef: HTMLDivElement | undefined;
  let resizeObserver: ResizeObserver | undefined;

  const fontString = () => props.font || "18px 'Patrick Hand'";
  const lh = () => props.lineHeight || 26;

  const performLayout = () => {
    if (!containerRef) return;
    const width = containerRef.getBoundingClientRect().width || 320;
    
    try {
      // Use pretext to compute line breaks based on current width
      const prepared = prepareWithSegments(props.text, fontString());
      const result = layoutWithLines(prepared, width, lh());
      setLines(result.lines);
    } catch (e) {
      console.warn("Pretext layout failed, falling back to simple line split:", e);
      // Fallback
      setLines([{ text: props.text, width }]);
    }
  };

  onMount(() => {
    performLayout();

    // Re-layout on container resize
    if (typeof ResizeObserver !== 'undefined' && containerRef) {
      resizeObserver = new ResizeObserver(() => {
        performLayout();
      });
      resizeObserver.observe(containerRef);
    }
  });

  onCleanup(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });

  // Re-run if text or font changes
  createEffect(() => {
    props.text;
    props.font;
    performLayout();
  });

  return (
    <div ref={containerRef} class={`w-full text-left select-none ${props.class || ''}`}>
      <For each={lines()}>
        {(line, idx) => (
          <div 
            class="text-line-wrapper overflow-hidden mb-1"
            style={{ 
              height: `${lh()}px`, 
              "line-height": `${lh()}px`,
              "perspective": "400px"
            }}
          >
            <div 
              class="text-line-content opacity-0 inline-block w-full"
              style={{
                animation: `textShiftIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                "animation-delay": `${(props.delay || 0) + idx * 80}ms`,
                "transform-origin": "center bottom",
                "will-change": "transform, opacity"
              }}
            >
              {line.text}
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
