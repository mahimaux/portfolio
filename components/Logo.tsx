import { brand } from "@/lib/content";
import { Waves } from "./Icons";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-lime py-1 pl-3 pr-2.5 text-forest shadow-[0_3px_0_var(--ink)] ${className}`}>
      <span className="display text-[22px] leading-none tracking-[0.01em]">{brand.name}</span>
      <Waves size={16} className="text-tomato" />
    </span>
  );
}
