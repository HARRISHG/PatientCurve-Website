/* PatientCurve — site interactions. No dependencies. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = motionQuery.matches;
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (e) { reduceMotion = e.matches; });
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /** Run `onEnter` once the element is in view (or right away when observers are unavailable). */
  function whenVisible(el, onEnter, opts) {
    if (!("IntersectionObserver" in window)) { onEnter(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { io.disconnect(); onEnter(); }
      });
    }, opts || { threshold: 0.25 });
    io.observe(el);
  }

  /** Track whether an element is on screen, so looping animations only run while visible. */
  function watchVisibility(el, onChange) {
    if (!("IntersectionObserver" in window)) { onChange(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { onChange(entry.isIntersecting); });
    }, { threshold: 0.15 }).observe(el);
  }

  /* ---------- Header + mobile nav ---------- */
  var header = $(".site-header");
  var lastScrolled = null;
  function onScroll() {
    var scrolled = window.scrollY > 8;
    if (header && scrolled !== lastScrolled) { header.classList.toggle("is-scrolled", scrolled); lastScrolled = scrolled; }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) setOpen(false); });
  }

  /* ---------- Sticky mobile CTA ---------- */
  var mobileCta = $(".mobile-cta");
  if (mobileCta) {
    document.body.classList.add("has-mobile-cta");
    var heroEl = $(".hero, .page-hero");
    var finalCta = $(".cta-panel, .form-card");
    var pastHero = false, nearEnd = false;
    var update = function () { mobileCta.classList.toggle("is-shown", pastHero && !nearEnd); };
    if ("IntersectionObserver" in window) {
      if (heroEl) new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; update(); }).observe(heroEl);
      if (finalCta) new IntersectionObserver(function (e) { nearEnd = e[0].isIntersecting; update(); }).observe(finalCta);
    }
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealIO.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters ---------- */
  function animateNumber(el, to, opts) {
    opts = opts || {};
    var from = opts.from || 0;
    var format = opts.format || function (n) { return Math.round(n).toLocaleString(); };
    if (reduceMotion) { el.textContent = format(to); return; }
    var duration = opts.duration || 1400;
    var start = null;
    if (el._raf) cancelAnimationFrame(el._raf);
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(from + (to - from) * eased);
      if (t < 1) el._raf = requestAnimationFrame(frame);
    }
    el._raf = requestAnimationFrame(frame);
  }

  $$("[data-count]").forEach(function (el) {
    var to = parseFloat(el.getAttribute("data-count"));
    el.textContent = "0";
    whenVisible(el, function () { animateNumber(el, to, { duration: 1200 }); }, { threshold: 0.6 });
  });

  /* ---------- Hero board: patients move from waiting → followed up → booked ---------- */
  (function heroBoard() {
    var board = $("[data-board]");
    if (!board) return;
    var rows = $$(".patient", board);
    var slots = $$(".slot", board);
    var curve = $(".curve-path", board);
    var dot = $(".curve-dot", board);
    var area = $(".curve-area", board);
    var bookedCount = $("[data-booked]", board);
    var labels = { waiting: "Waiting for reply", following: "Followed up", booked: "Booked" };
    var states = ["waiting", "following", "booked"];
    var pathLen = curve ? curve.getTotalLength() : 0;
    var points = [[0, 64], [70, 56], [140, 44], [210, 26], [280, 8]];

    if (curve) { curve.style.strokeDasharray = pathLen; }

    function setRow(row, state, animate) {
      var chip = $(".status", row);
      chip.setAttribute("data-state", state);
      chip.textContent = state === "booked" ? labels.booked + " · " + row.getAttribute("data-time") : labels[state];
      if (animate) { chip.classList.remove("is-changing"); void chip.offsetWidth; chip.classList.add("is-changing"); }
      var slot = slots[parseInt(row.getAttribute("data-slot"), 10)];
      if (slot) {
        slot.classList.toggle("is-filled", state === "booked");
        if (state === "booked" && animate) { slot.classList.remove("is-new"); void slot.offsetWidth; slot.classList.add("is-new"); }
      }
    }

    function render(progress, animate) {
      // progress: per-row state index
      var booked = 0;
      rows.forEach(function (row, i) {
        setRow(row, states[progress[i]], animate && row._last !== progress[i]);
        row._last = progress[i];
        if (progress[i] === 2) booked++;
      });
      var ratio = booked / rows.length;
      if (curve) curve.style.strokeDashoffset = pathLen * (1 - Math.max(0.08, ratio));
      if (area) area.style.opacity = String(0.15 + ratio * 0.85);
      if (dot) {
        var p = points[Math.min(points.length - 1, booked)];
        dot.setAttribute("transform", "translate(" + p[0] + " " + p[1] + ")");
      }
      if (bookedCount) bookedCount.textContent = String(booked);
    }

    // Final state for reduced motion
    if (reduceMotion) { render(rows.map(function () { return 2; }), false); return; }

    // Sequence: each tick advances one patient one step, staggered so it reads as a flow.
    // Interleave steps so the next patient is followed up while the previous one is being booked.
    var order = [];
    for (var i = 0; i < rows.length; i++) {
      order.push([i, 1]);
      if (i > 0) order.push([i - 1, 2]);
    }
    order.push([rows.length - 1, 2]);

    var progress = rows.map(function () { return 0; });
    var step = 0, timer = null, active = false;
    render(progress, false);

    function tick() {
      if (step >= order.length) {
        // hold the "everything booked" moment, then reset
        timer = setTimeout(function () {
          progress = rows.map(function () { return 0; });
          rows.forEach(function (r) { r.classList.remove("is-active"); });
          render(progress, false);
          step = 0;
          timer = setTimeout(tick, 1200);
        }, 3200);
        return;
      }
      var move = order[step++];
      progress[move[0]] = move[1];
      rows.forEach(function (r, idx) { r.classList.toggle("is-active", idx === move[0]); });
      render(progress, true);
      timer = setTimeout(tick, 1300);
    }

    watchVisibility(board, function (visible) {
      if (visible && !active) { active = true; timer = setTimeout(tick, 700); }
      else if (!visible && active) { active = false; clearTimeout(timer); }
    });
  })();

  /* ---------- Hidden revenue dot grid ---------- */
  (function dotGrid() {
    var grid = $("[data-dot-grid]");
    if (!grid) return;
    var total = 128;
    // Deterministic illustrative layout (not data): a mix of categories scattered across a patient list.
    var cats = ["lead", "noshow", "treat", "recall", "inactive"];
    var seed = 7;
    function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var frag = document.createDocumentFragment();
    for (var i = 0; i < total; i++) {
      var d = document.createElement("span");
      d.className = "pdot";
      var r = rand();
      if (r < 0.42) d.setAttribute("data-cat", cats[Math.floor(rand() * cats.length)]);
      d.style.setProperty("--dd", (i % 16) * 0.02 + Math.floor(i / 16) * 0.03 + "s");
      frag.appendChild(d);
    }
    grid.appendChild(frag);
    grid.setAttribute("aria-hidden", "true");

    whenVisible(grid, function () {
      grid.classList.add("is-in");
      setTimeout(function () { grid.classList.add("is-lit"); }, reduceMotion ? 0 : 1100);
    }, { threshold: 0.3 });

    var buttons = $$("[data-legend]");
    var pinned = null;
    function focusCat(cat) {
      if (!cat) { grid.removeAttribute("data-focus"); }
      else grid.setAttribute("data-focus", cat);
      $$(".pdot", grid).forEach(function (d) { d.classList.toggle("is-focus", !!cat && d.getAttribute("data-cat") === cat); });
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-legend") === cat)); });
    }
    buttons.forEach(function (b) {
      var cat = b.getAttribute("data-legend");
      b.addEventListener("mouseenter", function () { if (!pinned) focusCat(cat); });
      b.addEventListener("mouseleave", function () { if (!pinned) focusCat(null); });
      b.addEventListener("click", function () { pinned = pinned === cat ? null : cat; focusCat(pinned); });
    });
  })();

  /* ---------- Segmented controls (shared) ---------- */
  function initSegmented(seg, onChange) {
    var buttons = $$("button", seg);
    var thumb = $(".seg-thumb", seg);
    function place(btn) {
      if (!thumb) return;
      thumb.style.width = btn.offsetWidth + "px";
      thumb.style.transform = "translateX(" + (btn.offsetLeft - 4) + "px)";
    }
    function select(btn, silent) {
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      seg.setAttribute("data-mode", btn.getAttribute("data-value"));
      place(btn);
      if (!silent) onChange(btn.getAttribute("data-value"));
    }
    buttons.forEach(function (b) { b.addEventListener("click", function () { select(b); }); });
    var current = buttons.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0] || buttons[0];
    select(current, true);
    window.addEventListener("resize", function () {
      var on = buttons.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0];
      if (on) place(on);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { select(current, true); });
    return { select: select, buttons: buttons };
  }

  /* ---------- Leak pipeline: without vs with PatientCurve ---------- */
  (function pipeline() {
    var root = $("[data-pipeline]");
    if (!root) return;
    var tokens = $(".tokens", root);
    var lostEl = $("[data-lost]", root);
    var bookedEl = $("[data-booked-tally]", root);
    var gapLabels = $$(".gap-label", root);
    var mode = root.getAttribute("data-mode") || "without";
    var lost = 0, booked = 0, spawnTimer = null, running = false, n = 0;

    // Fixed, illustrative pattern of where a patient drops out without follow-up (index = stage gap), -1 = reaches booking.
    var withoutPattern = [0, -1, 1, 2, 0, 1, -1, 2, 0, 1];
    var gapText = {
      without: ["No quick reply", "No second follow-up", "Not rebooked"],
      with: ["Replied fast", "Followed up again", "Reminded + booked"]
    };

    function setLabels() {
      gapLabels.forEach(function (g, i) { g.textContent = gapText[mode][i]; });
    }

    function resetTally() { lost = 0; booked = 0; lostEl.textContent = "0"; bookedEl.textContent = "0"; }

    function spawn() {
      var width = tokens.clientWidth;
      var fate = mode === "with" ? -1 : withoutPattern[n % withoutPattern.length];
      n++;
      var t = document.createElement("span");
      t.className = "token";
      tokens.appendChild(t);

      var stopAt = fate === -1 ? 1 : (fate + 0.5) / 3; // drop between stages
      var travel = 3200 * stopAt;
      var anim = t.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(" + width * stopAt + "px)" }],
        { duration: travel, easing: "linear", fill: "forwards" }
      );
      anim.onfinish = function () {
        if (fate === -1) {
          t.classList.add("is-saved");
          booked++; bookedEl.textContent = String(booked);
          var out = t.animate(
            [{ transform: "translateX(" + width + "px) scale(1)", opacity: 1 }, { transform: "translateX(" + width + "px) scale(1.8)", opacity: 0 }],
            { duration: 500, easing: "ease-out", fill: "forwards" }
          );
          out.onfinish = function () { t.remove(); };
        } else {
          t.classList.add("is-lost");
          lost++; lostEl.textContent = String(lost);
          var fall = t.animate(
            [{ transform: "translateX(" + width * stopAt + "px) translateY(0)", opacity: 1 },
             { transform: "translateX(" + width * stopAt + "px) translateY(64px)", opacity: 0 }],
            { duration: 900, easing: "cubic-bezier(.5,0,.8,.4)", fill: "forwards" }
          );
          fall.onfinish = function () { t.remove(); };
        }
      };
    }

    function start() {
      if (running || reduceMotion || !tokens.animate) return;
      running = true; spawn();
      spawnTimer = setInterval(spawn, 900);
    }
    function stop() { running = false; clearInterval(spawnTimer); }

    var seg = $(".segmented", root);
    initSegmented(seg, function (value) {
      mode = value;
      root.setAttribute("data-mode", mode);
      setLabels();
      tokens.innerHTML = "";
      n = 0;
      resetTally();
      if (reduceMotion) staticTally();
    });

    function staticTally() {
      // Reduced motion: show the same illustrative pattern as a static result.
      var l = 0, b = 0;
      withoutPattern.forEach(function (f) { if (mode === "with" || f === -1) b++; else l++; });
      lostEl.textContent = String(l); bookedEl.textContent = String(b);
    }

    setLabels();
    if (reduceMotion || !tokens.animate) { staticTally(); return; }
    watchVisibility(root, function (visible) { if (visible) start(); else stop(); });
  })();

  /* ---------- Journey stepper (Lead → Follow-up → Appointment → Revenue) ---------- */
  (function journey() {
    var root = $("[data-journey]");
    if (!root) return;
    var tabs = $$("[role='tab']", root);
    var stepsEl = $(".steps", root);
    var panels = $$("[data-journey-panel]", root);
    var bars = $$(".stage-progress span", root);
    var labels = $$(".stage-labels span", root);
    var card = $(".journey-card", root);
    var caption = $(".stage-caption", root);
    var stepMs = 3400;
    var idx = 0, timer = null, playing = !reduceMotion, visible = false;
    stepsEl.style.setProperty("--step-ms", stepMs + "ms");

    function show(i, user) {
      idx = i;
      tabs.forEach(function (t, k) {
        t.setAttribute("aria-selected", String(k === i));
        t.setAttribute("tabindex", k === i ? "0" : "-1");
        t.classList.toggle("is-done", k < i);
      });
      bars.forEach(function (b, k) { b.classList.toggle("is-on", k <= i); });
      labels.forEach(function (b, k) { b.classList.toggle("is-on", k <= i); });
      var panel = panels[i];
      card.innerHTML = panel.querySelector("[data-card]").innerHTML;
      caption.innerHTML = panel.querySelector("[data-caption]").innerHTML;
      if (!reduceMotion) { card.classList.remove("is-swapping"); void card.offsetWidth; card.classList.add("is-swapping"); }
      // restart progress bar animation
      stepsEl.classList.remove("is-playing"); void stepsEl.offsetWidth;
      if (playing) stepsEl.classList.add("is-playing");
      if (user) { playing = false; stepsEl.classList.remove("is-playing"); clearTimeout(timer); }
      else schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (!playing || !visible) return;
      timer = setTimeout(function () { show((idx + 1) % tabs.length); }, stepMs);
    }
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () { show(k, true); });
      t.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (k + 1) % tabs.length;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (k - 1 + tabs.length) % tabs.length;
        if (next !== null) { e.preventDefault(); tabs[next].focus(); show(next, true); }
      });
    });
    show(0);
    watchVisibility(root, function (v) {
      visible = v;
      if (v && playing) { stepsEl.classList.remove("is-playing"); void stepsEl.offsetWidth; stepsEl.classList.add("is-playing"); schedule(); }
      else clearTimeout(timer);
    });
  })();

  /* ---------- Cycle: Find → Follow Up → Recover → Book → Repeat ---------- */
  (function cycle() {
    var root = $("[data-cycle]");
    if (!root) return;
    var nodes = $$(".cycle-node", root);
    var orbit = $(".cycle-orbit", root);
    var panel = $(".cycle-panel", root);
    var data = $$("[data-cycle-step]", root);
    var playBtn = $("[data-cycle-play]", root);
    var stepMs = 3000;
    var idx = 0, angle = 0, timer = null, playing = !reduceMotion, visible = false;
    var n = nodes.length;

    // Position nodes around the ring.
    nodes.forEach(function (node, i) {
      var a = (-90 + (360 / n) * i) * Math.PI / 180;
      node.style.left = 50 + 40 * Math.cos(a) + "%";
      node.style.top = 50 + 40 * Math.sin(a) + "%";
    });

    function setPlayLabel() {
      if (!playBtn) return;
      playBtn.setAttribute("aria-label", playing ? "Pause animation" : "Play animation");
      playBtn.innerHTML = playing
        ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
    }

    function show(i, user) {
      var forward = ((i - idx) + n) % n;
      angle += forward * (360 / n);
      idx = i;
      if (orbit) orbit.style.transform = "rotate(" + angle + "deg)";
      nodes.forEach(function (node, k) {
        node.setAttribute("aria-selected", String(k === i));
        node.setAttribute("tabindex", k === i ? "0" : "-1");
      });
      panel.innerHTML = data[i].innerHTML;
      if (!reduceMotion) { panel.classList.remove("is-swapping"); void panel.offsetWidth; panel.classList.add("is-swapping"); }
      if (user) { playing = false; setPlayLabel(); }
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (playing && visible) timer = setTimeout(function () { show((idx + 1) % n); }, stepMs);
    }
    nodes.forEach(function (node, k) {
      node.addEventListener("click", function () { show(k, true); });
      node.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (k + 1) % n;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (k - 1 + n) % n;
        if (next !== null) { e.preventDefault(); nodes[next].focus(); show(next, true); }
      });
    });
    var prev = $("[data-cycle-prev]", root), next = $("[data-cycle-next]", root);
    if (prev) prev.addEventListener("click", function () { show((idx - 1 + n) % n, true); });
    if (next) next.addEventListener("click", function () { show((idx + 1) % n, true); });
    if (playBtn) playBtn.addEventListener("click", function () { playing = !playing; setPlayLabel(); schedule(); });

    setPlayLabel();
    show(0);
    watchVisibility(root, function (v) { visible = v; schedule(); });
  })();

  /* ---------- Before / after toggles ---------- */
  $$("[data-ba]").forEach(function (ba) {
    var panels = { before: $("[data-ba-panel='before']", ba), after: $("[data-ba-panel='after']", ba) };
    initSegmented($(".segmented", ba), function (value) {
      Object.keys(panels).forEach(function (k) {
        var p = panels[k];
        p.hidden = k !== value;
        p.classList.remove("is-in");
        if (k === value && !reduceMotion) { void p.offsetWidth; p.classList.add("is-in"); }
      });
    });
  });

  /* ---------- Compare slider ---------- */
  $$("[data-compare]").forEach(function (cmp) {
    var range = $(".compare-range", cmp);
    function set(v) { cmp.style.setProperty("--pos", v + "%"); }
    range.addEventListener("input", function () { set(range.value); });
    set(range.value);
    // A gentle one-time sweep shows visitors the slider moves.
    if (!reduceMotion) {
      whenVisible(cmp, function () {
        var startT = null, from = 85, to = 50;
        set(from);
        function frame(ts) {
          if (startT === null) startT = ts;
          var t = Math.min(1, (ts - startT) / 1400);
          var e = 1 - Math.pow(1 - t, 3);
          var v = from + (to - from) * e;
          range.value = v; set(v);
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }, { threshold: 0.5 });
    }
  });

  /* ---------- Revenue estimator ---------- */
  (function estimator() {
    var root = $("[data-estimator]");
    if (!root) return;
    var patients = $("#est-patients", root);
    var value = $("#est-value", root);
    var currency = $("#est-currency", root);
    var pct = $("#est-pct", root);
    var pctOut = $("#est-pct-out", root);
    var out = $("[data-est-total]", root);
    var outBack = $("[data-est-back]", root);
    var outEach = $("[data-est-each]", root);
    var last = 0;

    function num(input) {
      var v = parseFloat(String(input.value).replace(/[^0-9.]/g, ""));
      return isFinite(v) && v > 0 ? v : 0;
    }
    function money(n) {
      return currency.value + Math.round(n).toLocaleString();
    }
    function update() {
      var p = num(patients), v = num(value), share = parseFloat(pct.value) || 0;
      pctOut.textContent = share + "%";
      pct.style.setProperty("--fill", ((share - pct.min) / (pct.max - pct.min)) * 100 + "%");
      var back = Math.round(p * share / 100);
      var total = back * v;
      outBack.textContent = p ? back.toLocaleString() + " patients" : "—";
      outEach.textContent = v ? money(v) : "—";
      if (!p || !v) { out.textContent = "—"; last = 0; return; }
      animateNumber(out, total, { from: last, duration: 600, format: money });
      last = total;
    }
    [patients, value, currency, pct].forEach(function (el) { el.addEventListener("input", update); el.addEventListener("change", update); });
    update();
  })();

  /* ---------- Revenue audit form ---------- */
  (function auditForm() {
    var form = $("#audit-form");
    if (!form) return;
    var status = $(".form-status", form);
    var submit = $("button[type='submit']", form);
    var progress = $(".form-progress span");
    var success = $("#audit-success");
    var required = $$("[data-required]", form);

    var messages = {
      name: "Please tell us your name.",
      clinic: "Please add your clinic's name.",
      phone: "Please add a WhatsApp or phone number we can reach you on.",
      email: "Please add a valid email address.",
      volume: "Please choose your monthly patient volume.",
      challenge: "Please pick your biggest growth challenge."
    };

    function fieldOf(name) { return form.querySelector("[data-field='" + name + "']"); }

    function validate(name) {
      var wrap = fieldOf(name);
      var err = $(".field-error", wrap);
      var ok = true;
      if (name === "challenge") {
        ok = !!form.querySelector("input[name='challenge']:checked");
      } else {
        var input = form.elements[name];
        var v = String(input.value || "").trim();
        if (!v) ok = false;
        else if (name === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        else if (name === "phone") ok = v.replace(/\D/g, "").length >= 7;
        input.setAttribute("aria-invalid", String(!ok));
      }
      wrap.classList.toggle("has-error", !ok);
      err.textContent = ok ? "" : messages[name];
      return ok;
    }

    function updateProgress() {
      var done = required.filter(function (wrap) {
        var name = wrap.getAttribute("data-field");
        if (name === "challenge") return !!form.querySelector("input[name='challenge']:checked");
        return String(form.elements[name].value || "").trim() !== "";
      }).length;
      if (progress) progress.style.width = (done / required.length) * 100 + "%";
    }

    required.forEach(function (wrap) {
      var name = wrap.getAttribute("data-field");
      $$("input, select", wrap).forEach(function (el) {
        el.addEventListener("blur", function () { if (name !== "challenge" && el.value) validate(name); });
        el.addEventListener("input", function () { if (wrap.classList.contains("has-error")) validate(name); updateProgress(); });
        el.addEventListener("change", function () { if (wrap.classList.contains("has-error")) validate(name); updateProgress(); });
      });
    });
    updateProgress();

    // Carry the estimator result into the lead, if the visitor used it.
    function estimatorSummary() {
      var total = $("[data-est-total]");
      return total && total.textContent !== "—" ? total.textContent : "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = ""; status.className = "form-status";
      var firstBad = null;
      required.forEach(function (wrap) {
        var name = wrap.getAttribute("data-field");
        if (!validate(name) && !firstBad) firstBad = wrap;
      });
      if (firstBad) {
        var focusable = firstBad.querySelector("input, select");
        if (focusable) focusable.focus();
        status.textContent = "Please check the highlighted fields.";
        status.classList.add("is-error");
        return;
      }
      if (form.elements.company_website && form.elements.company_website.value) return; // honeypot

      var payload = {
        name: form.elements.name.value.trim(),
        clinic: form.elements.clinic.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        monthly_patient_volume: form.elements.volume.value,
        biggest_challenge: form.querySelector("input[name='challenge']:checked").value,
        notes: (form.elements.notes && form.elements.notes.value.trim()) || "",
        estimate: estimatorSummary(),
        page: window.location.href,
        submitted_at: new Date().toISOString()
      };

      var endpoint = (form.getAttribute("data-endpoint") || "").trim();
      submit.classList.add("is-loading"); submit.disabled = true;

      function done() {
        submit.classList.remove("is-loading"); submit.disabled = false;
        form.hidden = true;
        success.hidden = false;
        if (!endpoint) $("[data-demo-note]", success).hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }

      if (!endpoint) {
        // No endpoint configured yet (see README). Keep the experience intact in previews.
        if (window.console) console.warn("[PatientCurve] Audit form has no data-endpoint configured; submission was not sent.", payload);
        setTimeout(done, 700);
        return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        done();
      }).catch(function () {
        submit.classList.remove("is-loading"); submit.disabled = false;
        status.textContent = "Something went wrong sending your request. Please try again in a moment.";
        status.classList.add("is-error");
      });
    });
  })();

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
