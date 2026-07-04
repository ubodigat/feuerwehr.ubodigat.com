let currentVehicle = null;
let quiz = [];
let answers = [];
let idx = 0;

const questionsByVehicle = {
    mtw: [
        { type: "mc", q: "Wofür wird der MTW hauptsächlich eingesetzt?", a: ["Transport von Einsatzkräften", "Löschen von Bränden", "Schwere technische Rettung", "Gefahrgut-Einsätze"], c: 0 },
        { type: "mc", q: "Wie viele Sitzplätze hat euer MTW typischerweise?", a: ["Bis 5", "Bis 9", "Über 12", "Nur 2"], c: 1 },
        { type: "mc", q: "Welche Ausrüstung ist typischerweise an Bord?", a: ["Atemschutz & Rüstsatz", "Funk & Erste-Hilfe-Material", "Drehleiterkorb", "Schaumzumischer"], c: 1 },
        { type: "mc", q: "Wofür wird der MTW im Einsatz gern genutzt?", a: ["Löschangriff", "Absperr-/Einsatzleitungstransport", "Hochwasserpumpe", "Seilwindenarbeiten"], c: 1 },
        { type: "mc", q: "Welche Besatzung passt am ehesten?", a: ["1/2", "1/5", "1/8", "1/1"], c: 2 }
    ],
    hlf20: [
        { type: "mc", q: "Welche Hauptaufgaben deckt das HLF 20/16 ab?", a: ["Nur Brandbekämpfung", "Nur THL", "Brandbekämpfung und THL", "Nur Gefahrgut"], c: 2 },
        { type: "mc", q: "Welche Komponente gehört meist zur HLF-Beladung?", a: ["Schere & Spreizer", "Schiffsradar", "Asphaltfräse", "Büroarbeitsplatz"], c: 0 },
        { type: "mc", q: "Typischer Löschmittelvorrat (Wasser) am HLF?", a: ["200 L", "800–2000 L", "5000 L", "Keiner"], c: 1 },
        { type: "mc", q: "Welche Pumpe ist häufig verbaut?", a: ["TS 8/8", "FP 10–2000", "Hochdruckreiniger", "Keine"], c: 1 },
        { type: "mc", q: "Welche Trupps sind üblich?", a: ["Nur Angriffstrupp", "Angriffs-/Wasser-/Schlauchtrupp", "Nur Wassertrupp", "Keine Trupps"], c: 1 }
    ],
    tlf3000: [
        { type: "mc", q: "Wofür ist das TLF3000 ST besonders geeignet?", a: ["Innenangriff in Hochhäusern", "Wasserförderung/Brandbekämpfung mit großem Tank", "Seilwindenrettung", "Taucheinsätze"], c: 1 },
        { type: "mc", q: "Wie groß ist der Wassertank (namentlich)?", a: ["1000 L", "2000 L", "3000 L", "5000 L"], c: 2 },
        { type: "mc", q: "Was gehört oft zur Beladung?", a: ["Große Menge Schlauchmaterial", "Rettungsschere", "Bootsanhänger", "Sprengmittel"], c: 0 },
        { type: "mc", q: "Welche Taktik unterstützt das TLF besonders?", a: ["Lange Wegestrecken", "Massenanfall Verletzter", "Seerettung", "Personensuche mit Drohne"], c: 0 },
        { type: "mc", q: "Welche Zumischung ist verbreitet?", a: ["Schaumzumischer/AFFF", "Betonmischer", "CO₂-Anlage", "Ozonisator"], c: 0 }
    ],
    lf8: [
        { type: "mc", q: "Das LF8 ist vor allem…", a: ["Ein Gefahrstofffahrzeug", "Ein Löschgruppenfahrzeug älterer Bauart", "Ein Rettungswagen", "Eine Drehleiter"], c: 1 },
        { type: "mc", q: "Typische Einsatzschwerpunkte des LF8?", a: ["Kleinere Brände & einfache THL", "Großtier-Rettung", "Seerettung", "Sprengarbeiten"], c: 0 },
        { type: "mc", q: "Welche Pumpe ist typisch am LF8?", a: ["Tragkraftspritze (TS)", "Hochdruckreiniger", "Keine", "Nur Schmutzwasserpumpe"], c: 0 },
        { type: "mc", q: "Besatzungskonzept klassisch?", a: ["1/2", "1/5", "1/8", "1/0"], c: 2 },
        { type: "mc", q: "Beladungsschwerpunkt?", a: ["Kommunikation", "Atemschutz schwer", "Löschangriff & Grund-THL", "Gefahrgut-Labor"], c: 2 },
        { type: "compartment", side: "right", correct: "G2", q: "In welchem Gerätefach auf der rechten Seite liegt der Verteiler?", hint: "Rechte Seite – tippe das richtige Fach an." },
        { type: "compartment", side: "rear", correct: "GR", q: "Wo befindet sich das Heck-Gerätefach GR?", hint: "Tippe das richtige Heckfach an." },
        { type: "compartment", side: "left", correct: "G4", q: "In welchem Gerätefach auf der linken Seite befindet sich die Schaumausrüstung?", hint: "Linke Seite – tippe das richtige Fach an." },
        { type: "compartment", side: "right", correct: "G3", q: "In welchem Gerätefach auf der rechten Seite befindet sich der Schnellangriff?", hint: "Rechte Seite – tippe das richtige Fach an." },
        { type: "mc", q: "Welche Leiter ist typischerweise auf dem LF8 verlastet?", a: ["Steckleiter", "Schiebleiter", "Drehleiterkorb", "Keine"], c: 0 },
        { type: "mc", q: "Welche Angriffsart wird mit dem LF8 typischerweise zuerst aufgebaut?", a: ["Innenangriff", "Außenangriff", "Schaumangriff", "Keine"], c: 1 }
    ]
};

