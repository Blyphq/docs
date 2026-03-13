const RELEASES_API_URL = "https://api.github.com/repos/Blyphq/blyp/releases";

export const UPSTREAM_RELEASES_URL = "https://github.com/Blyphq/blyp/releases";
export const CHANGELOG_REVALIDATE_SECONDS = 3600;

export interface GitHubRelease {
  id: number;
  tagName: string;
  name: string | null;
  body: string;
  url: string;
  isPrerelease: boolean;
  publishedAt: string;
}

interface GitHubReleaseApiResponse {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
}

export interface GitHubReleasesResult {
  releases: GitHubRelease[];
  error?: string;
  sourceUrl: string;
}

function isGitHubReleaseApiResponse(value: unknown): value is GitHubReleaseApiResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<GitHubReleaseApiResponse>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.tag_name === "string" &&
    typeof candidate.html_url === "string" &&
    typeof candidate.draft === "boolean" &&
    typeof candidate.prerelease === "boolean" &&
    (typeof candidate.name === "string" || candidate.name === null) &&
    (typeof candidate.body === "string" || candidate.body === null) &&
    (typeof candidate.published_at === "string" || candidate.published_at === null)
  );
}

export async function getGitHubReleases(): Promise<GitHubReleasesResult> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "blyp-docs-changelog",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(RELEASES_API_URL, {
      headers,
      next: { revalidate: CHANGELOG_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return {
        releases: [],
        error: `GitHub releases request failed with status ${response.status}.`,
        sourceUrl: UPSTREAM_RELEASES_URL,
      };
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
      return {
        releases: [],
        error: "GitHub releases response was not an array.",
        sourceUrl: UPSTREAM_RELEASES_URL,
      };
    }

    const releases = payload
      .filter(isGitHubReleaseApiResponse)
      .filter((release) => !release.draft && typeof release.published_at === "string")
      .sort((left, right) => {
        return new Date(right.published_at ?? 0).getTime() - new Date(left.published_at ?? 0).getTime();
      })
      .map<GitHubRelease>((release) => ({
        id: release.id,
        tagName: release.tag_name,
        name: release.name,
        body: release.body ?? "",
        url: release.html_url,
        isPrerelease: release.prerelease,
        publishedAt: release.published_at as string,
      }));

    return {
      releases,
      sourceUrl: UPSTREAM_RELEASES_URL,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      releases: [],
      error: `Unable to load GitHub releases: ${message}`,
      sourceUrl: UPSTREAM_RELEASES_URL,
    };
  }
}
