<template>
  <div class="bottleneck-home">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">马拉松PB瓶颈诊断</h1>
      <p class="page-subtitle">精准判定6大核心瓶颈，获取专属突破方案</p>

      <!-- 真性瓶颈判定规则 -->
      <div class="rules-card">
        <h2 class="section-title">
          <span class="section-icon">📋</span>
          真性瓶颈判定规则
        </h2>
        <p class="rules-desc">只有同时满足以下3个条件，才判定为真性训练瓶颈</p>
        <div class="rules-list">
          <div class="rule-item">
            <span class="rule-number">1</span>
            <div class="rule-content">
              <h4>时间维度</h4>
              <p>连续4-6周严格执行备赛课表，无中断、无偷减/乱加量，无伤病、睡眠/工作/营养等重大外部干扰</p>
            </div>
          </div>
          <div class="rule-item">
            <span class="rule-number">2</span>
            <div class="rule-content">
              <h4>核心指标维度</h4>
              <p>和PB目标强相关的核心能力指标无正向提升，甚至持续下滑</p>
            </div>
          </div>
          <div class="rule-item">
            <span class="rule-number">3</span>
            <div class="rule-content">
              <h4>排除维度</h4>
              <p>已排除正常疲劳、赛前减量、课表执行不到位、临时伤病等非能力类干扰因素</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速自测评估 -->
      <div class="assessment-card">
        <h2 class="section-title">
          <span class="section-icon">🔍</span>
          快速自测评估
        </h2>
        <p class="assessment-desc">根据您的实际情况选择，快速定位可能的瓶颈类型</p>

        <div class="assessment-form">
          <div class="question-group">
            <h3 class="question-title">1. 您的备赛执行情况如何？</h3>
            <div class="options">
              <label class="option-item">
                <input type="radio" v-model="assessment.execution" value="strict" />
                <span>严格执行课表4-6周，无中断</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.execution" value="partial" />
                <span>基本执行，偶有调整/减量</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.execution" value="poor" />
                <span>执行不到位，经常缺课/加量</span>
              </label>
            </div>
          </div>

          <div class="question-group">
            <h3 class="question-title">2. 目标PB配速下最长能持续多久？</h3>
            <div class="options">
              <label class="option-item">
                <input type="radio" v-model="assessment.paceDuration" value="less60" />
                <span>不足60分钟，心率快速飙升</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.paceDuration" value="60to90" />
                <span>60-90分钟，无法突破</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.paceDuration" value="more90" />
                <span>超过90分钟，但后半程掉速</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.paceDuration" value="stable" />
                <span>能稳定维持，但比赛崩</span>
              </label>
            </div>
          </div>

          <div class="question-group">
            <h3 class="question-title">3. 长距离训练（25km+）后半程表现？</h3>
            <div class="options">
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="crash" />
                <span>严重撞墙，配速掉超20%</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="drop" />
                <span>匀速掉速，无剧烈撞墙</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="form" />
                <span>跑姿变形，核心垮塌</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="good" />
                <span>能维持配速，体感尚可</span>
              </label>
            </div>
          </div>

          <div class="question-group">
            <h3 class="question-title">4. 近期身体状态如何？</h3>
            <div class="options">
              <label class="option-item">
                <input type="radio" v-model="assessment.condition" value="fatigue" />
                <span>持续疲劳，静息心率升高</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.condition" value="injury" />
                <span>频繁伤病，多次中断训练</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.condition" value="stomach" />
                <span>补给后肠胃不适/抽筋</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.condition" value="normal" />
                <span>身体正常，但成绩不涨</span>
              </label>
            </div>
          </div>

          <button @click="analyzeBottleneck" class="btn btn-primary btn-analyze">
            分析瓶颈类型
          </button>
        </div>

        <!-- 分析结果 -->
        <div v-if="analysisResult" class="analysis-result">
          <h3 class="result-title">可能的瓶颈类型</h3>
          <div class="result-list">
            <div
              v-for="(result, index) in analysisResult"
              :key="index"
              class="result-item"
              @click="goToDetail(result.id)"
            >
              <span class="result-icon">{{ result.icon }}</span>
              <div class="result-info">
                <h4>{{ result.name }}</h4>
                <p>{{ result.matchReason }}</p>
              </div>
              <span class="match-rate">匹配度 {{ result.matchRate }}%</span>
              <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6大瓶颈类型 -->
      <div class="bottleneck-section">
        <h2 class="section-title">
          <span class="section-icon">🎯</span>
          6大PB核心瓶颈
        </h2>

        <div class="bottleneck-grid">
          <div
            v-for="bottleneck in bottleneckTypes"
            :key="bottleneck.id"
            class="bottleneck-card"
            @click="goToDetail(bottleneck.id)"
          >
            <div class="bottleneck-header">
              <span class="bottleneck-icon">{{ bottleneck.icon }}</span>
              <h3 class="bottleneck-name">{{ bottleneck.name }}</h3>
              <span :class="['prevalence-badge', bottleneck.prevalence]">{{ bottleneck.prevalenceText }}</span>
            </div>
            <p class="bottleneck-short-desc">{{ bottleneck.shortDesc }}</p>
            <div class="bottleneck-symptoms">
              <strong>典型症状：</strong>
              <span v-for="(symptom, idx) in bottleneck.symptoms" :key="idx" class="symptom-tag">{{ symptom }}</span>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 自测评估数据
