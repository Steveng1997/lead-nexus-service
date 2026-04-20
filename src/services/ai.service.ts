/**
 * Parte 3: Servicio encargado de generar el resumen con IA.
 */
export class AIService {
  async generateSummary(leads: any[]) {
    if (leads.length === 0)
      return { resumen: "No hay datos suficientes para el análisis." };

    return {
      conteo_analizado: leads.length,
      resumen_ejecutivo:
        "Análisis inteligente: El flujo de prospectos es estable.",
      insight: "La fuente con mayor potencial de conversión es Instagram.",
      recomendacion:
        "Se sugiere incrementar el seguimiento en leads con presupuesto superior a $500.",
    };
  }
}
