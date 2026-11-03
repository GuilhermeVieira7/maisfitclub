/* +Fit Club Academia — interações */
(() => {
  /* ================= CONFIGURAÇÃO ================= */
  const UNIDADES = [
    { id: "cidade-nova", nome: "Cidade Nova", tipo: "Matriz", endereco: "Rua E, 897 – Bairro Maranhão", tel: "5594992683291", telTxt: "(94) 9 9268-3291", busca: "Rua E, 897, Bairro Maranhão, Parauapebas - PA" },
    { id: "beira-rio", nome: "Beira Rio", tipo: "Filial", endereco: "Av. E, Qd 55, Lt 12 e 13 – Beira Rio II", tel: "5594991418360", telTxt: "(94) 9 9141-8360", busca: "Av. E, Quadra 55, Lote 12, Beira Rio II, Parauapebas - PA" },
  ];

  // c = aula coletiva (no Fit Especial: só aos sábados e datas comemorativas)
  const MODALIDADES = [
    { n: "Musculação", c: false, d: "Equipamentos modernos e treino planejado no seu ritmo." },
    { n: "CrossFit", c: true, d: "Alta intensidade, em turma." },
    { n: "Cross Training", c: true, d: "Força e condicionamento funcional." },
    { n: "Spinning", c: true, d: "Bike, música alta e muito suor." },
    { n: "Jump", c: true, d: "Cardio no mini trampolim." },
    { n: "GAP", c: true, d: "Glúteos, abdômen e pernas." },
    { n: "ABS", c: true, d: "Core forte e abdômen definido." },
    { n: "Pilates", c: true, d: "Postura, mobilidade e controle." },
    { n: "Fit Dance", c: true, d: "Dança pra queimar sem perceber." },
    { n: "Step", c: true, d: "Coreografia e coordenação." },
    { n: "Rit Box", c: true, d: "Ritmo de luta, cardio no talo." },
    { n: "Muay Thai", c: true, d: "Técnica, defesa e condicionamento." },
    { n: "Funcional", c: true, d: "Movimentos do dia a dia, corpo todo." },
    { n: "Func. Kids", c: true, d: "Funcional para a criançada." },
  ];

  const MOTIVOS = [
    "Preço que cabe na rotina (e no bolso).",
    "Equipamentos modernos.",
    "Um ambiente que motiva, acolhe e inspira.",
    "Acompanhamento e treino planejado no seu ritmo — sem pressão.",
    "Diversas modalidades: do CrossFit ao Pilates, do Spinning ao Muay Thai.",
    "Climatização ideal e vestiários completos para o seu conforto.",
    "App para organizar seu treino.",
    "Avaliação física completa.",
    "Duas unidades para melhor te atender.",
    "Acompanhamento de profissionais qualificados em cada etapa.",
  ];
  const MOTIVO_IMG = { 2: "assets/aula-coletiva-2.webp", 4: "assets/professor.webp", 7: "assets/app.webp", 9: "assets/fachada.webp" };

  const AVALIACAO = [
    { t: "Bioimpedância", d: "Composição corporal: massa magra, gordura e água." },
    { t: "Perimetria", d: "Mede as circunferências do corpo para acompanhar a evolução." },
    { t: "Dobras cutâneas", d: "Calcula o percentual de gordura com adipômetro.", img: "assets/aval-dobras.webp" },
    { t: "Dinamômetro", d: "Mede a força muscular." },
    { t: "Flexiteste", d: "Avalia a flexibilidade das articulações.", img: "assets/aval-flexiteste.webp" },
    { t: "Resultados e explicação", d: "O avaliador entrega e explica cada resultado.", img: "assets/professor.webp" },
  ];

  // Horário de acesso do Fit Livre (minutos). 0 = domingo.
  const ABERTO = { 0: [[480, 720]], 1: [[300, 1380]], 2: [[300, 1380]], 3: [[300, 1380]], 4: [[300, 1380]], 5: [[300, 1380]], 6: [[480, 720], [900, 1140]] };

  /* ================================================= */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const wa = (tel, msg) => `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
  let unidade = UNIDADES[0];
  try { const s = localStorage.getItem("mf-unidade"); if (s) unidade = UNIDADES.find((u) => u.id === s) || unidade; } catch (e) {}
  const atualizarWa = () => document.querySelectorAll("[data-wa-unit]").forEach((a) => (a.href = wa(unidade.tel, a.dataset.msg + ` (Unidade ${unidade.nome})`)));
  function setUnidade(id) {
    unidade = UNIDADES.find((u) => u.id === id);
    try { localStorage.setItem("mf-unidade", id); } catch (e) {}
    document.querySelectorAll(`#unitPick input`).forEach((i) => (i.checked = i.value === id));
    document.querySelectorAll(".unit").forEach((c) => c.classList.toggle("is-sel", c.dataset.id === id));
    atualizarWa();
  }

  // ---------- status (agora, em Parauapebas) ----------
  function agora() {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Belem", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    return { d: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")), m: (+g("hour") % 24) * 60 + +g("minute") };
  }
  const hh = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`;
  function status() {
    const { d, m } = agora(), el = $("status");
    const aberto = ABERTO[d].find(([a, f]) => m >= a && m < f);
    if (aberto) { el.className = "hero__status is-open"; el.lastChild.textContent = `Aberto agora · até às ${hh(aberto[1])}`; return; }
    for (let i = 0; i < 8; i++) {
      const dd = (d + i) % 7, s = ABERTO[dd].find(([a]) => i > 0 || a > m);
      if (s) { el.className = "hero__status"; el.lastChild.textContent = `Fechado agora · abre ${i === 0 ? "hoje" : i === 1 ? "amanhã" : ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][dd]} às ${hh(s[0])}`; return; }
    }
  }
  status(); setInterval(status, 60000);

  // ---------- ticker ----------
  const tk = MODALIDADES.map((m) => `<span>${esc(m.n)}</span><svg><use href="#plus"/></svg>`).join("");
  $("ticker").innerHTML = tk + tk;

  // ---------- modalidades ----------
  let filtro = "todas";
  function renderMods() {
    $("modlist").innerHTML = MODALIDADES.map((m) => {
      const no = filtro === "especial" && m.c ? "parcial" : "sim";
      const tag = filtro === "todas" ? (m.c ? "Coletiva" : "Todos os planos") : filtro === "livre" ? "Liberado" : m.c ? "Só aos sábados" : "Liberado";
      return `<li class="mod mod--${no}"><svg><use href="#plus"/></svg><span class="mod__n">${esc(m.n)}</span><span class="mod__d">${esc(m.d)}</span><span class="mod__tag">${tag}</span></li>`;
    }).join("");
  }
  document.querySelectorAll(".filter button").forEach((b) => b.addEventListener("click", () => {
    filtro = b.dataset.f;
    document.querySelectorAll(".filter button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderMods();
  }));
  renderMods();

  // ---------- motivos ----------
  $("why").innerHTML = MOTIVOS.map((t, i) => `<li class="why__c ${MOTIVO_IMG[i] ? "why__c--img" : ""}">${MOTIVO_IMG[i] ? `<img src="${MOTIVO_IMG[i]}" alt="" loading="lazy">` : ""}<b>${i + 1}</b><p>${esc(t)}</p></li>`).join("");

  // ---------- planos: forma de pagamento ----------
  document.querySelectorAll("#pay button").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll("#pay button").forEach((x) => x.setAttribute("aria-checked", x === b));
    document.querySelectorAll(".plan__val").forEach((v) => {
      v.textContent = v.dataset[b.dataset.p];
      v.parentElement.classList.remove("bump"); void v.offsetWidth; v.parentElement.classList.add("bump");
    });
  }));

  // ---------- qual plano é o seu? ----------
  const hour = $("hour"), want = $("wantClasses");
  function match() {
    const h = +hour.value;
    $("hourOut").textContent = `${String(h).padStart(2, "0")}h`;
    const especialOk = h >= 9 && h <= 14 && !want.checked;
    let txt;
    if (especialOk) txt = `<b class="cyan">Fit Especial</b> resolve: seu horário cabe no acesso de 09h às 15h40 e você economiza R$ 50 por mês.`;
    else if (want.checked) txt = `<b class="violet">Fit Livre</b>: aulas coletivas durante a semana só estão no Fit Livre.`;
    else txt = `<b class="violet">Fit Livre</b>: às ${String(h).padStart(2, "0")}h só o Fit Livre libera o acesso (05h às 23h).`;
    $("matchRes").innerHTML = txt;
    document.querySelectorAll(".plan").forEach((p) => p.classList.toggle("is-match", p.dataset.plan === (especialOk ? "especial" : "livre")));
  }
  hour.addEventListener("input", match); want.addEventListener("change", match); match();
  document.querySelectorAll("[data-plan-cta]").forEach((a) => a.addEventListener("click", () => { sessionStorage.setItem("mf-plano", a.dataset.planCta); }));

  // ---------- avaliação ----------
  $("steps").innerHTML = AVALIACAO.map((s, i) => `<li class="step reveal"><span class="step__n">${String(i + 1).padStart(2, "0")}</span>${s.img ? `<img src="${s.img}" alt="" loading="lazy">` : ""}<div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></li>`).join("");

  // ---------- unidades ----------
  $("units").innerHTML = UNIDADES.map((u) => `
    <article class="unit reveal" data-id="${u.id}">
      <p class="unit__k">Unidade ${esc(u.tipo)}</p>
      <h3 class="unit__n">${esc(u.nome)}</h3>
      <p class="unit__a"><svg><use href="#pin"/></svg>${esc(u.endereco)}</p>
      <p class="unit__t"><svg><use href="#wa"/></svg>${esc(u.telTxt)}</p>
      <div class="unit__ctas">
        <a class="btn btn--cyan btn--sm" href="${wa(u.tel, `Olá! Vim pelo site e quero informações da unidade ${u.nome} da +Fit Club.`)}" target="_blank" rel="noopener"><svg><use href="#wa"/></svg> Falar com a unidade</a>
        <a class="btn btn--line btn--sm" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(u.busca)}" target="_blank" rel="noopener"><svg><use href="#pin"/></svg> Como chegar</a>
      </div>
      <button class="unit__pick" data-pick="${u.id}">Treinar nesta unidade</button>
    </article>`).join("");
  $("units").addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (b) { setUnidade(b.dataset.pick); document.getElementById("experimental").scrollIntoView({ behavior: "smooth" }); } });
  $("footUnits").innerHTML = UNIDADES.map((u) => `<p><b>${esc(u.nome)}</b> · ${esc(u.endereco)} · <a href="${wa(u.tel, "Olá! Vim pelo site da +Fit Club.")}" target="_blank" rel="noopener">${esc(u.telTxt)}</a></p>`).join("");

  // ---------- aula experimental ----------
  $("unitPick").innerHTML = UNIDADES.map((u) => `<label><input type="radio" name="unidade" value="${u.id}"><span>${esc(u.nome)}<small>${esc(u.endereco.split("–")[1] || u.endereco)}</small></span></label>`).join("");
  $("unitPick").addEventListener("change", (e) => setUnidade(e.target.value));
  $("trialMods").innerHTML = MODALIDADES.map((m, i) => `<label><input type="checkbox" name="mod" value="${esc(m.n)}" ${i === 0 ? "checked" : ""}><span>${esc(m.n)}</span></label>`).join("");
  const form = $("trialForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form), nome = (f.get("nome") || "").trim();
    if (!nome) { form.nome.focus(); form.nome.classList.add("err"); return; }
    const mods = f.getAll("mod"), plano = sessionStorage.getItem("mf-plano");
    const msg = `Olá! Sou ${nome} e quero agendar minha aula experimental grátis na unidade ${unidade.nome}.\n` +
      (mods.length ? `Quero experimentar: ${mods.join(", ")}.\n` : "") + `Melhor período: ${f.get("periodo")}.` + (plano ? `\nTenho interesse no plano ${plano}.` : "");
    window.open(wa(unidade.tel, msg), "_blank", "noopener");
    form.classList.add("sent");
    form.querySelector("button[type=submit]").innerHTML = `<svg><use href="#wa"/></svg> Mensagem pronta! Enviar de novo`;
  });
  form.nome.addEventListener("input", () => form.nome.classList.remove("err"));

  // ---------- vídeos ----------
  function som(v, b) {
    b.addEventListener("click", () => {
      v.muted = !v.muted; if (!v.muted) { v.currentTime = 0; v.play(); }
      b.setAttribute("aria-pressed", !v.muted);
      b.innerHTML = `<svg><use href="#${v.muted ? "mute" : "sound"}"/></svg><span>${v.muted ? "Ouvir" : "Som ligado"}</span>`;
    });
    new IntersectionObserver((es) => { if (es[0].isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause(); }, { threshold: 0.3 }).observe(v);
  }
  som($("tour"), $("tourSound")); som($("evalVideo"), $("evalSound"));

  // ---------- nav ----------
  const nav = document.querySelector(".nav");
  const onScroll = () => { nav.classList.toggle("scrolled", scrollY > 30); document.body.classList.toggle("past", scrollY > innerHeight * 0.7); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const burger = document.querySelector(".nav__burger");
  burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); document.body.classList.toggle("lock", o); });
  document.querySelectorAll(".nav__links a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", false); document.body.classList.remove("lock"); }));

  setUnidade(unidade.id);
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  $("ano").textContent = new Date().getFullYear();
})();
