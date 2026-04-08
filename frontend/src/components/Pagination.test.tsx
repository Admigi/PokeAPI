import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Pagination from "./Pagination";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => mockNavigate,
}));

describe("Pagination", () => {
	beforeEach(() => {
		mockNavigate.mockClear();
	});

	it("renders nothing when there is only one page", () => {
		const { container } = render(
			<Pagination currentPage={1} totalPages={1} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renders prev, page buttons, and next", () => {
		render(<Pagination currentPage={2} totalPages={3} />);
		// prev + 3 pages + next = 5 buttons
		expect(screen.getAllByRole("button")).toHaveLength(5);
	});

	it("disables the previous button on the first page", () => {
		render(<Pagination currentPage={1} totalPages={3} />);
		const prev = screen.getByText("‹") as HTMLButtonElement;
		expect(prev.disabled).toBe(true);
	});

	it("disables the next button on the last page", () => {
		render(<Pagination currentPage={3} totalPages={3} />);
		const next = screen.getByText("›") as HTMLButtonElement;
		expect(next.disabled).toBe(true);
	});

	it("calls navigate when a page button is clicked", () => {
		render(<Pagination currentPage={1} totalPages={3} />);
		fireEvent.click(screen.getByText("2"));
		expect(mockNavigate).toHaveBeenCalledWith(
			expect.objectContaining({ search: expect.any(Function) }),
		);
	});

	it("does not call navigate when disabled", () => {
		render(<Pagination currentPage={1} totalPages={3} disabled />);
		fireEvent.click(screen.getByText("2"));
		expect(mockNavigate).not.toHaveBeenCalled();
	});
});
