import * as dotenv from 'dotenv';
import { chromium } from 'playwright';

// npx tsx scripts/count-gallery-cards.ts

dotenv.config();

async function main() {
  const secretId = process.env.COS_SECRET_ID;
  const secretKey = process.env.COS_SECRET_KEY;

  if (!secretId || !secretKey) {
    console.error('缺少 COS 凭证，请检查 .env 文件');
    process.exit(1);
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:5174/src/pages/gallery/index.html', { waitUntil: 'networkidle' });

    // 等待登录弹窗
    await page.waitForSelector('#cosId', { timeout: 5000 });
    console.log('正在登录...');

    // 填写登录表单
    await page.fill('#cosId', secretId);
    await page.fill('#cosToken', secretKey);
    await page.click('button[type="submit"]');

    // 等待照片加载
    await page.waitForSelector('.item', { timeout: 10000 });

    // 统计卡片数量
    const cardCount = await page.locator('.item').count();
    console.log(`🎉 画廊页面卡片数量: ${cardCount}`);

  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
