import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('编辑弹窗关闭按钮测试', () => {
  test.beforeEach(async ({ page }) => {
    const secretId = process.env.COS_SECRET_ID;
    const secretKey = process.env.COS_SECRET_KEY;

    if (!secretId || !secretKey) {
      test.skip('缺少 COS 凭证');
      return;
    }

    // 访问画廊编辑页
    await page.goto('http://localhost:5173/src/pages/gallery-edit/index.html');

    // 等待登录弹窗并登录
    await page.waitForSelector('#cosId', { timeout: 5000 });
    await page.fill('#cosId', secretId);
    await page.fill('#cosToken', secretKey);
    await page.locator('.modal-overlay form button[type="submit"]').click();

    // 等待图片卡片加载
    await page.waitForSelector('.image-card', { timeout: 10000 });

    // 点击第一张卡片的编辑按钮
    await page.locator('.edit-btn').first().click();

    // 等待编辑弹窗出现
    await page.waitForSelector('#editModal.active', { timeout: 5000 });
  });

  test('关闭按钮可见且在右上角', async ({ page }) => {
    const closeBtn = page.locator('.close-edit-btn');
    const modalContent = page.locator('#modalContent');

    // 关闭按钮应该可见
    await expect(closeBtn).toBeVisible();

    // 获取位置
    const btnBox = await closeBtn.boundingBox();
    const modalBox = await modalContent.boundingBox();

    expect(btnBox!.width).toBeGreaterThan(0);
    expect(btnBox!.height).toBeGreaterThan(0);

    // 按钮应该在弹窗右上角
    expect(btnBox!.x + btnBox!.width).toBeGreaterThan(modalBox!.x + modalBox!.width - 40);
    expect(btnBox!.y).toBeLessThan(modalBox!.y + 50);
  });

  test('点击关闭按钮可以关闭弹窗', async ({ page }) => {
    const closeBtn = page.locator('.close-edit-btn');
    const editModal = page.locator('#editModal');

    // 确认弹窗是打开的
    await expect(editModal).toHaveClass(/active/);

    // 点击关闭按钮
    await closeBtn.click();

    // 确认弹窗已关闭
    await expect(editModal).not.toHaveClass(/active/);
  });
});
