import{d as He,b as _,o as Le,g as r,e as y,i as n,m as h,c as p,f as A,r as ee,h as Pe,u as Oe,t as i,s as b,a as B,j as Ee,F as I}from"./web.CWjATOO3.js";import{h as te}from"./haptics.CX2_4n8b.js";function Y(o,j=30){const w=[];let k=0;for(const M of o)w.push({char:M,delay:k*j}),k++;return w}var Fe=i(`<div class="w-full h-full backdrop-blur-sm opacity-80 flex flex-col items-center justify-center gap-3"><div class="w-full flex items-center justify-center shrink-0"><div><div class=holo-card__inner><!$><!/><div class="absolute inset-0 bg-gradient-to-b opacity-50 from-blue-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl z-10"></div><div class=holo-card__glitter></div><div class=holo-card__shine></div><div class=holo-card__glare></div><div class="relative z-10 flex flex-col items-center text-center p-4 h-full"></div></div></div></div><style>
        /* Colocated Hadacard styles (state machine preferred: closed/open/landscape/withVideo).
           All theme variants defined here for the component. Global holo base kept minimal. */
        .holo-card--closed {
          --card-aspect: 0.72;
          cursor: pointer;
        }
        .holo-card--open {
          /* "open up wide" — the letter breathes; parent container still controls outer bounds */
        }
        .holo-card--closed .holo-card__inner,
        .holo-card--open .holo-card__inner {
          /* Slower, more deliberate (hadacard-invert-letter): feels like carefully unfolding a real letter */
          transition: transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* subtle lift + presence when opening */
        .holo-card--open {
          filter: saturate(1.05);
        }

        /* Landscape (hadacard-invert-letter + prior): the letter "unfolds" into a generous wide sheet.
           Slower and more deliberate aspect transition + the new banner/P.S. feel like discovered pages. */
        .holo-card--landscape {
          --card-aspect: 1.62;
        }
        .holo-card--landscape .holo-card__inner {
          transition: transform 820ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 820ms ease;
        }
        /* A touch more presence + the new elements breathe with the wider format */
        .holo-card--landscape {
          filter: saturate(1.08);
        }
        /* The glassy arrow is already styled inline to feel native; these rules just ensure it participates */
        .holo-card--landscape .aero-glass {
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* Video background state (gift horsey) - full aspect, scales, sits behind holo layers */
        .hadacard-with-video .holo-card__inner {
          background: transparent;
        }
        .hadacard-with-video video {
          filter: saturate(0.85) contrast(1.05);
        }

        /* Nice animation for fixed confetti image above center (subtle drift + sparkle) */
        .hadacard-confetti-anim {
          animation: confettiDrift 9s ease-in-out infinite, confettiSparkle 3.5s linear infinite;
          will-change: transform, opacity;
        }
        @keyframes confettiDrift {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes confettiSparkle {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }

        /* More exciting particle field for Hadacard (colocated, on the holo surface when video/gift mode) */
        .hadacard-with-video .holo-card__glitter::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(255,102,196,0.12) 0%, transparent 60%);
          animation: particleField 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: screen;
        }
        @keyframes particleField {
          0%, 100% { opacity: 0.6; transform: translate(0, 0); }
          50% { opacity: 1; transform: translate(1px, -1px); }
        }
      `),Ae=i('<video class="absolute inset-0 w-full h-full object-cover rounded-2xl z-0"autoplay loop muted playsinline style=object-fit:cover>'),Be=i('<div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"style=background-image:url(/resources/img/jaja.png)>'),Ie=i(`<div class="flex flex-col items-center justify-center h-full py-2"><div class="text-[9px] text-pink-200/55 tracking-wider mb-0.5"style="font-family:'Patrick Hand', cursive">2026</div><div class="relative w-16 h-16 mb-2 animate-float z-10 shrink-0"><img src=/resources/img/bday-cap.svg class="absolute -top-3 -right-1.5 w-7 h-7 z-20 rotate-12 drop-shadow"alt><div class="w-full h-full rounded-full border-[2px] border-pink-300/50 overflow-hidden"style="box-shadow:0 0 10px rgba(255,102,196,0.35), inset 0 0 6px rgba(0,0,0,0.25)"><img class="w-full h-full object-cover"></div></div><h2 class="text-2xl font-normal leading-none text-white drop-shadow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 12px rgba(255,102,196,0.45)"></h2><!$><!/><div class="mt-3 text-[10px] text-pink-200/70 tracking-wider font-semibold">TAP TO OPEN</div><div class="text-[11px] mt-0.5">✉︎`),Re=i('<p class="text-pink-200/60 text-[9px] italic mt-0.5">aka <!$><!/>'),Ue=i(`<div class="w-full text-[9px] text-pink-200/60 tracking-[1px] mb-1 text-right"style="font-family:'Patrick Hand', cursive">For Janell • 2026`),Ne=i('<div class="relative w-24 h-24 mb-3 animate-float z-10 shrink-0"><img src=/resources/img/bday-cap.svg class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg"alt><div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"style="box-shadow:0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)"><img class="w-full h-full object-cover"></div><div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">'),Te=i(`<h1 class="text-3xl font-normal mb-1 leading-tight text-white drop-shadow-md text-glow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 15px rgba(255,102,196,0.5)">`),Ve=i(`<h2 class="text-2xl font-normal mb-0.5"style="font-family:'Great Vibes', cursive">`),Ye=i('<img class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0 rounded-2xl hadacard-confetti-anim"alt>'),Ge=i(`<div class="flex-1 flex items-center overflow-y-auto px-3 py-1"><p class="text-blue-100/95 leading-relaxed text-[26px] md:text-[30px] italic"style="font-family:'Patrick Hand', cursive">`),Je=i('<div class="w-full mt-1 pt-2 border-t border-white/10 text-[10px] text-pink-200/60 font-mono flex justify-between items-center"><div>— with love, always</div><div class=text-right><!$><!/> · <!$><!/>'),Xe=i('<button class="absolute bottom-3 right-4 z-30 aero-glass rounded-full w-11 h-11 flex items-center justify-center text-2xl leading-none text-aero-cyan border border-white/25 shadow-md active:scale-90 transition-all hover:border-aero-pink/60 hover:scale-105 select-none">'),qe=i('<div class="w-1 h-4 bg-gradient-to-b from-white to-pink-300 rounded-sm relative shadow-md"><div class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-orange-400 rounded-full blur-[1px] animate-pulse"></div><div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-200 rounded-full">'),G=i("<span>"),De=i('<p class="text-pink-200/80 text-[10px] font-semibold italic mb-2">aka "<!$><!/>"'),Qe=i(`<div class="w-full mb-1 text-[12px] md:text-[14px] text-pink-200/85 tracking-[0.5px] italic"style="font-family:'Patrick Hand', cursive">`),We=i('<div class="w-full text-[11px] md:text-[12px] text-pink-200/75 italic mb-1 px-1">P.S. I would choose this lifetime again if it meant one more moment with you.');function tt(o){const[j,w]=_(50),[k,M]=_(50),[ae,J]=_(.4),[Ke,X]=_(!1),R=()=>o.open,[re,le]=_(!1),z=()=>R()!==void 0?!!R():re(),ie=l=>{R()===void 0&&le(l),o.onOpenChange?.(l),l&&te.trigger("success")},ne=()=>ie(!z()),U=()=>o.landscape,[oe,se]=_(!1),S=()=>U()!==void 0?!!U():oe(),ce=l=>{U()===void 0&&se(l),o.onLandscapeChange?.(l),te.trigger(l?"success":"light")},de=()=>ce(!S());let H,C;const L=()=>o.name||"For Janell",P=()=>o.nickname||"Janell",he=()=>o.picUrl||"/resources/img/janell.png",q=()=>o.hbdMessage||"Happy Belated Birthday!",D=()=>o.cardMeta||{edition:"Quantum Extract · First Edition",series:"Hadacard™ Crystalline Series",id:"HC-001",rarity:"✦ Ultra Rare Holo",year:"2026",artist:"The Universe"},fe=()=>Y(q(),50),ue=()=>Y(L(),40),pe=()=>o.scrollMsg||"Every star still pauses when you smile.",N=()=>o.videoBg||"",Q=()=>o.centerImage||he(),me=()=>o.confettiImage||"/resources/img/Confetti.png",ge=()=>["holo-card",z()?"holo-card--open":"holo-card--closed",S()?"holo-card--landscape":"",N()?"hadacard-with-video":""].filter(Boolean).join(" "),T=()=>{C&&(cancelAnimationFrame(C),C=void 0)},ve=l=>{if(!H)return;X(!0),T();const f=H.getBoundingClientRect(),c=(l.clientX-f.left)/f.width*100,O=(l.clientY-f.top)/f.height*100;w(Math.max(0,Math.min(100,c))),M(Math.max(0,Math.min(100,O))),J(1)},be=()=>{X(!1),J(.45),W()},W=()=>{T();let l=0;const f=()=>{l+=.006,w(50+Math.sin(l)*35),M(50+Math.cos(l*.7)*35),C=requestAnimationFrame(f)};C=requestAnimationFrame(f)};Le(()=>{W()}),Pe(()=>{T()});const xe=()=>`
    --pointer-x: ${j()}%;
    --pointer-y: ${k()}%;
    --card-opacity: ${ae()};
    --rotate-x: ${(j()-50)/50*14}deg;
    --rotate-y: ${(k()-50)/50*-14}deg;
  `;return(()=>{var l=r(Fe),f=l.firstChild,c=f.firstChild,O=c.firstChild,$e=O.firstChild,[K,_e]=y($e.nextSibling),ye=K.nextSibling,we=ye.nextSibling,ke=we.nextSibling,Se=ke.nextSibling,Ce=Se.nextSibling;c.$$click=()=>{z()||ne()},c.addEventListener("pointerleave",be),c.$$pointermove=ve;var Z=H;return typeof Z=="function"?Oe(Z,c):H=c,n(O,(()=>{var u=h(()=>!!N());return()=>u()?(()=>{var e=r(Ae);return p(()=>b(e,"src",N())),e})():r(Be)})(),K,_e),n(Ce,(()=>{var u=h(()=>!z());return()=>u()?(()=>{var e=r(Ie),t=e.firstChild,a=t.nextSibling,s=a.firstChild,m=s.nextSibling,d=m.firstChild,g=a.nextSibling,x=g.nextSibling,[E,V]=y(x.nextSibling);return E.nextSibling,n(g,L),n(e,(()=>{var v=h(()=>!!P());return()=>v()&&(()=>{var $=r(Re),F=$.firstChild,je=F.nextSibling,[Me,ze]=y(je.nextSibling);return n($,P,Me,ze),$})()})(),E,V),p(v=>{var $=Q(),F=L();return $!==v.e&&b(d,"src",v.e=$),F!==v.t&&b(d,"alt",v.t=F),v},{e:void 0,t:void 0}),e})():[r(Ue),(()=>{var e=r(Ne),t=e.firstChild,a=t.nextSibling,s=a.firstChild,m=a.nextSibling;return n(m,A(I,{each:[1,2,3,4,5],children:()=>r(qe)})),p(d=>{var g=Q(),x=L();return g!==d.e&&b(s,"src",d.e=g),x!==d.t&&b(s,"alt",d.t=x),d},{e:void 0,t:void 0}),e})(),(()=>{var e=r(Te);return n(e,A(I,{get each(){return fe()},children:t=>(()=>{var a=r(G);return n(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),p(()=>B(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),(()=>{var e=r(Ve);return n(e,A(I,{get each(){return ue()},children:t=>(()=>{var a=r(G);return n(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),p(()=>B(a,t.char===" "?"letter-space":"letter-block letter-gradient")),a})()})),e})(),h(()=>h(()=>!!P())()&&(()=>{var e=r(De),t=e.firstChild,a=t.nextSibling,[s,m]=y(a.nextSibling);return s.nextSibling,n(e,P,s,m),e})()),h(()=>h(()=>!!S())()&&[(()=>{var e=r(Qe);return n(e,A(I,{get each(){return Y(pe(),22)},children:t=>(()=>{var a=r(G);return n(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),p(()=>B(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),r(We)]),(()=>{var e=r(Ye);return p(()=>b(e,"src",me())),e})(),(()=>{var e=r(Ge),t=e.firstChild;return n(t,()=>q()||"Wishing you a day filled with joy, sparkles, and infinite beauty."),e})(),(()=>{var e=r(Je),t=e.firstChild,a=t.nextSibling,s=a.firstChild,[m,d]=y(s.nextSibling),g=m.nextSibling,x=g.nextSibling,[E,V]=y(x.nextSibling);return n(a,()=>D().artist,m,d),n(a,()=>D().year,E,V),e})(),(()=>{var e=r(Xe);return e.$$click=t=>{t.stopPropagation(),de()},n(e,()=>S()?"⟵":"⟶"),p(()=>b(e,"aria-label",S()?"Return to portrait letter view":"Expand letter to landscape view")),ee(),e})()]})()),p(u=>{var e=`holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${ge()}`,t=`${xe()}; touch-action: none;`;return e!==u.e&&B(c,u.e=e),u.t=Ee(c,t,u.t),u},{e:void 0,t:void 0}),ee(),l})()}He(["pointermove","click"]);export{tt as default};
