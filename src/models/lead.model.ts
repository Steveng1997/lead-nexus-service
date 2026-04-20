/**
 * Interface que define la estructura de un Lead según los requerimientos técnicos.
 */
export interface Lead {
  id?: string;
  nombre: string;
  email: string;
  fuente: string;
  producto_interes: string;
  presupuesto?: number;
  telefono?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
