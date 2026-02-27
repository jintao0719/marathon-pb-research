<template>
  <div class="advanced-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🏃</span>
          <span class="logo-text">马拉松PB研究院</span>
        </div>
        <div class="nav-links">
          <router-link to="/beginner" class="nav-link">入门专区</router-link>
          <router-link to="/races" class="nav-link">参赛专区</router-link>
          <router-link to="/advanced" class="nav-link active">进阶专区</router-link>
          <router-link to="/feedback" class="nav-link">跑者心声</router-link>
        </div>
      </div>
    </nav>

    <div class="main-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>进阶PB专区</h1>
        <p>科学训练计划与专业工具，助你突破个人最佳成绩</p>
      </div>

      <!-- 功能模块导航 -->
      <div class="modules-grid">
        <!-- 训练课表定制 -->
        <div class="module-card card" @click="$router.push('/advance-marathon/course-custom/course-form')">
          <div class="module-icon">📅</div>
          <h3>训练课表定制</h3>
          <p>基于个人情况生成科学的马拉松备赛课表，支持PDF/图片导出</p>
          <div class="module-link">
            <span>立即定制</span>
            <span class="arrow">→</span>
          </div>
        </div>

        <!-- 专项训练 -->
        <div class="module-card card" @click="$router.push('/advance-marathon/special-training')">
          <div class="module-icon">⚡</div>
          <h3>专项训练</h3>
          <p>7大核心专项训练，科学提升马拉松成绩</p>
          <div class="module-link">
            <span>开始训练</span>
            <span class="arrow">→</span>
          </div>
        </div>

        <!-- 瓶颈诊断 -->
        <div class="module-card card" @click="$router.push('/advance-marathon/bottleneck-diagnosis')">
          <div class="module-icon">🔍</div>
          <h3>瓶颈诊断</h3>
          <p>6大PB核心瓶颈精准判定，获取专属突破方案</p>
          <div class="module-link">
            <span>开始诊断</span>
            <span class="arrow">→</span>
          </div>
        </div>

        <!-- AI 跑姿分析 -->
        <div class="module-card card" @click="$router.push('/advance-marathon/running-posture')">
          <div class="module-icon">🏃</div>
          <h3>AI 跑姿分析</h3>
          <p>跑姿核心指标解读和常见错误动作纠正方案</p>
          <div class="module-link">
            <span>了解详情</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>

      <!-- 快速工具 -->
      <div class="tools-section">
        <h2>快速工具</h2>
        <div class="tools-grid">
          <!-- 配速计算器 -->
          <div class="tool-card card">
            <div class="tool-header">
              <span class="tool-icon">🧮</span>
              <h3>配速计算器</h3>
            </div>
            <p class="tool-desc">输入距离和时长，自动计算配速</p>
            
            <div class="calculator-form">
              <div class="form-group">
                <label>距离 (公里)</label>
                <input 
                  v-model.number="paceCalc.distance" 
                  type="number" 
                  class="input" 
                  placeholder="例如：10"
                  @input="calculatePace"
                />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>小时</label>
                  <input 
                    v-model.number="paceCalc.hours" 
                    type="number" 
                    class="input" 
                    placeholder="0"
                    @input="calculatePace"
                  />
                </div>
                <div class="form-group">
                  <label>分钟</label>
                  <input 
                    v-model.number="paceCalc.minutes" 
                    type="number" 
                    class="input" 
                    placeholder="0"
                    @input="calculatePace"
                  />
                </div>
                <div class="form-group">
                  <label>秒</label>
                  <input 
                    v-model.number="paceCalc.seconds" 
                    type="number" 
                    class="input" 
                    placeholder="0"
                    @input="calculatePace"
                  />
                </div>
              </div>
            </div>

            <div v-if="paceResult" class="calc-result">
              <div class="result-item">
                <span class="result-label">平均配速</span>
                <span class="result-value">{{ paceResult.pace }}/公里</span>
              </div>
              <div class="result-item">
                <span class="result-label">总时长</span>
                <span class="result-value">{{ paceResult.totalTime }}</span>
              </div>
              <div class="result-item">
                <span class="result-label">时速</span>
                <span class="result-value">{{ paceResult.speed }} km/h</span>
              </div>
            </div>
          </div>

          <!-- 成绩预测 -->
          <div class="tool-card card" @click="$router.push('/advance-marathon/prediction')">
            <div class="tool-header">
              <span class="tool-icon">📊</span>
              <h3>成绩预测</h3>
            </div>
            <p class="tool-desc">基于里格利公式+多因素修正，科学预测全马成绩</p>
            <div class="module-link">
              <span>开始预测</span>
              <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { updatePageMeta, pageSEO } from '../utils/seo.js'

