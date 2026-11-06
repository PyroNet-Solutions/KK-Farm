// Browser smoke test against the running local app. Usage: node tests/e2e/smoke.mjs [screenshot-dir]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const base = 'http://127.0.0.1:8000';
const shots = process.argv[2];
if (shots) {
    mkdirSync(shots, { recursive: true });
}

const screens = ['/', '/goats', '/scan', '/breeding', '/health', '/weights', '/feeding', '/sheds', '/tasks', '/employees', '/finance', '/reports', '/settings'];
const browser = await chromium.launch();
let failures = 0;
const fail = (message) => {
    failures += 1;
    console.log(`FAIL ${message}`);
};

async function session(role, viewport, mobile = false) {
    const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('console', (m) => {
        if (m.type() === 'error' && !m.text().includes('403')) {
            fail(`[${role}] console: ${m.text().slice(0, 160)} at ${page.url()}`);
        }
    });
    page.on('pageerror', (e) => fail(`[${role}] page error: ${e.message.slice(0, 160)} at ${page.url()}`));
    await page.goto(`${base}/login`);
    await page.getByRole('button', { name: new RegExp(role, 'i') }).first().click();
    await page.waitForURL(`${base}/`);
    return { context, page };
}

// Every screen as the CEO, desktop and phone.
for (const [name, viewport, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const { context, page } = await session('CEO', viewport, mobile);
    for (const path of screens) {
        const start = Date.now();
        const response = await page.goto(base + path, { waitUntil: 'networkidle' });
        const ms = Date.now() - start;
        if (response.status() !== 200) {
            fail(`${path} returned ${response.status()}`);
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 1) {
            fail(`${name} ${path} scrolls sideways by ${overflow}px`);
        }
        console.log(`ok ${name.padEnd(7)} ${path.padEnd(11)} ${String(ms).padStart(5)}ms`);
        if (shots) {
            await page.waitForTimeout(450);
            await page.screenshot({ path: join(shots, `${name}${path.replace(/\//g, '-') || '-'}.png`), fullPage: name === 'mobile' ? false : true });
        }
    }
    const goat = await page.goto(`${base}/goats`, { waitUntil: 'networkidle' }).then(() => page.locator('tbody a[href^="/goats/"]').first().getAttribute('href'));
    await page.goto(base + goat, { waitUntil: 'networkidle' });
    for (const tab of ['Lifecycle', 'Health', 'Breeding & pedigree', 'Photos', 'RFID history']) {
        await page.getByRole('tab', { name: new RegExp(tab) }).click();
        await page.waitForTimeout(120);
    }
    if (shots) {
        await page.getByRole('tab', { name: /Overview/ }).click();
        await page.waitForTimeout(450);
        await page.screenshot({ path: join(shots, `${name}-goat360.png`), fullPage: name !== 'mobile' });
    }
    await context.close();
}

// Real workflows, driven through the interface.
{
    const { context, page } = await session('Caretaker', { width: 390, height: 844 }, true);
    await page.evaluate(() => { window.__spa = true; });

    await page.getByRole('button', { name: 'Open menu' }).click();
    const start = Date.now();
    await page.getByRole('link', { name: 'RFID Scan' }).click();
    await page.getByRole('heading', { name: 'RFID scan' }).waitFor();
    console.log(`ok in-app navigation ${Date.now() - start}ms`);
    if (!(await page.evaluate(() => window.__spa === true))) {
        fail('navigation caused a full page reload');
    }

    await page.getByRole('button', { name: /^SIM-982/ }).first().click();
    await page.getByRole('heading', { name: 'Goat found' }).waitFor();
    console.log('ok scan opens the goat');
    await page.getByRole('button', { name: 'Open full record' }).click();
    await page.getByRole('button', { name: 'Add weight' }).waitFor();

    await page.getByRole('button', { name: 'Add weight' }).click();
    await page.getByLabel('Weight (kg)').fill('41.5');
    await page.getByRole('button', { name: 'Save weight' }).click();
    await page.getByText('41.5 kg').first().waitFor();
    console.log('ok weight saved and shown');

    await page.getByRole('button', { name: 'Report concern' }).click();
    await page.getByLabel('What did you notice?').fill('Smoke test concern');
    await page.getByRole('button', { name: 'Send to vet' }).click();
    await page.getByRole('status').waitFor();
    console.log('ok concern reported');

    await page.getByRole('button', { name: 'Add photo' }).click();
    const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    await page.locator('input[type=file]').setInputFiles({ name: 'goat.png', mimeType: 'image/png', buffer: pixel });
    await page.getByRole('button', { name: 'Save photo' }).click();
    await page.getByRole('img', { name: /Profile of/ }).waitFor();
    console.log('ok photo uploaded and shown as profile');

    await page.getByRole('button', { name: /Simulated|^CA/ }).first().click();
    await page.getByRole('button', { name: 'Veterinarian' }).click();
    await page.waitForURL(`${base}/`);
    await page.goto(`${base}/health`);
    await page.getByRole('button', { name: 'Save record' }).waitFor();
    console.log('ok switched to veterinarian and clinical form appears');
    await context.close();
}

// Server-side permissions as seen through the browser.
const { context, page } = await session('Caretaker', { width: 1280, height: 800 });
for (const path of ['/finance', '/settings', '/employees', '/reports']) {
    const response = await page.goto(base + path);
    if (response.status() !== 403) {
        fail(`caretaker reached ${path} with ${response.status()}`);
    }
}
if (await page.goto(`${base}/`).then(() => page.getByRole('link', { name: 'Expenses & Finance' }).count())) {
    fail('caretaker sees the finance link');
}
console.log('ok caretaker is refused finance, settings, employees and reports');
await context.close();

await browser.close();
console.log(failures ? `\n${failures} failure(s)` : '\nAll browser checks passed');
process.exit(failures ? 1 : 0);
