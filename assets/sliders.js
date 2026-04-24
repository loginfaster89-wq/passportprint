// Homepage card sliders: any grid becomes a horizontal scroll-snap slider
// whenever its cards wrap to an incomplete last row (orphan) on the current
// viewport — regardless of device size. Also forces slider mode on narrow
// phones (≤760px) so the styling stays consistent even when a single-row
// layout is technically not an orphan.
//
// Dots indicator is injected after each slider-mode grid and synced to the
// scroll position. Pure vanilla; no deps.
//
// Lives in assets/ (not inline) so build.js copies it verbatim without
// passing it through javascript-obfuscator. Two obfuscated inline <script>
// blocks on the same page produce conflicting stringArray wrappers that
// silently break one of them, so keeping this code external is load-bearing
// for the orphan-row detection to actually run on the deployed site.
(function () {
  var SELECTORS = ['.features-grid', '.audience-grid', '.why-grid', '.steps-grid', '.pricing-grid', '.stats-grid'];
  var MQ = window.matchMedia('(max-width: 760px)');

  function realCards(grid) {
    var out = [];
    for (var i = 0; i < grid.children.length; i++) {
      var c = grid.children[i];
      if (!c.classList.contains('slider-dots')) out.push(c);
    }
    return out;
  }

  function buildDots(grid, cards) {
    var dots = grid.nextElementSibling;
    if (!dots || !dots.classList.contains('slider-dots')) {
      dots = document.createElement('div');
      dots.className = 'slider-dots';
      dots.setAttribute('role', 'tablist');
      grid.parentNode.insertBefore(dots, grid.nextSibling);
    }
    dots.innerHTML = '';
    for (var i = 0; i < cards.length; i++) {
      (function (idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
        b.addEventListener('click', function () {
          var card = cards[idx];
          if (card) grid.scrollTo({ left: card.offsetLeft - grid.offsetLeft, behavior: 'smooth' });
        });
        dots.appendChild(b);
      })(i);
    }
    return dots;
  }

  function sync(grid, cards, dots) {
    var x = grid.scrollLeft, best = Infinity, active = 0;
    for (var i = 0; i < cards.length; i++) {
      var d = Math.abs(cards[i].offsetLeft - grid.offsetLeft - x);
      if (d < best) { best = d; active = i; }
    }
    var bs = dots.children;
    for (var j = 0; j < bs.length; j++) bs[j].classList.toggle('active', j === active);
  }

  // Detect an incomplete last row in grid layout. Uses the per-row right
  // edge (rightmost card's right coordinate) rather than child count so
  // spanning cards (e.g. .feature-card.primary on desktop) are treated as
  // filling the row. Returns true when any row's right edge is noticeably
  // narrower than the widest row's — i.e. at least one card sits alone on
  // a line that earlier cards did not.
  function hasOrphanRow(grid, cards) {
    if (cards.length < 2) return false;
    var rows = [];
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var top = c.offsetTop;
      var right = c.offsetLeft + c.offsetWidth;
      var row = rows[rows.length - 1];
      if (!row || Math.abs(row.top - top) > 4) {
        rows.push({ top: top, right: right });
      } else if (right > row.right) {
        row.right = right;
      }
    }
    if (rows.length < 2) return false;
    var maxRight = rows[0].right;
    for (var k = 1; k < rows.length; k++) {
      if (rows[k].right > maxRight) maxRight = rows[k].right;
    }
    for (var m = 0; m < rows.length; m++) {
      if (maxRight - rows[m].right > 10) return true;
    }
    return false;
  }

  function attachScroll(grid, cards, dots) {
    if (grid._spDotsScroll) {
      grid.removeEventListener('scroll', grid._spDotsScroll);
    }
    var onScroll = function () { sync(grid, cards, dots); };
    grid.addEventListener('scroll', onScroll, { passive: true });
    grid._spDotsScroll = onScroll;
  }

  function detachScroll(grid) {
    if (grid._spDotsScroll) {
      grid.removeEventListener('scroll', grid._spDotsScroll);
      grid._spDotsScroll = null;
    }
  }

  function setup() {
    for (var i = 0; i < SELECTORS.length; i++) {
      var grid = document.querySelector(SELECTORS[i]);
      if (!grid) continue;
      // Measure orphan state in grid mode, so remove class first and let
      // the browser re-layout before sampling card positions.
      var wasSlider = grid.classList.contains('is-slider');
      if (wasSlider) grid.classList.remove('is-slider');
      // Force synchronous reflow.
      void grid.offsetHeight;
      var cards = realCards(grid);
      var shouldSlide = MQ.matches || hasOrphanRow(grid, cards);
      var next = grid.nextElementSibling;
      if (shouldSlide) {
        grid.classList.add('is-slider');
        var dots = buildDots(grid, cards);
        attachScroll(grid, cards, dots);
        sync(grid, cards, dots);
      } else if (next && next.classList.contains('slider-dots')) {
        detachScroll(grid);
        next.remove();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(setup, 120);
  });
  // Orientation changes on tablets/phones fire a separate event; re-run.
  window.addEventListener('orientationchange', function () {
    clearTimeout(rt);
    rt = setTimeout(setup, 120);
  });
})();
