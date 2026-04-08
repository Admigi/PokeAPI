import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PokemonCard from "./PokemonCard";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, ...props }: { children: React.ReactNode }) => (
		<a {...props}>{children}</a>
	),
}));

const mockPokemon = {
	id: 1,
	name: "Bulbasaur",
	types: ["Grass", "Poison"],
	imageUrl: "https://example.com/bulbasaur.png",
	stats: {
		hp: 45,
		attack: 49,
		defense: 49,
		specialAttack: 65,
		specialDefense: 65,
		speed: 45,
	},
};

describe("PokemonCard", () => {
	it("renders the pokemon name and formatted id", () => {
		render(<PokemonCard p={mockPokemon} activeStat={undefined} statMax={1} />);
		expect(screen.getByText("Bulbasaur")).toBeDefined();
		expect(screen.getByText("#001")).toBeDefined();
	});

	it("renders all type badges", () => {
		render(<PokemonCard p={mockPokemon} activeStat={undefined} statMax={1} />);
		expect(screen.getByText("Grass")).toBeDefined();
		expect(screen.getByText("Poison")).toBeDefined();
	});

	it("does not show the stat bar when no sort is active", () => {
		const { container } = render(
			<PokemonCard p={mockPokemon} activeStat={undefined} statMax={255} />,
		);
		expect(container.querySelector(".flex.items-center.gap-2")).toBeNull();
	});

	it("shows the stat bar with correct label and value when a sort is active", () => {
		render(<PokemonCard p={mockPokemon} activeStat="HP" statMax={255} />);
		expect(screen.getByText("HP")).toBeDefined();
		expect(screen.getByText("45")).toBeDefined();
	});

	it("shows the correct stat value for each sort field", () => {
		const { rerender } = render(
			<PokemonCard p={mockPokemon} activeStat="ATTACK" statMax={255} />,
		);
		expect(screen.getByText("49")).toBeDefined();

		rerender(<PokemonCard p={mockPokemon} activeStat="SPEED" statMax={255} />);
		expect(screen.getByText("45")).toBeDefined();
	});
});
