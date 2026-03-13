import { getSkillBySlug, getSkillInstallTargets, type SkillPreset } from "@/lib/skills";

type SkillInstallProps = {
  slug: SkillPreset["slug"];
};

export function SkillInstall({ slug }: SkillInstallProps) {
  const skill = getSkillBySlug(slug);
  const installTargets = getSkillInstallTargets(skill.skillId);

  return (
    <div className="my-6 space-y-4">
      <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="m-0 text-sm font-semibold">Download raw skill file</p>
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">
          Use the canonical source file directly if you want to copy it into an agent skill
          directory without copying from the rendered page.
        </p>
        <a
          className="mt-3 inline-flex text-sm font-medium underline underline-offset-4"
          href={skill.rawPath}
        >
          {skill.rawPath}
        </a>
      </div>

      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Project-local path</th>
            <th>Global path</th>
          </tr>
        </thead>
        <tbody>
          {installTargets.map((target) => (
            <tr key={target.agent}>
              <td>{target.agent}</td>
              <td>
                <code>{target.projectPath}</code>
              </td>
              <td>
                <code>{target.globalPath}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
