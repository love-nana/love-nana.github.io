import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

//npx playwright test tests/gallery.spec.ts

// 加载环境变量
dotenv.config();

test('画廊页面显示照片卡片', async ({ page }) => {
  const secretId = process.env.COS_SECRET_ID;
  const secretKey = process.env.COS_SECRET_KEY;

  if (!secretId || !secretKey) {
    test.skip('缺少 COS 凭证');
    return;
  }

  // 访问画廊页面
  await page.goto('/src/pages/gallery/index.html');

  // 等待登录弹窗出现
  await page.waitForSelector('#cosId', { timeout: 5000 });

  // 填写登录表单
  await page.fill('#cosId', secretId);
  await page.fill('#cosToken', secretKey);
  await page.click('button[type="submit"]');

  // 等待照片加载
  await page.waitForSelector('.item', { timeout: 10000 });

  // 统计卡片数量
  const cardCount = await page.locator('.item').count();
  console.log(`卡片数量: ${cardCount}`);

  expect(cardCount).toBeGreaterThan(0);
});
