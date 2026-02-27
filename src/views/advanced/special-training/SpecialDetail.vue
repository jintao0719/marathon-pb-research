<template>
  <div class="special-detail">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <button @click="goBack" class="back-btn">← 返回列表</button>
      
      <!-- 训练包基本信息 -->
      <div class="package-header">
        <h1 class="package-title">{{ packageData.name }}</h1>
        <div class="package-meta">
          <span class="meta-item">
            <strong>难度等级：</strong>{{ packageData.difficultyText }}
          </span>
          <span class="meta-item">
            <strong>训练周期：</strong>{{ packageData.cycle }} 周
          </span>
          <span class="meta-item">
            <strong>适用人群：</strong>{{ packageData.targetAudience }}
          </span>
          <span class="meta-item">
            <strong>核心目标：</strong>{{ packageData.coreGoal }}
          </span>
        </div>
        <button @click="toggleFavorite" class="favorite-btn">
          {{ isFavorite ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
      </div>
      
      <!-- 页面导航 -->
      <div class="page-nav">
        <button 
          v-for="nav in navItems" 
          :key="nav.id"
          @click="scrollToSection(nav.id)"
          class="nav-btn"
        >
          {{ nav.label }}
        </button>
      </div>
      
      <!-- 基础信息板块 -->
      <section id="basic-info" class="section">
        <h2 class="section-title">基础信息</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>适用人群</h3>
            <p>{{ packageData.targetAudience }}</p>
          </div>
          <div class="info-card">
            <h3>训练周期</h3>
            <p>{{ packageData.cycle }} 周</p>
          </div>
          <div class="info-card">
            <h3>每周训练频次</h3>
            <p>{{ packageData.weeklyFrequency }}</p>
          </div>
          <div class="info-card">
            <h3>预期效果</h3>
            <p>{{ packageData.expectedEffect }}</p>
          </div>
        </div>
        <div class="info-card full-width">
          <h3>注意事项</h3>
          <p>{{ packageData.notes }}</p>
        </div>
      </section>
      
      <!-- 分周训练计划板块 -->
      <section id="weekly-plan" class="section">
        <h2 class="section-title">分周训练计划</h2>
        <div class="plan-table">
          <table>
            <thead>
              <tr>
                <th>周数</th>
                <th>训练频次</th>
                <th>单次训练内容</th>
                <th>执行标准</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="week in packageData.weeklyPlans" :key="week.week">
                <td>{{ week.week }}</td>
                <td>{{ week.frequency }}</td>
                <td>{{ week.content }}</td>
                <td>{{ week.standard }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <!-- 动作教学库板块 -->
      <section id="action-library" class="section">
        <h2 class="section-title">动作教学库</h2>
        <div class="action-list">
          <div v-for="action in packageData.actions" :key="action.id" class="action-card">
            <div class="action-header">
              <h3>{{ action.name }}</h3>
            </div>
            <div class="action-content">
              <div class="action-media">
                <video 
                  v-if="action.video" 
                  controls 
                  class="action-video"
                >
                  <source :src="action.video" type="video/mp4">
                  您的浏览器不支持视频播放
                </video>
                <img v-else :src="action.image" :alt="action.name" class="action-image">
              </div>
              <div class="action-details">
                <div class="detail-item">
                  <h4>动作拆解</h4>
                  <p>{{ action.breakdown }}</p>
                </div>
                <div class="detail-item">
                  <h4>发力要点</h4>
                  <p>{{ action.keyPoints }}</p>
                </div>
                <div class="detail-item">
                  <h4>易错点提示</h4>
                  <p>{{ action.commonMistakes }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 补给与恢复建议 -->
      <section id="supplement" class="section">
        <h2 class="section-title">补给与恢复建议</h2>
        <div class="supplement-grid">
          <div class="supplement-card">
            <h3>补给建议</h3>
            <p>{{ packageData.supplementAdvice }}</p>
          </div>
          <div class="supplement-card">
            <h3>恢复建议</h3>
            <p>{{ packageData.recoveryAdvice }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 模拟训练包数据
const packageData = ref({
  id: 1,
  name: '有氧耐力提升',
  difficulty: 'beginner',
  difficultyText: '入门级',
  cycle: 8,
  targetAudience: '初级跑者',
  coreGoal: '提高有氧基础，增强耐力',
  weeklyFrequency: '3-4次/周',
  expectedEffect: '提高有氧代谢能力，增加跑量耐受性，为长距离跑步打下基础',
  notes: '训练前进行充分热身，训练后进行拉伸放松。根据自身情况调整训练强度，避免过度训练。',
  weeklyPlans: [
    {
      week: 1,
      frequency: '3次',
      content: '轻松跑 3-4公里 × 2次，长距离跑 5公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%'
    },
    {
      week: 2,
      frequency: '3次',
      content: '轻松跑 4-5公里 × 2次，长距离跑 6公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%'
    },
    {
      week: 3,
      frequency: '4次',
      content: '轻松跑 4-5公里 × 3次，长距离跑 8公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%'
    },
    {
      week: 4,
      frequency: '4次',
      content: '轻松跑 5-6公里 × 3次，长距离跑 10公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%'
    },
    {
      week: 5,
      frequency: '4次',
      content: '轻松跑 5-6公里 × 3次，长距离跑 12公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%'
    },
    {
      week: 6,
      frequency: '4次',
      content: '轻松跑 6-7公里 × 3次，长距离跑 14公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%'
    },
    {
      week: 7,
      frequency: '4次',
      content: '轻松跑 6-7公里 × 3次，长距离跑 16公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%'
    },
    {
      week: 8,
      frequency: '3次',
      content: '轻松跑 5-6公里 × 2次，长距离跑 12公里 × 1次',
      standard: '保持轻松配速，心率控制在最大心率的60-70%，为比赛做准备'
    }
  ],
  actions: [
    {
      id: 1,
      name: '正确的跑步姿势',
      video: '',
      image: 'https://via.placeholder.com/400x300?text=正确跑步姿势',
      breakdown: '头部保持正直，肩膀放松，手臂自然摆动，步伐轻盈，着地时前脚掌先着地',
      keyPoints: '核心收紧，身体略微前倾，手臂摆动幅度适中，步频保持在180步/分钟左右',
      commonMistakes: '避免过度跨步，避免膝盖内扣，避免上半身过度晃动'
    },
    {
      id: 2,
      name: '有氧跑呼吸技巧',
      video: '',
      image: 'https://via.placeholder.com/400x300?text=呼吸技巧',
      breakdown: '采用腹式呼吸，保持呼吸节奏与步伐协调，通常是3步一吸，3步一呼',
      keyPoints: '呼吸要深而慢，避免浅快呼吸，在长距离跑步中保持稳定的呼吸节奏',
      commonMistakes: '避免憋气，避免只用胸部呼吸，避免呼吸节奏混乱'
    }
  ],
  supplementAdvice: '训练前30分钟补充碳水化合物，训练中每30-45分钟补充水分和电解质，训练后30分钟内补充蛋白质和碳水化合物',
  recoveryAdvice: '保证充足的睡眠，训练后进行拉伸和泡沫轴放松，适当进行交叉训练如游泳、瑜伽等，避免连续高强度训练'
})

const isFavorite = ref(false)

// 导航项
const navItems = [
  { id: 'basic-info', label: '基础信息' },
  { id: 'weekly-plan', label: '分周计划' },
  { id: 'action-library', label: '动作教学' },
  { id: 'supplement', label: '补给恢复' }
]

// 滚动到指定 section
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 切换收藏状态
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // 实际项目中可以使用 localStorage 存储收藏状态
  if (isFavorite.value) {
    localStorage.setItem(`favorite_${packageData.value.id}`, 'true')
  } else {
    localStorage.removeItem(`favorite_${packageData.value.id}`)
  }
}

// 返回列表页
const goBack = () => {
  router.push('/advance-marathon/special-training/special-list')
}

// 组件挂载时检查收藏状态
onMounted(() => {
  const favorite = localStorage.getItem(`favorite_${packageData.value.id}`)
  isFavorite.value = favorite === 'true'
})
</script>

<style scoped>
.special-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 返回导航 */
.back-nav {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: #5a6fd8;
  transform: translateX(-4px);
}

.back-icon {
  font-size: 1.2rem;
}

.back-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e0e0e0;
}

/* 训练包基本信息 */
.package-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #667eea;
}

.package-title {
  color: #333;
  margin-bottom: 1rem;
}

.package-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  font-size: 0.9rem;
  color: #555;
}

.favorite-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  background: #ffebee;
  border-color: #ffcdd2;
}

/* 页面导航 */
.page-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-btn:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

/* 通用 section 样式 */
.section {
  margin-bottom: 3rem;
}

.section-title {
  color: #333;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

/* 基础信息板块 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.info-card h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.info-card p {
  color: #555;
  margin: 0;
  font-size: 0.9rem;
}

/* 分周训练计划板块 */
.plan-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #667eea;
  color: white;
  font-weight: 500;
}

tr:hover {
  background: #f5f5f5;
}

/* 动作教学库板块 */
.action-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.action-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.action-header h3 {
  color: #333;
  margin-bottom: 1rem;
}

.action-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.action-media {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-video {
  width: 100%;
  border-radius: 8px;
}

.action-image {
  width: 100%;
  border-radius: 8px;
  height: auto;
}

.action-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-details h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.action-details p {
  color: #555;
  margin: 0;
  font-size: 0.9rem;
}

/* 补给与恢复建议 */
.supplement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.supplement-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.supplement-card h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.supplement-card p {
  color: #555;
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .package-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .page-nav {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-content {
    grid-template-columns: 1fr;
  }
  
  .supplement-grid {
    grid-template-columns: 1fr;
  }
  
  table {
    font-size: 0.8rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style>