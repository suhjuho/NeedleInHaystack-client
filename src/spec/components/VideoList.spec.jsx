import { describe, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VideoList from "../../components/VideoList";

const queryClient = new QueryClient();

const mocks = {
  navigate: vi.fn(),
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

describe("Video List components", () => {
  it("render Video List Component", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <VideoList />
      </QueryClientProvider>,
    );
  });
});
