import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const canonical = path.join(process.cwd(), '.agents', 'skills');
const claudeMirror = path.join(process.cwd(), '.claude', 'skills');
const namePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

function parseSkill(text, file) {
  if (!text.startsWith('---\n')) throw new Error(`${file}: missing YAML frontmatter`);
  const end = text.indexOf('\n---', 4);
  if (end === -1) throw new Error(`${file}: unterminated YAML frontmatter`);
  const frontmatter = text.slice(4, end);
  const name = frontmatter.match(/^name:\s*([a-z0-9-]+)\s*$/m)?.[1];
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name || !description) throw new Error(`${file}: name and description are required`);
  if (!namePattern.test(name)) throw new Error(`${file}: invalid skill name "${name}"`);
  if (description.length > 1024) throw new Error(`${file}: description exceeds 1024 characters`);
  return { name, description };
}

if (!(await exists(canonical))) {
  console.error('Missing .agents/skills/ canonical skill folder.');
  process.exit(1);
}

const sourceDirs = (await readdir(canonical, { withFileTypes: true }))
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort();

let failed = false;
for (const dirName of sourceDirs) {
  const sourceFile = path.join(canonical, dirName, 'SKILL.md');
  try {
    const sourceText = await readFile(sourceFile, 'utf8');
    const metadata = parseSkill(sourceText, sourceFile);
    if (metadata.name !== dirName) throw new Error(`${sourceFile}: frontmatter name must match folder "${dirName}"`);

    const mirrorFile = path.join(claudeMirror, dirName, 'SKILL.md');
    if (!(await exists(mirrorFile))) throw new Error(`Missing Claude/OmniRush mirror: ${mirrorFile}`);
    const mirrorText = await readFile(mirrorFile, 'utf8');
    parseSkill(mirrorText, mirrorFile);
    if (sourceText !== mirrorText) throw new Error(`Mirror mismatch: ${sourceFile} differs from ${mirrorFile}`);

    console.log(`OK ${dirName}`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${dirName}: ${error.message}`);
  }
}

if (failed) {
  console.error('Agent skill validation failed. Run node scripts/sync-skills.mjs, then resolve any remaining errors.');
  process.exit(1);
}

console.log(`Validated ${sourceDirs.length} canonical skills and matching Claude/OmniRush mirrors.`);
