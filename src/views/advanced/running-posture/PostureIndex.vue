<template>
  <div class="posture-index">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">跑姿指标解读</h1>
      <p class="page-subtitle">核心跑姿指标的定义、标准值与影响解读</p>
      
      <!-- 分类标签栏 -->
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="currentCategory = category.id"
          :class="['tab-btn', { active: currentCategory === category.id }]"
        >
          {{ category.name }}
        </button>
      </div>
      
      <!-- 指标列表 -->
      <div class="indicator-list">
        <div 
          v-for="indicator in currentCategoryIndicators" 
          :key="indicator.id"
          class="indicator-card"
          @click="toggleIndicatorDetail(indicator.id)"
        >
          <div class="indicator-header">
            <h3>{{ indicator.name }}</h3>
            <span class="expand-icon">{{ expandedIndicatorId === indicator.id ? '▼' : '▶' }}</span>
          </div>
          <div class="indicator-content">
            <div class="indicator-meta">
              <span class="meta-item">
                <strong>标准值：</strong>{{ indicator.standardValue }}
              </span>
              <span class="meta-item">
                <strong>评分等级：</strong>{{ indicator.ratingLevel }}
              </span>
            </div>
            <div v-if="expandedIndicatorId === indicator.id" class="indicator-detail">
              <div class="detail-section">
                <h4>指标定义</h4>
                <p>{{ indicator.definition }}</p>
              </div>
              <div class="detail-section">
                <h4>采集逻辑</h4>
                <p>{{ indicator.collectionLogic }}</p>
              </div>
              <div class="detail-section">
                <h4>影响解读</h4>
                <p>{{ indicator.impactAnalysis }}</p>
              </div>
              <div class="detail-section">
                <h4>对标案例</h4>
                <p>{{ indicator.caseExample }}</p>
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

// 分类数据
const categories = [
  { id: 'spatio-temporal', name: '时空参数（配速效率）' },
  { id: 'vertical-balance', name: '垂直与平衡参数（伤病风险）' },
  { id: 'posture', name: '动作姿态参数（技术优化）' }
]

const currentCategory = ref('spatio-temporal')
const expandedIndicatorId = ref(null)

// 模拟指标数据
const indicatorData = {
  'spatio-temporal': [
    {
      id: 1,
      name: '步频',
      standardValue: '170-180步/分钟',
      ratingLevel: '优秀: 175-180, 良好: 170-175, 一般: <170',
      definition: '每分钟迈出的步数，是衡量跑步效率的重要指标',
      collectionLogic: '通过跑步手表或视频分析测定',
      impactAnalysis: '步频过低会增加着地冲击力，增加伤病风险；步频过高可能导致能量消耗增加',
      caseExample: '跑者A的步频为165步/分钟，通过步频训练后提升至175步/分钟，跑步效率提高，膝盖疼痛减轻'
    },
    {
      id: 2,
      name: '步幅',
      standardValue: '1.2-1.5米',
      ratingLevel: '优秀: 1.4-1.5, 良好: 1.2-1.4, 一般: <1.2',
      definition: '每一步迈出的距离，与步频共同决定跑步速度',
      collectionLogic: '通过跑步手表或视频分析测定',
      impactAnalysis: '步幅过大可能导致着地冲击力增加，增加伤病风险；步幅过小会影响跑步速度',
      caseExample: '跑者B的步幅为1.1米，通过力量训练和技术调整后提升至1.3米，配速提高10秒/公里'
    },
    {
      id: 3,
      name: '触地时间',
      standardValue: '180-250毫秒',
      ratingLevel: '优秀: <200, 良好: 200-220, 一般: >220',
      definition: '脚与地面接触的时间，反映跑步的弹性和效率',
      collectionLogic: '通过专业跑步分析设备测定',
      impactAnalysis: '触地时间过长会降低跑步效率，增加能量消耗；触地时间过短可能增加肌肉负荷',
      caseExample: '跑者C的触地时间为230毫秒，通过弹跳训练后减少至200毫秒，跑步效率明显提高'
    }
  ],
  'vertical-balance': [
    {
      id: 4,
      name: '垂直振幅',
      standardValue: '8-12厘米',
      ratingLevel: '优秀: 8-10, 良好: 10-12, 一般: >12',
      definition: '跑步时身体重心上下移动的幅度',
      collectionLogic: '通过专业跑步分析设备测定',
      impactAnalysis: '垂直振幅过大说明能量浪费在上下运动上，降低跑步效率',
      caseExample: '跑者D的垂直振幅为14厘米，通过核心训练和技术调整后减少至10厘米，跑步经济性提高15%'
    },
    {
      id: 5,
      name: '左右平衡',
      standardValue: '≤5%',
      ratingLevel: '优秀: ≤2%, 良好: 2-5%, 一般: >5%',
      definition: '左右脚触地时间和力量的差异',
      collectionLogic: '通过专业跑步分析设备测定',
      impactAnalysis: '左右平衡差会导致单侧肌肉过度负荷，增加伤病风险',
      caseExample: '跑者E的左右平衡差为8%，通过针对性训练后改善至3%，膝盖疼痛消失'
    }
  ],
  'posture': [
    {
      id: 6,
      name: '躯干前倾角度',
      standardValue: '5-10度',
      ratingLevel: '优秀: 7-10, 良好: 5-7, 一般: <5或>10',
      definition: '跑步时躯干相对于地面的前倾角度',
      collectionLogic: '通过视频分析测定',
      impactAnalysis: '适当的躯干前倾有助于利用重力前进，提高跑步效率',
      caseExample: '跑者F的躯干前倾角度为2度，通过核心训练后调整至8度，配速提高5秒/公里'
    },
    {
      id: 7,
      name: '膝盖角度',
      standardValue: '着地时160-170度，蹬伸时>170度',
      ratingLevel: '优秀: 着地165-170, 蹬伸>175, 良好: 着地160-165, 蹬伸170-175, 一般: 着地<160或>170, 蹬伸<170',
      definition: '跑步时膝盖的弯曲角度',
      collectionLogic: '通过视频分析测定',
      impactAnalysis: '膝盖角度过小会增加关节压力，角度过大可能影响蹬伸效率',
      caseExample: '跑者G的着地膝盖角度为155度，通过技术调整后改善至165度，膝盖疼痛减轻'
    }
  ]
}

// 当前分类的指标
const currentCategoryIndicators = computed(() => {
  return indicatorData[currentCategory.value] || []
})

// 展开/收起指标详情
const toggleIndicatorDetail = (id) => {
  expandedIndicatorId.value = expandedIndicatorId.value === id ? null : id
}
</script>

<style scoped>
.posture-index {
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

/* 分类标签栏 */
.category-tabs {
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

/* 指标列表 */
.indicator-list {
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

.indicator-header h3 {
  color: #333;
  margin: 0;
  font-size: 1.1rem;
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

.detail-section h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.detail-section p {
  color: #555;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .category-tabs {
    flex-direction: column;
  }
  
  .tab-btn {
    width: 100%;
  }
  
  .indicator-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>