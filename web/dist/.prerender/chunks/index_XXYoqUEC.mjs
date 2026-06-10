import { c as createComponent$1, $ as $$Application } from './Application_CfLXTD7T.mjs';
import 'piccolore';
import { r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './prerender_DgZHrewz.mjs';
import { $ as $$Container, r as renderScript } from './Container_DxCA0byh.mjs';
import { ssr, ssrHydrationKey, escape, createComponent, ssrStyleProperty } from 'solid-js/web';
import { createSignal, onMount, onCleanup, createEffect, For } from 'solid-js';
import { B as BackButton } from './BackButton_Lu0ppxms.mjs';

var _tmpl$$1 = ["<div", ' class="', '">', "</div>"], _tmpl$2$1 = ["<div", ' class="text-line-wrapper overflow-hidden mb-1 flex justify-center flex-wrap" style="', '"><div class="text-line-content opacity-0 inline-block" style="', '">', "</div></div>"], _tmpl$3$1 = ["<span", ' class="word-item inline-block transition-all duration-300 hover:scale-125 hover:-translate-y-1 hover:text-[#00f3ff] active:scale-110 active:text-[#ff66c4] cursor-default select-none pointer-events-auto mr-1.5" style="', '">', "</span>"];
function PretextShift(props) {
  const [lines, setLines] = createSignal([]);
  const lh = () => props.lineHeight || 26;
  onMount(() => {
  });
  onCleanup(() => {
  });
  createEffect(() => {
    props.text;
    props.font;
  });
  return ssr(_tmpl$$1, ssrHydrationKey(), `w-full text-center select-none pointer-events-auto ${escape(props.class || "", true)}`, escape(createComponent(For, {
    get each() {
      return lines();
    },
    children: (line, idx) => ssr(_tmpl$2$1, ssrHydrationKey(), ssrStyleProperty("min-height:", `${escape(lh(), true)}px`) + ssrStyleProperty(";line-height:", `${escape(lh(), true)}px`) + ssrStyleProperty(";perspective:", "400px"), ssrStyleProperty("animation:", "textShiftIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards") + ssrStyleProperty(";animation-delay:", `${escape(props.delay || 0, true) + escape(idx, true) * 80}ms`) + ssrStyleProperty(";transform-origin:", "center bottom") + ssrStyleProperty(";will-change:", "transform, opacity"), escape(createComponent(For, {
      get each() {
        return line.text.split(" ");
      },
      children: (word) => ssr(_tmpl$3$1, ssrHydrationKey(), ssrStyleProperty("font-family:", "inherit") + ssrStyleProperty(";text-shadow:", "0 2px 4px rgba(0,0,0,0.3)"), escape(word))
    })))
  })));
}

var _tmpl$ = ["<div", ' class="relative z-10 w-full max-w-lg grid grid-cols-1 gap-6 pb-12">', "</div>"], _tmpl$2 = ["<div", ' class="', '" style="', '"><div class="mb-4"><span class="text-xs text-pink-300 font-extrabold tracking-widest uppercase block mb-2" style="', '">MESSAGE #<!--$-->', "<!--/--></span><!--$-->", '<!--/--></div><div class="flex justify-between items-center border-t border-white/10 pt-3 mt-4"><span class="font-black text-white text-base" style="', '">', '</span><span class="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase" style="', '">', "</span></div><!--$-->", "<!--/--></div>"], _tmpl$3 = ["<div", ' class="mt-4 pt-4 border-t border-white/10 text-sm animate-reveal-up"><!--$-->', '<!--/--><div class="text-[10px] text-white/50 mt-2 text-right">tap card again to close</div></div>'];
function MessageList(props) {
  const [openIdx, setOpenIdx] = createSignal(null);
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(For, {
    get each() {
      return props.messages;
    },
    children: (msg, idx) => ssr(_tmpl$2, ssrHydrationKey(), `aero-glass rounded-3xl p-5 border-2 ${escape(msg.color, true)} shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer flex flex-col justify-between ${openIdx() === idx() ? "ring-1 ring-white/30" : ""}`, ssrStyleProperty("background:", "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)") + ssrStyleProperty(";animation-delay:", `${escape(idx(), true) * 150}ms`), ssrStyleProperty("font-family:", "'Comfortaa', sans-serif"), escape(idx()) + 1, escape(createComponent(PretextShift, {
      get text() {
        return msg.text;
      },
      font: "16px 'Patrick Hand'",
      lineHeight: 22,
      "class": "text-white text-base leading-relaxed italic",
      get delay() {
        return idx() * 150 + 200;
      }
    })), ssrStyleProperty("font-family:", "'Caveat', cursive"), escape(msg.sender), ssrStyleProperty("font-family:", "'Comfortaa', sans-serif"), escape(msg.relation), openIdx() === idx() && ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(PretextShift, {
      get text() {
        return msg.text;
      },
      font: "18px 'Patrick Hand'",
      lineHeight: 26,
      "class": "text-white leading-relaxed italic"
    }))))
  })));
}

const $$Index = createComponent$1(($$result, $$props, $$slots) => {
  const MESSAGES = [
    {
      sender: "Alice 💖",
      relation: "Best Friend",
      text: "Happy birthday Jell! Hope you have an amazing day filled with love, laughter, and endless sparkles. You deserve the absolute world! ✨",
      color: "border-aero-pink shadow-aero-pink/20",
      gradient: "from-pink-500/20 to-purple-500/20"
    }
  ];
  const configMessages = config.messages || [];
  const displayMessages = [...MESSAGES, ...configMessages];
  return renderTemplate`${renderComponent($$result, "Application", $$Application, { "title": "For Janell", "subTitle": " | Messages" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${renderComponent($$result3, "BackButton", BackButton, { "client:load": true, "to": "/", "label": "Back Home", "emoji": "🏠", "client:component-hydration": "load", "client:component-path": "@/components/Navigator/BackButton", "client:component-export": "default" })} ${maybeRenderHead()}<div class="relative z-10 w-full max-w-lg text-center mt-16 mb-6"> <h1 class="text-3xl font-extrabold text-white mb-2 tracking-wide drop-shadow-md" style="font-family: 'Caveat', cursive;">
Messages for Janell 💌
</h1> <p class="text-pink-200/80 text-xs tracking-wider uppercase font-extrabold animate-pulse" style="font-family: 'Comfortaa', sans-serif;">
Words of Love & Celebration
</p> </div> ${renderComponent($$result3, "MessageList", MessageList, { "client:load": true, "messages": displayMessages, "client:component-hydration": "load", "client:component-path": "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/components/MessageList/MessageList", "client:component-export": "default" })} ${renderScript($$result3, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/messages/index.astro?astro&type=script&index=0&lang.ts")} ` })} ` })}`;
}, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/messages/index.astro", void 0);

const $$file = "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/messages/index.astro";
const $$url = "/messages";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
