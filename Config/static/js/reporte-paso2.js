// /static/js/reporte-paso2.js
import { Storage } from "./utils/storage.js"; // si no usas el wrapper, puedes quitar esta import

const GRID_ID = "nivelesUrgenciaGrid";

// Mapea cada nivel a una clase de color (ajusta a tus clases CSS)
const BADGE_CLASS_BY_NAME = {
    "Bajo": "low",
    "Medio": "medium",
    "Alto": "high",
    "Crítico": "critical",
};
// Por si prefieres mapear por código (NU-001..NU-004):
const BADGE_CLASS_BY_CODE = {
    "NU-001": "low",
    "NU-002": "medium",
    "NU-003": "high",
    "NU-004": "critical",
};

function readCatalogo() {
    // 1) con wrapper (namespaced)
    const viaWrapper = (typeof Storage !== "undefined")
        ? Storage.get("catalogo_reportes")
        : null;

    if (viaWrapper) return viaWrapper;

    // 2) fallback sin wrapper
    try {
        const raw =
            localStorage.getItem("solectric:catalogo_reportes") ||
            localStorage.getItem("catalogo_reportes");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function badgeClassFor(item) {
    // intenta por código, luego por nombre; por defecto usa "medium"
    return (
        BADGE_CLASS_BY_CODE[item.codigo] ||
        BADGE_CLASS_BY_NAME[item.nombre] ||
        "medium"
    );
}

function renderNiveles() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    const catalogo = readCatalogo();
    const niveles = catalogo?.niveles_urgencia ?? [];

    if (!niveles.length) {
        grid.innerHTML = `<div style="padding:8px;color:#666;font-size:14px;">
      No hay niveles de urgencia disponibles.
    </div>`;
        return;
    }

    grid.innerHTML = "";

    niveles.forEach((n) => {
        const badgeClass = badgeClassFor(n);

        const card = document.createElement("div");
        card.className = "urgency-option";
        card.dataset.id = n.id;       // <-- guardamos el ID aquí
        card.dataset.code = n.codigo;

        card.innerHTML = `
      <span class="urgency-badge ${badgeClass}">${n.nombre}</span>
      <div class="urgency-content">
        <div class="urgency-label">${n.descripcion?.split(".")[0] || ""}</div>
        <div class="urgency-desc">${n.descripcion || ""}</div>
      </div>
    `;

        grid.appendChild(card);
    });
}

function wireSelection() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".urgency-option");
        if (!card) return;

        grid.querySelectorAll(".urgency-option.selected")
            .forEach((el) => el.classList.remove("selected"));
        card.classList.add("selected");

        const selected = {
            id: card.dataset.nivelId,
            nombre: card.dataset.nivelNombre,
        };
        localStorage.setItem("solectric:reporte.nivel", JSON.stringify(selected));
    });
}

function requireNivelBeforeContinue() {
    const continueBtn = document.querySelector(".continue-btn");
    continueBtn?.addEventListener("click", (e) => {
        const raw = localStorage.getItem("solectric:reporte.nivel");
        const sel = raw ? JSON.parse(raw) : null;
        if (!sel?.id) {
            e.preventDefault();
            alert("Selecciona un nivel de urgencia para continuar.");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderNiveles();
    wireSelection();
    requireNivelBeforeContinue();
});
