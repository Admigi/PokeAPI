import {
	createFileRoute,
	useNavigate,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import StatBar from "@/components/StatBar";
import { typeColors } from "@/constants/typeColors";
import { graphqlFetch } from "../../api/graphqlClient.ts";
import {
	GET_POKEMON_BY_ID,
	GET_POKEMON_COUNT,
	GET_STAT_MAX,
} from "../../api/queries.ts";

interface Pokemon {
	id: number;
	name: string;
	types: string[];
	imageUrl: string;
	stats: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};
}

export const Route = createFileRoute("/pokemon/$slug")({
	component: PokemonDetail,
});

function PokemonDetail() {
	const { slug } = useParams({ from: "/pokemon/$slug" });
	const [pokemon, setPokemon] = useState<Pokemon | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [statsMax, setStatsMax] = useState<Record<string, number>>({});
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const navigate = useNavigate();

	useEffect(() => {
		graphqlFetch(GET_STAT_MAX)
			.then((data) => setStatsMax(data.maxStats))
			.catch((err) => console.error("Failed to fetch max stats", err));
		graphqlFetch(GET_POKEMON_COUNT)
			.then((data) => setTotal(data.pokemons.total))
			.catch((err) => console.error("Failed to fetch total", err));
	}, []);

	useEffect(() => {
		setError(null);
		setLoading(true);
		graphqlFetch(GET_POKEMON_BY_ID, { id: Number(slug) })
			.then((data) => setPokemon(data.pokemon))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [slug]);

	if (error) return <p>Error: {error}</p>;
	if (!pokemon)
		return (
			<div className="h-screen bg-gray-50 flex items-center justify-center">
				<img
					src="/Spinner.svg"
					alt="Loading..."
					className="w-28 h-28 animate-spin"
					style={{ animationDuration: "1.2s" }}
				/>
			</div>
		);

	const id = pokemon.id;
	const primary = typeColors[pokemon.types[0]] || typeColors.Normal;
	const total_stats =
		pokemon.stats.hp +
		pokemon.stats.attack +
		pokemon.stats.defense +
		pokemon.stats.specialAttack +
		pokemon.stats.specialDefense +
		pokemon.stats.speed;

	const prevDisabled = loading || id <= 1;
	const nextDisabled = loading || (total > 0 && id >= total);

	return (
		<div className="min-h-screen bg-gray-50">
			<div
				className="relative overflow-hidden px-8 pt-8 pb-20"
				style={{
					background: `linear-gradient(160deg, ${primary.bg} 0%, ${primary.bg}CC 100%)`,
				}}
			>
				<div className="absolute -right-14 -top-14 w-72 h-72 rounded-full bg-white/10" />
				<div
					className="absolute right-20 top-20 w-36 h-36 rounded-full"
					style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
				/>
				<div className="max-w-2xl mx-auto">
					<button
						type="button"
						onClick={() => router.history.back()}
						className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-5 py-2 rounded-full mb-6 transition-colors border-0 cursor-pointer tracking-wide"
					>
						← Back to Pokédex
					</button>
					<div className="flex flex-col-reverse sm:flex-row sm:items-end sm:justify-between gap-4">
						<div>
							<p className="text-white/70 text-sm font-bold tracking-widest mb-1 uppercase">
								#{String(pokemon.id).padStart(3, "0")}
							</p>
							<h1 className="text-5xl font-black text-white mb-4 tracking-wide">
								{pokemon.name}
							</h1>
							<div className="flex gap-2">
								{pokemon.types.map((t) => (
									<span
										key={t}
										className="text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest"
										style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
									>
										{t}
									</span>
								))}
							</div>
						</div>
						<img
							src={pokemon.imageUrl}
							alt={pokemon.name}
							className="w-32 h-32 sm:w-44 sm:h-44 object-contain relative z-10 self-center sm:self-auto"
							style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.25))" }}
						/>
					</div>
				</div>
			</div>
			<div className="max-w-2xl mx-auto mx-6 -mt-10 bg-white rounded-3xl shadow-xl p-7 relative z-10">
				<h2
					className="text-lg font-black mb-6 pb-3 tracking-wide border-b-2"
					style={{ color: "#1a1a2e", borderColor: primary.light }}
				>
					Base Stats
				</h2>
				<StatBar label="HP" value={pokemon.stats.hp} max={statsMax.hp} />
				<StatBar label="Attack" value={pokemon.stats.attack} max={statsMax.attack} />
				<StatBar label="Defense" value={pokemon.stats.defense} max={statsMax.defense} />
				<StatBar label="Sp. Atk" value={pokemon.stats.specialAttack} max={statsMax.specialAttack} />
				<StatBar label="Sp. Def" value={pokemon.stats.specialDefense} max={statsMax.specialDefense} />
				<StatBar label="Speed" value={pokemon.stats.speed} max={statsMax.speed} />
				<div className="flex justify-between items-center mt-5 pt-4 border-t-2 border-gray-100">
					<span className="text-xs font-bold uppercase tracking-widest text-gray-400">
						Total
					</span>
					<span className="text-2xl font-black" style={{ color: primary.text }}>
						{total_stats}
					</span>
				</div>

				{/* Navigation */}
				<div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-100">
					<button
						type="button"
						onClick={() =>
							navigate({
								to: "/pokemon/$slug",
								params: { slug: String(id - 1) },
								replace: true,
							})
						}
						disabled={prevDisabled}
						className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all border-0 cursor-pointer"
						style={{
							backgroundColor: prevDisabled ? "#f3f4f6" : "#1a1a2e",
							color: prevDisabled ? "#9ca3af" : "#fff",
							cursor: prevDisabled ? "default" : "pointer",
						}}
					>
						← Previous
					</button>
					<span className="text-xs font-bold text-gray-300 tracking-widest">
						{String(id).padStart(3, "0")} / {String(total).padStart(3, "0")}
					</span>
					<button
						type="button"
						onClick={() =>
							navigate({
								to: "/pokemon/$slug",
								params: { slug: String(id + 1) },
								replace: true,
							})
						}
						disabled={nextDisabled}
						className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all border-0 cursor-pointer"
						style={{
							backgroundColor: nextDisabled ? "#f3f4f6" : "#1a1a2e",
							color: nextDisabled ? "#9ca3af" : "#fff",
							cursor: nextDisabled ? "default" : "pointer",
						}}
					>
						Next →
					</button>
				</div>
			</div>
		</div>
	);
}
