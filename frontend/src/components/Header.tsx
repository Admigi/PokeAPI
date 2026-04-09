import { useNavigate, useSearch } from "@tanstack/react-router";

export default function Header() {
	const navigate = useNavigate({ from: "/" });
	const { search } = useSearch({ strict: false });

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		navigate({
			search: (prev) => ({ ...prev, search: e.target.value, page: 1 }),
		});
	};

	return (
		<header>
			<div className="bg-[#1a1a2e] px-8 pt-7 pb-5 sticky top-0 z-[60]">
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center gap-3 mb-4">
						<img src="Logo.png" alt="Logo" className="w-24 h-24" />
						<h1 className="text-white text-2xl font-black tracking-[0.2em]">
							POKE-API
						</h1>
					</div>
					<input
						placeholder="Search by name or ID..."
						value={search ?? ""}
						onChange={handleSearch}
						className="w-full px-5 py-3 rounded-full bg-white/10 text-white placeholder-white/50 text-sm font-semibold tracking-wide outline-none border-0 focus:bg-white/15 transition-colors"
					/>
				</div>
			</div>
		</header>
	);
}
