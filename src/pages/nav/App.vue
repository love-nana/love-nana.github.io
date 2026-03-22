<template>
  <div class="nav-page">
    <!-- 纸张纹理背景层 -->
    <div class="paper-texture"></div>
    <div class="grain-overlay"></div>

    <!-- 顶部装饰丝带 -->
    <div class="ribbon-trail">
      <svg class="ribbon-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
        <path fill="#8B4557" opacity="0.12" d="M0,30 Q25,10 50,30 T100,30 T150,30 T200,30 L200,60 L0,60 Z"/>
      </svg>
    </div>

    <!-- 页面主内容 -->
    <main class="content">
      <!-- 标题区 -->
      <header class="hero">
        <div class="flourish-above">
          <svg viewBox="0 0 120 20" class="flourish-svg">
            <path fill="none" stroke="#C9A96E" stroke-width="1.5" d="M0,10 Q15,2 30,10 T60,10 T90,10 T120,10"/>
            <circle cx="60" cy="10" r="3" fill="#C9A96E"/>
            <circle cx="40" cy="10" r="1.5" fill="#C9A96E"/>
            <circle cx="80" cy="10" r="1.5" fill="#C9A96E"/>
          </svg>
        </div>

        <div class="emblem">
          <span class="emblem-text">Our Story</span>
        </div>

        <h1 class="title">我们的回忆小站</h1>

        <p class="subtitle">
          <span class="subtitle-line"></span>
          <span class="subtitle-text">Since 2025.08.03</span>
          <span class="subtitle-line"></span>
        </p>

        <div class="days-counter">
          <div class="counter-ring">
            <svg class="ring-svg" viewBox="0 0 100 100">
              <circle class="ring-bg" cx="50" cy="50" r="45"/>
              <circle class="ring-progress" cx="50" cy="50" r="45" :stroke-dasharray="circumference" :stroke-dashoffset="progress"/>
            </svg>
            <div class="counter-inner">
              <span class="counter-number">{{ daysTogether }}</span>
              <span class="counter-label">Days</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 导航卡片区 -->
      <section class="nav-section">
        <div class="cards-row">
          <!-- 纪念日卡片 -->
          <a href="./about.html" class="polaroid" style="--rotation: -3deg">
            <div class="polaroid-inner">
              <div class="polaroid-image">
                <div class="image-placeholder love-letter">
                  <svg viewBox="0 0 80 60" class="letter-icon">
                    <rect x="5" y="10" width="70" height="45" rx="2" fill="#F5E6D3" stroke="#C9A96E" stroke-width="1"/>
                    <path d="M5,10 L40,35 L75,10" fill="none" stroke="#C9A96E" stroke-width="1"/>
                    <path d="M5,55 L25,40 L40,50" fill="#F5E6D3" stroke="#C9A96E" stroke-width="1"/>
                    <path d="M75,55 L55,40 L40,50" fill="#F5E6D3" stroke="#C9A96E" stroke-width="1"/>
                    <circle cx="40" cy="30" r="8" fill="#8B4557" opacity="0.8"/>
                    <path d="M36,28 Q40,34 44,28" fill="none" stroke="#F5E6D3" stroke-width="1.5"/>
                  </svg>
                </div>
              </div>
              <div class="polaroid-caption">
                <span class="caption-title">纪念日</span>
                <span class="caption-sub">Our Anniversary</span>
              </div>
            </div>
            <div class="polaroid-shadow"></div>
          </a>

          <!-- 画廊卡片 -->
          <a href="./gallery.html" class="polaroid" style="--rotation: 2deg">
            <div class="polaroid-inner">
              <div class="polaroid-image">
                <div class="image-placeholder polaroid-cam">
                  <svg viewBox="0 0 80 60" class="cam-icon">
                    <rect x="10" y="15" width="60" height="40" rx="4" fill="#2C2C2C"/>
                    <rect x="15" y="20" width="30" height="25" rx="2" fill="#1a1a1a"/>
                    <circle cx="30" cy="32" r="10" fill="#3d3d3d" stroke="#C9A96E" stroke-width="1"/>
                    <circle cx="30" cy="32" r="6" fill="#4a4a4a"/>
                    <circle cx="28" cy="30" r="2" fill="#C9A96E" opacity="0.5"/>
                    <rect x="50" y="22" width="15" height="8" rx="1" fill="#8B4557"/>
                    <circle cx="65" cy="18" r="3" fill="#8B4557"/>
                  </svg>
                </div>
              </div>
              <div class="polaroid-caption">
                <span class="caption-title">时光相册</span>
                <span class="caption-sub">Photo Gallery</span>
              </div>
            </div>
            <div class="polaroid-shadow"></div>
          </a>

          <!-- 管理后台卡片 -->
          <a href="./gallery-edit.html" class="polaroid" style="--rotation: -1deg">
            <div class="polaroid-inner">
              <div class="polaroid-image">
                <div class="image-placeholder pencil-case">
                  <svg viewBox="0 0 80 60" class="pencil-icon">
                    <rect x="10" y="20" width="60" height="25" rx="4" fill="#C9A96E"/>
                    <rect x="15" y="25" width="8" height="15" fill="#F5E6D3"/>
                    <polygon points="15,40 19,45 23,40" fill="#C9A96E"/>
                    <rect x="28" y="25" width="8" height="15" fill="#8B4557"/>
                    <polygon points="28,40 32,45 36,40" fill="#C9A96E"/>
                    <rect x="41" y="25" width="8" height="15" fill="#2C2C2C"/>
                    <polygon points="41,40 45,45 49,40" fill="#C9A96E"/>
                    <circle cx="58" cy="32" r="5" fill="#F5E6D3" stroke="#C9A96E"/>
                    <circle cx="58" cy="32" r="2" fill="#C9A96E"/>
                  </svg>
                </div>
              </div>
              <div class="polaroid-caption">
                <span class="caption-title">整理回忆</span>
                <span class="caption-sub">Manage Photos</span>
              </div>
            </div>
            <div class="polaroid-shadow"></div>
          </a>
        </div>
      </section>

      <!-- 底部印章装饰 -->
      <footer class="footer-stamp">
        <div class="stamp-ring">
          <svg viewBox="0 0 100 100" class="stamp-svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#8B4557" stroke-width="2" stroke-dasharray="4,2"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#8B4557" stroke-width="1"/>
            <text x="50" y="45" text-anchor="middle" class="stamp-text">LOVE</text>
            <text x="50" y="60" text-anchor="middle" class="stamp-text-small">NANA</text>
          </svg>
        </div>
        <p class="footer-quote">～ 愿与你共度余生 ～</p>
      </footer>
    </main>

    <!-- 浮动装饰 - 散落的花瓣/爱心 -->
    <div class="floating-elements">
      <span v-for="i in 8" :key="i" class="float-petals" :class="`petal-${i}`">
        <svg viewBox="0 0 20 20" width="14" height="14">
          <path v-if="i % 3 === 0" fill="#C9A96E" opacity="0.35" d="M10,2 Q12,8 10,18 Q8,8 10,2"/>
          <path v-else-if="i % 3 === 1" fill="#8B4557" opacity="0.25" d="M10,2 Q12,8 10,18 Q8,8 10,2"/>
          <path v-else fill="#D4A5A5" opacity="0.3" d="M10,2 Q12,8 10,18 Q8,8 10,2"/>
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { dayRan } from '@/utils/date'