const compartmentBaseWidth = {
    lf8: {
        left: 665,
        right: 665,
        rear: 665
    }
};

const compartmentPixels = {
    lf8: {
        left: {
            G4: { x: 44, y: 182, w: 134, h: 125 },
            G2: { x: 180, y: 182, w: 114, h: 125 },
            M1: { x: 306, y: 182, w: 259, h: 146 }
        },
        right: {
            M1: { x: 306, y: 182, w: 259, h: 146 },
            G1: { x: 382, y: 182, w: 96, h: 110 },
            G3: { x: 481, y: 182, w: 115, h: 110 }
        },
        rear: {
            GR: { x: 230, y: 132, w: 173, h: 223 }
        }
    }
};


function showFahrzeugInfo(fahrzeug) {
    resetQuizUI();
    const fahrzeugInfo = {
        mtw: { title: "Mannschaftstransportwagen (MTW)", image: "/picture/fahrzeugkunde/mtw.jpg", description: "Der MTW dient dem Transport von Einsatzkräften und leichter Ausrüstung." },
        hlf20: { title: "Hilfeleistungslöschgruppenfahrzeug (HLF 20/16)", image: "/picture/fahrzeugkunde/hlf20.jpg", description: "Das HLF 20/16 ist ein vielseitiges Einsatzfahrzeug mit Ausrüstung für Brandbekämpfung und technische Hilfeleistung." },
        tlf3000: { title: "Tanklöschfahrzeug (TLF3000 ST)", image: "/picture/fahrzeugkunde/tlf3000.jpg", description: "Das TLF 3000 ST hat einen großen Wassertank und ist ideal für Brandbekämpfungen in abgelegenen Gebieten." },
        lf8: { title: "Löschgruppenfahrzeug (LF8)", image: "/picture/fahrzeugkunde/lf8.jpg", description: "Das LF8 ist ein klassisches Löschfahrzeug für die Brandbekämpfung und kleinere technische Einsätze." }
    };
    currentVehicle = fahrzeug;
    const info = fahrzeugInfo[fahrzeug];
    const titleEl = document.getElementById("fahrzeug-title");
    const imgEl = document.getElementById("fahrzeug-image");
    const descEl = document.getElementById("fahrzeug-description");
    const startEl = document.getElementById("start-uebung-button");
    if (titleEl) titleEl.textContent = info.title;
    if (imgEl) {
        imgEl.src = info.image;
        imgEl.style.display = "block";
        imgEl.style.filter = "none";
    }
    if (descEl) descEl.textContent = info.description;
    if (startEl) startEl.style.display = "inline-block";
}

