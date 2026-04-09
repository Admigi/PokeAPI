import { SORT_FIELDS } from "@/constants/pokemon";
import { typeColors } from "@/constants/typeColors";

const ALL_TYPES = Object.keys(typeColors);

interface SidebarProps {
	selectedTypes: string[];
	typeMode: "any" | "all";
	setTypeMode: (mode: "any" | "all") => void;
	toggleType: (type: string) => void;
	sortField: string | null;
	setSortField: (field: string | undefined) => void;
	sortDir: string;
	setSortDir: (dir: string) => void;
	onReset: () => void;
}

export default function Sidebar({
	selectedTypes,
	typeMode,
	setTypeMode,
	toggleType,
	sortField,
	setSortField,
	sortDir,
	setSortDir,
	onReset,
}: SidebarProps) {
	const bothActive = selectedTypes.length > 0 && !!sortField;

	return (
		<aside className="w-64 flex-shrink-0 pt-[200px] md:pt-0">
			<div className="bg-white md:rounded-2xl shadow-sm border border-gray-100 p-5 min-h-full md:min-h-0 md:sticky md:top-24">
				{/* Header */}
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-sm font-black uppercase tracking-widest text-gray-800">
						Filters
					</h2>
					<button
						type="reset"
						onClick={onReset}
						className={`text-xs font-bold text-red-400 hover:text-red-600 transition-colors border-0 bg-transparent cursor-pointer ${!bothActive ? "invisible pointer-events-none" : ""}`}
					>
						Reset all
					</button>
				</div>

				{/* Type filter */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-3">
						<p className="text-xs font-bold uppercase tracking-widest text-gray-400">
							Type
						</p>
						<div className="flex bg-gray-100 rounded-full p-0.5">
							{(["any", "all"] as const).map((mode) => (
								<button
									type="button"
									key={mode}
									onClick={() => setTypeMode(mode)}
									className="text-xs font-bold px-2.5 py-0.5 rounded-full transition-all border-0 cursor-pointer"
									style={{
										backgroundColor:
											typeMode === mode ? "#1a1a2e" : "transparent",
										color: typeMode === mode ? "#fff" : "#888",
									}}
								>
									{mode === "any" ? "OR" : "AND"}
								</button>
							))}
						</div>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{ALL_TYPES.map((type) => {
							const colors = typeColors[type];
							const active = selectedTypes.includes(type);
							return (
								<button
									type="button"
									key={type}
									onClick={() => toggleType(type)}
									className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border-0 cursor-pointer"
									style={{
										backgroundColor: active ? colors.bg : colors.light,
										color: active ? "#fff" : colors.text,
										opacity: active ? 1 : 0.75,
									}}
								>
									{type}
								</button>
							);
						})}
					</div>
					<button
						type="reset"
						onClick={() => { for (const t of selectedTypes) toggleType(t); }}
						className={`w-full text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors pt-2 border-0 bg-transparent cursor-pointer ${selectedTypes.length === 0 ? "invisible pointer-events-none" : ""}`}
					>
						Clear types
					</button>
				</div>

				{/* Sort */}
				<div>
					<div className="flex items-center justify-between mb-3">
						<p className="text-xs font-bold uppercase tracking-widest text-gray-400">
							Sort by stat
						</p>
					</div>
					<div className="space-y-1.5">
						{SORT_FIELDS.map(({ label, value }) => (
							<button
								type="button"
								key={value}
								onClick={() => {
									if (sortField === value)
										setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
									else {
										setSortField(value);
										setSortDir("DESC");
									}
								}}
								className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border-0 cursor-pointer"
								style={{
									backgroundColor: sortField === value ? "#1a1a2e" : "#f7f8fc",
									color: sortField === value ? "#fff" : "#555",
								}}
							>
								<span>{label}</span>
								{sortField === value && (
									<span>{sortDir === "DESC" ? "↓" : "↑"}</span>
								)}
							</button>
						))}
					</div>
					<button
						type="reset"
						onClick={() => setSortField(undefined)}
						className={`w-full text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors pt-2 border-0 bg-transparent cursor-pointer ${!sortField ? "invisible pointer-events-none" : ""}`}
					>
						Clear sort
					</button>
				</div>
			</div>
		</aside>
	);
}