const daysTogether = ref(0)
const circumference = 2 * Math.PI * 45
const progress = computed(() => {
  const maxDisplay = 500
  const percent = Math.min(daysTogether.value / maxDisplay, 1)
  return circumference * (1 - percent)
})

onMounted(() => {
  daysTogether.value = dayRan()
})
</script>

<style scoped>
/* ===== 基础变量 ===== */
:root {
  --cream: #FAF5EF;
  --cream-dark: #F0E4D7;
  --burgundy: #8B4557;
  --burgundy-light: #A65D6A;
  --gold: #C9A96E;
  --gold-light: #E5D4B3;
  --ink: #2C2C2C;
  --dusty-rose: #D4A5A5;
}

/* ===== 页面容器 ===== */
.nav-page {
  height: 100vh;
  background: var(--cream);
  position: relative;
  overflow: hidden;
  font-family: 'Georgia', 'Times New Roman', serif;
}

/* 纸张纹理 */
.paper-texture {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(200, 180, 160, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(139, 69, 87, 0.05) 0%, transparent 50%),
    linear-gradient(180deg, var(--cream) 0%, var(--cream-dark) 100%);
  pointer-events: none;
}

.grain-overlay {
  position: fixed;
  inset: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* ===== 丝带装饰 ===== */
.ribbon-trail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  overflow: hidden;
}

.ribbon-svg {
  width: 100%;
  height: 100%;
}

/* ===== 主内容 ===== */
.content {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px 30px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* ===== 标题区 ===== */
.hero {
  text-align: center;
  margin-bottom: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flourish-above {
  margin-bottom: 8px;
}

.flourish-svg {
  width: 120px;
  height: 20px;
}

.emblem {
  display: inline-block;
  padding: 6px 20px;
  border: 1px solid var(--gold);
  border-radius: 2px;
  margin-bottom: 8px;
  position: relative;
}

.emblem::before,
.emblem::after {
  content: "✦";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gold);
  font-size: 8px;
}

.emblem::before { left: 6px; }
.emblem::after { right: 6px; }

.emblem-text {
  font-family: 'Georgia', serif;
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--gold);
  text-transform: uppercase;
}

.title {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: normal;
  color: var(--ink);
  margin: 0 0 10px;
  letter-spacing: 8px;
  position: relative;
  display: inline-block;
}

.title::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.subtitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 10px 0 15px;
}

.subtitle-line {
  width: 40px;
  height: 1px;
  background: var(--gold);
}

.subtitle-text {
  font-family: 'Georgia', serif;
  font-size: 14px;
  color: var(--burgundy);
  letter-spacing: 3px;
  font-style: italic;
}

