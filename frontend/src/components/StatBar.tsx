import { useEffect, useState } from "react";

interface StatBarProps {
	label: string;
	value: number;
	max?: number;
}

export default function StatBar({ label, value, max = 160 }: StatBarProps) {
	const [animated, setAnimated] = useState(false);
	const pct = Math.round((value / max) * 100);
	const barColor = pct > 65 ? "#4CAF50" : pct > 40 ? "#FF9800" : "#F44336";

	// biome-ignore lint/correctness/useExhaustiveDependencies: value is intentionally used as an animation trigger
	useEffect(() => {
		setAnimated(false);
		const timer = setTimeout(() => setAnimated(true), 100);
		return () => clearTimeout(timer);
	}, [value]);

	return (
		<div className="mb-3">
			<div className="flex justify-between mb-1">
				<span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
					{label}
				</span>
				<span className="text-sm font-extrabold text-gray-800">{value}</span>
			</div>
			<div className="bg-gray-100 rounded-full h-2 overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-700"
					style={{
						width: animated ? `${pct}%` : "0%",
						backgroundColor: barColor,
					}}
				/>
			</div>
		</div>
	);
}
