import { A as AstroError, I as InvalidComponentArgs, e as renderHead, a as renderTemplate, d as renderSlot, m as maybeRenderHead, r as renderComponent } from './prerender_DgZHrewz.mjs';
import 'piccolore';
import 'clsx';

function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = (...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  };
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}

const $$Head = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Head;
  let { title = "", subTitle = "" } = Astro2.props;
  return renderTemplate`<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"><meta name="theme-color" content="#ff66c4"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="manifest" href="/manifest.json"><link rel="apple-touch-icon" href="/resources/favicon/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/resources/favicon/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/resources/favicon/favicon-16x16.png"><title>${title}${subTitle}</title><meta name="description" content="A holographic birthday card experience by Hadacard"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&family=Caveat:wght@400;700&family=Patrick+Hand&family=Inter:wght@400;600;700&family=Outfit:wght@600;700;800;900&family=Great+Vibes&family=Alex+Brush&display=swap" rel="stylesheet">${renderHead()}</head>`;
}, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/includes/Head/Head.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Application = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Application;
  let head = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> ', "", '<body class="relative min-h-screen"> ', " <script>\n      (function() {\n        const isCardPage = window.location.pathname.startsWith('/gifts/card');\n\n        // Create or retrieve single global BGM instance (still used by MusicTitlebar and scenes for coordination)\n        let audio = window.globalBgmAudio;\n        if (!audio) {\n          audio = new Audio('/resources/sfx/hbd.mp3');\n          audio.loop = true;\n          audio.volume = 0.3;\n          window.globalBgmAudio = audio;\n\n          // Restore playback position (time persistence kept for continuity)\n          const savedTime = sessionStorage.getItem('bgm_currentTime');\n          if (savedTime) {\n            audio.currentTime = parseFloat(savedTime);\n          }\n        }\n\n        // Periodically persist current time\n        setInterval(() => {\n          if (audio && !audio.paused) {\n            sessionStorage.setItem('bgm_currentTime', audio.currentTime.toString());\n          }\n        }, 500);\n\n        if (isCardPage) {\n          // Card/visual novel pages (e.g. circa-1993) take audio control\n          if (audio) {\n            audio.pause();\n          }\n          return;\n        }\n\n        // Play global BGM on first user interaction (no mute control remains)\n        function startAudio() {\n          if (audio.paused) {\n            audio.play().catch(e => console.log('Autoplay deferred:', e));\n          }\n          document.removeEventListener('click', startAudio);\n          document.removeEventListener('keydown', startAudio);\n          document.removeEventListener('touchstart', startAudio);\n        }\n\n        document.addEventListener('click', startAudio);\n        document.addEventListener('keydown', startAudio);\n        document.addEventListener('touchstart', startAudio);\n      })();\n    <\/script> </body> </html>"])), renderComponent($$result, "Head", $$Head, { "title": head.title, "subTitle": head.subTitle }), maybeRenderHead(), renderSlot($$result, $$slots["default"]));
}, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/layouts/Application.astro", void 0);

export { $$Application as $, createComponent as c };
