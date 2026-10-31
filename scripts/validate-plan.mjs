import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const required = [
  'AGENT_SYNC.md','AGENT_STATUS.md','AGENT_ROUTER.md','AGENT_PROMPTS.md',
  'STORY_WORKSHOP.md','STORY_BIBLE.md','STORY_DECISIONS.md',
  'TECHNICAL_RESEARCH_PLAN.md','ASSET_PIPELINE.md','ASSET_REGISTER.csv'
];
let failed = false;
for (const f of required) {
  try { await access(f); console.log(`OK ${f}`); }
  catch { console.error(`MISSING ${f}`); failed = true; }
}
const dir = '.agents/skills';
try {
  const names = await readdir(dir, { withFileTypes: true });
  for (const d of names.filter(x => x.isDirectory())) {
    const p = path.join(dir, d.name, 'SKILL.md');
    try {
      const s = await readFile(p, 'utf8');
      if (!s.startsWith('---\n') || !/^name:\s*[a-z0-9-]+/m.test(s) || !/^description:\s*.+/m.test(s)) {
        console.error(`INVALID frontmatter: ${p}`); failed = true;
      } else console.log(`OK skill ${d.name}`);
    } catch { console.error(`MISSING ${p}`); failed = true; }
  }
} catch { console.error(`MISSING ${dir}`); failed = true; }
if (failed) process.exit(1);
console.log('Plan validation passed.');
