import { onMount } from 'solid-js';
import { haptic } from '@/utils/haptics';

/**
 * Solid BackButton — abstracted navigation affordance (per configs-to-toml-2).
 * Type-safe route targets (expand union as routes grow).
 * Replaces 4x duplicated inline <a> + script blocks across pages.
 * Mobile friendly, haptic on pointerdown, aero-glass style.
 *
 * Usage (in .astro page):
 *   import BackButton from '@/components/Navigator/BackButton';
 *   <BackButton client:load to="/gifts" label="Gift Vault" emoji="🎁" />
 */
export type AppRoute = '/' | '/gifts' | '/gifts/circa-1993' | '/about' | '/messages';

export interface BackButtonProps {
  to: AppRoute | (string & {});
  label?: string;
  emoji?: string;
  class?: string;
}

export default function BackButton(props: BackButtonProps) {
  let btnRef: HTMLAnchorElement | undefined;

  const emoji = () => props.emoji || '🏠';
  const label = () => props.label || 'Back';
  const href = () => props.to as string;

  onMount(() => {
    if (btnRef) {
      btnRef.addEventListener('pointerdown', () => {
        haptic.trigger('light');
      });
    }
  });

  return (
    <a
      ref={btnRef}
      href={href()}
      class={`absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full aero-glass text-white font-bold text-sm transition-transform hover:scale-105 active:scale-95 select-none ${props.class || ''}`}
    >
      <span>{emoji()}</span>
      <span>{label()}</span>
    </a>
  );
}
