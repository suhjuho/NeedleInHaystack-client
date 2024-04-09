import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ErrorPage from "../../components/ErrorPage";

describe("Error Page", () => {
  it("render Error Page", () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Go Back To Main Page")).toBeInTheDocument();
  });
});
