export class AIService {
  async generateSummary(leads: any[]) {
    if (leads.length === 0) {
      return { message: "No hay leads suficientes para generar un análisis." };
    }

    // Simulamos un análisis inteligente basado en los datos reales recibidos
    const total = leads.length;
    const conPresupuesto = leads.filter((l) => (l.presupuesto || 0) > 0).length;

    // Lógica de simulación de IA
    return {
      analisis_general: `Se ha realizado un análisis sobre ${total} prospectos activos.`,
      fuente_principal: this.obtenerFuentePrincipal(leads),
      estadisticas: {
        con_presupuesto: conPresupuesto,
        sin_presupuesto: total - conPresupuesto,
      },
      recomendaciones:
        "Se recomienda priorizar los leads de Instagram que tienen un presupuesto asignado mayor a 500 USD.",
      texto_resumen: `Análisis Ejecutivo: El flujo de leads es constante. Se observa un interés mayoritario en servicios de consultoría digital.`,
    };
  }

  private obtenerFuentePrincipal(leads: any[]): string {
    const conteo: any = {};
    leads.forEach((l) => (conteo[l.fuente] = (conteo[l.fuente] || 0) + 1));
    return Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b,
    );
  }
}
