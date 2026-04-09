import { Link } from "@tanstack/react-router";
import { SORT_FIELDS, STAT_KEY_MAP } from "@/constants/pokemon";
import { typeColors } from "@/constants/typeColors";

interface PokemonCardProps {
	p: {
		id: number;
		name: string;
		types: string[];
		imageUrl: string;
		stats: Record<string, number>;
	};
	activeStat: string | undefined;
	statMax: number;
}

const TypeBadge = ({ type }: { type: string }) => {
	const colors = typeColors[type] || typeColors.Normal;
	return (
		<span
			className="px-2 sm:px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest text-white"
			style={{ backgroundColor: colors.bg }}
		>
			{type}
		</span>
	);
};

export default function PokemonCard({
	p,
	activeStat,
	statMax,
}: PokemonCardProps) {
	const primary = typeColors[p.types[0]] || typeColors.Normal;
	const statValue = activeStat ? p.stats?.[STAT_KEY_MAP[activeStat]] : null;
	const statPct =
		statValue && statMax ? Math.round((statValue / statMax) * 100) : 0;
	const barColor =
		statPct > 65 ? "#4CAF50" : statPct > 40 ? "#FF9800" : "#F44336";
	const statLabel = SORT_FIELDS.find((f) => f.value === activeStat)?.label;

	return (
		<Link to="/pokemon/$slug" params={{ slug: String(p.id) }}>
			<div className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm hover:-translate-y-1.5 hover:shadow-xl transition-all duration-200">
				<div
					className="relative flex items-center justify-center pt-5 pb-3 min-h-[140px]"
					style={{ backgroundColor: primary.light }}
				>
					<div
						className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full"
						style={{ backgroundColor: `${primary.bg}22` }}
					/>
					<div
						className="absolute -left-3 -top-3 w-14 h-14 rounded-full"
						style={{ backgroundColor: `${primary.bg}15` }}
					/>
					<span
						className="absolute top-3 left-3 text-xs font-extrabold tracking-wide opacity-60"
						style={{ color: primary.text }}
					>
						#{String(p.id).padStart(3, "0")}
					</span>
					<img
						src={p.imageUrl}
						alt={p.name}
						className="w-24 h-24 object-contain relative z-10 drop-shadow-lg"
					/>
				</div>

				<div className="px-4 pt-3 pb-3">
					<p className="text-base font-extrabold text-gray-900 mb-2 tracking-wide">
						{p.name}
					</p>
					<div className="flex flex-wrap gap-1.5 mb-3">
						{p.types.map((t) => (
							<TypeBadge key={t} type={t} />
						))}
					</div>

					{/* Reserved space for stat bar */}
					<div className="h-4">
						{activeStat && statValue !== null && (
							<div className="flex items-center gap-2">
								<span className="text-xs font-bold text-gray-400 w-12 shrink-0">
									{statLabel}
								</span>
								<div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
									<div
										className="h-full rounded-full"
										style={{ width: `${statPct}%`, backgroundColor: barColor }}
									/>
								</div>
								<span className="text-xs font-black text-gray-600 w-6 text-right">
									{statValue}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}
