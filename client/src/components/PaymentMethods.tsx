export default function PaymentMethods() {
  const methods = [
    { name: "Whish", bg: "bg-[#0057FF]/15", text: "text-[#8DB1FF]", dot: "bg-[#0057FF]" },
    { name: "OMT", bg: "bg-[#FFD400]/15", text: "text-[#FFE27A]", dot: "bg-[#FFD400]" },
    { name: "USDT", bg: "bg-[#26A17B]/15", text: "text-[#7ED9BE]", dot: "bg-[#26A17B]" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-400">Accepted local payment methods</p>
      <div className="grid grid-cols-3 gap-2">
        {methods.map((method) => (
          <div
            key={method.name}
            className={`flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-semibold ${method.bg} ${method.text}`}
          >
            <span className={`h-2 w-2 rounded-full ${method.dot}`} />
            <span>{method.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
