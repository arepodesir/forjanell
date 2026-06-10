import { c as createComponent, $ as $$Application } from './Application_WF1Dr1M_.mjs';
import 'piccolore';
import { r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from './prerender_BOSDH4Xw.mjs';
import { r as renderScript, $ as $$Container } from './Container_fpLNjPqv.mjs';
import { H as Hadacard } from './Hadacard__wZfSHI3.mjs';
import { c as config } from './config_CbvXcl0W.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageProps = {
    title: "For Janell",
    subTitle: " | Home",
    menuItems: [
      {
        name: "About",
        href: "/about",
        emoji: "📖",
        glowClass: "gc-cyan"
      },
      {
        name: "Gifts",
        href: "/gifts",
        emoji: "🎁",
        glowClass: "gc-pink"
      },
      {
        name: "Messages",
        href: "/messages",
        emoji: "💌",
        glowClass: "gc-purple"
      }
    ],
    footer: {
      text: "Made with ❤️ ",
      linkText: "LOVE-LANG",
      url: "https://love-metalang.xyz"
    }
  };
  return renderTemplate`${renderComponent($$result, "Application", $$Application, { "title": pageProps.title, "subTitle": pageProps.subTitle }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Container", $$Container, {}, { "default": ($$result3) => renderTemplate`${maybeRenderHead()}<div class="relative z-10 w-full max-w-lg flex-1 flex flex-col justify-between items-center gap-3 px-2 my-auto py-1">  <div class=" rounded-3xl p-3 md:p-5 text-white w-full border-white/20 animate-reveal-up text-center shadow-[0_8px_32px_rgba(255,102,196,0.15)] shrink-0"></div>  <div class="w-full h-[250px] xs:h-[290px] sm:h-[360px] md:h-[420px] animate-reveal-up" style="animation-delay: 0.1s;"> ${renderComponent($$result3, "Hadacard", Hadacard, { "client:load": true, "name": config.name, "nickname": config.nickname, "picUrl": config.picUrl, "hbdMessage": config.hbdMessage, "isFinalCard": false, "client:component-hydration": "load", "client:component-path": "@/components/Hadacard/Hadacard", "client:component-export": "default" })} </div>  <div class="grid grid-cols-3 gap-4 w-full animate-reveal-up shrink-0" style="animation-delay: 0.2s;"> ${pageProps.menuItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="bubble-menu-item relative flex flex-col items-center group cursor-pointer"> <div${addAttribute(`globular-circle ${item.glowClass} w-14 h-14 md:w-20 md:h-20`, "class")}> <span class="text-xl md:text-3xl group-hover:scale-115 transition-transform duration-300">${item.emoji}</span> <div class="globular-gloss"></div> </div> <span class="bubble-label text-[9px] md:text-xs">${item.name}</span> </a>`)} </div> </div> <div id="zoom-overlay" class="fixed inset-0 z-50 pointer-events-none opacity-0 scale-0 origin-center"></div> <footer class="relative z-20 w-full text-center py-2 text-[11px] text-white/60 tracking-wider font-semibold" style="font-family: 'Comfortaa', sans-serif;"> ${pageProps.footer.text} <a${addAttribute(pageProps.footer.url, "href")} target="_blank" rel="noopener noreferrer" class="text-aero-cyan hover:text-aero-pink hover:underline transition-colors active:scale-95 inline-block font-extrabold" id="footer-link"> ${pageProps.footer.linkText} </a> </footer> <div class="relative z-20 w-32 h-1 bg-white/40 rounded-full mx-auto mb-2 pointer-events-none"></div> ` })} ` })} ${renderScript($$result, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/index.astro", void 0);

const $$file = "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
