import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../components/App";

global.EventSource = vi.fn(() => ({
  onmessage: vi.fn(),
  onerror: vi.fn(),
  close: vi.fn(),
}));

describe("App Routing", () => {
  it("renders AdminPage when navigating to /admin", async () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Web Crawler")).toBeInTheDocument();
  });
});
