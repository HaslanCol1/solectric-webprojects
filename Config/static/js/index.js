import { api } from "./utils/http.js";
import { AuthStore } from "./utils/storage.js";

function obtenerDatosDeBD(endpoint) {
  try {
    const respuesta = api.get(endpoint, null);
    console.log("✅ Datos recibidos:", respuesta);
    return respuesta;
  } catch (error) {
    console.error("❌ Error al obtener datos:", error);
    return null;
  }
}

async function listaReportes_localstorage() {
  try {
    const lista_reportes = await obtenerDatosDeBD("/reportes/publicos");
    
    if (!lista_reportes) return;

    localStorage.setItem("lista_reportes", JSON.stringify(lista_reportes));
    console.log("✅ Reportes guardados en localStorage");

    return lista_reportes;
  } catch (error) {
    console.error("❌ Error al guardar reportes en localStorage:", error);
  }
}

async function actualizarStats() {
  try {
    const dataLocal = localStorage.getItem("lista_reportes");

    if (!dataLocal) {
      console.warn("⚠ No hay datos en localStorage todavía");
      return;
    }

    const lista_reportes = JSON.parse(dataLocal);

    console.log("✅ Actualizando estadísticas con datos:", lista_reportes);


    /** ✅ 1. REPORTES ACTIVOS (estado = Pendiente) */
    const reportesActivos = lista_reportes.filter(r => r.estado === "Pendiente").length;
    document.getElementById("reportesActivos").innerText = reportesActivos;



    /** ✅ 2. TIEMPO PROMEDIO (desde ocurrido_en hasta ahora) */
    let totalMinutos = 0;

    lista_reportes.forEach(r => {
      const fecha = new Date(r.ocurrido_en);
      const ahora = new Date();
      const diff = (ahora - fecha) / (1000 * 60); // en minutos
      totalMinutos += diff;
    });

    const promedioMinutos = lista_reportes.length > 0 
      ? Math.round(totalMinutos / lista_reportes.length)
      : 0;

    document.getElementById("tiempoPromedio").innerText = promedioMinutos + " min";



    /** ✅ 3. SECTORES AFECTADOS (barrios únicos) */
    const barrios = new Set(lista_reportes.map(r => r.barrio));
    document.getElementById("sectoresAfectados").innerText = barrios.size;



    /** ✅ 4. RESULTADOS HOY (estado = Resuelto hoy) */
    const hoy = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    const resueltosHoy = lista_reportes.filter(r => {
      if (r.estado !== "Resuelto") return false;
      const fecha = new Date(r.ocurrido_en).toISOString().split("T")[0];
      return fecha === hoy;
    }).length;

    document.getElementById("resultadosHoy").innerText = resueltosHoy;

  } catch (error) {
    console.error("❌ Error al actualizar estadísticas:", error);
  }
}

listaReportes_localstorage().then(() => actualizarStats());
setInterval(listaReportes_localstorage, 50000); 
setInterval(actualizarStats, 10000);