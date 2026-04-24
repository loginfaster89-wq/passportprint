/* Footer language toggle — syncs with passport-photo.html's pps_lang key */
(function(){
  var KEY='pps_lang';
  var lang='en';
  try{lang=localStorage.getItem(KEY)||'en';}catch(e){}

  document.querySelectorAll('.footer-locale .locale-btn').forEach(function(btn){
    btn.classList.toggle('active',btn.dataset.lang===lang);
    btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang));
    btn.addEventListener('click',function(){
      var pick=this.dataset.lang;
      document.querySelectorAll('.footer-locale .locale-btn').forEach(function(b){
        b.classList.toggle('active',b.dataset.lang===pick);
        b.setAttribute('aria-pressed',String(b.dataset.lang===pick));
      });
      try{localStorage.setItem(KEY,pick);}catch(e){}
    });
  });
})();
