import { test, expect } from '@playwright/test';

test.describe('导航页测试', () => {
  test.beforeEach(async ({ page }) => {
    // 打开导航页
    await page.goto('http://localhost:5173/src/pages/nav/index.html');
  });

  test('页面标题正确', async ({ page }) => {
    await expect(page).toHaveTitle(/我们的回忆小站/);
  });

  test('页面加载成功', async ({ page }) => {
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    // 验证 #app 元素存在
    await expect(page.locator('#app')).toBeVisible();
  });

  test('使用 Chrome 浏览器打开', async ({ browser }) => {
    // 验证使用 Chromium 内核（Chrome 使用 Chromium）
    expect(browser.browserType().name()).toBe('chromium');
  });
});
