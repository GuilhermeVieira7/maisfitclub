/* +Fit Club Academia — interações */
(() => {
  /* ================= CONFIGURAÇÃO (dados reais da academia) ================= */
  const UNIDADES = [
    { id: "cidade-nova", nome: "Cidade Nova", tipo: "Matriz", endereco: "Rua E, 897 – Bairro Maranhão", cidade: "Parauapebas – PA",
      tel: "5594992683291", telTxt: "(94) 9 9268-3291", busca: "Rua E, 897, Bairro Maranhão, Parauapebas - PA", foto: null },
    { id: "beira-rio", nome: "Beira Rio", tipo: "Filial", endereco: "Av. E, Qd 55, Lt 12 e 13 – Beira Rio II", cidade: "Parauapebas – PA",
      tel: "5594991418360", telTxt: "(94) 9 9141-8360", busca: "Av. E, Quadra 55, Lote 12, Beira Rio II, Parauapebas - PA", foto: null },
  ];

  // Link das avaliações no Google (troque pelo link do perfil da empresa no Google Maps, se houver).
  const GOOGLE_REVIEWS = "https://www.google.com/search?q=%2BFit+Club+Academia+Parauapebas+avalia%C3%A7%C3%B5es";

  // Depoimentos REAIS de alunos (com autorização). Vazio = a seção mostra só os botões.
  // Ex.: { texto: "…", nome: "Ana P.", tempo: "aluna há 1 ano" }
  const DEPOIMENTOS = [];

  // Modalidades. coletiva: true → no Fit Especial só aos sábados e datas comemorativas.
  const CATEGORIAS = [
    { id: "musc", nome: "Musculação", img: "assets/e-musculacao.webp", itens: [
      { n: "Musculação", coletiva: false, d: "Treino planejado no seu ritmo, com equipamentos modernos e acompanhamento.", b: ["Ganho de força e massa muscular", "Treino montado pra o seu objetivo"] },
    ]},
    { id: "cross", nome: "Cross & funcional", img: "assets/m-crossfit.webp", itens: [
      { n: "CrossFit", coletiva: true, d: "Treinos de alta intensidade em turma.", b: ["Condicionamento e força", "Energia de grupo"] },
      { n: "Cross Training", coletiva: true, d: "Força e condicionamento com movimentos funcionais.", b: ["Resistência", "Corpo mais preparado"] },
      { n: "Funcional", coletiva: true, d: "Movimentos do dia a dia, corpo inteiro.", b: ["Mobilidade e equilíbrio", "Gasto calórico"] },
      { n: "Func. Kids", coletiva: true, d: "Funcional pensado para a criançada.", b: ["Coordenação motora", "Atividade física divertida"] },
    ]},
    { id: "cardio", nome: "Cardio", img: "assets/m-spinning.webp", itens: [
      { n: "Spinning", coletiva: true, d: "Bike indoor, música e muita energia.", b: ["Condicionamento cardiovascular", "Alto gasto calórico"] },
      { n: "Jump", coletiva: true, d: "Cardio no mini trampolim.", b: ["Fôlego", "Pernas e glúteos fortes"] },
      { n: "Step", coletiva: true, d: "Coreografia na plataforma.", b: ["Coordenação", "Resistência"] },
      { n: "Rit Box", coletiva: true, d: "Movimentos de luta no ritmo da música.", b: ["Cardio intenso", "Alívio do estresse"] },
    ]},
    { id: "local", nome: "Pilates & localizadas", img: "assets/m-coletiva.webp", itens: [
      { n: "Pilates", coletiva: true, d: "Controle, postura e mobilidade.", b: ["Core forte", "Melhora da postura"] },
      { n: "GAP", coletiva: true, d: "Glúteos, abdômen e pernas.", b: ["Tonificação", "Treino focado"] },
      { n: "ABS", coletiva: true, d: "Treino de abdômen.", b: ["Core fortalecido", "Abdômen definido"] },
    ]},
    { id: "danca", nome: "Dança & luta", img: "assets/m-fitdance.webp", itens: [
      { n: "Fit Dance", coletiva: true, d: "Coreografias animadas pra suar sem perceber.", b: ["Diversão e gasto calórico", "Coordenação"] },
      { n: "Muay Thai", coletiva: true, d: "Técnica, condicionamento e disciplina.", b: ["Defesa pessoal", "Força e resistência"] },
    ]},
  ];

  const AVALIACAO = [
    { t: "Bioimpedância", d: "Composição corporal: gordura, músculo e água." },
    { t: "Perimetria", d: "Circunferências do corpo para acompanhar a evolução." },
    { t: "Dobras cutâneas", d: "Percentual de gordura com adipômetro.", img: "assets/av-dobras.webp" },
    { t: "Dinamômetro", d: "Mede a força muscular.", img: "assets/av-dinamometro.webp" },
    { t: "Banco de Wells e flexiteste", d: "Flexibilidade dos músculos e das articulações.", img: "assets/av-flexiteste.webp" },
    { t: "Resultados e explicação", d: "O avaliador entrega e explica o seu desempenho.", img: "assets/e-professor.webp" },
  ];

  // Horário de acesso do Fit Livre (minutos). 0 = domingo.
  const ABERTO = { 0: [[480, 720]], 1: [[300, 1380]], 2: [[300, 1380]], 3: [[300, 1380]], 4: [[300, 1380]], 5: [[300, 1380]], 6: [[480, 720], [900, 1140]] };

  /* ========================================================================= */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = (tel, msg) => `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
  const maps = (u) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(u.busca)}`;
  const PAY = { rec: "no recorrente", pix: "no PIX ou dinheiro", card: "no crédito ou débito" };
  let pay = "rec";

  let unidade = UNIDADES[0];
  try { const s = localStorage.getItem("mf-unidade"); if (s) unidade = UNIDADES.find((u) => u.id === s) || unidade; } catch (e) {}

  function atualizarLinks() {
    document.querySelectorAll("[data-wa-unit]").forEach((a) => (a.href = wa(unidade.tel, `${a.dataset.msg} (Unidade ${unidade.nome})`)));
    document.querySelectorAll("[data-plan-wa]").forEach((a) => {
      const val = document.querySelector(`.plan[data-plan="${a.dataset.planWa === "Fit Livre" ? "livre" : "especial"}"] .plan__val`).textContent;
      a.href = wa(unidade.tel, `Olá! Quero contratar o plano ${a.dataset.planWa} (R$ ${val},00/mês ${PAY[pay]}) na unidade ${unidade.nome}.`);
    });
  }
  function setUnidade(id) {
    unidade = UNIDADES.find((u) => u.id === id) || unidade;
    try { localStorage.setItem("mf-unidade", unidade.id); } catch (e) {}
    document.querySelectorAll("#unitPick input").forEach((i) => (i.checked = i.value === unidade.id));
    document.querySelectorAll(".unit").forEach((c) => c.classList.toggle("is-sel", c.dataset.id === unidade.id));
    atualizarLinks();
  }

  // ---------- status "aberto agora" ----------
  function agora() {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Belem", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    return { d: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")), m: (+g("hour") % 24) * 60 + +g("minute") };
  }
  const hh = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`;
  const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  function status() {
    const { d, m } = agora(), el = $("status");
    const ab = ABERTO[d].find(([a, f]) => m >= a && m < f);
    if (ab) { el.className = "hero__status is-open"; el.lastChild.textContent = `Aberto agora · até às ${hh(ab[1])}`; return; }
    for (let i = 0; i < 8; i++) {
      const dd = (d + i) % 7, s = ABERTO[dd].find(([a]) => i > 0 || a > m);
      if (s) { el.className = "hero__status"; el.lastChild.textContent = `Fechado agora · abre ${i === 0 ? "hoje" : i === 1 ? "amanhã" : DIAS[dd]} às ${hh(s[0])}`; return; }
    }
  }
  status(); setInterval(status, 60000);

  // ---------- modalidades ----------
  $("cats").innerHTML = CATEGORIAS.map((c) => `<button role="tab" data-c="${c.id}" aria-selected="false">${esc(c.nome)}<small>${c.itens.length}</small></button>`).join("");
  function renderCat(id) {
    const c = CATEGORIAS.find((x) => x.id === id);
    $("modgrid").innerHTML = `<figure class="modgrid__img"><img src="${c.img}" alt="${esc(c.nome)} na +Fit Club" loading="lazy" decoding="async"><figcaption>${esc(c.nome)}</figcaption></figure>
      <div class="modgrid__list">${c.itens.map((m, i) => `
        <article class="mod" style="animation-delay:${i * 60}ms">
          <h3>${esc(m.n)}</h3>
          <p>${esc(m.d)}</p>
          <ul>${m.b.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <div class="mod__plans">
            <span class="pill pill--l">Fit Livre</span>
            <span class="pill pill--e ${m.coletiva ? "pill--part" : ""}">Fit Especial${m.coletiva ? " · sábados" : ""}</span>
          </div>
        </article>`).join("")}</div>`;
    document.querySelectorAll("#cats button").forEach((b) => b.setAttribute("aria-selected", b.dataset.c === id));
  }
  $("cats").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) renderCat(b.dataset.c); });
  renderCat("musc");

  // ---------- planos ----------
  document.querySelectorAll("#pay button").forEach((b) => b.addEventListener("click", () => {
    pay = b.dataset.p;
    document.querySelectorAll("#pay button").forEach((x) => x.setAttribute("aria-checked", x === b));
    document.querySelectorAll(".plan__val").forEach((v) => {
      v.textContent = v.dataset[pay];
      v.parentElement.classList.remove("bump"); void v.offsetWidth; v.parentElement.classList.add("bump");
    });
    document.querySelectorAll("[data-pay-label]").forEach((p) => (p.textContent = PAY[pay]));
    atualizarLinks();
  }));
  const hour = $("hour"), want = $("wantClasses");
  function match() {
    const h = +hour.value;
    $("hourOut").textContent = `${String(h).padStart(2, "0")}h`;
    const esp = h >= 9 && h <= 14 && !want.checked;
    $("matchRes").innerHTML = esp
      ? `<b class="cyan">Fit Especial</b> atende: seu horário cabe no acesso das 09h às 15h40 e você economiza R$ 50 por mês.`
      : want.checked
        ? `<b class="violet">Fit Livre</b>: aulas coletivas durante a semana só no Fit Livre.`
        : `<b class="violet">Fit Livre</b>: às ${String(h).padStart(2, "0")}h, só o Fit Livre libera o acesso (05h às 23h).`;
    document.querySelectorAll(".plan").forEach((p) => p.classList.toggle("is-match", p.dataset.plan === (esp ? "especial" : "livre")));
  }
  hour.addEventListener("input", match); want.addEventListener("change", match); match();

  // ---------- avaliação ----------
  $("steps").innerHTML = AVALIACAO.map((s, i) => `<li class="step reveal">${s.img ? `<img src="${s.img}" alt="" loading="lazy">` : `<span class="step__ph">${String(i + 1).padStart(2, "0")}</span>`}<div><b>${String(i + 1).padStart(2, "0")}</b><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`).join("");

  // ---------- prova social ----------
  $("googleBtn").href = GOOGLE_REVIEWS;
  if (DEPOIMENTOS.length) {
    $("quotes").innerHTML = DEPOIMENTOS.map((d) => `<figure class="q reveal"><span class="q__s" aria-label="5 estrelas">★★★★★</span><blockquote>“${esc(d.texto)}”</blockquote><figcaption><b>${esc(d.nome)}</b>${d.tempo ? ` · ${esc(d.tempo)}` : ""}</figcaption></figure>`).join("");
  } else $("quotes").remove();

  // ---------- unidades ----------
  $("units").innerHTML = UNIDADES.map((u) => `
    <article class="unit reveal" data-id="${u.id}">
      ${u.foto ? `<img class="unit__img" src="${u.foto}" alt="Unidade ${esc(u.nome)}" loading="lazy">` : ""}
      <p class="unit__k">Unidade ${esc(u.tipo)}</p>
      <h3 class="unit__n">${esc(u.nome)}</h3>
      <p class="unit__row"><svg><use href="#pin"/></svg><span>${esc(u.endereco)}<br><small>${esc(u.cidade)}</small></span></p>
      <p class="unit__row"><svg><use href="#wa"/></svg><a href="${wa(u.tel, `Olá! Vim pelo site e quero informações da unidade ${u.nome}.`)}" target="_blank" rel="noopener">${esc(u.telTxt)}</a></p>
      <dl class="unit__hours">
        <div><dt>Seg a sex</dt><dd>05h–23h <small>Fit Livre</small> · 09h–15h40 <small>Fit Especial</small></dd></div>
        <div><dt>Sábado</dt><dd>08h–12h · 15h–19h</dd></div>
        <div><dt>Dom e feriados</dt><dd>08h–12h</dd></div>
      </dl>
      <div class="unit__ctas">
        <a class="btn btn--cyan btn--sm" href="${maps(u)}" target="_blank" rel="noopener"><svg><use href="#pin"/></svg> Abrir no Google Maps</a>
        <a class="btn btn--line btn--sm" href="${wa(u.tel, `Olá! Vim pelo site e quero informações da unidade ${u.nome}.`)}" target="_blank" rel="noopener"><svg><use href="#wa"/></svg> WhatsApp da unidade</a>
      </div>
      <button class="unit__pick" data-pick="${u.id}">Treinar nesta unidade</button>
    </article>`).join("");
  $("units").addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (b) { setUnidade(b.dataset.pick); $("experimental").scrollIntoView({ behavior: "smooth" }); } });
  $("footUnits").innerHTML = UNIDADES.map((u) => `<p><b>${esc(u.nome)} (${esc(u.tipo)})</b> · ${esc(u.endereco)} · <a href="${wa(u.tel, "Olá! Vim pelo site da +Fit Club.")}" target="_blank" rel="noopener">${esc(u.telTxt)}</a></p>`).join("");

  // ---------- aula experimental ----------
  $("unitPick").innerHTML = UNIDADES.map((u) => `<label><input type="radio" name="unidade" value="${u.id}"><span>${esc(u.nome)}<small>${esc(u.endereco.split("–").pop().trim())}</small></span></label>`).join("");
  $("unitPick").addEventListener("change", (e) => setUnidade(e.target.value));
  const form = $("trialForm"), done = $("done");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form), nome = (f.get("nome") || "").trim();
    if (!nome) { form.nome.focus(); form.nome.classList.add("err"); return; }
    const msg = `Olá! Sou ${nome} e quero agendar minha aula experimental grátis na unidade ${unidade.nome}.\nMelhor período: ${f.get("periodo")}.`;
    const href = wa(unidade.tel, msg);
    window.open(href, "_blank", "noopener");
    $("doneName").textContent = nome.split(" ")[0];
    $("doneUnit").textContent = unidade.nome;
    $("doneWa").href = href;
    form.hidden = true; done.hidden = false; done.focus();
  });
  form.nome.addEventListener("input", () => form.nome.classList.remove("err"));
  $("doneBack").addEventListener("click", () => { done.hidden = true; form.hidden = false; form.reset(); setUnidade(unidade.id); });

  // ---------- WhatsApp flutuante (escolhe a unidade) ----------
  const fab = $("fab"), fabMenu = $("fabMenu"), fabBtn = $("fabBtn");
  fabMenu.innerHTML = `<p>Falar com qual unidade?</p>` + UNIDADES.map((u) => `<a href="${wa(u.tel, "Olá! Vim pelo site da +Fit Club.")}" target="_blank" rel="noopener"><svg><use href="#wa"/></svg><span><b>${esc(u.nome)}</b><small>${esc(u.telTxt)}</small></span></a>`).join("");
  const toggleFab = (v) => { fabMenu.hidden = !v; fabBtn.setAttribute("aria-expanded", v); fab.classList.toggle("open", v); };
  fabBtn.addEventListener("click", () => toggleFab(fabMenu.hidden));
  document.querySelectorAll("[data-fab-open]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); toggleFab(fabMenu.hidden); }));
  document.addEventListener("click", (e) => { if (!fab.contains(e.target) && !e.target.closest("[data-fab-open]")) toggleFab(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleFab(false); });

  // ---------- vídeos ----------
  function video(v, b) {
    if (b) b.addEventListener("click", () => {
      v.muted = !v.muted; if (!v.muted) { v.currentTime = 0; v.play(); }
      b.setAttribute("aria-pressed", !v.muted);
      b.querySelector("use").setAttribute("href", v.muted ? "#mute" : "#sound");
    });
    new IntersectionObserver((es) => { if (es[0].isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); }, { threshold: 0.25 }).observe(v);
  }
  video($("tour"), $("tourSound")); video($("evalVideo"), $("evalSound"));

  // ---------- nav ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => { nav.classList.toggle("scrolled", scrollY > 30); document.body.classList.toggle("past", scrollY > innerHeight * 0.6); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const burger = document.querySelector(".nav__burger");
  const closeNav = () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); document.body.classList.remove("lock"); };
  burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); document.body.classList.toggle("lock", o); });
  document.querySelectorAll(".nav__links a").forEach((a) => a.addEventListener("click", closeNav));

  setUnidade(unidade.id);
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => {
    const sib = [...el.parentElement.children].filter((x) => x.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(sib.indexOf(el), 5) * 60}ms`;
    io.observe(el);
  });
  $("ano").textContent = new Date().getFullYear();
})();
