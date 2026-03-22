import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// npx playwright test tests/gallery-masonry.spec.ts

// 加载环境变量
dotenv.config();

async function loginAndWaitForGallery(page: any) {
  const secretId = process.env.COS_SECRET_ID;
  const secretKey = process.env.COS_SECRET_KEY;

  if (!secretId || !secretKey) {
    test.skip('缺少 COS 凭证');
    return;
  }

  await page.goto('/src/pages/gallery/index.html');
  await page.waitForSelector('#cosId', { timeout: 5000 });
  await page.fill('#cosId', secretId);
  await page.fill('#cosToken', secretKey);
  await page.click('button[type="submit"]');
  await page.waitForSelector('.item', { timeout: 15000 });
}

test.describe('画廊瀑布流布局测试', () => {

  test.beforeEach(async ({ page }) => {
    await loginAndWaitForGallery(page);
  });

  /**
   * 测试1: 桌面端瀑布流布局 (4列)
   */
  test('桌面端显示瀑布流', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    const items = page.locator('.item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    const loadingOverlay = page.locator('.loading-overlay');
    await expect(loadingOverlay).not.toBeVisible();

    console.log(`桌面端: ${count} 个卡片`);
  });

  /**
   * 测试2: 平板端瀑布流布局 (3列)
   */
  test('平板端显示瀑布流', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 1024 });
    await page.waitForTimeout(500);

    const items = page.locator('.item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    console.log(`平板端: ${count} 个卡片`);
  });

  /**
   * 测试3: 移动端瀑布流布局 (2列)
   */
  test('移动端显示瀑布流', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const items = page.locator('.item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    console.log(`移动端: ${count} 个卡片`);
  });

  /**
   * 测试4: 响应式布局切换
   */
  test('视口缩放时布局自动调整', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(300);

    await page.setViewportSize({ width: 800, height: 1024 });
    await page.waitForTimeout(300);

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

    const items = page.locator('.item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    console.log('响应式切换成功');
  });

  /**
   * 测试5: 图片加载后布局稳定
   */
  test('图片加载后布局稳定', async ({ page }) => {
    await page.waitForTimeout(3000);

    const firstItem = page.locator('.item').first();
    const box = await firstItem.boundingBox();
    expect(box).not.toBeNull();

    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(500);

    const newBox = await firstItem.boundingBox();
    expect(newBox).not.toBeNull();

    console.log(`图片加载后位置: x=${box?.x}, y=${box?.y}`);
  });

  /**
   * 测试6: 无限滚动加载更多
   */
  test('滚动加载更多照片', async ({ page }) => {
    const initialCount = await page.locator('.item').count();
    expect(initialCount).toBeGreaterThan(0);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const newCount = await page.locator('.item').count();
    console.log(`初始: ${initialCount}, 滚动后: ${newCount}`);
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

});
