/* ===== Custom JS ===== */
document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────────────────
     1. Unified IntersectionObserver for Scroll Animations
     ───────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var options = {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;

          if (target.classList.contains('fc-showcase__card')) {
            target.classList.add('visible');
          } else if (target.classList.contains('wfs-card')) {
            var cards = target.parentElement.querySelectorAll('.wfs-card');
            var idx = Array.prototype.indexOf.call(cards, target);
            target.style.transitionDelay = (idx * 0.07) + 's';
            target.classList.add('animated');
          } else if (target.classList.contains('pop-card')) {
            var cards = target.parentElement.querySelectorAll('.pop-card');
            var idx = Array.prototype.indexOf.call(cards, target);
            target.style.transitionDelay = (idx * 0.07) + 's';
            target.classList.add('animated');
          } else if (target.classList.contains('cc-card')) {
            var cards = target.parentElement.querySelectorAll('.cc-card');
            var idx = Array.prototype.indexOf.call(cards, target);
            target.style.transitionDelay = (idx * 0.1) + 's';
            target.classList.add('visible');
          } else if (target.classList.contains('cc-stat')) {
            var stats = target.parentElement.querySelectorAll('.cc-stat');
            var idx = Array.prototype.indexOf.call(stats, target);
            target.style.transitionDelay = (idx * 0.1) + 's';
            target.classList.add('visible');
          }

          observer.unobserve(target);
        }
      });
    }, options);

    document.querySelectorAll('.fc-showcase__card, .wfs-card, .pop-card, .cc-card, .cc-stat').forEach(function (el) {
      observer.observe(el);
    });

  } else {
    /* Fallback for browsers without IntersectionObserver */
    document.querySelectorAll('.fc-showcase__card, .cc-card, .cc-stat').forEach(function (el) {
      el.classList.add('visible');
    });
    document.querySelectorAll('.wfs-card, .pop-card').forEach(function (el) {
      el.classList.add('animated');
    });
  }

  /* ─────────────────────────────────────────────────────
     2. Countdown Timer for Deal of the Week Spotlight
     ───────────────────────────────────────────────────── */
  var daysEl  = document.getElementById('wfs-days');
  var hoursEl = document.getElementById('wfs-hours');
  var minsEl  = document.getElementById('wfs-mins');
  var secsEl  = document.getElementById('wfs-secs');

  if (daysEl) {
    var storageKey = 'wfs_deal_end';
    var endTime = sessionStorage.getItem(storageKey);
    if (!endTime) {
      var end = new Date();
      end.setDate(end.getDate() + 7);
      endTime = end.getTime();
      sessionStorage.setItem(storageKey, endTime);
    }
    endTime = parseInt(endTime, 10);

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function tickCountdown() {
      var now  = new Date().getTime();
      var diff = endTime - now;

      if (diff <= 0) {
        daysEl.textContent  = '00';
        hoursEl.textContent = '00';
        minsEl.textContent  = '00';
        secsEl.textContent  = '00';
        return;
      }

      var days  = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs  = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent  = pad(days);
      hoursEl.textContent = pad(hours);
      minsEl.textContent  = pad(mins);
      secsEl.textContent  = pad(secs);

      setTimeout(tickCountdown, 1000);
    }

    tickCountdown();
  }

  /* ─────────────────────────────────────────────────────
     3. Most Popular — Tab Switching
     ───────────────────────────────────────────────────── */
  var tabBtns = document.querySelectorAll('.pop-tab-btn');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.getAttribute('data-target');

      /* Update active button */
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      /* Show target pane */
      document.querySelectorAll('.tab_pane').forEach(function (pane) {
        pane.classList.remove('active', 'show');
      });

      var targetPane = document.querySelector(target);
      if (targetPane) {
        targetPane.classList.add('active');
        /* Small delay so CSS transition fires */
        setTimeout(function () { targetPane.classList.add('show'); }, 10);

        /* Re-trigger card animations */
        targetPane.querySelectorAll('.pop-card').forEach(function (card, idx) {
          card.classList.remove('animated');
          card.style.transitionDelay = (idx * 0.07) + 's';
          setTimeout(function () { card.classList.add('animated'); }, 50);
        });
      }
    });
  });

});
