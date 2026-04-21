/* Shared navigation behavior: Features dropdown + mobile drawer.
   Used by the homepage and all legal/marketing pages. */
(function(){
  'use strict';

  // ── Desktop dropdown (click + click-outside to close) ──
  function wireDropdowns(){
    var menus = document.querySelectorAll('.legal-header .has-menu');
    menus.forEach(function(menu){
      var trigger = menu.querySelector('.menu-trigger');
      if(!trigger) return;
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function(e){
        e.stopPropagation();
        var open = menu.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        // close siblings
        menus.forEach(function(m){ if(m !== menu) m.classList.remove('is-open'); });
      });
    });
    document.addEventListener('click', function(e){
      menus.forEach(function(menu){
        if(!menu.contains(e.target)) menu.classList.remove('is-open');
      });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') menus.forEach(function(m){ m.classList.remove('is-open'); });
    });
  }

  // ── Mobile drawer ──
  function wireDrawer(){
    var header = document.querySelector('.legal-header');
    var burger = document.querySelector('.legal-header .hamburger');
    var drawer = document.querySelector('.mobile-drawer');
    var backdrop = document.querySelector('.nav-backdrop');
    var closeBtn = document.querySelector('.mobile-drawer .drawer-close');
    if(!burger || !drawer) return;

    function open(){
      document.body.classList.add('nav-open');
      header && header.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
    }
    function close(){
      document.body.classList.remove('nav-open');
      header && header.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    }
    burger.addEventListener('click', function(){
      if(document.body.classList.contains('nav-open')) close(); else open();
    });
    closeBtn && closeBtn.addEventListener('click', close);
    backdrop && backdrop.addEventListener('click', close);
    // close when clicking a drawer link
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') close();
    });
    // close on resize to desktop
    var mq = window.matchMedia('(min-width: 821px)');
    mq.addEventListener ? mq.addEventListener('change', function(e){ if(e.matches) close(); })
                        : mq.addListener(function(e){ if(e.matches) close(); });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ wireDropdowns(); wireDrawer(); });
  } else {
    wireDropdowns(); wireDrawer();
  }
})();
