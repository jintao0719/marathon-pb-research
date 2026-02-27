<template>
  <div class="special-training-home">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">马拉松专项训练</h1>
      <p class="page-subtitle">7大核心专项训练，科学提升马拉松成绩</p>

      <!-- 跑者水平快速评估 -->
      <div class="assessment-card">
        <h2 class="section-title">
          <span class="section-icon">🎯</span>
          跑者水平评估
        </h2>
        <p class="section-desc">选择您的跑者类型，获取个性化训练推荐</p>

        <div class="runner-types">
          <div
            v-for="type in runnerTypes"
            :key="type.id"
            :class="['runner-type-card', { active: selectedType === type.id }]"
            @click="selectRunnerType(type.id)"
          >
            <div class="type-icon">{{ type.icon }}</div>
            <h3 class="type-name">{{ type.name }}</h3>
            <p class="type-desc">{{ type.description }}</p>
            <div class="type-tags">
              <span class="tag">月跑量{{ type.monthlyMileage }}</span>
              <span class="tag">目标{{ type.target }}</span>
            </div>
          </div>
        </div>

        <!-- 推荐训练优先级 -->
        <div v-if="selectedType" class="recommendation">
          <h3 class="recommendation-title">推荐训练优先级</h3>
          <div class="priority-list">
            <div
              v-for="(item, index) in currentRecommendations"
              :key="index"
              class="priority-item"
            >
              <span class="priority-number">{{ index + 1 }}</span>
              <span class="priority-name">{{ item.name }}</span>
              <span :class="['priority-level', item.level]">{{ item.levelText }}</span>
            </div>
          </div>
          <div class="warning-box" v-if="currentWarnings.length > 0">
            <h4>⚠️ 训练禁忌</h4>
            <ul>
              <li v-for="(warning, index) in currentWarnings" :key="index">{{ warning }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 7大专项训练卡片 -->
      <div class="training-section">
        <h2 class="section-title">
          <span class="section-icon">💪</span>
          七大核心专项训练
        </h2>

        <div class="training-grid">
          <div
            v-for="training in trainingModules"
            :key="training.id"
            class="training-card"
            @click="goToDetail(training.id)"
          >
            <div class="training-header">
              <span class="training-icon">{{ training.icon }}</span>
              <h3 class="training-name">{{ training.name }}</h3>
              <span :class="['difficulty-badge', training.difficulty]">{{ training.difficultyText }}</span>
            </div>
            <p class="training-desc">{{ training.shortDesc }}</p>
            <div class="training-meta">
              <span class="meta-item">
                <strong>周期：</strong>{{ training.cycle }}
              </span>
              <span class="meta-item">
                <strong>频次：</strong>{{ training.frequency }}
              </span>
            </div>
            <div class="training-target">
              <strong>核心目标：</strong>{{ training.target }}
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 配速定义参考 -->
      <div class="pace-reference">
        <h2 class="section-title">
          <span class="section-icon">📊</span>
          配速定义参考
        </h2>
        <div class="pace-table">
          <div class="pace-row header">
            <span>配速类型</span>
            <span>定义标准</span>
            <span>心率区间</span>
          </div>
          <div v-for="pace in paceDefinitions" :key="pace.type" class="pace-row">
            <span class="pace-name">{{ pace.type }}</span>
            <span>{{ pace.definition }}</span>
            <span class="pace-hr">{{ pace.hrZone }}</span>
          </div>
        </div>
      </div>

      <!-- 备战周期框架 -->
      <div class="cycle-framework">
        <h2 class="section-title">
          <span class="section-icon">📅</span>
          16周备战周期框架
        </h2>
        <div class="cycle-timeline">
          <div v-for="phase in cyclePhases" :key="phase.id" class="phase-card">
            <div class="phase-header">
              <span class="phase-weeks">{{ phase.weeks }}</span>
              <h3 class="phase-name">{{ phase.name }}</h3>
            </div>
            <p class="phase-focus">{{ phase.focus }}</p>
            <div class="phase-trainings">
              <span v-for="training in phase.trainings" :key="training" class="phase-training-tag">
                {{ training }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 执行红线 -->
      <div class="red-line-section">
        <h2 class="section-title">
          <span class="section-icon">🚫</span>
          通用执行红线
        </h2>
        <div class="red-line-grid">
          <div v-for="(line, index) in redLines" :key="index" class="red-line-item">
            <span class="red-line-icon">⚠️</span>
            <p>{{ line }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedType = ref('')

// 跑者类型定义
const runnerTypes = [
  {
    id: 'beginner',
    icon: '🌱',
    name: '新手跑者',
    description: '首次备战全马，建立基础有氧能力',
    monthlyMileage: '<150km',
    target: '完赛430-500',
    recommendations: [
      { name: '跑步经济性专项', level: 'high', levelText: '必练' },
      { name: '专项力量耐力', level: 'high', levelText: '必练' },
      { name: '入门版专项长距离', level: 'medium', levelText: '重点' }
    ],
    warnings: [
      '严禁触碰VO2max间歇跑',
      '严禁进行乳酸阈跑训练',
      '严禁低糖原抗疲劳专项'
    ]
  },
  {
    id: 'intermediate',
    icon: '🏃',
    name: '中级跑者',
    description: '有完赛经验，追求成绩突破',
    monthlyMileage: '180-300km',
    target: '330-430',
    recommendations: [
      { name: '马拉松配速跑', level: 'high', levelText: '必练' },
      { name: '专项长距离', level: 'high', levelText: '必练' },
      { name: '乳酸阈跑', level: 'high', levelText: '必练' },
      { name: '后程抗疲劳专项', level: 'medium', levelText: '重点' },
      { name: '力量+经济性专项', level: 'medium', levelText: '辅助' }
    ],
    warnings: []
  },
  {
    id: 'advanced',
    icon: '⚡',
    name: '高级跑者',
    description: '全马330以内，冲击PB',
    monthlyMileage: '≥300km',
    target: 'PB突破',
    recommendations: [
      { name: '马拉松配速跑', level: 'high', levelText: '必练' },
      { name: '乳酸阈跑', level: 'high', levelText: '必练' },
      { name: '专项长距离', level: 'high', levelText: '必练' },
      { name: 'VO2max间歇', level: 'high', levelText: '必练' },
      { name: '后程抗疲劳专项', level: 'medium', levelText: '重点' },
      { name: '精细化力量+经济性', level: 'low', levelText: '精细' }
    ],
    warnings: []
  }
]

// 7大专项训练模块
const trainingModules = [
  {
    id: 'mpace',
    icon: '🎯',
    name: '马拉松配速跑',
    shortDesc: '让身体适应目标配速，将极限强度转化为可持续稳态',
    difficulty: 'medium',
    difficultyText: '中等',
    cycle: '专项期-巅峰期',
    frequency: '7-10天1次',
    target: '适应M配速，解决前快后慢问题'
  },
  {
    id: 'threshold',
    icon: '🔥',
    name: '乳酸阈跑',
    shortDesc: '提升乳酸阈值，延长稳态配速持续时间',
    difficulty: 'high',
    difficultyText: '高阶',
    cycle: '专项期',
    frequency: '10天1次',
    target: '解决后半程乳酸堆积崩盘'
  },
  {
    id: 'longrun',
    icon: '🏔️',
    name: '专项长距离跑',
    shortDesc: '提升肌糖原储备和脂肪氧化能力，模拟比赛负荷',
    difficulty: 'medium',
    difficultyText: '中等',
    cycle: '全周期',
    frequency: '14天1次',
    target: '解决马拉松撞墙核心痛点'
  },
  {
    id: 'vo2max',
    icon: '💨',
    name: 'VO2max间歇跑',
    shortDesc: '提升最大摄氧量，突破成绩瓶颈',
    difficulty: 'high',
    difficultyText: '高阶',
    cycle: '基础期末-专项期初',
    frequency: '10天1次',
    target: '拉高心肺功能天花板'
  },
  {
    id: 'fatigue',
    icon: '🔋',
    name: '后程抗疲劳专项',
    shortDesc: '提升低糖原状态脂肪供能能力，适应比赛后半程',
    difficulty: 'high',
    difficultyText: '高阶',
    cycle: '专项期',
    frequency: '14天1次',
    target: '从根源避免30km撞墙'
  },
  {
    id: 'economy',
    icon: '⚙️',
    name: '跑步经济性专项',
    shortDesc: '提升动作效率，减少能量浪费',
    difficulty: 'low',
    difficultyText: '入门',
    cycle: '全周期',
    frequency: '每周2-3次',
    target: '零成本提升耐力上限'
  },
  {
    id: 'strength',
    icon: '💪',
    name: '专项力量耐力',
    shortDesc: '提升肌群力量耐力与核心稳定性',
    difficulty: 'low',
    difficultyText: '入门',
    cycle: '全周期',
    frequency: '每周2次',
    target: '降低受伤风险，避免后半程变形'
  }
]

// 配速定义
const paceDefinitions = [
  {
    type: 'M配速',
    definition: '全马目标完赛对应匀速配速',
    hrZone: '最大心率80%-85%'
  },
  {
    type: 'T配速',
    definition: '比M配速快10-15秒/km',
    hrZone: '最大心率85%-88%'
  },
  {
    type: 'LSD配速',
    definition: '比M配速慢20-30秒/km',
    hrZone: '最大心率65%-78%'
  },
  {
    type: 'VO2max配速',
    definition: '5km全力竞速比赛配速',
    hrZone: '最大心率90%-95%'
  }
]

// 备战周期
const cyclePhases = [
  {
    id: 'base',
    weeks: '第1-8周',
    name: '基础期',
    focus: '核心打牢有氧基础，低强度为主',
    trainings: ['LSD长距离', '跑步经济性', '力量耐力']
  },
  {
    id: 'specific',
    weeks: '第9-12周',
    name: '专项期',
    focus: '核心开展专项提升训练',
    trainings: ['M配速跑', '乳酸阈跑', '专项长距离', '抗疲劳']
  },
  {
    id: 'peak',
    weeks: '第13-14周',
    name: '巅峰期',
    focus: '完成最高强度专项模拟训练',
    trainings: ['长距离模拟', 'M配速强化', '状态调整']
  },
  {
    id: 'taper',
    weeks: '第15-16周',
    name: '减量期',
    focus: '降量保状态，赛前3周停高强度',
    trainings: ['短距离激活', '轻松跑', '休息恢复']
  }
]

// 执行红线
const redLines = [
  '单周高强度专项训练不超过1次，严禁同一周叠加长距离、间歇跑、阈跑',
  '所有专项训练后次日必须安排轻松恢复跑或完全休息',
  '所有训练配速波动必须控制在±5秒内，后半程不得掉出目标区间',
  '纯新手（月跑量＜150km）严禁触碰VO2max间歇、乳酸阈跑、低糖原抗疲劳专项',
  '单次长距离训练严禁超过35km，避免过度消耗与受伤风险'
]

// 计算当前推荐
const currentRecommendations = computed(() => {
  const type = runnerTypes.find(t => t.id === selectedType.value)
  return type ? type.recommendations : []
})

const currentWarnings = computed(() => {
  const type = runnerTypes.find(t => t.id === selectedType.value)
  return type ? type.warnings : []
})

// 选择跑者类型
const selectRunnerType = (typeId) => {
  selectedType.value = typeId
}

// 跳转到详情页
const goToDetail = (trainingId) => {
  router.push(`/advance-marathon/special-training/${trainingId}`)
}
</script>

<style scoped>
.special-training-home {
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

.section-desc {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* 评估卡片 */
.assessment-card {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #667eea30;
}

/* 跑者类型选择 */
.runner-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.runner-type-card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.runner-type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.runner-type-card.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.type-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.type-name {
  color: #333;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.type-desc {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.type-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.tag {
  background: #667eea20;
  color: #667eea;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

/* 推荐优先级 */
.recommendation {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.recommendation-title {
  color: #333;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.priority-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.priority-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.priority-number {
  width: 28px;
  height: 28px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
}

.priority-name {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.priority-level {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.priority-level.high {
  background: #4caf50;
  color: white;
}

.priority-level.medium {
  background: #ff9800;
  color: white;
}

.priority-level.low {
  background: #9e9e9e;
  color: white;
}

/* 警告框 */
.warning-box {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 1rem;
  border-radius: 4px;
}

.warning-box h4 {
  color: #e65100;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.warning-box ul {
  margin: 0;
  padding-left: 1.25rem;
}

.warning-box li {
  color: #666;
  font-size: 0.85rem;
  margin: 0.25rem 0;
}

/* 训练区块 */
.training-section {
  margin-bottom: 2rem;
}

.training-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.training-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  position: relative;
}

.training-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.training-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.training-icon {
  font-size: 1.5rem;
}

.training-name {
  flex: 1;
  color: #333;
  font-size: 1rem;
  margin: 0;
}

.difficulty-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

.difficulty-badge.low {
  background: #4caf50;
  color: white;
}

.difficulty-badge.medium {
  background: #ff9800;
  color: white;
}

.difficulty-badge.high {
  background: #f44336;
  color: white;
}

.training-desc {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.training-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.meta-item {
  font-size: 0.8rem;
  color: #888;
}

.meta-item strong {
  color: #555;
}

.training-target {
  font-size: 0.8rem;
  color: #667eea;
  background: #667eea10;
  padding: 0.5rem;
  border-radius: 4px;
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

.training-card:hover .card-arrow {
  opacity: 1;
}

/* 配速参考 */
.pace-reference {
  margin-bottom: 2rem;
}

.pace-table {
  background: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
}

.pace-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1.5fr;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}

.pace-row:last-child {
  border-bottom: none;
}

.pace-row.header {
  background: #667eea;
  color: white;
  font-weight: bold;
}

.pace-name {
  color: #667eea;
  font-weight: 600;
}

.pace-hr {
  color: #e91e63;
  font-weight: 500;
}

/* 周期框架 */
.cycle-framework {
  margin-bottom: 2rem;
}

.cycle-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.phase-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.25rem;
  border-left: 4px solid #667eea;
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.phase-weeks {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
}

.phase-name {
  color: #333;
  font-size: 1rem;
  margin: 0;
}

.phase-focus {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.phase-trainings {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.phase-training-tag {
  background: white;
  color: #667eea;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  border: 1px solid #667eea30;
}

/* 执行红线 */
.red-line-section {
  margin-bottom: 1rem;
}

.red-line-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.red-line-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #ffebee;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #f44336;
}

.red-line-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.red-line-item p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }

  .runner-types {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .runner-type-card {
    padding: 1rem;
  }

  .type-icon {
    font-size: 1.75rem;
  }

  .type-name {
    font-size: 0.95rem;
  }

  .type-desc {
    font-size: 0.75rem;
  }

  .training-grid {
    grid-template-columns: 1fr;
  }

  .pace-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .pace-row.header {
    display: none;
  }

  .cycle-timeline {
    grid-template-columns: 1fr;
  }

  .red-line-grid {
    grid-template-columns: 1fr;
  }
}
</style>