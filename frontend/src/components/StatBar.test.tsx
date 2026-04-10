import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StatBar from "./StatBar";

describe("StatBar", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders the label and value", () => {
		render(<StatBar label="HP" value={45} max={255} />);
		expect(screen.getByText("HP")).toBeDefined();
		expect(screen.getByText("45")).toBeDefined();
	});

	it("bar starts at 0% before animation fires", () => {
		const { container } = render(<StatBar label="HP" value={45} max={255} />);
		const bar = container.querySelector(".h-full") as HTMLElement;
		expect(bar.style.width).toBe("0%");
	});

	it("bar animates to the correct percentage after 100ms", () => {
		const { container } = render(<StatBar label="HP" value={45} max={255} />);
		const bar = container.querySelector(".h-full") as HTMLElement;

		act(() => {
			vi.advanceTimersByTime(100);
		});

		// Math.round(45 / 255 * 100) = 18
		expect(bar.style.width).toBe("18%");
	});

	it("transitions directly to the new percentage when value changes", () => {
		const { container, rerender } = render(
			<StatBar label="HP" value={45} max={255} />,
		);
		const bar = container.querySelector(".h-full") as HTMLElement;

		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(bar.style.width).toBe("18%");

		rerender(<StatBar label="HP" value={100} max={255} />);
		// Math.round(100 / 255 * 100) = 39 — no reset to 0
		expect(bar.style.width).toBe("39%");
	});
});
