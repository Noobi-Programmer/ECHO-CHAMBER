import { chromium } from 'playwright';

async function test() {
  console.log('=== ECHO//CHAMBER INSPECTION ILLUSTRATION VERIFICATION ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(800);

  // Click start / wake up
  const startBtn = await page.$('.title-start');
  if (startBtn) {
    await startBtn.click();
    console.log('[OK] Game started from title screen');
  }
  await page.waitForTimeout(1000);

  // Targets to verify from master prompt
  const targets = [
    { id: 'cradle', expected: 'cradle-chamber-001.png', paired: false },
    { id: 'vossPod', expected: 'voss-pod-001.png', paired: false },
    { id: 'mug', expected: 'mug-present-001.png', echoExpected: 'mug-echo-001.png', paired: true },
    { id: 'locker', expected: 'locker-interior-001.png', paired: false },
    { id: 'plate3', expected: 'floor-plate-001.png', paired: false },
    { id: 'window', expected: 'observation-window-001.png', paired: false },
    { id: 'wallRule', expected: 'wall-inscription-001.png', paired: false, overlay: 'A MEMORY YOU CAN EDIT IS NOT EVIDENCE.' },
    { id: 'keySlot', expected: 'console-evidence-001.png', detailExpected: 'console-key-detail-001.png', paired: false },
    { id: 'photo', expected: 'photograph-present-001.png', echoExpected: 'photograph-echo-001.png', paired: true },
    { id: 'vossDesk', expected: 'research-desk-001.png', paired: false },
    { id: 'wellConsole', expected: 'well-archive-001.png', paired: false },
    { id: 'lethe', expected: 'lethe-lever-001.png', paired: false },
  ];

  const results = [];

  for (const item of targets) {
    const data = await page.evaluate(async (target) => {
      // Access the UI through window
      const ui = window.__UI;
      if (!ui) return { error: 'window.__UI missing' };

      // Open inspection
      const config = {
        id: target.id,
        title: `INSPECTION // ${target.id.toUpperCase()}`,
        category: 'EQUIPMENT',
        present: {
          description: [`Inspection visual verification for ${target.id}.`],
          badge: 'VERIFICATION ACTIVE',
        },
      };
      if (target.paired) {
        config.echo = {
          description: [`ECHO visual verification for ${target.id}.`],
          badge: 'ECHO VERIFICATION ACTIVE',
        };
      }

      void ui.inspect(config);

      const modal = document.querySelector('.inspect-card');
      const presentImg = modal?.querySelector('.inspect-illus-img.present')?.getAttribute('src');
      const echoImg = modal?.querySelector('.inspect-illus-img.echo')?.getAttribute('src');
      const wallText = modal?.querySelector('.inspect-wall-text')?.textContent;
      const isEchoTint = modal?.querySelector('.inspect-viewport')?.classList.contains('echo-tint');

      return {
        hasModal: Boolean(modal),
        presentImg,
        echoImg,
        wallText,
        isEchoTint,
      };
    }, item);

    const passPresent = data.presentImg && data.presentImg.includes(item.expected);
    let passEcho = true;
    if (item.paired) {
      passEcho = data.echoImg && data.echoImg.includes(item.echoExpected);
    }
    let passOverlay = true;
    if (item.overlay) {
      passOverlay = data.wallText === item.overlay;
    }
    // Verify NO generic blue tint applied to illustrations
    const passNoTint = !data.isEchoTint;

    const pass = passPresent && passEcho && passOverlay && passNoTint;
    console.log(`[TARGET] ${item.id.padEnd(12)} -> ${pass ? 'PASS' : 'FAIL'} (img: ${data.presentImg}, echo: ${data.echoImg || 'none'}, overlay: ${data.wallText || 'none'})`);
    results.push({ id: item.id, pass, data });

    // Capture screenshots of key milestones
    if (['cradle', 'mug', 'wallRule', 'photo', 'lethe'].includes(item.id)) {
      await page.screenshot({ path: `docs/assets/verify-${item.id}-present.png` });
      if (item.paired) {
        // Toggle Q
        await page.keyboard.press('q');
        await page.waitForTimeout(300);
        await page.screenshot({ path: `docs/assets/verify-${item.id}-echo.png` });
      }
    }

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
  }

  // Verify unmapped text-only behavior
  console.log('\n--- VERIFYING UNMAPPED TEXT-ONLY INTERACTIONS ---');
  const unmappedText = await page.evaluate(async () => {
    const ui = window.__UI;
    // Call text-only terminal or say
    const sayPromise = ui.say('Standard unmapped station announcement text.');
    const modal = document.querySelector('.inspect-card');
    const panel = document.querySelector('.panel:not(.inspect-card)');
    const hasIllusModal = Boolean(modal);
    const hasPanel = Boolean(panel);

    return { hasIllusModal, hasPanel };
  });

  const passUnmapped = !unmappedText.hasIllusModal && unmappedText.hasPanel;
  console.log(`[UNMAPPED] text-only fallback: ${passUnmapped ? 'PASS' : 'FAIL'} (hasIllusModal: ${unmappedText.hasIllusModal}, hasPanel: ${unmappedText.hasPanel})`);
  results.push({ id: 'unmapped-fallback', pass: passUnmapped });
  await page.keyboard.press('e');

  await browser.close();

  console.log('\n=================================================');
  const allPassed = results.every(r => r.pass);
  console.log(`FINAL RESULT: ${allPassed ? 'ALL 12 ILLUSTRATION TARGETS & UNMAPPED FALLBACK PASSED' : 'FAILURES DETECTED'}`);
  console.log(`=================================================`);
  if (!allPassed) process.exit(1);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
