import { c as createComponent, $ as $$Application } from './Application_Bbz4iz8D.mjs';
import 'piccolore';
import { r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from './prerender_vAft8ZjS.mjs';
import { $ as $$Container, r as renderScript } from './Container_2d9acb2R.mjs';
import { c as config } from './config_CwuTGXRM.mjs';
import { B as BackButton } from './BackButton_Lu0ppxms.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const gifts = (config.gift || []).slice().reverse();
  return renderTemplate`${renderComponent($$result, "Application", $$Application, { "title": "For Janell", "subTitle": " | Gift Vault" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "BackButton", BackButton, { "client:load": true, "to": "/", "label": "Back Home", "emoji": "🏠", "client:component-hydration": "load", "client:component-path": "@/components/Navigator/BackButton", "client:component-export": "default" })} ${maybeRenderHead()}<div class="w-full max-w-lg mx-auto overflow-x-hidden"> <div class="relative z-10 w-full max-w-lg text-center mt-16 mb-6 select-none"> <h1 class="text-3xl font-extrabold text-white mb-2 tracking-wide drop-shadow-md" style="font-family: 'Caveat', cursive;">
Janell's Gift Vault 🎁
</h1> <p class="text-aero-cyan text-xs tracking-wider uppercase font-extrabold" style="font-family: 'Comfortaa', sans-serif;">
A timeline of yearly birthday surprises
</p> </div>  <div class="relative z-10 w-full max-w-lg flex-1 flex flex-col min-h-0 overflow-hidden"> <div class="w-full flex-1 overflow-y-auto flex flex-col gap-6 pb-12 animate-reveal-up" style="font-family: 'Patrick Hand', cursive;"> ${gifts.map((gift) => renderTemplate`<div${addAttribute(`relative rounded-3xl p-5 border-2 flex flex-col justify-between transition-all duration-300 overflow-hidden ${gift.active ? "bg-white/15 border-aero-pink shadow-[0_0_30px_rgba(255,102,196,0.3)] scale-100 hover:scale-[1.02] active:scale-98 animate-pulse-border" : "bg-white/5 border-white/10 opacity-70 filter grayscale-50"}`, "class")}>  ${gift.active && renderTemplate`<span class="absolute top-3 right-3 bg-gradient-to-r from-aero-pink to-aero-cyan text-white text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md" style="font-family: 'Comfortaa', sans-serif;">
Target Bday 🎂
</span>`} <div> <div class="flex items-center justify-between mb-2"> <span class="text-2xl font-mono font-extrabold text-white/50">${gift.year}</span> <span class="text-3xl">${gift.emoji}</span> </div> <h3 class="text-lg font-bold text-white mb-1 leading-tight" style="font-family: 'Comfortaa', sans-serif;"> ${gift.title} </h3> <p class="text-sm text-blue-100/90 leading-relaxed mb-4"> ${gift.description} </p> </div> <div class="mt-auto"> ${gift.active ? renderTemplate`<a href="/gifts/circa-1993" class="gift-btn w-full block text-center py-2.5 rounded-full font-bold text-white uppercase text-xs tracking-wider transition-all select-none cursor-pointer" style="font-family: 'Comfortaa', sans-serif;">
🎁 Unwrap Gift 2026
</a>` : renderTemplate`<button class="w-full bg-white/5 border border-white/10 text-white/40 py-2 rounded-full font-bold text-xs uppercase tracking-wider cursor-not-allowed" style="font-family: 'Comfortaa', sans-serif;">
🔐 Archived Gift
</button>`} </div> </div>`)} </div> </div> </div> <div id="zoom-overlay" class="fixed inset-0 z-50 pointer-events-none opacity-0 scale-0 origin-center"></div> <style>
      .animate-pulse-border {
        animation: borderGlow 3s infinite alternate;
      }
      @keyframes borderGlow {
        0% { border-color: rgba(255, 102, 196, 0.4); box-shadow: 0 0 20px rgba(255, 102, 196, 0.2); }
        100% { border-color: rgba(0, 243, 255, 0.8); box-shadow: 0 0 35px rgba(0, 243, 255, 0.4); }
      }
      .gift-btn {
        background: linear-gradient(135deg, var(--color-aero-pink) 0%, var(--color-aero-cyan) 100%);
        box-shadow: 0 4px 15px rgba(255, 102, 196, 0.5);
      }
      .gift-btn:active {
        box-shadow: 0 2px 10px rgba(0, 243, 255, 0.7);
        transform: scale(0.97);
      }
      #zoom-overlay {
        transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease;
      }
    </style> ${renderScript($$result3, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/gifts/index.astro?astro&type=script&index=0&lang.ts")} ` })} ` })}`;
}, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/gifts/index.astro", void 0);

const $$file = "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/gifts/index.astro";
const $$url = "/gifts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
