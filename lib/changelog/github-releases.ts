export interface GitHubReleaseSource {
  id: "blyp" | "cli";
  label: string;
  packageName: string;
  apiUrl: string;
  sourceUrl: string;
}

export const CHANGELOG_SOURCES: Record<GitHubReleaseSource["id"], GitHubReleaseSource> = {
  blyp: {
    id: "blyp",
    label: "Blyp",
    packageName: "@blyp/core",
    apiUrl: "https://api.github.com/repos/Blyphq/blyp/releases",
    sourceUrl: "https://github.com/Blyphq/blyp/releases",
  },
  cli: {
    id: "cli",
    label: "CLI",
    packageName: "@blyp/cli",
    apiUrl: "https://api.github.com/repos/Blyphq/cli/releases",
    sourceUrl: "https://github.com/Blyphq/cli/releases",
  },
};

export const CHANGELOG_REVALIDATE_SECONDS = 3600;

export interface GitHubRelease {
  id: number;
  tagName: string;
  name: string | null;
  body: string;
  url: string;
  isPrerelease: boolean;
  publishedAt: string;
  source: GitHubReleaseSource;
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
  source: GitHubReleaseSource;
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

export async function getGitHubReleases(source: GitHubReleaseSource): Promise<GitHubReleasesResult> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "blyp-docs-changelog",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(source.apiUrl, {
      headers,
      next: { revalidate: CHANGELOG_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return {
        releases: [],
        error: `GitHub releases request failed with status ${response.status}.`,
        source,
      };
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
      return {
        releases: [],
        error: "GitHub releases response was not an array.",
        source,
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
        source,
      }));

    return {
      releases,
      source,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      releases: [],
      error: `Unable to load GitHub releases: ${message}`,
      source,
    };
  }
}
