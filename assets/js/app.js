(function(){
  function installFinalBlockingFixes(){
    if(!document.getElementById('atlasFinalBlockingFixes')){
      let style=document.createElement('style');
      style.id='atlasFinalBlockingFixes';
      style.textContent=`
        .practiceShell>.practicePick{display:none!important}
        .practiceHeroBody .practicePick.programDossierNav,.programDossierNav,.practicePick{display:flex!important;gap:7px 10px!important;flex-wrap:wrap!important;align-items:center!important;margin-top:2px!important;overflow:visible!important;padding:0!important;scrollbar-width:auto!important}
        .programDossierNav .schoolBtn,.practicePick .schoolBtn,.practiceHeroBody .programDossierNav .schoolBtn,.schoolBtn{position:relative!important;background:rgba(5,9,20,.22)!important;border:1px solid rgba(255,255,255,.10)!important;border-radius:999px!important;color:rgba(220,231,247,.76)!important;padding:8px 11px 8px 22px!important;box-shadow:none!important;font-weight:400!important;font-size:.76rem!important;line-height:normal!important;white-space:nowrap!important;margin:0!important;transition:border-color .18s ease,background .18s ease,color .18s ease!important}
        .programDossierNav .schoolBtn:before,.practicePick .schoolBtn:before,.practiceHeroBody .programDossierNav .schoolBtn:before,.schoolBtn:before{content:""!important;position:absolute!important;left:9px!important;top:50%!important;width:5px!important;height:5px!important;border-radius:50%!important;transform:translateY(-50%)!important;background:rgba(220,231,247,.28)!important}
        .programDossierNav .schoolBtn:hover,.programDossierNav .schoolBtn:focus,.practicePick .schoolBtn:hover,.practicePick .schoolBtn:focus,.practiceHeroBody .programDossierNav .schoolBtn:hover,.practiceHeroBody .programDossierNav .schoolBtn:focus,.schoolBtn:hover,.schoolBtn:focus{border-color:rgba(157,231,215,.26)!important;background:rgba(157,231,215,.07)!important;color:#f4f8ff!important;outline:0!important}
        .programDossierNav .schoolBtn.active,.practicePick .schoolBtn.active,.practiceHeroBody .programDossierNav .schoolBtn.active,.schoolBtn.active{background:rgba(157,231,215,.11)!important;border-color:rgba(157,231,215,.36)!important;color:#fff!important;font-weight:700!important}
        .programDossierNav .schoolBtn.active:before,.practicePick .schoolBtn.active:before,.practiceHeroBody .programDossierNav .schoolBtn.active:before,.schoolBtn.active:before{background:var(--programAccent,var(--practiceAccent,#9de7d7))!important;box-shadow:0 0 12px var(--programAccent,var(--practiceAccent,#9de7d7))!important}
        @media(min-width:901px){.practiceHeroBody .practicePick.programDossierNav,.programDossierNav,.practicePick{flex-wrap:nowrap!important;gap:6px!important}.programDossierNav .schoolBtn,.practicePick .schoolBtn,.practiceHeroBody .programDossierNav .schoolBtn,.schoolBtn{padding:8px 8px 8px 18px!important;font-size:.76rem!important;white-space:nowrap!important}.programDossierNav .schoolBtn:before,.practicePick .schoolBtn:before,.practiceHeroBody .programDossierNav .schoolBtn:before,.schoolBtn:before{left:7px!important;width:4px!important;height:4px!important}}
        .splashFrame{display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;width:100%!important;padding:28px!important;justify-items:center!important;place-items:center!important}
        .atlasWordmark{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:max-content!important;max-width:92vw!important;margin:0 auto!important;padding:0!important;text-indent:0!important;text-align:center!important;letter-spacing:.18em!important;transform-origin:center!important;box-sizing:border-box!important}
        .atlasWordmark:after{content:none!important;display:none!important}
        .splashGreeting,.splashSubtitle,.atlasSubtitle{display:none!important}
      `;
      document.head.appendChild(style);
    }

    function prioritizeFinalStyles(){
      let style=document.getElementById('atlasFinalBlockingFixes');
      if(style)document.head.appendChild(style);
    }

    function removeSplashSubtitles(){
      document.getElementById('atlasSplashSubtitleStyles')?.remove();
      document.querySelectorAll('#splashGreeting,.splashGreeting,.splashSubtitle,.atlasSubtitle').forEach(el=>el.remove());
    }

    removeSplashSubtitles();
    prioritizeFinalStyles();

    function normalizePracticeSelector(){
      let shell=document.querySelector('.practiceShell'),body=document.querySelector('.practiceHeroBody');
      if(!shell||!body)return;
      let pick=body.querySelector('.practicePick')||shell.querySelector(':scope > .practicePick');
      if(!pick)return;
      pick.classList.add('programDossierNav');
      if(pick.parentElement!==body){
        let anchor=body.querySelector('p');
        if(anchor)anchor.insertAdjacentElement('afterend',pick);else body.appendChild(pick);
      }
      shell.querySelectorAll(':scope > .practicePick').forEach(x=>x.remove());
      prioritizeFinalStyles();
    }

    normalizePracticeSelector();
    if(!window.ATLAS_FINAL_BLOCKING_RENDER_PATCHED&&typeof render==='function'){
      window.ATLAS_FINAL_BLOCKING_RENDER_PATCHED=true;
      let baseRender=render;
      render=function(){let out=baseRender.apply(this,arguments);requestAnimationFrame(normalizePracticeSelector);return out};
    }
    if(!window.ATLAS_FINAL_BLOCKING_VIEW_PATCHED&&typeof setView==='function'){
      window.ATLAS_FINAL_BLOCKING_VIEW_PATCHED=true;
      let baseSetView=setView;
      setView=function(){let out=baseSetView.apply(this,arguments);requestAnimationFrame(normalizePracticeSelector);return out};
    }
    if(!window.ATLAS_FINAL_BLOCKING_PRACTICE_PATCHED&&typeof atlasPracticeSelect==='function'){
      window.ATLAS_FINAL_BLOCKING_PRACTICE_PATCHED=true;
      let basePracticeSelect=atlasPracticeSelect;
      atlasPracticeSelect=function(){let out=basePracticeSelect.apply(this,arguments);requestAnimationFrame(normalizePracticeSelector);return out};
    }
    if(!window.ATLAS_FINAL_BLOCKING_SPLASH_SKIP){
      window.ATLAS_FINAL_BLOCKING_SPLASH_SKIP=true;
      document.addEventListener('keydown',e=>{
        let splash=document.getElementById('splash');
        if(e.key==='Enter'&&splash&&splash.style.display!=='none'&&splash.getAttribute('aria-hidden')==='false'){
          e.preventDefault();
          e.stopPropagation();
          if(typeof atlasSkipSplash==='function')atlasSkipSplash();
          else {splash.classList.remove('active','exiting');splash.style.display='none';splash.setAttribute('aria-hidden','true')}
        }
      },true);
    }
    let tries=0,watch=setInterval(()=>{tries++;removeSplashSubtitles();normalizePracticeSelector();prioritizeFinalStyles();if(tries>80)clearInterval(watch)},75);
  }

  let core=document.createElement('script');
  core.src='assets/js/app-core.js?v=20260516b';
  core.onload=installFinalBlockingFixes;
  core.onerror=installFinalBlockingFixes;
  document.currentScript.insertAdjacentElement('afterend',core);
})();