const assessment = reactive({
  execution: '',
  paceDuration: '',
  longRun: '',
  condition: ''
})

const analysisResult = ref(null)

// 6大瓶颈类型
const bottleneckTypes = [
  {
    id: 'aerobic',
    icon: '🏔️',
    name: '有氧基础底层瓶颈',
    shortDesc: '有氧基础不足，目标配速缺乏有氧支撑',
    prevalence: 'high',
    prevalenceText: '80%跑者',
    symptoms: ['E配速心率不降反升', '30km后必撞墙', '最大摄氧量无提升']
  },
  {
    id: 'pace',
    icon: '⏱️',
    name: 'PB专项配速耐力瓶颈',
    shortDesc: '有氧够了，但目标配速扛不完42km',
    prevalence: 'medium',
    prevalenceText: '常见',
    symptoms: ['M配速无法突破90分钟', '半马能稳全马崩', '乳酸阈配速停滞']
  },
  {
    id: 'economy',
    icon: '⚙️',
    name: '跑步经济性瓶颈',
    shortDesc: '跑姿缺陷、力量不足导致能量浪费',
    prevalence: 'medium',
    prevalenceText: '常见',
    symptoms: ['同等配速心率更高', '后半程跑姿变形', '频繁伤病中断']
  },
  {
    id: 'recovery',
    icon: '🔋',
    name: '恢复与过度训练瓶颈',
    shortDesc: '越练越累，成绩不涨反降',
    prevalence: 'medium',
    prevalenceText: '常见',
    symptoms: ['静息心率持续升高', '疲劳24小时不缓解', '免疫力下降频繁感冒']
  },
  {
    id: 'nutrition',
    icon: '🥤',
    name: '营养补给瓶颈',
    shortDesc: '训练能达标，比赛必崩',
    prevalence: 'low',
    prevalenceText: '较少',
    symptoms: ['30km后血糖暴跌', '补给后肠胃不适', '比赛中频繁抽筋']
  },
  {
    id: 'strategy',
    icon: '📊',
    name: '备赛节奏与策略瓶颈',
    shortDesc: '训练型选手，比赛永远跑不出PB',
    prevalence: 'low',
    prevalenceText: '较少',
    symptoms: ['训练好比赛差5分钟+', '起跑配速失控', '赛前减量不当']
  }
]

