import { readSkillSource, type SkillPreset } from "@/lib/skills";
import { CopyMarkdownBlock } from "@/app/components/copy-markdown-block";

type SkillSourceProps = {
  slug: SkillPreset["slug"];
};

export async function SkillSource({ slug }: SkillSourceProps) {
  const source = await readSkillSource(slug);

  return (
    <div className="my-6 space-y-3">
      <CopyMarkdownBlock source={source} />
    </div>
  );
}
