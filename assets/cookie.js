/* Cookie consent banner — essentials-only, self-hosted.
   Dismisses on click/tap and stores consent in localStorage
   so it never shows again. No third-party scripts. */
(function(){
  if(localStorage.getItem('sp_cookie_ok')) return;
  var b=document.createElement('div');
  b.className='sp-cookie';
  b.innerHTML='We only use essential cookies for login. <button type="button" class="sp-cookie-ok">OK</button>';
  document.body.appendChild(b);
  requestAnimationFrame(function(){requestAnimationFrame(function(){b.classList.add('show');});});
  b.querySelector('.sp-cookie-ok').addEventListener('click',function(){
    localStorage.setItem('sp_cookie_ok','1');
    b.classList.remove('show');
    setTimeout(function(){b.remove();},300);
  });
})();