// 分析瓶颈
const analyzeBottleneck = () => {
  if (!assessment.execution || !assessment.paceDuration || !assessment.longRun || !assessment.condition) {
    alert('请完成所有问题的选择')
    return
  }

  const results = []

  // 根据选择匹配瓶颈类型
  if (assessment.paceDuration === 'less60' && assessment.longRun === 'crash') {
    results.push({
      id: 'aerobic',
      icon: '🏔️',
      name: '有氧基础底层瓶颈',
      matchRate: 95,
      matchReason: '目标配速持续时间短+长距离严重撞墙'
    })
  }

  if (assessment.paceDuration === '60to90' && assessment.longRun === 'drop') {
    results.push({
      id: 'pace',
      icon: '⏱️',
      name: 'PB专项配速耐力瓶颈',
      matchRate: 90,
      matchReason: '配速无法突破90分钟+后半程匀速掉速'
    })
  }

  if (assessment.longRun === 'form' || assessment.condition === 'injury') {
    results.push({
      id: 'economy',
      icon: '⚙️',
      name: '跑步经济性瓶颈',
      matchRate: 85,
      matchReason: '跑姿变形+频繁伤病'
    })
  }

  if (assessment.condition === 'fatigue') {
    results.push({
      id: 'recovery',
      icon: '🔋',
      name: '恢复与过度训练瓶颈',
      matchRate: 88,
      matchReason: '持续疲劳+静息心率升高'
    })
  }

  if (assessment.condition === 'stomach') {
    results.push({
      id: 'nutrition',
      icon: '🥤',
      name: '营养补给瓶颈',
      matchRate: 92,
      matchReason: '补给后肠胃不适+比赛中抽筋'
    })
  }

  if (assessment.paceDuration === 'stable' && assessment.execution === 'strict') {
    results.push({
      id: 'strategy',
      icon: '📊',
      name: '备赛节奏与策略瓶颈',
      matchRate: 87,
      matchReason: '训练能达标但比赛崩'
    })
  }

  // 如果没有匹配到，推荐最常见的有氧瓶颈
  if (results.length === 0) {
    results.push({
      id: 'aerobic',
      icon: '🏔️',
      name: '有氧基础底层瓶颈',
      matchRate: 70,
      matchReason: '建议优先排查有氧基础'
    })
  }

  // 按匹配度排序
  results.sort((a, b) => b.matchRate - a.matchRate)

  analysisResult.value = results
}

// 跳转到详情页
const goToDetail = (id) => {
  router.push(`/advance-marathon/bottleneck-diagnosis/${id}`)
}
</script>

<style scoped>
.bottleneck-home {
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
  margin-bottom: 1.5rem;
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

/* 页面标题 */
.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

/* 通用区块样式 */
.section-title {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.3rem;
}

/* 判定规则卡片 */
.rules-card {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #ff9800;
}

.rules-desc {
  color: #e65100;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rule-item {
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rule-number {
  width: 32px;
  height: 32px;
  background: #ff9800;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.rule-content h4 {
  color: #333;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.rule-content p {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

/* 评估卡片 */
.assessment-card {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #667eea30;
}

.assessment-desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* 评估表单 */
.assessment-form {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
}

.question-group {
  margin-bottom: 1.5rem;
}

.question-title {
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  background: #f0f0f0;
}

.option-item input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.option-item span {
  color: #333;
  font-size: 0.9rem;
}

.btn-analyze {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  margin-top: 1rem;
}

/* 分析结果 */
.analysis-result {
  margin-top: 1.5rem;
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
}

.result-title {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.result-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.result-icon {
  font-size: 1.5rem;
}

.result-info {
  flex: 1;
}

.result-info h4 {
  color: #333;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.result-info p {
  color: #666;
  font-size: 0.8rem;
  margin: 0;
}

.match-rate {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.arrow {
  color: #667eea;
  font-size: 1.2rem;
}

/* 瓶颈类型区块 */
.bottleneck-section {
  margin-bottom: 1rem;
}

.bottleneck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
}

.bottleneck-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  position: relative;
}

.bottleneck-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.bottleneck-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.bottleneck-icon {
  font-size: 1.5rem;
}

.bottleneck-name {
  flex: 1;
  color: #333;
  font-size: 1rem;
  margin: 0;
}

.prevalence-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

.prevalence-badge.high {
  background: #f44336;
  color: white;
}

.prevalence-badge.medium {
  background: #ff9800;
  color: white;
}

.prevalence-badge.low {
  background: #4caf50;
  color: white;
}

.bottleneck-short-desc {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.bottleneck-symptoms {
  font-size: 0.8rem;
  color: #888;
}

.bottleneck-symptoms strong {
  color: #555;
}

.symptom-tag {
  display: inline-block;
  background: #e0e0e0;
  color: #666;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  margin: 0.25rem 0.25rem 0 0;
  font-size: 0.75rem;
}

.card-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 1.2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bottleneck-card:hover .card-arrow {
  opacity: 1;
}

/* 按钮 */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }

  .bottleneck-grid {
    grid-template-columns: 1fr;
  }

  .rule-item {
    flex-direction: column;
    gap: 0.5rem;
  }

  .result-item {
    flex-wrap: wrap;
  }

  .card-arrow {
    display: none;
  }
}
</style>