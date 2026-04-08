import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Sidebar from "./Sidebar";

const defaultProps = {
	selectedTypes: [],
	typeMode: "any" as const,
	setTypeMode: vi.fn(),
	toggleType: vi.fn(),
	sortField: null,
	setSortField: vi.fn(),
	sortDir: "DESC",
	setSortDir: vi.fn(),
	onReset: vi.fn(),
};

describe("Sidebar", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("does not show Reset all when no filters are active", () => {
		render(<Sidebar {...defaultProps} />);
		expect(screen.queryByText("Reset all")).toBeNull();
	});

	it("shows Reset all when a type is selected", () => {
		render(<Sidebar {...defaultProps} selectedTypes={["Fire"]} />);
		expect(screen.getByText("Reset all")).toBeDefined();
	});

	it("shows Reset all when a sort is active", () => {
		render(<Sidebar {...defaultProps} sortField="HP" />);
		expect(screen.getByText("Reset all")).toBeDefined();
	});

	it("calls onReset when Reset all is clicked", () => {
		render(<Sidebar {...defaultProps} selectedTypes={["Fire"]} />);
		fireEvent.click(screen.getByText("Reset all"));
		expect(defaultProps.onReset).toHaveBeenCalledOnce();
	});

	it("calls toggleType with the correct type when a type button is clicked", () => {
		render(<Sidebar {...defaultProps} />);
		fireEvent.click(screen.getByText("Fire"));
		expect(defaultProps.toggleType).toHaveBeenCalledWith("Fire");
	});

	it("calls setTypeMode when switching between OR and AND", () => {
		render(<Sidebar {...defaultProps} />);
		fireEvent.click(screen.getByText("AND"));
		expect(defaultProps.setTypeMode).toHaveBeenCalledWith("all");
	});

	it("calls setSortField when clicking an inactive sort field", () => {
		render(<Sidebar {...defaultProps} />);
		fireEvent.click(screen.getByText("HP"));
		expect(defaultProps.setSortField).toHaveBeenCalledWith("HP");
		expect(defaultProps.setSortDir).toHaveBeenCalledWith("DESC");
	});

	it("toggles sort direction when clicking the already active sort field", () => {
		render(<Sidebar {...defaultProps} sortField="HP" sortDir="DESC" />);
		fireEvent.click(screen.getByText("HP"));
		expect(defaultProps.setSortDir).toHaveBeenCalledWith("ASC");
		expect(defaultProps.setSortField).not.toHaveBeenCalled();
	});

	it("shows the direction arrow on the active sort field", () => {
		render(<Sidebar {...defaultProps} sortField="HP" sortDir="DESC" />);
		expect(screen.getByText("↓")).toBeDefined();
	});

	it("shows Clear sort button when a sort is active and calls setSortField(undefined) on click", () => {
		render(<Sidebar {...defaultProps} sortField="HP" />);
		const clearBtn = screen.getByText("Clear sort");
		expect(clearBtn).toBeDefined();
		fireEvent.click(clearBtn);
		expect(defaultProps.setSortField).toHaveBeenCalledWith(undefined);
	});
});
