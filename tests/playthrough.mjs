// End-to-end playthrough against a running build (default http://localhost:4173).
// Usage: npm run build && npx vite preview --port 4173 &  then  node tests/playthrough.mjs [herName|lethe]
// Uses real keyboard input for movement, ECHO and dialogue; uses the debug teleport hook only to skip walking.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const URL = process.env.GAME_URL || 'http://localhost:4173/';
const ENDING = process.argv[2] || 'herName';
const SHOTS = process.env.SHOTS || '';
let pass = 0, fail = 0;
let lastState = null;
const ok = (c, msg) => { if (c) { pass++; console.log('  ✓', msg); } else { fail++; console.log('  ✗', msg, lastState ? JSON.stringify(lastState) : ''); } };

const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); if (m.text().startsWith('DBG')) console.log('    ', m.text()); });
p.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
const st = async () => (lastState = await p.evaluate(() => window.__ECHO.scene.debug()));
const tp = (x, y) => p.evaluate(([x, y]) => window.__ECHO.scene.teleport(x, y), [x, y]);
const wait = (ms) => p.waitForTimeout(ms);
const shot = async (n) => { if (SHOTS) await p.screenshot({ path: `${SHOTS}/${n}.png` }); };
const flag = async (f) => (await st()).flags.includes(f);
async function waitFor(fn, ms = 30000, label = '') {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (await fn()) return true; await wait(150); }
  console.log('    (timeout waiting for', label, ')');
  return false;
}
/** advance any open inspect panels / terminals; stop when a choice list is shown or nothing is modal */
async function drain(max = 60) {
  for (let i = 0; i < max; i++) {
    const s = await st();
    const choices = await p.isVisible('.choices:not(.hidden)');
    if (choices) return 'choice';
    if (!s.modal && !s.busy) return 'idle';
    if (s.modal && (await p.isVisible('.panel:not(.hidden)'))) await p.click('.panel', { timeout: 2000 }).catch(() => {});
    else if (s.modal && (await p.isVisible('.term .term-more:not(.hidden)'))) await p.click('.term', { timeout: 2000 }).catch(() => {});
    else if (s.modal && (await p.isVisible('.term'))) await p.keyboard.press('e');
    await wait(260);
  }
  return 'timeout';
}
async function pick(text) {
  await waitFor(() => p.isVisible('.choices:not(.hidden)'), 15000, 'choices');
  await wait(550);
  const btn = p.locator('.choices button.choice').filter({ hasText: text });
  if (!(await btn.count())) {
    console.log('    pick failed:', text, JSON.stringify(await st()), await p.locator('#ui').innerText());
  }
  await btn.first().click({ timeout: 5000 });
  await wait(300);
}
async function interactAt(x, y) {
  await waitFor(async () => { const s = await st(); return !s.modal && !s.busy; }, 20000, 'idle before interact');
  await tp(x, y); await wait(250);
  for (let i = 0; i < 3; i++) {
    await p.keyboard.press('e');
    if (await waitFor(async () => { const s = await st(); return s.modal || s.busy; }, 2500, 'interaction')) return;
  }
}
async function hold(key, ms) { await p.keyboard.down(key); await wait(ms); await p.keyboard.up(key); }

console.log('1. start');
await p.goto(URL);
await wait(1200);
ok(await p.isVisible('.title'), 'title screen visible');
await shot('01_title');
await p.keyboard.press('Enter');
ok(await waitFor(async () => (await p.isVisible('.choices:not(.hidden)')), 40000, 'name prompt'), 'intro plays and ORPHEUS asks a name');
await shot('02_wake');
await wait(700);
await p.keyboard.press('1');
ok(await waitFor(async () => (await st()).step === 'card', 30000, 'card step'), 'player has control');

console.log('2. movement');
await tp(160, 452);
let s0 = await st();
await hold('ArrowRight', 500); let s1 = await st(); ok(s1.x > s0.x + 10, `move right (${s0.x.toFixed(0)}→${s1.x.toFixed(0)})`);
await hold('a', 500); let s2 = await st(); ok(s2.x < s1.x - 10, 'move left (A)');
await hold('ArrowDown', 400); let s3 = await st(); ok(s3.y > s2.y + 8, 'move down');
await hold('w', 400); let s4 = await st(); ok(s4.y < s3.y - 8, 'move up (W)');

console.log('3. collision');
await tp(160, 440); await hold('ArrowUp', 1200);
let sw = await st(); ok(sw.y >= 419, `top wall blocks (y=${sw.y.toFixed(1)})`);
await tp(240, 452); await hold('ArrowUp', 1200);
sw = await st(); ok(sw.y >= 419, 'closed lab door blocks');
await tp(150, 452); await hold('ArrowLeft', 900);
sw = await st(); ok(sw.x >= 116, `Cradle pod blocks (x=${sw.x.toFixed(1)})`);

console.log('4. ECHO repeatedly');
await tp(293, 452);
for (let i = 0; i < 3; i++) {
  await p.keyboard.down('q'); await wait(700);
  const on = (await st()).echoT; await p.keyboard.up('q'); await wait(500);
  const off = (await st()).echoT;
  ok(on > 0.9 && off < 0.1, `ECHO cycle ${i + 1} (on ${on.toFixed(2)}, off ${off.toFixed(2)})`);
  await wait(700);
}
await p.keyboard.down('q'); await wait(400); await shot('03_echo_mug'); await p.keyboard.up('q');
await drain();

