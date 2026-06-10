import{d as Ae,b as S,o as Be,g as r,e as x,i as n,m as h,u as ie,c as u,f as R,r as re,h as Ie,t as l,s as $,a as L,j as Te,F as U}from"./web.CWjATOO3.js";import{h as ne}from"./haptics.CX2_4n8b.js";function J(o,O=30){const C=[];let j=0;for(const E of o)C.push({char:E,delay:j*O}),j++;return C}var Re=l(`<div><div class="w-full flex items-center justify-center shrink-0"><div><div class=holo-card__inner><!$><!/><!$><!/><div class="absolute inset-0 bg-gradient-to-b opacity-40 from-blue-900/60 via-pink-900/40 to-indigo-900/70 rounded-2xl z-5"></div><div class="holo-card__glitter z-10"></div><div class="holo-card__shine z-10"></div><div class="holo-card__glare z-10"></div><div class="relative z-20 flex flex-col items-center text-center p-4 h-full"></div></div></div></div><style>
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

        /* Video gift mode: video lives *inside* the card (as the card's own background).
           The .holo-card surface is intentionally large (fills most of the window) so the video + holo + letter elements feel immersive.
           Inner has no border so video reaches the card edges; holo layers + content overlay the video. */
        .hadacard-with-video .holo-card {
          width: 94vw;
          height: 78vh;
          max-width: none;
          aspect-ratio: unset;
          border-radius: 18px;
        }
        .hadacard-with-video .holo-card__inner {
          background: transparent;
          border: none;
          box-shadow: none;
          border-radius: 18px;
          overflow: hidden; /* keep video contained to card shape */
        }
        .hadacard-with-video video {
          filter: saturate(0.9) contrast(1.08);
        }

        /* Confetti decoration above profile - a bit stronger on the video card */
        .hadacard-with-video .hadacard-confetti-anim {
          width: 4.75rem;
          height: 4.75rem;
          top: -1.1rem;
          opacity: 0.82;
        }

        /* Nice animation for confetti image above center (subtle drift + sparkle) */
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
      `),Ue=l('<video class="absolute inset-0 w-full h-full object-cover z-[-1] pointer-events-none"autoplay loop muted playsinline>'),Ve=l('<div class="absolute inset-0 bg-cover bg-center opacity-25 rounded-2xl"style=background-image:url(/assets/img/jaja.png)>'),Ne=l(`<div class="flex flex-col items-center justify-center h-full py-2"><div class="text-[9px] text-pink-200/55 tracking-wider mb-0.5"style="font-family:'Patrick Hand', cursive">2026</div><div class="relative w-20 h-20 mb-2 animate-float z-10 shrink-0"><img src=/assets/img/bday-cap.svg class="absolute -top-3 -right-1.5 w-7 h-7 z-20 rotate-12 drop-shadow"alt><div class="w-full h-full rounded-full border-[2px] border-pink-300/50 overflow-hidden"style="box-shadow:0 0 10px rgba(255,102,196,0.35), inset 0 0 6px rgba(0,0,0,0.25)"><img class="w-full h-full object-cover"></div></div><h2 class="text-2xl font-normal leading-none text-white drop-shadow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 12px rgba(255,102,196,0.45)"></h2><!$><!/><div class="mt-3 text-[10px] text-pink-200/70 tracking-wider font-semibold">TAP TO OPEN</div><div class="text-[11px] mt-0.5">✉︎`),Ye=l('<p class="text-pink-200/60 text-[9px] italic mt-0.5">aka <!$><!/>'),Ge=l(`<div class="w-full text-[9px] text-pink-200/60 tracking-[1px] mb-1 text-right"style="font-family:'Patrick Hand', cursive">For Janell • 2026`),Je=l('<div class="relative w-28 h-28 mb-3 animate-float z-10 shrink-0"><img src=/assets/img/bday-cap.svg class="absolute -top-4 -right-2 w-9 h-9 z-20 rotate-12 drop-shadow-lg"alt><div class="w-full h-full rounded-full border-[3px] border-pink-300/60 overflow-hidden"style="box-shadow:0 0 15px rgba(255,102,196,0.5), 0 0 30px rgba(188,19,254,0.2), inset 0 0 8px rgba(0,0,0,0.3)"><img class="w-full h-full object-cover"></div><div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20"></div><img class="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 object-contain opacity-70 pointer-events-none z-40 hadacard-confetti-anim"alt>'),Xe=l(`<h1 class="text-3xl font-normal mb-1 leading-tight text-white drop-shadow-md text-glow"style="font-family:'Great Vibes', cursive;text-shadow:0 0 15px rgba(255,102,196,0.5)">`),qe=l(`<h2 class="text-2xl font-normal mb-0.5"style="font-family:'Great Vibes', cursive">`),De=l(`<div class="flex-1 flex items-center overflow-y-auto px-3 py-1"><p class="text-blue-100/95 leading-relaxed text-[26px] md:text-[30px] italic"style="font-family:'Patrick Hand', cursive">`),Qe=l('<div class="w-full mt-1 pt-2 border-t border-white/10 text-[10px] text-pink-200/60 font-mono flex justify-between items-center"><div>— with love, always</div><div class=text-right><!$><!/> · <!$><!/>'),We=l('<button class="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 aero-glass rounded-full w-10 h-10 flex items-center justify-center text-xl leading-none text-aero-cyan border border-white/25 shadow-md active:scale-90 transition-all hover:border-aero-pink/60 hover:scale-105 select-none">'),Ke=l('<div class="w-1 h-4 bg-gradient-to-b from-white to-pink-300 rounded-sm relative shadow-md"><div class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-orange-400 rounded-full blur-[1px] animate-pulse"></div><div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-yellow-200 rounded-full">'),X=l("<span>"),Ze=l('<p class="text-pink-200/80 text-[10px] font-semibold italic mb-2">aka "<!$><!/>"'),et=l(`<div class="w-full mb-1 text-[12px] md:text-[14px] text-pink-200/85 tracking-[0.5px] italic"style="font-family:'Patrick Hand', cursive">`),tt=l('<div class="w-full text-[11px] md:text-[12px] text-pink-200/75 italic mb-1 px-1">P.S. I would choose this lifetime again if it meant one more moment with you.');function nt(o){const[O,C]=S(50),[j,E]=S(50),[le,q]=S(.4),[at,D]=S(!1),V=()=>o.open,[oe,se]=S(!1),F=()=>V()!==void 0?!!V():oe(),ce=i=>{V()===void 0&&se(i),o.onOpenChange?.(i),i&&ne.trigger("success")},de=()=>ce(!F()),N=()=>o.landscape,[he,fe]=S(!1),z=()=>N()!==void 0?!!N():he(),me=i=>{N()===void 0&&fe(i),o.onLandscapeChange?.(i),ne.trigger(i?"success":"light")},ve=()=>me(!z());let A,M,Y;const B=()=>o.name||"For Janell",I=()=>o.nickname||"Janell",ue=()=>o.picUrl||"/assets/img/janell.png",Q=()=>o.hbdMessage||"Happy Belated Birthday!",W=()=>o.cardMeta||{edition:"Quantum Extract · First Edition",series:"Hadacard™ Crystalline Series",id:"HC-001",rarity:"✦ Ultra Rare Holo",year:"2026",artist:"The Universe"},pe=()=>J(Q(),50),ge=()=>J(B(),40),be=()=>o.scrollMsg||"Every star still pauses when you smile.",p=()=>o.videoBg||"",K=()=>o.centerImage||ue(),xe=()=>o.confettiImage||"/assets/img/Confetti.png",$e=()=>["holo-card",F()?"holo-card--open":"holo-card--closed",z()?"holo-card--landscape":"",p()?"hadacard-with-video":""].filter(Boolean).join(" "),G=()=>{M&&(cancelAnimationFrame(M),M=void 0)},_e=i=>{if(!A)return;D(!0),G();const m=A.getBoundingClientRect(),f=(i.clientX-m.left)/m.width*100,H=(i.clientY-m.top)/m.height*100;C(Math.max(0,Math.min(100,f))),E(Math.max(0,Math.min(100,H))),q(1)},we=()=>{D(!1),q(.45),Z()},Z=()=>{G();let i=0;const m=()=>{i+=.006,C(50+Math.sin(i)*35),E(50+Math.cos(i*.7)*35),M=requestAnimationFrame(m)};M=requestAnimationFrame(m)},P=()=>{Y&&p()&&Y.play().catch(()=>{})};Be(()=>{Z(),p()&&(setTimeout(P,50),setTimeout(P,280))}),Ie(()=>{G()});const ye=()=>`
    --pointer-x: ${O()}%;
    --pointer-y: ${j()}%;
    --card-opacity: ${le()};
    --rotate-x: ${(O()-50)/50*20}deg;
    --rotate-y: ${(j()-50)/50*-20}deg;
  `;return(()=>{var i=r(Re),m=i.firstChild,f=m.firstChild,H=f.firstChild,ke=H.firstChild,[ee,Se]=x(ke.nextSibling),Ce=ee.nextSibling,[te,je]=x(Ce.nextSibling),ze=te.nextSibling,Me=ze.nextSibling,Pe=Me.nextSibling,He=Pe.nextSibling,Le=He.nextSibling;f.$$click=()=>{F()||de(),P()},f.addEventListener("pointerleave",we),f.$$pointermove=_e;var ae=A;return typeof ae=="function"?ie(ae,f):A=f,n(H,(()=>{var c=h(()=>!!p());return()=>c()&&(()=>{var e=r(Ue);return ie(t=>{Y=t||void 0},e),u(()=>$(e,"src",p())),e})()})(),ee,Se),n(H,(()=>{var c=h(()=>!p());return()=>c()&&r(Ve)})(),te,je),n(Le,(()=>{var c=h(()=>!F());return()=>c()?(()=>{var e=r(Ne),t=e.firstChild,a=t.nextSibling,s=a.firstChild,v=s.nextSibling,_=v.firstChild,d=a.nextSibling,w=d.nextSibling,[g,y]=x(w.nextSibling);return g.nextSibling,n(d,B),n(e,(()=>{var b=h(()=>!!I());return()=>b()&&(()=>{var k=r(Ye),T=k.firstChild,Oe=T.nextSibling,[Ee,Fe]=x(Oe.nextSibling);return n(k,I,Ee,Fe),k})()})(),g,y),u(b=>{var k=K(),T=B();return k!==b.e&&$(_,"src",b.e=k),T!==b.t&&$(_,"alt",b.t=T),b},{e:void 0,t:void 0}),e})():[r(Ge),(()=>{var e=r(Je),t=e.firstChild,a=t.nextSibling,s=a.firstChild,v=a.nextSibling,_=v.nextSibling;return n(v,R(U,{each:[1,2,3,4,5],children:()=>r(Ke)})),u(d=>{var w=K(),g=B(),y=xe();return w!==d.e&&$(s,"src",d.e=w),g!==d.t&&$(s,"alt",d.t=g),y!==d.a&&$(_,"src",d.a=y),d},{e:void 0,t:void 0,a:void 0}),e})(),(()=>{var e=r(Xe);return n(e,R(U,{get each(){return pe()},children:t=>(()=>{var a=r(X);return n(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),u(()=>L(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),(()=>{var e=r(qe);return n(e,R(U,{get each(){return ge()},children:t=>(()=>{var a=r(X);return n(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),u(()=>L(a,t.char===" "?"letter-space":"letter-block letter-gradient")),a})()})),e})(),h(()=>h(()=>!!I())()&&(()=>{var e=r(Ze),t=e.firstChild,a=t.nextSibling,[s,v]=x(a.nextSibling);return s.nextSibling,n(e,I,s,v),e})()),h(()=>h(()=>!!z())()&&[(()=>{var e=r(et);return n(e,R(U,{get each(){return J(be(),22)},children:t=>(()=>{var a=r(X);return n(a,(()=>{var s=h(()=>t.char===" ");return()=>s()?" ":t.char})()),u(()=>L(a,t.char===" "?"letter-space":"letter-block")),a})()})),e})(),r(tt)]),(()=>{var e=r(De),t=e.firstChild;return n(t,()=>Q()||"Wishing you a day filled with joy, sparkles, and infinite beauty."),e})(),(()=>{var e=r(Qe),t=e.firstChild,a=t.nextSibling,s=a.firstChild,[v,_]=x(s.nextSibling),d=v.nextSibling,w=d.nextSibling,[g,y]=x(w.nextSibling);return n(a,()=>W().artist,v,_),n(a,()=>W().year,g,y),e})(),(()=>{var e=r(We);return e.$$pointerdown=P,e.$$click=t=>{t.stopPropagation(),ve(),P()},n(e,()=>z()?"♡":"💌"),u(()=>$(e,"aria-label",z()?"Return to portrait letter view":"Expand letter to landscape view")),re(),e})()]})()),u(c=>{var e=`w-full h-full flex flex-col items-center justify-center gap-3 ${p()?"":"backdrop-blur-sm opacity-80"}`,t=`holo-card cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${$e()}`,a=`${ye()}; touch-action: none;`;return e!==c.e&&L(i,c.e=e),t!==c.t&&L(f,c.t=t),c.a=Te(f,a,c.a),c},{e:void 0,t:void 0,a:void 0}),re(),i})()}Ae(["pointermove","click","pointerdown"]);export{nt as default};