function startUebung() {
    if (!currentVehicle) return;
    quiz = questionsByVehicle[currentVehicle] ? [...questionsByVehicle[currentVehicle]] : [];
    answers = new Array(quiz.length).fill(null);
    idx = 0;
    const result = document.getElementById("quiz-result");
    if (result) {
        result.style.display = "none";
        result.innerHTML = "";
    }
    const uebung = document.getElementById("uebung-section");
    if (uebung) uebung.style.display = "block";
    document.getElementById("quiz-total").textContent = String(quiz.length);
    const panel = document.getElementById("fahrzeug-info");
    if (panel) panel.classList.add("uebung-aktiv");
    let badge = document.querySelector(".uebung-status");
    if (!badge && panel) {
        badge = document.createElement("span");
        badge.className = "uebung-status";
        badge.setAttribute("aria-live", "polite");
        badge.style.marginLeft = "8px";
        badge.style.fontSize = "0.9rem";
        badge.style.padding = "2px 8px";
        badge.style.borderRadius = "999px";
        badge.style.background = "rgba(0,123,255,.08)";
        badge.style.color = "#0d6efd";
        panel.appendChild(badge);
    }
    if (badge) {
        badge.textContent = "Übung aktiv";
        badge.style.display = "inline-block";
    }
    renderQuestion();
    uebung.scrollIntoView({ behavior: "smooth" });
}

function resetQuizUI() {
    const result = document.getElementById("quiz-result");
    if (result) {
        result.style.display = "none";
        result.innerHTML = "";
    }
    const uebung = document.getElementById("uebung-section");
    if (uebung) uebung.style.display = "none";
    const info = document.getElementById("fahrzeug-info");
    if (info) info.classList.remove("uebung-aktiv");
    const badge = document.querySelector(".uebung-status");
    if (badge) badge.style.display = "none";
    clearOverlays();
}

function renderQuestion() {
    clearOverlays();
    const q = quiz[idx];
    const qIndex = document.getElementById("quiz-index");
    if (qIndex) qIndex.textContent = String(idx + 1);
    document.getElementById("quiz-question").textContent = q.q;
    const opts = document.getElementById("quiz-options");
    opts.innerHTML = "";
    if (q.type === "compartment") {
        renderCompartmentQuestion(q, opts);
    } else {
        renderMultipleChoiceQuestion(q, opts);
    }
    document.getElementById("quiz-prev").disabled = idx === 0;
    const isLast = idx === quiz.length - 1;
    const nextBtn = document.getElementById("quiz-next");
    const finishBtn = document.getElementById("quiz-finish");
    nextBtn.style.display = isLast ? "none" : "inline-block";
    finishBtn.style.display = isLast ? "inline-block" : "none";
    nextBtn.disabled = answers[idx] === null;
}

function renderMultipleChoiceQuestion(q, container) {
    q.a.forEach((text, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = text;
        btn.className = "quiz-option-btn";
        btn.style.textAlign = "left";
        btn.style.background = "#fff";
        btn.style.border = "1px solid #dcdcdc";
        btn.style.borderRadius = "8px";
        btn.style.padding = "12px 14px";
        btn.style.cursor = "pointer";
        btn.style.transition = "transform .1s ease, border-color .2s ease, box-shadow .2s ease, background-color .2s ease";
        if (answers[idx] === i) {
            btn.style.borderColor = "#0d6efd";
            btn.style.boxShadow = "0 0 0 3px rgba(13,110,253,.25)";
            btn.style.backgroundColor = "rgba(13,110,253,.06)";
        }
        btn.addEventListener("mouseenter", () => {
            btn.style.transform = "translateY(-1px)";
            btn.style.boxShadow = "0 4px 10px rgba(0,0,0,.08)";
        });
        btn.addEventListener("mouseleave", () => {
            if (answers[idx] === i) {
                btn.style.transform = "none";
                btn.style.boxShadow = "0 0 0 3px rgba(13,110,253,.25)";
            } else {
                btn.style.transform = "none";
                btn.style.boxShadow = "none";
            }
        });
        btn.onclick = () => {
            answers[idx] = i;
            Array.from(container.children).forEach(c => {
                c.style.borderColor = "#dcdcdc";
                c.style.boxShadow = "none";
                c.style.backgroundColor = "#fff";
            });
            btn.style.borderColor = "#0d6efd";
            btn.style.boxShadow = "0 0 0 3px rgba(13,110,253,.25)";
            btn.style.backgroundColor = "rgba(13,110,253,.06)";
            document.getElementById("quiz-next").disabled = false;
        };
        container.appendChild(btn);
    });
}

