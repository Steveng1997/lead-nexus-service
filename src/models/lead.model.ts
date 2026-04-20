export interface Lead {
  id?: string;
  nombre: string;
  email: string;
  fuente: string;
  producto_interes: string;
  presupuesto?: number;
  telefono?: string;
  created_at?: Date;
  updated_at?: Date;
}
