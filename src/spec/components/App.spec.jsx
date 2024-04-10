import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../components/App";

vi.mock("../../components/MainPage", () => ({
  __esModule: true,
  default: () => <div>MainPage Mock</div>,
}));

vi.mock("../../components/ErrorPage", () => ({
  __esModule: true,
  default: () => <div>ErrorPage Mock</div>,
}));

vi.mock("../../components/ResultPage", () => ({
  __esModule: true,
  default: () => <div>ResultPage Mock</div>,
}));

vi.mock("../../components/VideoDetailPage", () => ({
  __esModule: true,
  default: () => <div>VideoDetailPage Mock</div>,
}));

vi.mock("../../components/AdminPage", () => ({
  __esModule: true,
  default: () => <div>AdminPage Mock</div>,
}));

describe("App Component Routing", () => {
  it("renders MainPage for the root route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("MainPage Mock")).toBeInTheDocument();
  });

  it('renders ResultPage for "/results" route', () => {
    render(
      <MemoryRouter initialEntries={["/results"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("ResultPage Mock")).toBeInTheDocument();
  });

  it('renders VideoDetailPage for "/watch" route', () => {
    render(
      <MemoryRouter initialEntries={["/watch"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("VideoDetailPage Mock")).toBeInTheDocument();
  });

  it('renders AdminPage for "/admin" route', () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("AdminPage Mock")).toBeInTheDocument();
  });

  it("renders ErrorPage for an unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/some/unknown/route"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("ErrorPage Mock")).toBeInTheDocument();
  });
});
