export type OrderStatus = "PLACED" | "PROCESSING" | "COMPLETED";

export const OrderTimeline = ({ 
  status,
  createdAt,
  estimatedDeliveryDate
}: {
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryDate: string;
}) => {
  const steps = [
    {
      name: "Order Placed",
      status: "complete",
      date: new Date(createdAt),
    },
    {
      name: "Processing",
      status: ["PROCESSING", "COMPLETED"].includes(status) ? "complete" : "current",
    },
    {
      name: "Shipped",
      status: status === "COMPLETED" ? "complete" : "upcoming",
    },
    {
      name: "Delivered",
      status: "upcoming",
      date: new Date(estimatedDeliveryDate),
    },
  ];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Order Status</h2>
      <div className="flow-root">
        <ul className="-mb-8">
          {steps.map((step, stepIdx) => (
            <li key={stepIdx}>
              <div className="relative pb-8">
                {stepIdx !== steps.length - 1 && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        step.status === "complete"
                          ? "bg-green-500"
                          : step.status === "current"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {step.status === "complete" ? (
                        <CheckIcon className="h-5 w-5 text-white" />
                      ) : step.status === "current" ? (
                        <ArrowPathIcon className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-800">
                        {step.name}{" "}
                        {step.status === "current" && (
                          <span className="font-medium text-blue-600">(In Progress)</span>
                        )}
                      </p>
                      {"date" in step && step.date && (
                        <p className="text-sm text-gray-500">
                          {step.date.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowPathIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);
