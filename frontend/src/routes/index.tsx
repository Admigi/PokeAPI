import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import PokemonCard from "@/components/PokemonCard";
import Sidebar from "@/components/Sidebar";
import SkeletonCard from "@/components/SkeletonCard";
import { STAT_KEY_MAP } from "@/constants/pokemon";
import { graphqlFetch } from "../api/graphqlClient.ts";
import { GET_ALL_POKEMONS, GET_STAT_MAX } from "../api/queries.ts";

interface Pokemon {
	id: number;
	name: string;
	types: string[];
	imageUrl: string;
	stats: Record<string, number>;
}

export const Route = createFileRoute("/")({
	validateSearch: (search) => ({
		search: (search.search as string) || undefined,
		page: (search.page as number) || 1,
		typesAny: (search.typesAny as string[]) || undefined,
		typeMode: (search.typeMode as "any" | "all") || "any",
		sortField: (search.sortField as string) || undefined,
		sortDir: (search.sortDir as string) || undefined,
	}),
	component: PokemonGrid,
});

const PAGE_SIZE = 35;

const getStatMax = (
	sortField: string | undefined,
	statsMax: Record<string, number>,
) => {
	if (!sortField) return 1;
	const key = STAT_KEY_MAP[sortField];
	return statsMax[key] ?? 1;
};

export default function PokemonGrid() {
	const { search, page, typesAny, typeMode, sortField, sortDir } = useSearch({
		strict: false,
	});
	const navigate = useNavigate({ from: "/" });
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [statsMax, setStatsMax] = useState<Record<string, number>>({});
	const [displayedSortField, setDisplayedSortField] = useState<string | undefined>(undefined);

	const currentPage = page ?? 1;

	const setTypeMode = (mode: "any" | "all") => {
		navigate({ search: (prev) => ({ ...prev, typeMode: mode }) });
	};

	useEffect(() => {
		graphqlFetch(GET_STAT_MAX)
			.then((data) => setStatsMax(data.maxStats))
			.catch((err) => console.error("Failed to fetch max stats", err));
	}, []);

	const statMax = getStatMax(displayedSortField, statsMax);

	const toggleType = (type: string) => {
		const current = typesAny ?? [];
		const updated = current.includes(type)
			? current.filter((t) => t !== type)
			: [...current, type];
		navigate({ search: (prev) => ({ ...prev, typesAny: updated, page: 1 }) });
	};

	const setSortField = (field: string | undefined) => {
		navigate({ search: (prev) => ({ ...prev, sortField: field, page: 1 }) });
	};

	const setSortDir = (dir: string) => {
		navigate({ search: (prev) => ({ ...prev, sortDir: dir }) });
	};

	const onReset = () => {
		navigate({
			search: () => ({
				page: 1,
				search: undefined,
				typesAny: [] as string[],
				typeMode: "any" as const,
				sortField: undefined,
				sortDir: undefined,
			}),
		});
	};

	useEffect(() => {
		const searchAsNumber =
			search && !Number.isNaN(Number(search)) ? Number(search) : null;

		const filter: Record<string, unknown> = {};
		if (search) {
			if (searchAsNumber !== null) filter.id = searchAsNumber;
			else filter.name = search;
		}
		if (typesAny && typesAny.length > 0) {
			if (typeMode === "any") filter.typesAny = typesAny;
			else filter.typesAll = typesAny;
		}

		setLoading(true);
		setError(null);
		graphqlFetch(GET_ALL_POKEMONS, {
			filter: Object.keys(filter).length > 0 ? filter : null,
			sort: sortField
				? { field: sortField, direction: sortDir ?? "DESC" }
				: null,
			limit: PAGE_SIZE,
			offset: (currentPage - 1) * PAGE_SIZE,
		})
			.then((data) => {
				setPokemons(data.pokemons.items);
				setTotal(data.pokemons.total);
				setDisplayedSortField(sortField);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [search, typesAny, sortField, sortDir, typeMode, currentPage]);

	const totalPages = Math.ceil(total / PAGE_SIZE);

	if (error) return <p>Error: {error}</p>;

	return (
		<div className="max-w-6xl mx-auto px-5 py-8 flex gap-6">
			{sidebarOpen && (
				<Sidebar
					selectedTypes={typesAny ?? []}
					typeMode={typeMode ?? "any"}
					setTypeMode={setTypeMode}
					toggleType={toggleType}
					sortField={sortField ?? null}
					setSortField={setSortField}
					sortDir={sortDir ?? "DESC"}
					setSortDir={setSortDir}
					onReset={onReset}
				/>
			)}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between mb-5">
					<p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
						{loading ? "Loading..." : `${total} Pokemon found`}
					</p>
					<button
						type="button"
						onClick={() => setSidebarOpen((o) => !o)}
						className="text-xs font-bold px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors w-28 text-center"
					>
						{sidebarOpen ? "Hide filters" : "Show filters"}
					</button>
				</div>
				<div
					className="grid gap-5"
					style={{
						gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
					}}
				>
					{loading && pokemons.length === 0
						? Array.from({ length: PAGE_SIZE }, (_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: skeleton cards are stateless placeholders
								<SkeletonCard key={i} />
							))
						: pokemons.map((p) => (
								<PokemonCard
									key={p.id}
									p={p}
									activeStat={displayedSortField}
									statMax={statMax}
								/>
							))}
				</div>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					disabled={loading}
				/>
			</div>
		</div>
	);
}
