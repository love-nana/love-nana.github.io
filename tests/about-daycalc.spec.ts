import { test, expect } from '@playwright/test';
import { dayDiff } from '../src/utils/date';

test.describe('天数计算一致性测试', () => {
  test('about 页与 date.ts 工具函数结果一致', async ({ page }) => {
    await page.goto('http://localhost:5173/src/pages/about/index.html');
    await page.waitForLoadState('networkidle');

    // 获取页面显示的相识天数
    const touchDays = await page.locator('#p_dayTouch').textContent();
    const ranDays = await page.locator('#p_dayRan').textContent();

    // 期望值（通过 dayDiff 计算）
    const expectedTouch = dayDiff('2025-06-19');
    const expectedRan = dayDiff('2025-08-03');

    expect(parseInt(touchDays!)).toBe(expectedTouch);
    expect(parseInt(ranDays!)).toBe(expectedRan);
  });

  test('nav 页与 about 页计算结果一致', async ({ page }) => {
    // nav 页
    await page.goto('http://localhost:5173/src/pages/nav/index.html');
    await page.waitForLoadState('networkidle');
    const navDays = await page.locator('.counter-number').textContent();

    // about 页
    await page.goto('http://localhost:5173/src/pages/about/index.html');
    await page.waitForLoadState('networkidle');
    const aboutDays = await page.locator('#p_dayRan').textContent();

    expect(parseInt(navDays!)).toBe(parseInt(aboutDays!));
  });
});
