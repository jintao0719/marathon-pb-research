<template>
  <div class="diagnosis-standard">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">瓶颈诊断维度标准</h1>
      <p class="page-subtitle">六大核心维度的定义、量化标准与问题判定规则</p>
      
      <!-- 维度标签栏 -->
      <div class="dimension-tabs">
        <button 
          v-for="dimension in dimensions" 
          :key="dimension.id"
          @click="currentDimension = dimension.id"
          :class="['tab-btn', { active: currentDimension === dimension.id }]"
        >
          {{ dimension.name }}
        </button>
      </div>
      
      <!-- 维度内容 -->
      <div class="dimension-content">
        <div v-if="currentDimensionData" class="dimension-detail">
          <div class="dimension-header">
            <h2 class="dimension-title">{{ currentDimensionData.name }}</h2>
            <div class="impact-weight">
              <span class="weight-label">对 PB 的影响权重：</span>
              <div class="weight-bar">
                <div 
                  class="weight-fill" 
                  :style="{ width: currentDimensionData.impactWeight + '%' }"
                ></div>
              </div>
              <span class="weight-value">{{ currentDimensionData.impactWeight }}%</span>
            </div>
          </div>
          
          <div class="dimension-definition">
            <h3>核心定义</h3>
            <p>{{ currentDimensionData.definition }}</p>
          </div>
          
          <!-- 指标卡片列表 -->
          <div class="指标-cards">
            <div 
              v-for="indicator in currentDimensionData.indicators" 
              :key="indicator.id"
              class="indicator-card"
              @click="toggleIndicatorDetail(indicator.id)"
            >
              <div class="indicator-header">
                <h4>{{ indicator.name }}</h4>
                <span class="expand-icon">{{ expandedIndicatorId === indicator.id ? '▼' : '▶' }}</span>
              </div>
              <div class="indicator-content">
                <div class="indicator-meta">
                  <span class="meta-item">
                    <strong>标准阈值：</strong>{{ indicator.standardValue }}
                  </span>
                  <span class="meta-item">
                    <strong>评分等级：</strong>{{ indicator.ratingLevel }}
                  </span>
                </div>
                <div v-if="expandedIndicatorId === indicator.id" class="indicator-detail">
                  <div class="detail-section">
                    <h5>采集逻辑</h5>
                    <p>{{ indicator.collectionLogic }}</p>
                  </div>
                  <div class="detail-section">
                    <h5>问题判定规则</h5>
                    <p>{{ indicator.judgmentRule }}</p>
                  </div>
                  <div class="detail-section">
                    <h5>瓶颈根源解读</h5>
                    <p>{{ indicator.rootCause }}</p>
                  </div>
                  <div class="detail-section">
                    <h5>对标案例</h5>
                    <p>{{ indicator.caseExample }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 维度数据
const dimensions = [
  { id: 'aerobic', name: '有氧能力' },
  { id: 'intensity', name: '强度能力' },
  { id: 'technique', name: '技术动作' },
  { id: 'strength', name: '力量水平' },
  { id: 'recovery', name: '恢复管理' },
  { id: 'strategy', name: '赛事策略' }
]

const currentDimension = ref('aerobic')
const expandedIndicatorId = ref(null)

// 模拟维度详细数据
const dimensionData = {
  aerobic: {
    id: 'aerobic',
    name: '有氧能力',
    impactWeight: 40,
    definition: '有氧能力是指身体在氧气充足的情况下持续运动的能力，是马拉松运动的基础能力',
    indicators: [
      {
        id: 1,
        name: '最大摄氧量 (VO2max)',
        standardValue: '45-60 ml/kg/min',
        ratingLevel: '优秀: >55, 良好: 45-55, 一般: <45',
        collectionLogic: '通过专业设备进行心肺功能测试，或通过12分钟跑等测试估算',
        judgmentRule: '低于45 ml/kg/min 时，有氧能力不足，需要加强有氧基础训练',
        rootCause: '有氧能力不足会导致在长距离跑步中过早疲劳，无法维持稳定配速',
        caseExample: '跑者A的VO2max为42 ml/kg/min，全马成绩4:30，通过3个月有氧基础训练后，VO2max提升至48 ml/kg/min，全马成绩提高至4:00'
      },
      {
        id: 2,
        name: '乳酸阈值 (LT)',
        standardValue: '70-85% 最大心率',
        ratingLevel: '优秀: >80%, 良好: 75-80%, 一般: <75%',
        collectionLogic: '通过渐增负荷测试，测定血乳酸浓度达到4mmol/L时的强度',
        judgmentRule: '乳酸阈值低于75%最大心率时，需要进行乳酸阈值训练',
        rootCause: '乳酸阈值低会导致在高强度运动中过早出现疲劳，无法维持配速',
        caseExample: '跑者B的乳酸阈值为72%最大心率，通过6周乳酸阈值训练后，提升至78%最大心率，半马成绩从1:50提高至1:40'
      }
    ]
  },
  intensity: {
    id: 'intensity',
    name: '强度能力',
    impactWeight: 30,
    definition: '强度能力是指在高强度下持续运动的能力，包括速度耐力和爆发力',
    indicators: [
      {
        id: 3,
        name: '5公里配速',
        standardValue: '根据年龄和性别有所不同',
        ratingLevel: '优秀: 年龄组前20%, 良好: 年龄组前40%, 一般: 年龄组后60%',
        collectionLogic: '通过实际测试5公里跑成绩',
        judgmentRule: '5公里配速与全马目标配速差距过大时，需要加强速度训练',
        rootCause: '强度能力不足会导致在比赛中无法维持目标配速，特别是在后半程',
        caseExample: '跑者C的5公里配速为5:30/公里，全马目标配速为6:00/公里，通过速度训练后，5公里配速提升至5:00/公里，全马成绩提高至3:45'
      }
    ]
  },
  technique: {
    id: 'technique',
    name: '技术动作',
    impactWeight: 25,
    definition: '技术动作是指跑步的姿势、步频、步幅等技术要素，直接影响跑步效率和伤病风险',
    indicators: [
      {
        id: 4,
        name: '步频',
        standardValue: '170-180步/分钟',
        ratingLevel: '优秀: 175-180, 良好: 170-175, 一般: <170',
        collectionLogic: '通过跑步手表或视频分析测定',
        judgmentRule: '步频低于170步/分钟时，需要进行步频训练',
        rootCause: '步频过低会增加着地冲击力，增加伤病风险，同时降低跑步效率',
        caseExample: '跑者D的步频为165步/分钟，通过步频训练后提升至175步/分钟，跑步效率提高，膝盖疼痛减轻'
      }
    ]
  },
  strength: {
    id: 'strength',
    name: '力量水平',
    impactWeight: 20,
    definition: '力量水平是指肌肉力量和稳定性，对跑步姿势和耐力有重要影响',
    indicators: [
      {
        id: 5,
        name: '核心力量',
        standardValue: '平板支撑60秒以上',
        ratingLevel: '优秀: >90秒, 良好: 60-90秒, 一般: <60秒',
        collectionLogic: '通过平板支撑、单腿站立等测试',
        judgmentRule: '核心力量不足会导致跑步姿势不稳定，影响跑步效率',
        rootCause: '核心力量不足会导致身体晃动，能量浪费，增加疲劳感',
        caseExample: '跑者E的平板支撑时间为45秒，通过核心训练后提升至90秒，跑步姿势更加稳定，长距离跑步后疲劳感减轻'
      }
    ]
  },
  recovery: {
    id: 'recovery',
    name: '恢复管理',
    impactWeight: 15,
    definition: '恢复管理是指训练后的恢复能力，包括睡眠、营养和主动恢复等',
    indicators: [
      {
        id: 6,
        name: '睡眠质量',
        standardValue: '7-9小时/天',
        ratingLevel: '优秀: 8-9小时, 良好: 7-8小时, 一般: <7小时',
        collectionLogic: '通过睡眠追踪设备或自我记录',
        judgmentRule: '睡眠不足会影响训练效果和身体恢复',
        rootCause: '睡眠不足会导致肌肉恢复缓慢，免疫力下降，训练效果打折扣',
        caseExample: '跑者F每天睡眠6小时，调整作息后睡眠达到8小时，训练恢复速度明显加快，伤病减少'
      }
    ]
  },
  strategy: {
    id: 'strategy',
    name: '赛事策略',
    impactWeight: 10,
    definition: '赛事策略是指比赛中的配速控制、补给策略和心理调节等',
    indicators: [
      {
        id: 7,
        name: '配速稳定性',
        standardValue: '全程配速波动≤5%',
        ratingLevel: '优秀: ≤3%, 良好: 3-5%, 一般: >5%',
        collectionLogic: '通过比赛数据或训练数据分析',
        judgmentRule: '配速波动过大说明赛事策略不合理',
        rootCause: '配速不稳定会导致能量消耗不均，增加疲劳感，影响最终成绩',
        caseExample: '跑者G在比赛中前半程过快，后半程掉速严重，通过配速策略调整后，全程配速更加稳定，成绩提高10分钟'
      }
    ]
  }
}

// 当前维度数据
const currentDimensionData = computed(() => {
  return dimensionData[currentDimension.value]
})

// 展开/收起指标详情
const toggleIndicatorDetail = (id) => {
  expandedIndicatorId.value = expandedIndicatorId.value === id ? null : id
}
</script>

<style scoped>
.diagnosis-standard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
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

.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

/* 维度标签栏 */
.dimension-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.tab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 维度内容 */
.dimension-content {
  margin-top: 2rem;
}

.dimension-detail {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dimension-header {
  margin-bottom: 2rem;
}

.dimension-title {
  color: #333;
  margin-bottom: 1rem;
}

.impact-weight {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.weight-label {
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.weight-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.weight-fill {
  height: 100%;
  background: #667eea;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.weight-value {
  font-weight: bold;
  color: #667eea;
  white-space: nowrap;
}

.dimension-definition {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #eee;
}

.dimension-definition h3 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.dimension-definition p {
  color: #555;
  margin: 0;
}

/* 指标卡片 */
.指标-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.indicator-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.indicator-header h4 {
  color: #333;
  margin: 0;
}

.expand-icon {
  color: #667eea;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.indicator-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  font-size: 0.9rem;
  color: #555;
}

.indicator-detail {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h5 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.detail-section p {
  color: #555;
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .dimension-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
  }
  
  .impact-weight {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .weight-bar {
    width: 100%;
  }
  
  .indicator-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>