import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../components/Header";
import {
  useHeaderStateStore,
  useUserInputStore,
  useUserStore,
} from "../../store/store";

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

const userInitialState = useUserStore.getState();
const headerInitialState = useHeaderStateStore.getState();
const userInputInitialState = useUserInputStore.getState();

describe("render Header components", () => {
  beforeEach(() => {
    useUserStore.setState(userInitialState);
    useHeaderStateStore.setState(headerInitialState);
    useUserInputStore.setState(userInputInitialState);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("check state on different headerState", async () => {
    const { setHeaderState } = useHeaderStateStore.getState();

    act(() => {
      setHeaderState("DetailPage");
    });

    expect(screen.getByText("Sign in")).toBeInTheDocument();

    act(() => {
      setHeaderState("DetailPage");
    });

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Needle In Haystack")).toBeInTheDocument();
  });

  it("click profile", async () => {
    const { setIsLoggedIn } = useUserStore.getState();

    expect(screen.getByText("Sign in")).toBeInTheDocument();

    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    act(() => {
      setIsLoggedIn(true);
    });

    const loginButton = container.querySelector(".toggle-button");

    fireEvent.click(loginButton);

    expect(screen.getByText("Crawler")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
});
