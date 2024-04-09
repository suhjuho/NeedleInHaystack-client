import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ResultPage from "../../components/ResultPage";

const queryClient = new QueryClient();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useLocation: () => ({
      search: "/results?search_query=javascript",
    }),
  };
});

describe("render Loading components", () => {
  it("Result Page Component", async () => {
    const route = "/results?search_query=javascript";

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <ResultPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Needle In Haystack")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});
