<template>
  <div class="container">
    <!--music-->
    <button id="music-player" @click="toggleMusic" :style="{ backgroundColor: isPlaying ? '#f44336' : '#4CAF50' }">
      {{ isPlaying ? '❚❚' : '♪' }}
    </button>
    <audio id="bg-music" loop ref="audioRef">
      <source src="https://aurora-1259397844.cos.ap-nanjing.myqcloud.com/nana/loveing.mp3" type="audio/mpeg">
      您的浏览器不支持音频元素。
    </audio>
    <!--end music-->

    <!-- 漂浮的心形背景 -->
    <div id="hearts-container">
      <div v-for="i in 20" :key="i" class="heart" :style="{
        left: Math.random() * 100 + 'vw',
        top: Math.random() * 100 + 'vh',
        fontSize: (Math.random() * 8 + 12) + 'px',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (Math.random() * 5 + 5) + 's'
      }">{{ i % 2 === 0 ? '❤' : '💖' }}</div>
    </div>

    <div class="header">
      <h1>温宝&娜宝·恋爱报告</h1>
      <p>时光如诗，爱意如歌。这些时光，我们共同编织了无数美好的回忆</p>
    </div>

    <!-- 基础信息 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-heart"></i>
        <h2>我们的爱情档案</h2>
      </div>
      <div class="grid">
        <div class="card">
          <h3><i class="fas fa-calendar-alt"></i> 恋爱日记</h3>
          <div class="info-item">
            <span>相识日期：</span>
            <span class="highlight">2025年6月19日</span>
          </div>
          <div class="info-item">
            <span>认识的天数：</span>
            <span class="highlight" id="p_dayTouch">{{ calculatedDays.touch }}天</span>
          </div>
          <div class="info-item">
            <span>在一起日期：</span>
            <span class="highlight">2025年8月3日</span>
          </div>
          <div class="info-item">
            <span>在一起的天数：</span>
            <span class="highlight" id="p_dayRan">{{ calculatedDays.ran }}天</span>
          </div>
          <div class="info-item">
            <span>相遇地点：</span>
            <span class="highlight">深圳·宝安梧桐村</span>
          </div>
          <div class="info-item">
            <span>爱情坐标：</span>
            <span class="highlight">(113.89°E, 22.55°N)</span>
          </div>
        </div>

        <div class="card">
          <h3><i class="fas fa-signature"></i> 甜蜜互动</h3>
          <div class="info-item">
            <span>我叫你：</span>
            <span class="highlight">娜宝、娜酱</span>
          </div>
          <div class="info-item">
            <span>你叫我：</span>
            <span class="highlight">温宝、温饱、小温</span>
          </div>
          <div class="info-item">
            <span>关系标签：</span>
            <span class="highlight">winner组合,明天组合</span>
          </div>
          <div class="info-item">
            <span>常用词：</span>
            <span class="highlight">喜欢咯,可爱咯</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 照片墙 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-camera-retro"></i>
        <h2>我们的照片墙</h2>
      </div>
      <div style="text-align:center; margin-top:20px">
        <button class="cook-btn" @click="goToGallery">点击前往~</button>
      </div>
    </div>

    <!-- 时间轴 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-history"></i>
        <h2>时光记忆轴</h2>
      </div>

      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-date">2025年6月19日</div>
          <div>初讯相触，在二狗APP</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-date">2023年6月29日</div>
          <div>第一次正式约会，梧桐村看景</div>
        </div>
        <div class="timeline-item">
          <div class="timeline-date">2023年8月03日</div>
          <div>我鼓起勇气表白，我们正式在一起</div>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-chart-line"></i>
        <h2>爱的数据统计</h2>
      </div>

      <div class="stats-container">
        <div class="stat-card">
          <i class="fas fa-comment-dots"></i>
          <div class="stat-number">19,180</div>
          <div class="stat-label">聊天总条数</div>
        </div>

        <div class="stat-card">
          <i class="fas fa-phone-alt"></i>
          <div class="stat-number">84.1</div>
          <div class="stat-label">通话总时长(小时)</div>
        </div>

        <div class="stat-card">
          <i class="fas fa-calendar-check"></i>
          <div class="stat-number">7</div>
          <div class="stat-label">约会次数</div>
        </div>

        <div class="stat-card">
          <i class="fas fa-utensils"></i>
          <div class="stat-number">12</div>
          <div class="stat-label">共同用餐</div>
        </div>
      </div>

      <div class="topic-title">
        <h3><i class="fas fa-heart-pulse"></i>互动指数</h3>
      </div>
      <div class="chart-container">
        <canvas id="monthlyChart"></canvas>
      </div>

      <div class="grid">
        <div class="card">
          <h3><i class="far fa-smile"></i> 表情包统计</h3>
          <div class="info-item">
            <span>我发送表情总数：</span>
            <span class="highlight">2,153个</span>
          </div>
          <div class="info-item">
            <span>我最爱的表情：</span>
            <span>
              <img :src="dogeIcon" width="20px" height="20px"/>
              <img :src="smileIcon" width="20px" height="20px"/>
              <img :src="emmIcon" width="20px" height="20px"/>
            </span>
          </div>

          <div class="info-item">
            <span>你发送表情总数：</span>
            <span class="highlight">948个</span>
          </div>
          <div class="info-item">
            <span>你最爱的表情：</span>
            <span>
              <img :src="dogeIcon" width="20px" height="20px"/>
              <img :src="cryIcon" width="22px" height="22px"/>
              <img :src="smileIcon" width="20px" height="20px"/>
            </span>
          </div>
        </div>

        <div class="card">
          <h3><i class="fas fa-gift"></i> 礼物与惊喜</h3>
          <div class="info-item">
            <span>互赠礼物：</span>
            <span class="highlight">8次</span>
          </div>
          <div class="info-item">
            <span>相互投喂：</span>
            <span class="highlight">7次</span>
          </div>
          <div class="info-item">
            <span>最感动礼物：</span>
            <span class="highlight">手写情书[2025.08.03]</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 情感分析 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-brain"></i>
        <h2>情感分析报告</h2>
      </div>

      <div class="keyword-cloud">
        <div class="keyword keyword-large">陪伴</div>
        <div class="keyword keyword-medium">信任</div>
        <div class="keyword keyword-large">理解</div>
        <div class="keyword">默契</div>
        <div class="keyword keyword-medium">温暖</div>
        <div class="keyword">成长</div>
        <div class="keyword keyword-large">包容</div>
        <div class="keyword">支持</div>
        <div class="keyword keyword-medium">浪漫</div>
      </div>

      <div class="grid">
        <div class="card">
          <h3><i class="fas fa-heart"></i> 甜蜜指数</h3>
          <div style="text-align:center; font-size:2.2rem; color:#ff758c; margin:12px 0">96%</div>
          <div class="progress-container">
            <div class="progress-bar" style="width:96%">96%</div>
          </div>
          <div style="margin-top:12px; text-align:center; font-size:0.95rem">
            超过99%的情侣！你们的爱情像蜜糖一样甜蜜
          </div>
        </div>

        <div class="card">
          <h3><i class="fas fa-hands-helping"></i> 相处模式</h3>
          <div style="margin:12px 0">
            <div>互补指数：92%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width:92%"></div>
            </div>
          </div>
          <div style="margin:12px 0">
            <div>默契程度：88%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width:88%"></div>
            </div>
          </div>
          <div style="margin:12px 0">
            <div>依赖程度：85%</div>
            <div class="progress-container">
              <div class="progress-bar" style="width:85%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>恋爱养成报告</p>
      <p>愿这份报告成为我们爱情旅程的美好见证</p>
      <p>❤️ 爱在当下，期许未来 ❤️</p>
      <p id="p_now_date">『{{ currentDate }}』</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dogeIcon from '../../assets/imgs/doge.png'
import smileIcon from '../../assets/imgs/smile.png'
import emmIcon from '../../assets/imgs/emoji_emm.png'
import cryIcon from '../../assets/imgs/cry.png'

const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)

// 计算天数
const calculatedDays = computed(() => {
  const meetDate = new Date('2025-06-19')
  const startDate = new Date('2025-08-03')
  const today = new Date()

  const touchDays = Math.floor((today.getTime() - meetDate.getTime()) / (1000 * 60 * 60 * 24))
  const ranDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return { touch: touchDays, ran: ranDays }
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN')
})

function toggleMusic() {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

function goToGallery() {
  window.location.href = './gallery.html'
}

onMounted(() => {
  // 初始化图表等逻辑
  console.log('Index page mounted')
})
</script>

<style scoped>
/* 心形动画 */
.heart {
  position: fixed;
  color: #ff6b6b;
  animation: float 6s ease-in-out infinite;
  z-index: -1;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}
</style>