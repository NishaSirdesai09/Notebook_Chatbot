import { Icon, type IconName } from "@/components/icons";
import { Card } from "@/components/ui/primitives";

export function StatCard({
  icon,
  label,
  value,
  delta,
  tone = "brand",
}: {
  icon: IconName;
  label: string;
  value: string | number;
  delta?: string;
  tone?: "brand" | "teal" | "purple" | "amber";
}) {
  const IconCmp = Icon[icon];
  const toneClass = {
    brand: "bg-brand-50 text-brand-600",
    teal: "bg-teal-50 text-teal-600",
    purple: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  }[tone];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}>
          <IconCmp className="h-5 w-5" />
        </span>
        {delta && (
          <span className="text-xs font-medium text-emerald-600">{delta}</span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-sm text-ink-500">{label}</p>
    </Card>
  );
}
