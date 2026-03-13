import type { GitHubRelease } from "@/lib/changelog/github-releases";

export type ChangelogSectionTitle = "Added" | "Improved" | "Fixed" | "Highlights" | "Notes";

export interface ChangelogListItem {
  text: string;
  children: ChangelogListItem[];
}

export interface ChangelogParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ChangelogListBlock {
  type: "list";
  items: ChangelogListItem[];
}

export type ChangelogSectionBlock = ChangelogParagraphBlock | ChangelogListBlock;

export interface ChangelogSection {
  kind: ChangelogSectionTitle;
  title: ChangelogSectionTitle;
  blocks: ChangelogSectionBlock[];
}

export interface NormalizedRelease {
  version: string;
  title: string;
  publishedAt: string;
  url: string;
  isPrerelease: boolean;
  sections: ChangelogSection[];
}

const SECTION_ORDER: ChangelogSectionTitle[] = ["Added", "Improved", "Fixed", "Highlights", "Notes"];

const RECOGNIZED_HEADINGS: Record<string, ChangelogSectionTitle> = {
  added: "Added",
  improved: "Improved",
  fixed: "Fixed",
  notes: "Notes",
};

function stripCodeFences(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, "");
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/<\/?[^>]+>/g, "")
    .trim();
}

function isListLine(line: string): boolean {
  return /^(\s*)([-*+])\s+/.test(line);
}

function isIndentedContinuation(line: string): boolean {
  return /^\s+\S+/.test(line);
}

function parseList(lines: string[], startIndex: number): { items: ChangelogListItem[]; nextIndex: number } {
  const rootItems: ChangelogListItem[] = [];
  const stack: Array<{ indent: number; items: ChangelogListItem[] }> = [{ indent: -1, items: rootItems }];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*+])\s+(.*)$/);

    if (listMatch) {
      const indent = listMatch[1].length;
      const text = stripInlineMarkdown(listMatch[3]);

      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }

      const item: ChangelogListItem = {
        text,
        children: [],
      };

      stack[stack.length - 1].items.push(item);
      stack.push({ indent, items: item.children });
      index += 1;
      continue;
    }

    if (isIndentedContinuation(line) && stack.length > 1) {
      const currentItems = stack[stack.length - 1].items;
      const currentItem = currentItems[currentItems.length - 1];

      if (currentItem) {
        currentItem.text = `${currentItem.text} ${stripInlineMarkdown(line)}`.trim();
        index += 1;
        continue;
      }
    }

    break;
  }

  return {
    items: rootItems,
    nextIndex: index,
  };
}

function parseParagraph(lines: string[], startIndex: number): { text: string; nextIndex: number } {
  const parts: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      if (parts.length > 0) {
        break;
      }

      index += 1;
      continue;
    }

    if (line.match(/^#{1,6}\s+/) || isListLine(line)) {
      break;
    }

    parts.push(stripInlineMarkdown(line));
    index += 1;
  }

  return {
    text: parts.join(" ").trim(),
    nextIndex: index,
  };
}

function getSectionKind(heading: string | null, blockType: ChangelogSectionBlock["type"]): ChangelogSectionTitle {
  if (heading) {
    const normalizedHeading = stripInlineMarkdown(heading).toLowerCase();
    const mappedSection = RECOGNIZED_HEADINGS[normalizedHeading];

    if (mappedSection) {
      return mappedSection;
    }
  }

  return blockType === "list" ? "Highlights" : "Notes";
}

function ensureSection(
  sections: Map<ChangelogSectionTitle, ChangelogSection>,
  kind: ChangelogSectionTitle,
): ChangelogSection {
  const existing = sections.get(kind);

  if (existing) {
    return existing;
  }

  const created: ChangelogSection = {
    kind,
    title: kind,
    blocks: [],
  };

  sections.set(kind, created);
  return created;
}

function deriveReleaseTitle(release: GitHubRelease): string {
  if (release.name && release.name.trim() && release.name.trim() !== release.tagName) {
    return release.name.trim();
  }

  const headings = stripCodeFences(release.body)
    .split(/\r?\n/)
    .map((line) => line.match(/^#{1,6}\s+(.*)$/)?.[1] ?? null)
    .filter((value): value is string => Boolean(value))
    .map((value) => stripInlineMarkdown(value));

  const comparableTag = release.tagName.toLowerCase();

  const extracted = headings.find((heading) => {
    const normalized = heading.toLowerCase();
    return normalized !== comparableTag && !normalized.includes(comparableTag);
  });

  if (extracted) {
    return extracted;
  }

  return release.name?.trim() || release.tagName;
}

export function normalizeRelease(release: GitHubRelease): NormalizedRelease {
  const markdown = stripCodeFences(release.body).replace(/\r\n/g, "\n");
  const lines = markdown.split("\n");
  const sections = new Map<ChangelogSectionTitle, ChangelogSection>();
  let currentHeading: string | null = null;
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^#{1,6}\s+(.*)$/);

    if (headingMatch) {
      currentHeading = headingMatch[1].trim();
      index += 1;
      continue;
    }

    if (isListLine(line)) {
      const { items, nextIndex } = parseList(lines, index);

      if (items.length > 0) {
        const kind = getSectionKind(currentHeading, "list");
        ensureSection(sections, kind).blocks.push({ type: "list", items });
      }

      index = nextIndex;
      continue;
    }

    const { text, nextIndex } = parseParagraph(lines, index);

    if (text) {
      const kind = getSectionKind(currentHeading, "paragraph");
      ensureSection(sections, kind).blocks.push({ type: "paragraph", text });
    }

    index = nextIndex;
  }

  return {
    version: release.tagName,
    title: deriveReleaseTitle(release),
    publishedAt: release.publishedAt,
    url: release.url,
    isPrerelease: release.isPrerelease,
    sections: SECTION_ORDER.map((kind) => sections.get(kind)).filter((section): section is ChangelogSection => {
      return Boolean(section && section.blocks.length > 0);
    }),
  };
}

export function normalizeReleases(releases: GitHubRelease[]): NormalizedRelease[] {
  return releases.map(normalizeRelease);
}
