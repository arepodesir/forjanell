import{d as Oe,b as k,o as Ee,m as d,g as r,e as S,i as l,c as m,f as R,r as ae,h as Fe,u as ie,t as n,s as b,a as P,j as Ae,F as U}from"./web.CWjATOO3.js";import{h as re}from"./haptics.CX2_4n8b.js";function J(o,H=30){const C=[];let j=0;for(const L of o)C.push({char:L,delay:j*H}),j++;return C}var Be=n(`<div><div class="w-full flex items-center justify-center shrink-0"><div><div class=holo-card__inner><!$><!/><div class="absolute inset-0 bg-gradient-to-b opacity-40 from-blue-900/60 via-pink-900/40 to-indigo-900/70 rounded-2xl z-5"></div><div class="holo-card__glitter z-10"></div><div class="holo-card__shine z-10"></div><div class="holo-card__glare z-10"></div><div class="relative z-20 flex flex-col items-center text-center p-4 h-full"></div></div></div></div><style>
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

        /* Video gift mode: the full viewport video is a separate fixed layer (no gaps, no border, no clip).
           The .holo-card / __inner here is just the floating letter surface (keeps its shape + holo foils for magic over video).
           Make the surface borderless / transparent so it doesn't "frame" or gap the video underneath. */
        .hadacard-with-video .holo-card__inner {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        /* The fixed video (outside the card surface) gets a gentle cinematic look via the element itself; foils live on the letter layer. */

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
      `),Te=n('<video class="fixed inset-0 w-full h-full object-cover z-[-20] pointer-events-none"autoplay loop muted playsinline>'),Ie=n('<div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"style=background-image:url(/resources/img/jaja.png)>'),Re=n(`<div class="flex flex-col items-center justify-center h-full py-2"><div class="text-[9px] text-pink-200/55 tracking-wider mb-0.5"style="font-family:'Patrick Hand', cursive">2026</div><div class="relative w-20 h-20 mb-2 animate-float z-10 shrink-0"><img src=/resources/img/bday-cap.svg class="absolute -top-3 -right-1.5 w-7 h-7 z-20 rotate-12 drop-shadow"alt><div class="w-full h-full rounded-full border-[2px] border-pink-300/50 overflow-hidden"style="box-shadow:0 0 10px rgba(255,102,196,0.35), inset 0 0 6px rgba(0,0,0,0.25)"><img class="w-full h-full object-cover"></div></div><h2 class="text-2xl font-normal leading-none text-white drop-shadow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 12px rgba(255,102,196,0.45)"></h2><!$><!/><div class="mt-3 text-[10px] text-pink-200/70 tracking-wider font-semibold">TAP TO OPEN</div><div class="text-[11px] mt-0.5">✉︎`),Ue=n('<p class="text-pink-200/60 text-[9px] italic mt-0.5">aka <!$><!/>'),Ve=n(`<div class="w-full text-[9px] text-pink-200/60 tracking-[1px] mb-1 text-right"style="font-family:'Patrick Hand', cursive">For Janell • 2026`),Ne=n('<div class="relative w-28 h-28 mb-3 animate-float z-10 shrink-0"><img src=/resources/img/bday-cap.svg class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg"alt><div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"style="box-shadow:0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)"><img class="w-full h-full object-cover"></div><div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20"></div><img class="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 object-contain opacity-70 pointer-events-none z-40 hadacard-confetti-anim"alt>'),Ye=n(`<h1 class="text-3xl font-normal mb-1 leading-tight text-white drop-shadow-md text-glow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 15px rgba(255,102,196,0.5)">`),Ge=n(`<h2 class="text-2xl font-normal mb-0.5"style="font-family:'Great Vibes', cursive">`),Je=n(`<div class="flex-1 flex items-center overflow-y-auto px-3 py-1"><p class="text-blue-100/95 leading-relaxed text-[26px] md:text-[30px] italic"style="font-family:'Patrick Hand', cursive">`),Xe=n('<div class="w-full mt-1 pt-2 border-t border-white/10 text-[10px] text-pink-200/60 font-mono flex justify-between items-center"><div>— with love, always</div><div class=text-right><!$><!/> · <!$><!/>'),qe=n('<button class="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 aero-glass rounded-full w-10 h-10 flex items-center justify-center text-xl leading-none text-aero-cyan border border-white/25 shadow-md active:scale-90 transition-all hover:border-aero-pink/60 hover:scale-105 select-none">'),De=n('<div class="w-1 h-4 bg-gradient-to-b from-white to-pink-300 rounded-sm relative shadow-md"><div class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-orange-400 rounded-full blur-[1px] animate-pulse"></div><div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-200 rounded-full">'),X=n("<span>"),Qe=n('<p class="text-pink-200/80 text-[10px] font-semibold italic mb-2">aka "<!$><!/>"'),We=n(`<div class="w-full mb-1 text-[12px] md:text-[14px] text-pink-200/85 tracking-[0.5px] italic"style="font-family:'Patrick Hand', cursive">`),Ke=n('<div class="w-full text-[11px] md:text-[12px] text-pink-200/75 italic mb-1 px-1">P.S. I would choose this lifetime again if it meant one more moment with you.');function at(o){const[H,C]=k(50),[j,L]=k(50),[le,q]=k(.4),[Ze,D]=k(!1),V=()=>o.open,[ne,oe]=k(!1),O=()=>V()!==void 0?!!V():ne(),se=i=>{V()===void 0&&oe(i),o.onOpenChange?.(i),i&&re.trigger("success")},ce=()=>se(!O()),N=()=>o.landscape,[de,he]=k(!1),M=()=>N()!==void 0?!!N():de(),fe=i=>{N()===void 0&&he(i),o.onLandscapeChange?.(i),re.trigger(i?"success":"light")},ue=()=>fe(!M());let E,z,Y;const F=()=>o.name||"For Janell",A=()=>o.nickname||"Janell",pe=()=>o.picUrl||"/assets/img/janell.png",Q=()=>o.hbdMessage||"Happy Belated Birthday!",W=()=>o.cardMeta||{edition:"Quantum Extract · First Edition",series:"Hadacard™ Crystalline Series",id:"HC-001",rarity:"✦ Ultra Rare Holo",year:"2026",artist:"The Universe"},me=()=>J(Q(),50),ve=()=>J(F(),40),ge=()=>o.scrollMsg||"Every star still pauses when you smile.",v=()=>o.videoBg||"",K=()=>o.centerImage||pe(),xe=()=>o.confettiImage||"/assets/img/Confetti.png",be=()=>["holo-card",O()?"holo-card--open":"holo-card--closed",M()?"holo-card--landscape":"",v()?"hadacard-with-video":""].filter(Boolean).join(" "),G=()=>{z&&(cancelAnimationFrame(z),z=void 0)},$e=i=>{if(!E)return;D(!0),G();const h=E.getBoundingClientRect(),u=(i.clientX-h.left)/h.width*100,T=(i.clientY-h.top)/h.height*100;C(Math.max(0,Math.min(100,u))),L(Math.max(0,Math.min(100,T))),q(1)},_e=()=>{D(!1),q(.45),Z()},Z=()=>{G();let i=0;const h=()=>{i+=.006,C(50+Math.sin(i)*35),L(50+Math.cos(i*.7)*35),z=requestAnimationFrame(h)};z=requestAnimationFrame(h)},B=()=>{Y&&v()&&Y.play().catch(()=>{})};Ee(()=>{Z(),v()&&(setTimeout(B,50),setTimeout(B,280))}),Fe(()=>{G()});const ye=()=>`
    --pointer-x: ${H()}%;
    --pointer-y: ${j()}%;
    --card-opacity: ${le()};
    --rotate-x: ${(H()-50)/50*20}deg;
    --rotate-y: ${(j()-50)/50*-20}deg;
  `;return[d(()=>d(()=>!!v())()&&(()=>{var i=r(Te);return ie(h=>{Y=h||void 0},i),m(()=>b(i,"src",v())),i})()),(()=>{var i=r(Be),h=i.firstChild,u=h.firstChild,T=u.firstChild,we=T.firstChild,[ee,ke]=S(we.nextSibling),Se=ee.nextSibling,Ce=Se.nextSibling,je=Ce.nextSibling,Me=je.nextSibling,ze=Me.nextSibling;u.$$click=()=>{O()||ce()},u.addEventListener("pointerleave",_e),u.$$pointermove=$e;var te=E;return typeof te=="function"?ie(te,u):E=u,l(T,(()=>{var f=d(()=>!v());return()=>f()&&r(Ie)})(),ee,ke),l(ze,(()=>{var f=d(()=>!O());return()=>f()?(()=>{var e=r(Re),t=e.firstChild,a=t.nextSibling,s=a.firstChild,p=s.nextSibling,$=p.firstChild,c=a.nextSibling,_=c.nextSibling,[g,y]=S(_.nextSibling);return g.nextSibling,l(c,F),l(e,(()=>{var x=d(()=>!!A());return()=>x()&&(()=>{var w=r(Ue),I=w.firstChild,Pe=I.nextSibling,[He,Le]=S(Pe.nextSibling);return l(w,A,He,Le),w})()})(),g,y),m(x=>{var w=K(),I=F();return w!==x.e&&b($,"src",x.e=w),I!==x.t&&b($,"alt",x.t=I),x},{e:void 0,t:void 0}),e})():[r(Ve),(()=>{var e=r(Ne),t=e.firstChild,a=t.nextSibling,s=a.firstChild,p=a.nextSibling,$=p.nextSibling;return l(p,R(U,{each:[1,2,3,4,5],children:()=>r(De)})),m(c=>{var _=K(),g=F(),y=xe();return _!==c.e&&b(s,"src",c.e=_),g!==c.t&&b(s,"alt",c.t=g),y!==c.a&&b($,"src",c.a=y),c},{e:void 0,t:void 0,a:void 0}),e})(),(()=>{var e=r(Ye);return l(e,R(U,{get each(){return me()},children:t=>(()=>{var a=r(X);return l(a,(()=>{var s=d(()=>t.char===" ");return()=>s()?" ":t.char})()),m(()=>P(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),(()=>{var e=r(Ge);return l(e,R(U,{get each(){return ve()},children:t=>(()=>{var a=r(X);return l(a,(()=>{var s=d(()=>t.char===" ");return()=>s()?" ":t.char})()),m(()=>P(a,t.char===" "?"letter-space":"letter-block letter-gradient")),a})()})),e})(),d(()=>d(()=>!!A())()&&(()=>{var e=r(Qe),t=e.firstChild,a=t.nextSibling,[s,p]=S(a.nextSibling);return s.nextSibling,l(e,A,s,p),e})()),d(()=>d(()=>!!M())()&&[(()=>{var e=r(We);return l(e,R(U,{get each(){return J(ge(),22)},children:t=>(()=>{var a=r(X);return l(a,(()=>{var s=d(()=>t.char===" ");return()=>s()?" ":t.char})()),m(()=>P(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),r(Ke)]),(()=>{var e=r(Je),t=e.firstChild;return l(t,()=>Q()||"Wishing you a day filled with joy, sparkles, and infinite beauty."),e})(),(()=>{var e=r(Xe),t=e.firstChild,a=t.nextSibling,s=a.firstChild,[p,$]=S(s.nextSibling),c=p.nextSibling,_=c.nextSibling,[g,y]=S(_.nextSibling);return l(a,()=>W().artist,p,$),l(a,()=>W().year,g,y),e})(),(()=>{var e=r(qe);return e.$$pointerdown=B,e.$$click=t=>{t.stopPropagation(),ue(),B()},l(e,()=>M()?"♡":"💌"),m(()=>b(e,"aria-label",M()?"Return to portrait letter view":"Expand letter to landscape view")),ae(),e})()]})()),m(f=>{var e=`w-full h-full flex flex-col items-center justify-center gap-3 ${v()?"":"backdrop-blur-sm opacity-80"}`,t=`holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${be()}`,a=`${ye()}; touch-action: none;`;return e!==f.e&&P(i,f.e=e),t!==f.t&&P(u,f.t=t),f.a=Ae(u,a,f.a),f},{e:void 0,t:void 0,a:void 0}),ae(),i})()]}Oe(["pointermove","click","pointerdown"]);export{at as default};
