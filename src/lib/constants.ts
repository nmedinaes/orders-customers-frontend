/**
 * Estados de pedido
 */
export const STATUS_LABELS_ES: Record<string, string> = {
  pending: "Pendiente",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export function getStatusLabel(status: string): string {
  return STATUS_LABELS_ES[status] ?? status;
}
