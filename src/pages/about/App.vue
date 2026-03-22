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

      <div class="card" style="margin-top:20px">
        <h3><i class="fas fa-user-astronaut"></i> 双方心中的角色形象</h3>
        <div class="grid">
          <div style="text-align:center; padding:10px">
            <i class="fas fa-shield-alt" style="color:#ffafbd; font-size:2.2rem"></i>
            <h4 style="margin:10px 0; font-size:1.1rem">心灵伴侣</h4>
            <div style="font-size:0.9rem">"get到对方的玩笑话，理解和接纳对方各种小情绪"</div>
            <div style="font-size:0.9rem">"聊好多好多的话题，聊都聊不完"</div>
          </div>
          <div style="text-align:center; padding:10px">
            <i class="fas fa-moon" style="color:#a1c4fd; font-size:2.2rem"></i>
            <h4 style="margin:10px 0; font-size:1.1rem">仰慕对象</h4>
            <div style="font-size:0.9rem">"喜欢的热情富有感染力，欣赏你的多才多艺"</div>
            <div style="font-size:0.9rem">"喜欢你认真，努力，还有思考的神态"</div>
          </div>
          <div style="text-align:center; padding:10px">
            <i class="fas fa-sun" style="color:#ffc3a0; font-size:2.2rem"></i>
            <h4 style="margin:10px 0; font-size:1.1rem">积极的影响者</h4>
            <div style="font-size:0.9rem">"变得柔软和可爱一点"</div>
            <div style="font-size:0.9rem">"多了解一些美食知识，以后要下厨的嘛"</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 专属记忆珍藏 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-star"></i>
        <h2>专属记忆珍藏</h2>
      </div>

      <div class="grid">
        <div class="card">
          <h3><i class="fas fa-clipboard-list"></i> 心愿清单</h3>
          <div class="info-item">
            <span>看一部电影</span>
            <span class="highlight">✅ 已完成</span>
          </div>
          <div class="info-item">
            <span>逛一趟校园</span>
            <span class="highlight">✅ 已完成</span>
          </div>
          <div class="info-item">
            <span>看一场脱口秀</span>
            <span class="highlight">✅ 已完成</span>
          </div>
          <div class="info-item">
            <span>去图书馆学习</span>
            <span class="highlight">✅ 已完成</span>
          </div>
          <div class="info-item">
            <span>一起看展</span>
            <span class="highlight">✅ 已完成</span>
          </div>
          <div class="info-item">
            <span>一起看日出</span>
            <span class="highlight">⏳ 待完成</span>
          </div>
          <div class="info-item">
            <span>一起坐摩天轮</span>
            <span class="highlight">⏳ 待完成</span>
          </div>
          <div class="info-item">
            <span>去一趟旅行</span>
            <span class="highlight">⏳ 待完成</span>
          </div>
          <div class="info-item">
            <span>一起运动健身</span>
            <span class="highlight">⏳ 待完成</span>
          </div>
          <div class="info-item">
            <span>一起玩游戏</span>
            <span class="highlight">⏳ 待完成</span>
          </div>
          <div class="info-item">
            <span>去一次游乐场</span>
            <span class="highlight">⏳ 待完成</span>
          </div>
          <div class="info-item">
            <span>待续...</span>
            <span class="highlight">🕒 进行中</span>
          </div>
        </div>

        <div class="card">
          <h3><i class="fas fa-music"></i> 专属BGM</h3>
          <div style="text-align:center; margin:15px 0">
            <i class="fas fa-music" style="color:#ff758c; font-size:2rem"></i>
            <h4 style="margin:12px 0; font-size:1.2rem">《静静的》</h4>
            <div style="font-size:0.95rem">庾澄庆</div>
            <div style="margin-top:12px; color:#777; font-size:0.9rem">"空气里躲着什么 有点浪漫的心动..."</div>
          </div>

          <div style="text-align:center; margin:15px 0">
            <i class="fas fa-music" style="color:#ff758c; font-size:2rem"></i>
            <h4 style="margin:12px 0; font-size:1.2rem">《美丽人生》</h4>
            <div style="font-size:0.95rem">梁静茹</div>
            <div style="margin-top:12px; color:#777; font-size:0.9rem">"走进满山遍野的向日葵田..."</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:20px">
        <h3><i class="fas fa-message"></i> 那些难忘的词句</h3>
        <div class="keyword-cloud">
          <div class="keyword keyword-medium">可爱咯</div>
          <div class="keyword keyword-large">同频</div>
          <div class="keyword">默契</div>
          <div class="keyword keyword-medium">温润纯良</div>
          <div class="keyword">爱与自由</div>
          <div class="keyword keyword-large">113.89,22.55</div>
          <div class="keyword keyword-large">恋爱话剧</div>
          <div class="keyword keyword-large">被爱，被关心，体贴照顾</div>
          <div class="keyword keyword-large">不要离开我</div>
          <div class="keyword keyword-large">陪伴，共同成长</div>
          <div class="keyword keyword-large">了解和体验世界</div>
          <div class="keyword keyword-large">狗男女</div>
        </div>
      </div>

      <div class="card" style="margin-top:20px">
        <h3><i class="far fa-comment-dots"></i> 最感动的一句话</h3>
        <div style="padding:15px; text-align:center; font-size:1.05rem; font-style:italic; line-height:1.6">
          "我会帮你摘掉身上的刺。"
        </div>

        <div style="padding:15px; text-align:center; font-size:1.05rem; font-style:italic; line-height:1.6">
          "你想吃什么，我都可以为你做。"
        </div>
      </div>
    </div>

    <!-- 甜蜜瞬间回顾 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-camera-retro"></i>
        <h2>甜蜜瞬间回顾</h2>
      </div>

      <div class="photo-grid">
        <div class="photo-item">
          初遇·约会<br/>
          宝安·梧桐村
        </div>

        <div class="photo-item">
          畅聊·咖啡馆
          <br/>
          散步·壹方城
        </div>

        <div class="photo-item">
          遨游·图书馆
          <br/>
          品·手作佳肴
        </div>

        <div class="photo-item">
          观幕·电影院
          <br/>
          有哭有笑
        </div>

        <div class="photo-item">
          行·校园之旅
          <br/>
          依偎·青草地
        </div>

        <div class="photo-item">
          看展·博物馆
          <br/>
          告白之旅
        </div>

        <div class="photo-item">
          摄影·咖啡馆
          <br/>
          互赠礼物
        </div>
      </div>
    </div>

    <!-- 爱的互动 -->
    <div class="section">
      <div class="section-title">
        <i class="fas fa-feather-alt"></i>
        <h2>爱的互动</h2>
      </div>

      <div class="card">
        <h3><i class="fas fa-heart"></i> 你在我心中是_____分</h3>
        <div style="text-align:center; margin:15px 0">
          <div style="font-size:3.5rem; color:#ff758c; line-height:1">100</div>
          <div style="font-size:1rem; margin-top:5px">（满分100分）</div>
          <div style="margin-top:12px; font-size:0.95rem">因为你是我的百分之百女孩</div>
        </div>
      </div>

      <div class="card" style="margin-top:20px">
        <h3><i class="fas fa-pen-fancy"></i> 写给对方的一句话</h3>
        <div style="padding:15px; text-align:center; font-size:1.05rem; min-height:100px; display:flex; align-items:center; justify-content:center; line-height:1.6">
          感谢你出现在我的生命里，让我的每一天都充满阳光和希望。我爱你，现在和未来。
        </div>
      </div>

      <div style="text-align:center; margin-top:20px">
        <button class="share-btn" @click="shareReport">生成专属报告 & 分享</button>
      </div>
    </div>

    <!-- 图片模态框 -->
    <div id="imageModal" class="modal" :class="{ show: showModal }" @click="closeModal">
      <span class="close" @click="closeModal">&times;</span>
      <img class="modal-content" :src="modalImage">
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
import { ref, computed, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import html2canvas from 'html2canvas'
import { dayTouch, dayRan } from '@/utils/date'
import dogeIcon from '../../assets/imgs/doge.png'
import smileIcon from '../../assets/imgs/smile.png'
import emmIcon from '../../assets/imgs/emoji_emm.png'
import cryIcon from '../../assets/imgs/cry.png'

const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const showModal = ref(false)
const modalImage = ref('')

// 计算天数
const calculatedDays = computed(() => ({
  touch: dayTouch(),
  ran: dayRan()
}))

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

function closeModal() {
  showModal.value = false
}

async function shareReport() {
  const shareBtn = document.querySelector('.share-btn') as HTMLButtonElement
  if (!shareBtn) return

  const originalText = shareBtn.innerHTML
  shareBtn.innerHTML = '<i class="fas fa-check"></i> 已生成，快去分享吧！'

  // 创建爱心动画
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const heart = document.createElement('div')
      heart.innerHTML = '❤'
      heart.style.position = 'fixed'
      heart.style.fontSize = '24px'
      heart.style.color = '#ff758c'
      heart.style.zIndex = '1000'
      heart.style.pointerEvents = 'none'
      heart.style.left = shareBtn.getBoundingClientRect().left + shareBtn.offsetWidth / 2 + 'px'
      heart.style.top = shareBtn.getBoundingClientRect().top + 'px'
      heart.style.transform = 'translate(-50%, -50%)'
      document.body.appendChild(heart)

      const animation = heart.animate([
        { top: shareBtn.getBoundingClientRect().top + 'px', opacity: 1 },
        { top: shareBtn.getBoundingClientRect().top - 100 + 'px', opacity: 0 }
      ], {
        duration: 1200 + Math.random() * 500,
        easing: 'ease-out'
      })

      animation.onfinish = () => {
        heart.remove()
      }
    }, i * 200)
  }

  try {
    const element = document.querySelector('.container') as HTMLElement
    if (element) {
      const canvas = await html2canvas(element, {
        allowTaint: true,
        useCORS: true,
        scale: 1
      })
      const imageData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = '恋爱报告.png'
      link.href = imageData
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('转换失败:', error)
  }

  setTimeout(() => {
    shareBtn.innerHTML = originalText
  }, 3000)
}

onMounted(() => {
  // 初始化 Chart.js 图表
  nextTick(() => {
    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['6月', '7月', '8月'],
          datasets: [{
            label: '每月互动指数',
            data: [82, 85, 88],
            borderColor: '#ff758c',
            backgroundColor: 'rgba(255, 117, 140, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#ff758c',
            pointRadius: 5,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              bodyColor: '#666',
              borderColor: '#ffafbd',
              borderWidth: 1,
              padding: 10
            }
          },
          scales: {
            y: {
              min: 80,
              max: 100,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    }
  })
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

/* 图片模态框 */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.modal.show {
  display: flex;
}

.modal-content {
  max-width: 100%;
  max-height: 90%;
  border-radius: 10px;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  color: white;
  font-size: 35px;
  cursor: pointer;
  z-index: 1001;
}
</style>