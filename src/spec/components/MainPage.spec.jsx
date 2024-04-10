import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MainPage from "../../components/MainPage";

vi.mock("../../components/Header", () => ({
  __esModule: true,
  default: () => <div>Header Mock</div>,
}));

vi.mock("../../components/SearchInput", () => ({
  __esModule: true,
  default: () => <div>SearchInput Mock</div>,
}));

vi.mock("../../store/store", () => ({
  useHeaderStateStore: () => ({
    setHeaderState: vi.fn(),
  }),
}));

describe("MainPage Component", () => {
  it("Should render correctly", () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Header Mock")).toBeInTheDocument();
    expect(screen.getByText("SearchInput Mock")).toBeInTheDocument();
    expect(screen.getByText("Needle In Haystack")).toBeInTheDocument();
    expect(
      screen.getByText("Search the video using Haystack!"),
    ).toBeInTheDocument();
  });
});
