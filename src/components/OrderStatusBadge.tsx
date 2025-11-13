type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export const OrderStatusBadge = ({
  status,
  large = false,
}: {
  status: OrderStatus;
  large?: boolean;
}) => {
  const statusMap: Record<OrderStatus, { color: string; label: string }> = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    PROCESSING: { color: "bg-blue-100 text-blue-800", label: "Processing" },
    COMPLETED: { color: "bg-green-100 text-green-800", label: "Completed" },
    CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled" },
  };

  const badgeStyle = `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
    statusMap[status].color
  } ${large ? "text-sm px-4 py-1.5" : ""}`;

  return <span className={badgeStyle}>{statusMap[status].label}</span>;
};
