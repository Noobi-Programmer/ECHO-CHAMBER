import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, '.agents', 'skills');
const target = path.join(root, '.claude', 'skills');
const force = process.argv.includes('--force');

async function exists(p) { try { await stat(p); return true; } catch { return false; } }

function validate(name, text, file) {
  if (!text.startsWith('---\n')) throw new Error(`${file}: missing YAML frontmatter`);
  const end = text.indexOf('\n---', 4);
  if (end === -1) throw new Error(`${file}: unterminated YAML frontmatter`);
  const frontmatter = text.slice(4, end);
  const declared = frontmatter.match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (declared !== name) throw new Error(`${file}: name must match folder (${name})`);
  if (!description || description.length > 1024) throw new Error(`${file}: description is required and must be <= 1024 characters`);
}

async function listFiles(dir, prefix = '') {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = path.join(prefix, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await listFiles(dir, rel));
    else if (entry.isFile()) result.push(rel);
  }
  return result;
}

if (!(await exists(source))) {
  console.error('Missing .agents/skills. Run from repository root.');
  process.exit(1);
}

await mkdir(target, { recursive: true });
const skills = (await readdir(source, { withFileTypes: true })).filter(x => x.isDirectory());
let synced = 0;
let conflicts = 0;

for (const skill of skills) {
  const from = path.join(source, skill.name);
  const to = path.join(target, skill.name);
  const sourceSkillFile = path.join(from, 'SKILL.md');

  if (!(await exists(sourceSkillFile))) {
    console.warn(`Skip ${skill.name}: missing SKILL.md`);
    continue;
  }

  const sourceText = await readFile(sourceSkillFile, 'utf8');
  validate(skill.name, sourceText, sourceSkillFile);

  if (await exists(to)) {
    const sourceFiles = await listFiles(from);
    const different = [];
    for (const relative of sourceFiles) {
      const srcFile = path.join(from, relative);
      const dstFile = path.join(to, relative);
      if (await exists(dstFile)) {
        const [a, b] = await Promise.all([readFile(srcFile), readFile(dstFile)]);
        if (!a.equals(b)) different.push(relative);
      }
    }

    if (different.length && !force) {
      conflicts++;
      console.error(`CONFLICT ${skill.name}: ${different.join(', ')}`);
      console.error(`Review the differences. Re-run with --force only if .agents/skills/${skill.name} is approved as canonical.`);
      continue;
    }

    if (different.length && force) {
      await rm(to, { recursive: true, force: true });
      await cp(from, to, { recursive: true });
      console.log(`Replaced reviewed mirror ${skill.name}`);
      synced++;
      continue;
    }

    // No conflicts: copy canonical files without deleting unrelated files.
    await cp(from, to, { recursive: true, force: true });
  } else {
    await cp(from, to, { recursive: true });
  }

  synced++;
  console.log(`Synced ${skill.name}`);
}

if (conflicts) {
  console.error(`${conflicts} skill mirror conflict(s); no conflicting skill folder was overwritten.`);
  process.exit(1);
}

console.log(`Synced ${synced} canonical skill folders to .claude/skills.`);
console.log('Next: run node scripts/check-agent-skills.mjs');