// 设置页面SEO
onMounted(() => {
  updatePageMeta(pageSEO.advanced)
})

// 配速计算器
const paceCalc = reactive({
  distance: '',
  hours: 0,
  minutes: 0,
  seconds: 0
})

const paceResult = ref(null)

const calculatePace = () => {
  if (!paceCalc.distance || (paceCalc.hours === 0 && paceCalc.minutes === 0 && paceCalc.seconds === 0)) {
    paceResult.value = null
    return
  }

  const totalSeconds = paceCalc.hours * 3600 + paceCalc.minutes * 60 + paceCalc.seconds
  const pacePerKm = totalSeconds / paceCalc.distance
  
  const paceMin = Math.floor(pacePerKm / 60)
  const paceSec = Math.round(pacePerKm % 60)
  
  const speed = (paceCalc.distance / (totalSeconds / 3600)).toFixed(2)
  
  paceResult.value = {
    pace: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
    totalTime: `${paceCalc.hours}:${paceCalc.minutes.toString().padStart(2, '0')}:${paceCalc.seconds.toString().padStart(2, '0')}`,
    speed: speed
  }
}


</script>

<style scoped>
.advanced-page {
  min-height: 100vh;
  background: var(--bg-gray);
}

/* 导航栏 */
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-blue);
}

.logo-icon {
  font-size: 28px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-blue);
}

/* 主容器 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.page-header p {
  color: var(--text-gray);
}

/* 模块网格 */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.module-card {
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-blue);
}

.module-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.module-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.module-card p {
  color: var(--text-gray);
  line-height: 1.6;
  margin-bottom: 24px;
  font-size: 14px;
}

.module-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-blue);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.module-card:hover .arrow {
  transform: translateX(4px);
}

/* 工具区 */
.tools-section {
  margin-top: 40px;
}

.tools-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.tool-card {
  padding: 20px;
  border: 1px solid var(--border-color);
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.tool-icon {
  font-size: 24px;
}

.tool-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
}

.tool-desc {
  color: var(--text-gray);
  font-size: 13px;
  margin-bottom: 16px;
}

/* 计算器表单 */
.calculator-form {
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: var(--text-gray);
  margin-bottom: 6px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.btn-full {
  width: 100%;
}

/* 计算结果 */
.calc-result {
  background: var(--bg-gray);
  border-radius: 8px;
  padding: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  color: var(--text-gray);
  font-size: 14px;
}

.result-value {
  font-weight: 600;
  color: var(--primary-blue);
}

/* 预测结果 */
.prediction-result {
  margin-top: 16px;
}

.prediction-table {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.prediction-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px 16px;
  font-size: 14px;
}

.prediction-row.header {
  background: var(--bg-gray);
  font-weight: 600;
  color: var(--text-dark);
}

.prediction-row:not(.header) {
  border-top: 1px solid var(--border-color);
  color: var(--text-gray);
}

.prediction-row .highlight {
  color: var(--primary-orange);
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .main-container {
    padding: 16px;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .module-card {
    padding: 24px;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
