// --- Fahrzeugkunde: Status & Fragen ---------------------------------
let currentVehicle = null;
let quiz = [];
let answers = [];
let idx = 0;

const questionsByVehicle = {
    mtw: [{
            q: "Wofür wird der MTW hauptsächlich eingesetzt?",
            a: ["Transport von Einsatzkräften", "Löschen von Bränden", "Schwere technische Rettung", "Gefahrgut-Einsätze"],
            c: 0
        },
        {
            q: "Wie viele Sitzplätze hat euer MTW typischerweise?",
            a: ["Bis 5", "Bis 9", "Über 12", "Nur 2"],
            c: 1
        }
    ],
    hlf20: [{
            q: "Welche Hauptaufgaben deckt das HLF 20/16 ab?",
            a: ["Nur Brandbekämpfung", "Nur THL", "Brandbekämpfung und THL", "Nur Gefahrgut"],
            c: 2
        },
        {
            q: "Welche Komponente gehört meist zur HLF-Beladung?",
            a: ["Schere & Spreizer", "Schiffsradar", "Asphaltfräse", "Büroarbeitsplatz"],
            c: 0
        }
    ],
    tlf3000: [{
            q: "Wofür ist das TLF3000 ST besonders geeignet?",
            a: ["Innenangriff in Hochhäusern", "Wasserförderung/Brandbekämpfung mit großem Tank", "Seilwindenrettung", "Taucheinsätze"],
            c: 1
        },
        {
            q: "Wie groß ist der Wassertank (namentlich)?",
            a: ["1000 L", "2000 L", "3000 L", "5000 L"],
            c: 2
        }
    ],
    lf8: [{
            q: "Das LF8 ist vor allem…",
            a: ["Ein Gefahrstofffahrzeug", "Ein Löschgruppenfahrzeug älterer Bauart", "Ein Rettungswagen", "Eine Drehleiter"],
            c: 1
        },
        {
            q: "Typische Einsatzschwerpunkte des LF8?",
            a: ["Kleinere Brände & einfache THL", "Großtier-Rettung", "Seerettung", "Sprengarbeiten"],
            c: 0
        }
    ]
};

// --- Fahrzeugauswahl aktualisieren (aufrufen wie gehabt) -------------
function showFahrzeugInfo(fahrzeug) {
    const fahrzeugInfo = {
        mtw: {
            title: "Mannschaftstransportwagen (MTW)",
            image: "/picture/mtw.jpg",
            description: "Der MTW dient dem Transport von Einsatzkräften und leichter Ausrüstung."
        },
        hlf20: {
            title: "Hilfeleistungslöschgruppenfahrzeug (HLF 20/16)",
            image: "/picture/hlf20.jpg",
            description: "Das HLF 20/16 ist ein vielseitiges Einsatzfahrzeug mit Ausrüstung für Brandbekämpfung und technische Hilfeleistung."
        },
        tlf3000: {
            title: "Tanklöschfahrzeug (TLF3000 ST)",
            image: "/picture/tlf3000.jpg",
            description: "Das TLF 3000 ST hat einen großen Wassertank und ist ideal für Brandbekämpfungen in abgelegenen Gebieten."
        },
        lf8: {
            title: "Löschgruppenfahrzeug (LF8)",
            image: "/picture/lf8.jpg",
            description: "Das LF8 ist ein klassisches Löschfahrzeug für die Brandbekämpfung und kleinere technische Einsätze."
        }
    };

    currentVehicle = fahrzeug;

    const info = fahrzeugInfo[fahrzeug];
    document.getElementById('fahrzeug-title').textContent = info.title;
    const img = document.getElementById('fahrzeug-image');
    img.src = info.image;
    img.style.display = 'block';
    document.getElementById('fahrzeug-description').textContent = info.description;

    // Start-Button sichtbar machen (ohne alert)
    const startBtn = document.getElementById('start-uebung-button');
    if (startBtn) startBtn.style.display = 'inline-block';
}

// --- Übung starten: wechselt in Quiz-Ansicht -------------------------
function startUebung() {
    if (!currentVehicle) return; // kein Popup, einfach nichts tun, falls kein Fahrzeug gewählt.

    quiz = questionsByVehicle[currentVehicle] ? [...questionsByVehicle[currentVehicle]] : [];
    answers = new Array(quiz.length).fill(null);
    idx = 0;

    // Bereich anzeigen
    document.getElementById('uebung-section').style.display = 'block';

    // Fortschritt/Gesamt setzen
    document.getElementById('quiz-total').textContent = String(quiz.length);

    // Erste Frage rendern
    renderQuestion();
    // Zu Quiz-Bereich scrollen (optional, ohne Popup)
    document.getElementById('uebung-section').scrollIntoView({ behavior: 'smooth' });
}

// --- Frage rendern ----------------------------------------------------
function renderQuestion() {
    const q = quiz[idx];
    document.getElementById('quiz-index').textContent = String(idx + 1);
    document.getElementById('quiz-question').textContent = q.q;

    const opts = document.getElementById('quiz-options');
    opts.innerHTML = '';

    q.a.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        if (answers[idx] === i) btn.classList.add('selected');
        btn.onclick = () => {
            answers[idx] = i;
            // Auswahl visuell markieren
            [...opts.children].forEach(c => c.classList.remove('selected'));
            btn.classList.add('selected');
            // "Weiter" aktiv machen
            document.getElementById('quiz-next').disabled = false;
        };
        opts.appendChild(btn);
    });

    // Buttons steuern
    document.getElementById('quiz-prev').disabled = idx === 0;
    document.getElementById('quiz-next').style.display = idx < quiz.length - 1 ? 'inline-block' : 'none';
    document.getElementById('quiz-finish').style.display = idx === quiz.length - 1 ? 'inline-block' : 'none';
    document.getElementById('quiz-next').disabled = answers[idx] === null;
}

// --- Navigation -------------------------------------------------------
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

// --- Auswertung -------------------------------------------------------
function finishQuiz() {
    // Punkte zählen
    let score = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.c) score++; });

    const result = document.getElementById('quiz-result');
    result.style.display = 'block';
    result.textContent = `Ergebnis: ${score} von ${quiz.length} korrekt.`;

    // Optional: Nach oben zum Ergebnis scrollen
    result.scrollIntoView({ behavior: 'smooth' });
}