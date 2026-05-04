/* Cookie consent banner - essentials-only, self-hosted.
   Dismisses on click/tap and stores consent in localStorage.
   No third-party scripts. */
(function(){
  var KEY='sp_cookie_ok';
  function storageGet(){
    try{return localStorage.getItem(KEY);}catch(_){return null;}
  }
  function storageSet(){
    try{localStorage.setItem(KEY,'1');}catch(_){}
  }
  function addStyle(){
    if(document.getElementById('sp-cookie-style')) return;
    var s=document.createElement('style');
    s.id='sp-cookie-style';
    s.textContent=[
      '.sp-cookie{position:fixed!important;left:50%!important;right:auto!important;bottom:12px!important;z-index:10000!important;width:max-content!important;max-width:min(430px,calc(100vw - 24px))!important;padding:8px 8px 8px 13px!important;border:1px solid rgba(17,17,17,.12)!important;border-radius:999px!important;background:rgba(255,255,255,.9)!important;color:#3d372f!important;box-shadow:0 16px 48px rgba(36,30,20,.16)!important;-webkit-backdrop-filter:saturate(170%) blur(18px)!important;backdrop-filter:saturate(170%) blur(18px)!important;font:700 12px/1.35 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;letter-spacing:0!important;text-align:left!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;transform:translate(-50%,calc(100% + 18px))!important;opacity:0!important;transition:transform .24s ease,opacity .24s ease!important;}',
      '.sp-cookie.show{transform:translate(-50%,0)!important;opacity:1!important;}',
      '.sp-cookie-text{display:block!important;min-width:0!important;overflow-wrap:anywhere!important;}',
      '.sp-cookie-ok{flex:0 0 auto!important;min-width:38px!important;min-height:30px!important;padding:0 12px!important;border:0!important;border-radius:999px!important;background:#111!important;color:#fff!important;box-shadow:none!important;font:800 12px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;cursor:pointer!important;}',
      '.sp-cookie-ok:hover{background:#000!important;}',
      '@media(max-width:480px){.sp-cookie{bottom:9px!important;max-width:calc(100vw - 18px)!important;padding:8px 7px 8px 11px!important;gap:8px!important;font-size:11px!important;}.sp-cookie-ok{min-width:34px!important;min-height:28px!important;padding:0 10px!important;font-size:11px!important;}}'
    ].join('');
    document.head.appendChild(s);
  }
  function init(){
    if(storageGet()) return;
    addStyle();
    var b=document.createElement('div');
    b.className='sp-cookie';
    b.setAttribute('role','status');
    b.innerHTML='<span class="sp-cookie-text">Essential cookies only for login.</span><button type="button" class="sp-cookie-ok">OK</button>';
    document.body.appendChild(b);
    requestAnimationFrame(function(){requestAnimationFrame(function(){b.classList.add('show');});});
    b.querySelector('.sp-cookie-ok').addEventListener('click',function(){
      storageSet();
      b.classList.remove('show');
      setTimeout(function(){b.remove();},260);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