console.log('5. clues + puzzle 1 (hidden card)');
await interactAt(293, 448); await drain();
await interactAt(334, 452); await drain();
ok(await flag('lockerOpen'), 'locker opens to your palm');
await interactAt(184, 482); await drain();
ok(!(await flag('cardTaken')), 'plate cannot be lifted before seeing the memory');
await tp(334, 452); await wait(1200);
await p.keyboard.down('q'); await wait(3200); await shot('04_echo_locker'); await p.keyboard.up('q');
ok(await flag('seenLockerEcho'), 'ECHO reveals the figure hiding the card');
await wait(1200);
await interactAt(184, 482); await drain();
ok(await flag('cardTaken'), 'card found under plate 3');
await interactAt(224, 436); await drain(); await wait(800);
ok(await flag('labOpen'), 'lab door opens with the card');
await hold('ArrowUp', 1500);
ok(await waitFor(async () => (await flag('enteredLab')), 6000, 'lab'), 'walk through the door into the lab');
await waitFor(async () => !(await st()).busy, 10000);
await shot('05_lab');

console.log('6. puzzle 2 (contested memory + corroboration + code)');
await tp(292, 330); await wait(300);
await p.keyboard.down('q'); await wait(2000); await shot('06_contested'); await p.keyboard.up('q');
ok(await flag('seenContested'), 'contested memory seen');
await wait(1200);
await interactAt(298, 308); await drain();
ok(await flag('slotSeen'), 'snapped key found');
await interactAt(270, 308);
let r = await drain();
ok(r === 'choice', 'console offers corroboration');
await pick("Voss's memory"); await pick('The key snapped off'); await drain();
ok(!(await flag('corroborated')), 'wrong memory rejected');
await interactAt(270, 308); await drain();
await pick("Mira's memory"); await pick('The key snapped off'); await drain();
ok(await flag('corroborated'), 'Mira\'s memory corroborated and unsealed');
await interactAt(122, 320); await drain(80);
ok(await flag('rec03'), 'REC_03 plays');
await tp(376, 232); await wait(300);
await p.keyboard.down('q'); await wait(3000); await shot('07_code_memory'); await p.keyboard.up('q');
ok(await flag('seenCode'), 'unsealed memory shows the code');
await wait(1200);
await interactAt(376, 232);
ok(await p.isVisible('.keypad'), 'keypad opens');
await wait(500);
await p.keyboard.press('1'); await wait(150); await p.keyboard.press('2'); await wait(150); await p.keyboard.press('3');
await wait(900); await drain();
ok(!(await flag('coreOpen')), 'wrong code rejected');
await interactAt(376, 232); await wait(500);
await p.keyboard.press('1'); await wait(150); await p.keyboard.press('2'); await wait(150); await p.keyboard.press('4');
await wait(6500); await shot('08_frost');
ok(await waitFor(async () => (await flag('coreOpen')), 20000, 'core open'), 'code opens the Core after the DON\'T ANSWER beat');

console.log('7. core: continuity, reveal, log');
await waitFor(async () => !(await st()).busy, 10000);
await tp(352, 150); await hold('ArrowUp', 300);
await waitFor(async () => (await flag('enteredCore')), 8000);
await waitFor(async () => !(await st()).busy, 10000);
await interactAt(270, 122); await drain(40);
ok(await flag('rec04'), 'REC_04 plays');
await interactAt(352, 140); r = await drain();
await pick('Begin');
await pick('A key snaps'); await pick('A woman marks'); await pick('A man climbs'); await pick('Someone in a pale gown');
await drain();
ok(!(await flag('continuity')), 'wrong order rejected with a continuity error');
await interactAt(352, 140); await drain();
await pick('Begin');
await pick('A woman marks'); await pick('A key snaps'); await pick('A man climbs'); await pick('Someone in a pale gown');
await wait(1000); await drain(10);
await wait(6000); await shot('09_self_replay');
ok(await waitFor(async () => (await flag('continuity')) && !(await st()).busy, 40000, 'reveal'), 'continuity restored; R-017 replay');
await interactAt(424, 62);
await wait(9000); await shot('10_log');
await drain(40);
ok(await flag('letheOpen'), 'log read; reflection; Lethe unlocked');
ok((await st()).step === 'final', 'final decision available');

console.log(`8. ending: ${ENDING}`);
if (ENDING === 'lethe') {
  await interactAt(264, 64); await drain();
  await pick('Pull it');
} else {
  await interactAt(352, 140); await drain();
  await pick('What am I'); await drain();
  await wait(4000);
  await pick('Answer'); await pick('"Mira."'); await pick('"Yes."');
  await waitFor(() => p.isVisible('.choices:not(.hidden)'), 20000);
  await pick("I'm here");
}
ok(await waitFor(() => p.isVisible('.end-restart:not(.hidden)'), 90000, 'ending'), 'ending sequence completes');
await shot('11_ending');

console.log('9. restart');
await p.keyboard.press('Enter');
await wait(2500);
ok(await p.isVisible('.title'), 'restart returns to the title');

console.log('\nconsole errors:', errors.length ? errors : 'none');
ok(errors.length === 0, 'no console errors');
console.log(`\n${pass} passed, ${fail} failed`);
await b.close();
process.exit(fail ? 1 : 0);
