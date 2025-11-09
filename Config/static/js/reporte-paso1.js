import { Storage } from "./utils/storage.js";

const GRID_ID = "tiposFallaGrid";
const EMOJI = "⚡";

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
        <span class="failure-emoji">${EMOJI}</span>
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
            id: card.dataset.id,
            codigo: card.dataset.code,
            nombre: card.querySelector(".failure-title")?.textContent || "",
        };
        localStorage.setItem("solectric:reporte.tipo", JSON.stringify(selected));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderTiposReporte();
    wireSelection();
});
