import { c as createRenderInstruction, m as maybeRenderHead, b as addAttribute, d as renderSlot, a as renderTemplate } from './prerender_BOSDH4Xw.mjs';
import { c as createComponent } from './Application_WF1Dr1M_.mjs';
import 'piccolore';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Container = createComponent(($$result, $$props, $$slots) => {
  let gif = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJ2eHY3aTZ2eDFwdnV4amN1ZTZ1Z3R4bnlmdWxlb2p4dmN3dDRuZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VxbvpfaTTo3le/giphy.gif";
  return renderTemplate`${maybeRenderHead()}<div class="relative w-full min-h-[100dvh] overflow-y-auto flex flex-col items-center justify-between p-4 bg-cover bg-center select-none pb-safe pt-safe"${addAttribute(`background-image: url(${gif})`, "style")}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/home/arepo/LOGOS/SOFTWARE/DOGMA/FORJANELL/CODE/web/src/layouts/Container.astro", void 0);

export { $$Container as $, renderScript as r };
