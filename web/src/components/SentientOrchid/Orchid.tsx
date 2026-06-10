export type OrchidProps = {
    size?: string
}

// Sentient orchid implementation lives in OrchidViewer (three + solid statemachine, smile, wiggles, game-like guided views).
// This stub preserved for module shape; re-exports the sentient viewer for convenience.
export { default as OrchidViewer } from './OrchidViewer';
export { default as SentientOrchid } from './OrchidViewer';

export function Orchid(props: OrchidProps) {
  // Thin pass-through for legacy; prefer <OrchidViewer client:load ... /> directly
  return null;
}