import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import VideoDetailPage from "../../components/VideoDetailPage";

const queryClient = new QueryClient();

const mockVideo = {
  youtubeVideoId: "mockID",
  title: "mock title",
  description: "mock description",
  channel: "mock channel",
  transcript: "mock transcript",
  transcripts: ["mock scripts1", "mock scripts2"],
  transcriptTimeLines: ["0:01", "0:06"],
  thumbnailURL: "mock_thumbnail_url",
  profileImg: "mock_profilImg_url",
  tag: "needle, in, haystack, mock, tags",
  documentLength: 100,
  titleLength: 10,
  descriptionLength: 100,
  transcriptLength: 100,
  tagLength: 50,
  forwardLinks: [],
  backwardLinks: [],
  allForwardLinks: [],
};

const mocks = {
  navigate: vi.fn(),
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => ({
      state: { video: mockVideo },
    }),
  };
});

describe("Video detail page", () => {
  beforeEach(() => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <VideoDetailPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("render Video", async () => {
    expect(screen.queryAllByText(mockVideo.title).length).toBeGreaterThan(1);
    expect(screen.getByText(mockVideo.description)).toBeInTheDocument();
    expect(screen.getByText(mockVideo.channel)).toBeInTheDocument();
  });

  it("render Script", async () => {
    mockVideo.transcripts.forEach((script) => {
      expect(screen.getByText(script)).toBeInTheDocument();
    });

    mockVideo.transcriptTimeLines.forEach((timeline) => {
      expect(screen.getByText(timeline)).toBeInTheDocument();
    });

    expect(screen.getByText("Transcript")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("See Editor")).toBeInTheDocument();
  });
});
