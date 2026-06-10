import { createSignal, For } from 'solid-js';
import PretextShift from '../Pretext/PretextShift';
import { haptic } from '../../utils/haptics';

type Message = {
  sender: string;
  relation: string;
  text: string;
  color: string;
  gradient: string;
};

type MessageListProps = {
  messages: Message[];
};

export default function MessageList(props: MessageListProps) {
  return (
    <div class="relative z-10 w-full max-w-lg grid grid-cols-1 gap-6 pb-12">
      <For each={props.messages}>
        {(msg, idx) => (
          <div 
            class={`aero-glass rounded-3xl p-5 border-2 ${msg.color} shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer flex flex-col justify-between`}
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              "animation-delay": `${idx() * 150}ms`
            }}
            onPointerDown={() => haptic.trigger('light')}
          >
            <div class="mb-4">
              <span class="text-xs text-pink-300 font-extrabold tracking-widest uppercase block mb-2" style={{ "font-family": "'Comfortaa', sans-serif" }}>
                MESSAGE #{idx() + 1}
              </span>
              
              {/* Render message body with pretext text-shifting line breaks */}
              <PretextShift 
                text={msg.text} 
                font="16px 'Patrick Hand'" 
                lineHeight={22} 
                class="text-white text-base leading-relaxed italic"
                delay={idx() * 150 + 200}
              />
            </div>
            
            <div class="flex justify-between items-center border-t border-white/10 pt-3 mt-4">
              <span class="font-black text-white text-base" style={{ "font-family": "'Caveat', cursive" }}>
                {msg.sender}
              </span>
              <span class="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase" style={{ "font-family": "'Comfortaa', sans-serif" }}>
                {msg.relation}
              </span>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