function renderCompartmentQuestion(q, container) {
    const wrapper = document.createElement("div");
    wrapper.id = "compartment-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";

    const img = document.createElement("img");
    img.id = "compartment-image";
    img.alt = "Fahrzeugansicht";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    img.style.display = "block";
    img.style.transition = "filter .2s ease";

    if (currentVehicle === "lf8") {
        if (q.side === "left")
            img.src = "/picture/fahrzeugkunde/lf8_links_außen.jpg";
        else if (q.side === "right")
            img.src = "/picture/fahrzeugkunde/lf8_rechts_außen.jpg";
        else if (q.side === "rear")
            img.src = "/picture/fahrzeugkunde/lf8_hinten_außen.jpg";
        else
            img.src = "/picture/fahrzeugkunde/lf8_links_außen.jpg";
    } else {
        img.src = "/picture/fahrzeugkunde/lf8_links_außen.jpg";
    }

    img.onload = () => {
        img.style.filter = "brightness(0.75)";
        drawOverlays(img, q);
    };

    const hint = document.createElement("div");
    hint.textContent = q.hint || "Tippe das richtige Rolladenfach an.";
    hint.style.marginTop = "8px";

    const selection = document.createElement("div");
    selection.id = "compartment-selection";
    selection.textContent = "Auswahl: –";
    selection.style.marginTop = "2px";
    selection.style.fontWeight = "500";

    wrapper.appendChild(img);
    wrapper.appendChild(hint);
    wrapper.appendChild(selection);
    container.appendChild(wrapper);

    document.getElementById("quiz-next").disabled = answers[idx] === null;
}

function drawOverlays(img, q) {
    clearOverlays();
    if (!compartmentPixels[currentVehicle]) return;
    const mapSide = compartmentPixels[currentVehicle][q.side];
    if (!mapSide) return;

    const rect = img.getBoundingClientRect();
    const wrap = document.createElement("div");
    wrap.id = "overlay-wrap";
    wrap.style.position = "relative";
    wrap.style.width = rect.width + "px";
    wrap.style.height = rect.height + "px";

    img.parentElement.insertBefore(wrap, img);
    wrap.appendChild(img);

    const baseWidth = (compartmentBaseWidth[currentVehicle] && compartmentBaseWidth[currentVehicle][q.side]) || rect.width;
    const scale = rect.width / baseWidth;

    Object.keys(mapSide).forEach(key => {
        const p = mapSide[key];
        const box = document.createElement("div");
        box.className = "overlay-box";
        box.dataset.key = key;

        box.style.position = "absolute";
        box.style.left = (p.x * scale) + "px";
        box.style.top = (p.y * scale) + "px";
        box.style.width = (p.w * scale) + "px";
        box.style.height = (p.h * scale) + "px";
        box.style.borderRadius = "10px";
        box.style.boxSizing = "border-box";
        box.style.cursor = "pointer";
        box.style.border = "3px solid rgba(13,110,253,.7)";
        box.style.background = "rgba(13,110,253,.22)";
        box.style.boxShadow = "0 0 0 2px rgba(255,255,255,.35)";
        box.style.transition = "background-color .15s ease, border-color .15s ease, box-shadow .15s ease, transform .1s ease";

        box.addEventListener("mouseenter", () => {
            box.style.background = "rgba(25,135,84,.32)";
            box.style.borderColor = "rgba(25,135,84,.9)";
            box.style.boxShadow = "0 0 0 3px rgba(25,135,84,.45)";
            box.style.transform = "translateY(-1px)";
        });

        box.addEventListener("mouseleave", () => {
            if (answers[idx] === key) {
                box.style.background = "rgba(25,135,84,.4)";
                box.style.borderColor = "#198754";
                box.style.boxShadow = "0 0 0 4px rgba(25,135,84,.6)";
            } else {
                box.style.background = "rgba(13,110,253,.22)";
                box.style.borderColor = "rgba(13,110,253,.7)";
                box.style.boxShadow = "0 0 0 2px rgba(255,255,255,.35)";
                box.style.transform = "none";
            }
        });

        box.addEventListener("click", () => {
            const all = document.querySelectorAll(".overlay-box");
            all.forEach(b => {
                b.style.background = "rgba(13,110,253,.22)";
                b.style.borderColor = "rgba(13,110,253,.7)";
                b.style.boxShadow = "0 0 0 2px rgba(255,255,255,.35)";
            });
            box.style.background = "rgba(25,135,84,.4)";
            box.style.borderColor = "#198754";
            box.style.boxShadow = "0 0 0 4px rgba(25,135,84,.6)";
            answers[idx] = key;
            const sel = document.getElementById("compartment-selection");
            if (sel) sel.textContent = "Auswahl: " + key;
            document.getElementById("quiz-next").disabled = false;
        });

        wrap.appendChild(box);
    });
}