/* ===== 天数计数器 ===== */
.days-counter {
  display: flex;
  justify-content: center;
}

.counter-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--cream-dark);
  stroke-width: 4;
}

.ring-progress {
  fill: none;
  stroke: var(--burgundy);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.counter-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.counter-number {
  font-family: 'Georgia', serif;
  font-size: 2rem;
  color: var(--burgundy);
  line-height: 1;
}

.counter-label {
  font-family: 'Georgia', serif;
  font-size: 0.65rem;
  color: var(--gold);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 4px;
}

/* ===== 导航卡片区 ===== */
.nav-section {
  //flex-shrink: 0;
  flex: 1;
  margin-bottom: 0;
}

.cards-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: nowrap;
}

/* ===== 宝丽来风格卡片 ===== */
.polaroid {
  text-decoration: none;
  transform: rotate(var(--rotation, 0deg));
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  flex: 1;
  max-width: 200px;
  min-width: 0;
}

.polaroid:hover {
  transform: rotate(0deg) translateY(-12px) scale(1.03);
  z-index: 10;
}

.polaroid-inner {
  background: #FAFAFA;
  padding: 8px 8px 25px;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.08),
    0 8px 16px rgba(0,0,0,0.08),
    0 20px 40px rgba(0,0,0,0.1);
  position: relative;
}

.polaroid-inner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold-light), var(--gold), var(--gold-light));
}

.polaroid-image {
  width: 100%;
  height: 90px;
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border: 1px solid rgba(0,0,0,0.05);
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.letter-icon, .cam-icon, .pencil-icon {
  width: 50px;
  height: 38px;
}

.polaroid-caption {
  text-align: center;
  padding-top: 8px;
}

.caption-title {
  display: block;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 0.95rem;
  color: var(--ink);
  margin-bottom: 4px;
}

.caption-sub {
  display: block;
  font-family: 'Georgia', serif;
  font-size: 0.6rem;
  color: var(--gold);
  letter-spacing: 2px;
  font-style: italic;
}

.polaroid-shadow {
  position: absolute;
  bottom: -8px;
  left: 5%;
  width: 90%;
  height: 12px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%);
  z-index: -1;
  transition: all 0.4s ease;
}

.polaroid:hover .polaroid-shadow {
  bottom: -15px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%);
}

/* ===== 底部印章 ===== */
.footer-stamp {
  flex-shrink: 0;
  margin-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.stamp-ring {
  width: 50px;
  height: 50px;
  margin: 0;
  opacity: 0.7;
  transform: rotate(-15deg);
  animation: stampFloat 4s ease-in-out infinite;
}

@keyframes stampFloat {
  0%, 100% { transform: rotate(-15deg) translateY(0); }
  50% { transform: rotate(-12deg) translateY(-5px); }
}

.stamp-svg {
  width: 100%;
  height: 100%;
}

.stamp-text {
  font-family: 'Georgia', serif;
  font-size: 16px;
  fill: var(--burgundy);
  letter-spacing: 4px;
}

.stamp-text-small {
  font-family: 'Georgia', serif;
  font-size: 10px;
  fill: var(--burgundy);
  letter-spacing: 6px;
}

.footer-quote {
  font-family: 'Georgia', serif;
  font-size: 11px;
  color: var(--burgundy);
  letter-spacing: 4px;
  font-style: italic;
  opacity: 0.8;
}

/* ===== 浮动花瓣 ===== */
.floating-elements {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.float-petals {
  position: absolute;
  animation: petalFall linear infinite;
  opacity: 0;
}

.petal-1 { left: 10%; animation-duration: 15s; animation-delay: 0s; }
.petal-2 { left: 25%; animation-duration: 18s; animation-delay: 2s; }
.petal-3 { left: 40%; animation-duration: 16s; animation-delay: 4s; }
.petal-4 { left: 55%; animation-duration: 20s; animation-delay: 1s; }
.petal-5 { left: 70%; animation-duration: 17s; animation-delay: 3s; }
.petal-6 { left: 85%; animation-duration: 19s; animation-delay: 5s; }
.petal-7 { left: 15%; animation-duration: 14s; animation-delay: 6s; }
.petal-8 { left: 60%; animation-duration: 21s; animation-delay: 7s; }

@keyframes petalFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* ===== 页面加载动画 ===== */
.hero, .polaroid, .footer-stamp {
  animation: fadeInUp 0.8s ease-out backwards;
}

.hero { animation-delay: 0.2s; }
.polaroid:nth-child(1) { animation-delay: 0.5s; }
.polaroid:nth-child(2) { animation-delay: 0.65s; }
.polaroid:nth-child(3) { animation-delay: 0.8s; }
.footer-stamp { animation-delay: 1s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .content {
    padding: 30px 15px 20px;
  }

  .cards-row {
    gap: 10px;
  }

  .polaroid {
    max-width: 150px;
  }

  .polaroid-image {
    height: 70px;
  }

  .counter-ring {
    width: 70px;
    height: 70px;
  }

  .counter-number {
    font-size: 1.6rem;
  }

  .title {
    letter-spacing: 4px;
  }
}
</style>
