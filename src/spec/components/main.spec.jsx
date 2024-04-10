import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../../components/App";

vi.mock("./components/App", () => ({
    __esModule: true,
    default: vi.fn(() => <div>Mocked App Component</div>),
  }));

const queryClient = new QueryClient();

describe("App Component", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Needle In Haystack")).toBeInTheDocument();
    expect(
      screen.getByText("Search the video using Haystack!"),
    ).toBeInTheDocument();
  });
});