function clearOverlays() {
    const existingWrap = document.getElementById("overlay-wrap");
    const img = document.getElementById("compartment-image");
    if (existingWrap && img && existingWrap.contains(img)) {
        existingWrap.parentElement.insertBefore(img, existingWrap);
        existingWrap.remove();
        img.style.filter = "none";
    } else if (existingWrap) {
        existingWrap.remove();
    }
}

function nextQuestion() {
    if (idx < quiz.length - 1) {
        idx++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (idx > 0) {
        idx--;
        renderQuestion();
    }
}

function finishQuiz() {
    let score = 0;
    quiz.forEach((q, i) => {
        if (q.type === "compartment") {
            if (answers[i] === q.correct) score++;
        } else if (typeof answers[i] === "number" && answers[i] === q.c) {
            score++;
        }
    });

    const result = document.getElementById("quiz-result");
    result.style.display = "block";
    const total = quiz.length;
    const header = document.createElement("div");
    header.textContent = `Ergebnis: ${score} von ${total} korrekt.`;
    header.style.marginBottom = "10px";
    header.style.fontWeight = "600";

    const list = document.createElement("ol");
    list.style.paddingLeft = "20px";
    list.style.margin = "0";

    quiz.forEach((q, i) => {
        const li = document.createElement("li");
        li.style.marginBottom = "6px";

        const user = answers[i];
        let isCorrect = false;
        let userText = "–";
        let correctText = "";

        if (q.type === "compartment") {
            correctText = q.correct || "";
            if (user != null) {
                userText = String(user);
                if (user === q.correct) isCorrect = true;
            }
        } else {
            const correctIdx = q.c;
            correctText = q.a[correctIdx] || "";
            if (typeof user === "number") {
                userText = q.a[user] || "";
                if (user === correctIdx) isCorrect = true;
            }
        }

        li.innerHTML = `<strong>Frage:</strong> ${q.q}<br>
      <span style="color:${isCorrect ? "#198754" : "#dc3545"};">
      ${isCorrect ? "✔ Richtig" : "✘ Falsch"}</span>
      – Deine Antwort: <em>${userText}</em>;
      richtig: <em>${correctText}</em>`;
        list.appendChild(li);
    });

    result.innerHTML = "";
    result.appendChild(header);
    result.appendChild(list);
    result.scrollIntoView({ behavior: "smooth" });

    const panel = document.getElementById("fahrzeug-info");
    if (panel) panel.classList.remove("uebung-aktiv");
    const badge = document.querySelector(".uebung-status");
    if (badge) {
        badge.textContent = "Übung beendet";
        badge.style.background = "rgba(25,135,84,.12)";
        badge.style.color = "#198754";
    }
}