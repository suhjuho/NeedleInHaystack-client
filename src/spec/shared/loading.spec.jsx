import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Loading,
  LoadingSpin,
  CustomLoading,
} from "../../components/shared/Loading";

describe("render Loading components", () => {
  it("Loading Component", () => {
    render(<Loading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    const { container } = render(<Loading />);

    expect(container.firstChild).toHaveClass("fixed");
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("justify-center");
    expect(container.firstChild).toHaveClass("items-center");
  });

  it("LoadingSpin component ", () => {
    const { container } = render(<LoadingSpin />);

    const spinner = container.querySelector(".animate-spin");
    const reverseSpinner = container.querySelector(".animate-spin-reverse");

    expect(spinner).toBeInTheDocument();
    expect(reverseSpinner).toBeInTheDocument();
  });

  it("CustomLoading component ", () => {
    const customText = "this is custom text";
    render(<CustomLoading text={customText} />);

    expect(screen.getByText(customText)).toBeInTheDocument();
  });
});
