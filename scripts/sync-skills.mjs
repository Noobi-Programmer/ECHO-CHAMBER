import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, '.agents', 'skills');
const target = path.join(root, '.claude', 'skills');

async function exists(p) { try { await stat(p); return true; } catch { return false; } }
if (!(await exists(source))) {
  console.error('Missing .agents/skills. Run from repository root.');
  process.exit(1);
}
await mkdir(target, { recursive: true });
const skills = (await readdir(source, { withFileTypes: true })).filter(x => x.isDirectory());
for (const skill of skills) {
  const from = path.join(source, skill.name);
  const to = path.join(target, skill.name);
  if (!(await exists(path.join(from, 'SKILL.md')))) {
    console.warn(`Skip ${skill.name}: missing SKILL.md`);
    continue;
  }
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
  console.log(`Synced ${skill.name}`);
}
console.log(`Synced ${skills.length} skill folders to .claude/skills`);
