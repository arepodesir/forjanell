# MusicTitlebar — Usage Example (staged artifact)

This is **not** applied to source. It is a ready-to-paste illustration of how the new component can be dropped into a Solid island (e.g. inside FrutigerScenes final stage, or a dedicated music page section) once a follow-up task authorizes integration.

## Import
```tsx
import MusicTitlebar from '@/components/MusicTitlebar';
```

## Basic (self-contained, uses a real asset)
```tsx
<MusicTitlebar
  src="/assets/sounds/hbd.mp3"
  title="Bubbly Reverie"
  artist="AREPO for Janell"
  lyrics={[
    "Happy belated, my love...",
    "Every bubble holds a wish for you",
    "Stars paused just to watch you smile",
    "Pink and cyan lights on your skin",
    "You make time feel like 1993 again",
    "Dance with me in the hallway of forever",
  ]}
  volume={0.55}
  class="w-full max-w-md mx-auto"
/>
```

## With config-driven audio (preferred long-term)
```tsx
import { config } from '@/config';

<MusicTitlebar
  src={config.assets.audio.main || '/assets/audio/main.wav'}
  title="Hallway Reverie"
  artist={config.recipient.name || 'For Janell'}
  // lyrics can come from scene or a future tracks toml
/>
```

## Notes for integrators
- The component pauses globalBgmAudio on play (audio discipline).
- It is fully functional without any external service; when src/services/audio (or a useAudioPlayer hook) lands, we can evolve the props to accept a controller.
- Mobile: 44px+ play target, pointer + touch scrub on the progress track, big tap surface on the bar itself.
- Keyboard: focus the bar and use Space/Enter to toggle, ←/→ to seek ±5s.
- Styling: aero-glass + gradients + existing palette + Patrick Hand/Comfortaa. Scoped keyframes only for the marquee.
- Defaults are deliberately warm and on-theme so a bare `<MusicTitlebar src="..." />` already feels like part of the gift.

Drop this wherever a music moment lives. Future job can wire real lyrics + multi-track selection from TOML.
