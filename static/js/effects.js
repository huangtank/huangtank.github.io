(function () {
  "use strict";

  // Fade + slide up each block of the post content as it scrolls into view.
  function initReveal() {
    var targets = document.querySelectorAll(".post-content > *, .post-title");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("reveal", "is-visible");
      });
      return;
    }

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i, 10) * 60 + "ms";
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  // Small pixels spawn at the cursor and fall with gravity, like falling sand.
  function initPixelTrail() {
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var coarsePointer =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) return;

    var canvas = document.createElement("canvas");
    canvas.id = "pixel-trail";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    var colors = ["#67a2c9", "#c9679b", "#9b9b9b", "#e6e6e6"];
    var pixels = [];
    var lastSpawn = 0;
    var maxPixels = 400;

    function spawn(x, y) {
      var count = 2 + Math.floor(Math.random() * 2);
      for (var i = 0; i < count; i++) {
        if (pixels.length >= maxPixels) pixels.shift();
        pixels.push({
          x: x + (Math.random() * 10 - 5),
          y: y + (Math.random() * 10 - 5),
          size: 2 + Math.random() * 3,
          vx: Math.random() * 1.2 - 0.6,
          vy: Math.random() * 1 - 0.2,
          gravity: 0.06 + Math.random() * 0.05,
          life: 1,
          decay: 0.008 + Math.random() * 0.012,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function onMove(e) {
      var now = performance.now();
      if (now - lastSpawn < 16) return;
      lastSpawn = now;
      spawn(e.clientX, e.clientY);
    }
    window.addEventListener("mousemove", onMove);

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = pixels.length - 1; i >= 0; i--) {
        var p = pixels[i];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0 || p.y > canvas.height + 20) {
          pixels.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initPixelTrail();
  });
})();
