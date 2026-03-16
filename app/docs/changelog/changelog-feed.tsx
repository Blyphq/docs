import {
  CHANGELOG_SOURCES,
  getGitHubReleases,
  type GitHubReleaseSource,
} from "@/lib/changelog/github-releases";
import {
  normalizeReleases,
  type ChangelogListItem,
  type ChangelogSectionBlock,
} from "@/lib/changelog/normalize-release";

function formatPublishedDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function ReleaseList({
  items,
  nested = false,
}: {
  items: ChangelogListItem[];
  nested?: boolean;
}) {
  return (
    <ul className={nested ? "mt-2 list-disc space-y-2 pl-5" : "list-disc space-y-2 pl-5"}>
      {items.map((item) => (
        <li key={`${item.text}-${item.children.length}`} className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <span>{item.text}</span>
          {item.children.length > 0 ? <ReleaseList items={item.children} nested /> : null}
        </li>
      ))}
    </ul>
  );
}

function ReleaseBlock({ block }: { block: ChangelogSectionBlock }) {
  if (block.type === "paragraph") {
    return <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">{block.text}</p>;
  }

  return <ReleaseList items={block.items} />;
}

export async function ChangelogFeed({ source }: { source: GitHubReleaseSource }) {
  const { releases, error } = await getGitHubReleases(source);
  const normalizedReleases = normalizeReleases(releases);

  if (error) {
    return (
      <div className="not-prose mt-8 rounded-2xl border border-amber-300/70 bg-amber-50/80 p-5 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="font-medium">Unable to load the latest {source.label} changelog entries right now.</p>
        <p className="mt-2 leading-6">{error}</p>
        <a
          href={source.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-sm font-medium text-amber-900 underline underline-offset-4 dark:text-amber-100"
        >
          Open the upstream {source.label} releases page
        </a>
      </div>
    );
  }

  if (normalizedReleases.length === 0) {
    return (
      <div className="not-prose mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
        <p className="font-medium">No published {source.label} releases were returned from GitHub.</p>
        <a
          href={source.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
        >
          Open the upstream {source.label} releases page
        </a>
      </div>
    );
  }

  return (
    <div className="not-prose mt-10 space-y-8">
      {normalizedReleases.map((release, index) => (
        <article
          key={release.version}
          className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950/60 dark:shadow-none"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-100">
              {release.version}
            </span>
            {index === 0 ? (
              <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-100">
                Latest
              </span>
            ) : null}
            {release.isPrerelease ? (
              <span className="rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-800 dark:border-violet-800 dark:bg-violet-950/70 dark:text-violet-100">
                Prerelease
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                {source.packageName}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {release.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Published {formatPublishedDate(release.publishedAt)}
              </p>
            </div>

            <a
              href={release.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
            >
              View on GitHub
            </a>
          </div>

          <div className="mt-6 space-y-6">
            {release.sections.map((section) => (
              <section key={`${release.version}-${section.kind}`} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.blocks.map((block, blockIndex) => (
                    <ReleaseBlock
                      key={`${release.version}-${section.kind}-${block.type}-${blockIndex}`}
                      block={block}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      ))}

      <div className="rounded-2xl border border-dashed border-zinc-300/80 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
        Need the raw release notes or package metadata? Check{" "}
        <a
          href={source.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
        >
          {CHANGELOG_SOURCES[source.id].label} releases
        </a>
        .
      </div>
    </div>
  );
}
