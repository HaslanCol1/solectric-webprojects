import { Storage } from "./utils/storage.js";

const GRID_ID = "tiposFallaGrid";

function emojiTipoFromName(nombre) {
    const n = (nombre || "").toLowerCase();
    if (n.includes("corte")) return "⚡";           // Corte Total de Energía
    if (n.includes("volt")) return "📊";            // Fluctuaciones de Voltaje
    if (n.includes("transform")) return "🔧";       // Transformador Dañado
    if (n.includes("cable")) return "⚠️";           // Cables Caídos
    if (n.includes("alumbr")) return "💡";          // Alumbrado Público
    if (n.includes("medidor")) return "📟";         // Problema con Medidor
    return "🔌";                                     // Genérico
}

function readCatalogo() {
    const viaWrapper = (typeof Storage !== "undefined")
        ? Storage.get("catalogo_reportes")
        : null;

    if (viaWrapper) return viaWrapper;
    try {
        const raw =
            localStorage.getItem("solectric:catalogo_reportes") ||
            localStorage.getItem("catalogo_reportes");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function renderTiposReporte() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    const catalogo = readCatalogo();
    const tipos = catalogo?.tipos_reporte ?? [];

    if (!tipos.length) {
        grid.innerHTML = `<div style="padding:8px;color:#666;font-size:14px;">
      No hay tipos de falla disponibles.
    </div>`;
        return;
    }

    grid.innerHTML = "";

        tipos.forEach((t) => {
        const item = document.createElement("div");
        item.className = "failure-option";
        item.dataset.id = t.id;
        item.dataset.code = t.codigo;

        item.innerHTML = `
      <div class="failure-header">
                <span class="failure-emoji">${emojiTipoFromName(t.nombre)}</span>
        <div class="failure-title">${t.nombre}</div>
      </div>
      <div class="failure-desc">${t.descripcion ?? ""}</div>
    `;

        grid.appendChild(item);
    });
}

function wireSelection() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;

    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".failure-option");
        if (!card) return;

        grid.querySelectorAll(".failure-option.selected")
            .forEach((el) => el.classList.remove("selected"));
        card.classList.add("selected");

        const selected = {
            id: card.dataset.idTipo,
            nombre: card.dataset.nombreTipo,
        };
        localStorage.setItem("solectric:reporte.tipo", JSON.stringify(selected));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderTiposReporte();
    wireSelection();
});
