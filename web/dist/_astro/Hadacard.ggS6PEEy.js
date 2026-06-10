import{d as He,b as w,o as Le,g as r,e as k,i as l,m as h,c as m,f as B,r as ee,h as Pe,u as Oe,t as n,s as b,a as I,j as Ee,F as R}from"./web.CWjATOO3.js";import{h as te}from"./haptics.CX2_4n8b.js";function Y(o,M=30){const S=[];let C=0;for(const H of o)S.push({char:H,delay:C*M}),C++;return S}var Fe=n(`<div class="w-full h-full backdrop-blur-sm opacity-80 flex flex-col items-center justify-center gap-3"><div class="w-full flex items-center justify-center shrink-0"><div><div class=holo-card__inner><!$><!/><div class="absolute inset-0 bg-gradient-to-b opacity-50 from-blue-900/70 via-pink-900/50 to-indigo-900/80 rounded-2xl z-5"></div><div class="holo-card__glitter z-10"></div><div class="holo-card__shine z-10"></div><div class="holo-card__glare z-10"></div><div class="relative z-20 flex flex-col items-center text-center p-4 h-full"></div></div></div></div><style>
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
      `),Ae=n('<video class="absolute inset-0 w-full h-full object-cover rounded-2xl z-[-1] pointer-events-none"autoplay loop muted playsinline>'),Be=n('<div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"style=background-image:url(/resources/img/jaja.png)>'),Ie=n(`<div class="flex flex-col items-center justify-center h-full py-2"><div class="text-[9px] text-pink-200/55 tracking-wider mb-0.5"style="font-family:'Patrick Hand', cursive">2026</div><div class="relative w-20 h-20 mb-2 animate-float z-10 shrink-0"><img src=/resources/img/bday-cap.svg class="absolute -top-3 -right-1.5 w-7 h-7 z-20 rotate-12 drop-shadow"alt><div class="w-full h-full rounded-full border-[2px] border-pink-300/50 overflow-hidden"style="box-shadow:0 0 10px rgba(255,102,196,0.35), inset 0 0 6px rgba(0,0,0,0.25)"><img class="w-full h-full object-cover"></div></div><h2 class="text-2xl font-normal leading-none text-white drop-shadow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 12px rgba(255,102,196,0.45)"></h2><!$><!/><div class="mt-3 text-[10px] text-pink-200/70 tracking-wider font-semibold">TAP TO OPEN</div><div class="text-[11px] mt-0.5">✉︎`),Re=n('<p class="text-pink-200/60 text-[9px] italic mt-0.5">aka <!$><!/>'),Ue=n(`<div class="w-full text-[9px] text-pink-200/60 tracking-[1px] mb-1 text-right"style="font-family:'Patrick Hand', cursive">For Janell • 2026`),Ne=n('<div class="relative w-28 h-28 mb-3 animate-float z-10 shrink-0"><img src=/resources/img/bday-cap.svg class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg"alt><div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"style="box-shadow:0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)"><img class="w-full h-full object-cover"></div><div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20"></div><img class="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 object-contain opacity-70 pointer-events-none z-40 hadacard-confetti-anim"alt>'),Te=n(`<h1 class="text-3xl font-normal mb-1 leading-tight text-white drop-shadow-md text-glow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 15px rgba(255,102,196,0.5)">`),Ve=n(`<h2 class="text-2xl font-normal mb-0.5"style="font-family:'Great Vibes', cursive">`),Ye=n(`<div class="flex-1 flex items-center overflow-y-auto px-3 py-1"><p class="text-blue-100/95 leading-relaxed text-[26px] md:text-[30px] italic"style="font-family:'Patrick Hand', cursive">`),Ge=n('<div class="w-full mt-1 pt-2 border-t border-white/10 text-[10px] text-pink-200/60 font-mono flex justify-between items-center"><div>— with love, always</div><div class=text-right><!$><!/> · <!$><!/>'),Je=n('<button class="absolute bottom-3 right-4 z-30 aero-glass rounded-full w-11 h-11 flex items-center justify-center text-2xl leading-none text-aero-cyan border border-white/25 shadow-md active:scale-90 transition-all hover:border-aero-pink/60 hover:scale-105 select-none">'),Xe=n('<div class="w-1 h-4 bg-gradient-to-b from-white to-pink-300 rounded-sm relative shadow-md"><div class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-orange-400 rounded-full blur-[1px] animate-pulse"></div><div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-200 rounded-full">'),G=n("<span>"),qe=n('<p class="text-pink-200/80 text-[10px] font-semibold italic mb-2">aka "<!$><!/>"'),De=n(`<div class="w-full mb-1 text-[12px] md:text-[14px] text-pink-200/85 tracking-[0.5px] italic"style="font-family:'Patrick Hand', cursive">`),Qe=n('<div class="w-full text-[11px] md:text-[12px] text-pink-200/75 italic mb-1 px-1">P.S. I would choose this lifetime again if it meant one more moment with you.');function et(o){const[M,S]=w(50),[C,H]=w(50),[ae,J]=w(.4),[We,X]=w(!1),U=()=>o.open,[re,ie]=w(!1),L=()=>U()!==void 0?!!U():re(),le=i=>{U()===void 0&&ie(i),o.onOpenChange?.(i),i&&te.trigger("success")},ne=()=>le(!L()),N=()=>o.landscape,[oe,se]=w(!1),j=()=>N()!==void 0?!!N():oe(),ce=i=>{N()===void 0&&se(i),o.onLandscapeChange?.(i),te.trigger(i?"success":"light")},de=()=>ce(!j());let P,z;const O=()=>o.name||"For Janell",E=()=>o.nickname||"Janell",he=()=>o.picUrl||"/assets/img/janell.png",q=()=>o.hbdMessage||"Happy Belated Birthday!",D=()=>o.cardMeta||{edition:"Quantum Extract · First Edition",series:"Hadacard™ Crystalline Series",id:"HC-001",rarity:"✦ Ultra Rare Holo",year:"2026",artist:"The Universe"},fe=()=>Y(q(),50),ue=()=>Y(O(),40),pe=()=>o.scrollMsg||"Every star still pauses when you smile.",T=()=>o.videoBg||"",Q=()=>o.centerImage||he(),me=()=>o.confettiImage||"/assets/img/Confetti.png",ge=()=>["holo-card",L()?"holo-card--open":"holo-card--closed",j()?"holo-card--landscape":"",T()?"hadacard-with-video":""].filter(Boolean).join(" "),V=()=>{z&&(cancelAnimationFrame(z),z=void 0)},ve=i=>{if(!P)return;X(!0),V();const f=P.getBoundingClientRect(),d=(i.clientX-f.left)/f.width*100,F=(i.clientY-f.top)/f.height*100;S(Math.max(0,Math.min(100,d))),H(Math.max(0,Math.min(100,F))),J(1)},be=()=>{X(!1),J(.45),W()},W=()=>{V();let i=0;const f=()=>{i+=.006,S(50+Math.sin(i)*35),H(50+Math.cos(i*.7)*35),z=requestAnimationFrame(f)};z=requestAnimationFrame(f)};Le(()=>{W()}),Pe(()=>{V()});const xe=()=>`
    --pointer-x: ${M()}%;
    --pointer-y: ${C()}%;
    --card-opacity: ${ae()};
    --rotate-x: ${(M()-50)/50*14}deg;
    --rotate-y: ${(C()-50)/50*-14}deg;
  `;return(()=>{var i=r(Fe),f=i.firstChild,d=f.firstChild,F=d.firstChild,$e=F.firstChild,[K,_e]=k($e.nextSibling),ye=K.nextSibling,we=ye.nextSibling,ke=we.nextSibling,Se=ke.nextSibling,Ce=Se.nextSibling;d.$$click=()=>{L()||ne()},d.addEventListener("pointerleave",be),d.$$pointermove=ve;var Z=P;return typeof Z=="function"?Oe(Z,d):P=d,l(F,(()=>{var u=h(()=>!!T());return()=>u()?(()=>{var e=r(Ae);return m(()=>b(e,"src",T())),e})():r(Be)})(),K,_e),l(Ce,(()=>{var u=h(()=>!L());return()=>u()?(()=>{var e=r(Ie),t=e.firstChild,a=t.nextSibling,s=a.firstChild,p=s.nextSibling,x=p.firstChild,c=a.nextSibling,$=c.nextSibling,[g,_]=k($.nextSibling);return g.nextSibling,l(c,O),l(e,(()=>{var v=h(()=>!!E());return()=>v()&&(()=>{var y=r(Re),A=y.firstChild,je=A.nextSibling,[ze,Me]=k(je.nextSibling);return l(y,E,ze,Me),y})()})(),g,_),m(v=>{var y=Q(),A=O();return y!==v.e&&b(x,"src",v.e=y),A!==v.t&&b(x,"alt",v.t=A),v},{e:void 0,t:void 0}),e})():[r(Ue),(()=>{var e=r(Ne),t=e.firstChild,a=t.nextSibling,s=a.firstChild,p=a.nextSibling,x=p.nextSibling;return l(p,B(R,{each:[1,2,3,4,5],children:()=>r(Xe)})),m(c=>{var $=Q(),g=O(),_=me();return $!==c.e&&b(s,"src",c.e=$),g!==c.t&&b(s,"alt",c.t=g),_!==c.a&&b(x,"src",c.a=_),c},{e:void 0,t:void 0,a:void 0}),e})(),(()=>{var e=r(Te);return l(e,B(R,{get each(){return fe()},children:t=>(()=>{var a=r(G);return l(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),m(()=>I(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),(()=>{var e=r(Ve);return l(e,B(R,{get each(){return ue()},children:t=>(()=>{var a=r(G);return l(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),m(()=>I(a,t.char===" "?"letter-space":"letter-block letter-gradient")),a})()})),e})(),h(()=>h(()=>!!E())()&&(()=>{var e=r(qe),t=e.firstChild,a=t.nextSibling,[s,p]=k(a.nextSibling);return s.nextSibling,l(e,E,s,p),e})()),h(()=>h(()=>!!j())()&&[(()=>{var e=r(De);return l(e,B(R,{get each(){return Y(pe(),22)},children:t=>(()=>{var a=r(G);return l(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),m(()=>I(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),r(Qe)]),(()=>{var e=r(Ye),t=e.firstChild;return l(t,()=>q()||"Wishing you a day filled with joy, sparkles, and infinite beauty."),e})(),(()=>{var e=r(Ge),t=e.firstChild,a=t.nextSibling,s=a.firstChild,[p,x]=k(s.nextSibling),c=p.nextSibling,$=c.nextSibling,[g,_]=k($.nextSibling);return l(a,()=>D().artist,p,x),l(a,()=>D().year,g,_),e})(),(()=>{var e=r(Je);return e.$$click=t=>{t.stopPropagation(),de()},l(e,()=>j()?"⟵":"⟶"),m(()=>b(e,"aria-label",j()?"Return to portrait letter view":"Expand letter to landscape view")),ee(),e})()]})()),m(u=>{var e=`holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${ge()}`,t=`${xe()}; touch-action: none;`;return e!==u.e&&I(d,u.e=e),u.t=Ee(d,t,u.t),u},{e:void 0,t:void 0}),ee(),i})()}He(["pointermove","click"]);export{et as default};
