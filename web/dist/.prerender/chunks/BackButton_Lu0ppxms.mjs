import { ssr, ssrHydrationKey, ssrAttribute, escape } from 'solid-js/web';
import { onMount } from 'solid-js';

var _tmpl$ = ["<a", ' class="', '"><span>', "</span><span>", "</span></a>"];
function BackButton(props) {
  const emoji = () => props.emoji || "🏠";
  const label = () => props.label || "Back";
  const href = () => props.to;
  onMount(() => {
  });
  return ssr(_tmpl$, ssrHydrationKey() + ssrAttribute("href", escape(href(), true), false), `absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full aero-glass text-white font-bold text-sm transition-transform hover:scale-105 active:scale-95 select-none ${escape(props.class || "", true)}`, escape(emoji()), escape(label()));
}

export { BackButton as B };
