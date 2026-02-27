<template>
  <div class="training-detail">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <button @click="goBack" class="back-btn">← 返回列表</button>

      <!-- 训练头部信息 -->
      <div class="training-header" v-if="trainingData">
        <div class="header-icon">{{ trainingData.icon }}</div>
        <h1 class="training-title">{{ trainingData.name }}</h1>
        <span :class="['difficulty-badge', trainingData.difficulty]">{{ trainingData.difficultyText }}</span>
        <p class="training-short-desc">{{ trainingData.shortDesc }}</p>
      </div>

      <!-- 训练内容 -->
      <div class="training-content" v-if="trainingData">
        <!-- 适用人群 -->
        <section class="content-section">
          <h2 class="section-title">一、适用人群</h2>
          <div class="target-audience">
            <div v-for="(item, index) in trainingData.targetAudience" :key="index" class="audience-item">
              <span class="audience-icon">{{ item.icon }}</span>
              <span class="audience-text">{{ item.text }}</span>
            </div>
          </div>
        </section>

        <!-- 核心训练目标 -->
        <section class="content-section">
          <h2 class="section-title">二、核心训练目标</h2>
          <p class="goal-text">{{ trainingData.goal }}</p>
        </section>

        <!-- 适配训练周期 -->
        <section class="content-section">
          <h2 class="section-title">三、适配训练周期</h2>
          <div class="cycle-info">
            <div class="cycle-item">
              <span class="cycle-label">训练周期：</span>
              <span class="cycle-value">{{ trainingData.cycle }}</span>
            </div>
            <div class="cycle-item">
              <span class="cycle-label">训练频次：</span>
              <span class="cycle-value">{{ trainingData.frequency }}</span>
            </div>
          </div>
        </section>

        <!-- 标准化执行方案 -->
        <section class="content-section">
          <h2 class="section-title">四、标准化执行方案</h2>
          <div class="plan-table">
            <div class="plan-row header">
              <span>适配版本</span>
              <span>总距离</span>
              <span>详细执行流程</span>
            </div>
            <div v-for="(plan, index) in trainingData.plans" :key="index" class="plan-row">
              <span class="plan-version">{{ plan.version }}</span>
              <span class="plan-distance">{{ plan.distance }}</span>
              <span class="plan-detail">{{ plan.detail }}</span>
            </div>
          </div>
        </section>

        <!-- 执行标准与避坑红线 -->
        <section class="content-section">
          <h2 class="section-title">五、执行标准 & 避坑红线</h2>
          <div class="standards-list">
            <div v-for="(standard, index) in trainingData.standards" :key="index" class="standard-item">
              <span class="standard-icon">⚠️</span>
              <p>{{ standard }}</p>
            </div>
          </div>
        </section>

        <!-- 配速参考 -->
        <section class="content-section" v-if="trainingData.paceReference">
          <h2 class="section-title">六、配速参考</h2>
          <div class="pace-reference-box">
            <p v-for="(pace, index) in trainingData.paceReference" :key="index" class="pace-item">
              <strong>{{ pace.type }}：</strong>{{ pace.desc }}
            </p>
          </div>
        </section>
      </div>

      <!-- 未找到训练 -->
      <div v-else class="not-found">
        <p>未找到该训练内容</p>
        <button @click="goBack" class="btn btn-primary">返回列表</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 7大专项训练详细数据
const trainingDetails = {
  mpace: {
    icon: '🎯',
    name: '马拉松配速跑',
    shortDesc: '让身体适应目标配速，将极限强度转化为可持续稳态',
    difficulty: 'medium',
    difficultyText: '中等',
    goal: '让身体适应目标配速的生理负荷，将目标配速从极限强度转化为可持续稳态强度，解决比赛前快后慢、配速大幅波动问题。',
    cycle: '专项期（第9-12周）、巅峰期（第13-14周）',
    frequency: '每7-10天1次，单周最多1次',
    targetAudience: [
      { icon: '🌱', text: '入门级：3个月以上有氧基础、首次备战全马，月跑量150-200km，目标完赛430-500' },
      { icon: '🏃', text: '进阶级：1次以上全马完赛经验，月跑量200-300km，目标330-430' },
      { icon: '⚡', text: '高阶级：全马330以内、冲击PB的精英跑者' }
    ],
    plans: [
      {
        version: '入门版',
        distance: '8-12km',
        detail: '热身2km（LSD配速）+ 主课M配速4-8km + 冷身2km（慢走+拉伸）'
      },
      {
        version: '进阶版',
        distance: '14-22km',
        detail: '热身2km（LSD配速）+ 主课M配速10-18km + 冷身2km'
      },
      {
        version: '高阶版',
        distance: '24-30km',
        detail: '热身2km（LSD配速）+ 前10km LSD配速 + 后18km全程M配速 + 冷身2km'
      }
    ],
    standards: [
      '全程配速稳定，后半程配速不得低于M配速区间，否则立即停止转为有氧慢跑',
      '严禁为凑距离强行顶配速，心率超标时必须降速，避免过度疲劳',
      '无有氧基础的纯新手，严禁直接开展长距离M配速训练'
    ]
  },
  threshold: {
    icon: '🔥',
    name: '乳酸阈跑',
    shortDesc: '提升乳酸阈值，延长稳态配速持续时间',
    difficulty: 'high',
    difficultyText: '高阶',
    goal: '提升乳酸阈值，让身体在更高配速下不堆积乳酸，延长稳态配速持续时间，解决后半程崩盘问题。',
    cycle: '专项期（第9-12周），巅峰期减量，赛前3周完全停止',
    frequency: '每10天1次，单月最多3次',
    targetAudience: [
      { icon: '🏃', text: '6个月以上有氧基础、1次以上全马完赛经验' },
      { icon: '⚡', text: '比赛30km后因乳酸堆积出现配速崩盘的跑者' },
      { icon: '📊', text: '月跑量≥180km，纯新手禁用' }
    ],
    plans: [
      {
        version: '入门版（持续阈跑）',
        distance: '8-12km',
        detail: '热身3km（LSD配速）+ 主课T配速持续跑20-30分钟 + 冷身2km'
      },
      {
        version: '进阶版（间歇阈跑）',
        distance: '12-15km',
        detail: '热身3km（LSD配速）+ 主课T配速1km×6-8组，组间仅休息60秒 + 冷身2km'
      },
      {
        version: '高阶版（爬坡阈跑）',
        distance: '12-16km',
        detail: '热身3km（LSD配速）+ 主课2%-3%缓坡T配速800m×8-10组，组间休息90秒 + 冷身2km'
      }
    ],
    standards: [
      '间歇阈跑组间休息严禁超过90秒，否则乳酸完全代谢，训练效果归零',
      '严禁冲成全力无氧间歇，T配速为临界强度，非极限冲刺',
      '最后一组配速比第一组慢超10秒时，说明强度超标，下次需减量降速'
    ]
  },
  longrun: {
    icon: '🏔️',
    name: '专项长距离跑',
    shortDesc: '提升肌糖原储备和脂肪氧化能力，模拟比赛负荷',
    difficulty: 'medium',
    difficultyText: '中等',
    goal: '提升肌糖原储备、脂肪氧化供能效率、长距离肌肉抗疲劳能力，模拟比赛负荷，解决马拉松撞墙核心痛点。',
    cycle: '基础期末段（第7-8周）、专项期（第9-12周）、巅峰期（第13-14周）',
    frequency: '每14天1次，全备战周期最多完成4次30km以上',
    targetAudience: [
      { icon: '🌱', text: '所有备战全马的跑者，尤其是首次备战' },
      { icon: '🏃', text: '过往比赛30km后撞墙的跑者' },
      { icon: '📅', text: '3个月以上有氧基础，月跑量≥120km' }
    ],
    plans: [
      {
        version: '入门版（负分割渐进）',
        distance: '28-30km',
        detail: '热身2km + 前10km LSD配速 + 中间10km比M配速慢10秒 + 最后8km M配速 + 冷身2km'
      },
      {
        version: '进阶版（定速专项）',
        distance: '30-32km',
        detail: '热身2km + 中间26-28km全程M配速 + 冷身2km，完全复刻比赛配速节奏'
      },
      {
        version: '高阶版（全场景模拟）',
        distance: '32-35km',
        detail: '完全复刻比赛日出发时间、补给节奏、装备；前5km比M配速慢5秒 + 中间25km M配速 + 最后5km比M配速快3秒 + 冷身2km'
      }
    ],
    standards: [
      '单次长距离严禁超过35km，否则恢复周期过长，提升受伤风险',
      '必须严格按照比赛节奏补给，提前适应肠胃运动耐受度',
      '禁止跑成全程慢摇LSD，否则无法锻炼专项耐力'
    ]
  },
  vo2max: {
    icon: '💨',
    name: 'VO2max间歇跑',
    shortDesc: '提升最大摄氧量，突破成绩瓶颈',
    difficulty: 'high',
    difficultyText: '高阶',
    goal: '提升最大摄氧量，拉高心肺功能与氧气利用能力的天花板，突破成绩瓶颈。',
    cycle: '基础期末段（第5-8周）、专项期初段（第9-10周），赛前8周完全停止',
    frequency: '每10天1次，单月最多3次',
    targetAudience: [
      { icon: '⚡', text: '6个月以上有氧基础，月跑量≥200km' },
      { icon: '📈', text: '有氧扎实、成绩进入长期瓶颈期的跑者' },
      { icon: '🚫', text: '纯新手、有氧薄弱者严禁使用' }
    ],
    plans: [
      {
        version: '入门版',
        distance: '8-10km',
        detail: '热身3km + 主课800m×4组，组间休息时长=跑步时长 + 冷身2km'
      },
      {
        version: '进阶版',
        distance: '12-15km',
        detail: '热身3km + 主课1000m×6-8组，组间休息时长=跑步时长的80% + 冷身2km'
      },
      {
        version: '高阶版',
        distance: '15-18km',
        detail: '热身3km + 主课1200m×8-10组，组间休息时长=跑步时长的50% + 冷身2km'
      }
    ],
    standards: [
      '每组配速波动≤±3秒，最后一组配速比第一组慢超5秒，说明强度超标',
      '严禁冲单组极限速度，核心是每组强度稳定，而非单组最快',
      '必须在塑胶跑道等软质路面训练，严禁硬水泥地训练'
    ]
  },
  fatigue: {
    icon: '🔋',
    name: '后程抗疲劳专项跑',
    shortDesc: '提升低糖原状态脂肪供能能力，适应比赛后半程',
    difficulty: 'high',
    difficultyText: '高阶',
    goal: '提升低糖原状态下的脂肪供能能力，提前适应比赛后半程疲劳状态，从根源避免撞墙。',
    cycle: '专项期（第9-12周），赛前4周完全停止',
    frequency: '每14天1次，全备战周期最多3次',
    targetAudience: [
      { icon: '🏃', text: '过往全马30km后严重撞墙、配速掉速超30秒/km的跑者' },
      { icon: '📊', text: '6个月以上有氧基础，月跑量≥180km' },
      { icon: '🚫', text: '纯新手禁用' }
    ],
    plans: [
      {
        version: '入门版（空腹有氧进阶）',
        distance: '12-18km',
        detail: '晨起空腹，仅补电解质水，完成90-120分钟稳态有氧，配速比LSD慢5秒，心率65%-75%'
      },
      {
        version: '进阶版（长距离低糖原嵌入）',
        distance: '28-30km',
        detail: '前14km空腹状态（仅补水/电解质），配速比M配速慢15秒；14km后按比赛节奏补糖，后14km逐步提速到M配速'
      },
      {
        version: '高阶版（疲劳状态间歇）',
        distance: '26km',
        detail: '先完成20km LSD慢跑，不休息直接完成M配速1km×4组，组间慢跑休息2分钟 + 冷身2km'
      }
    ],
    standards: [
      '低糖原训练必须严格控制在有氧区间，严禁跑快，否则会分解肌肉、降低免疫力',
      '严禁高温、身体疲劳、生病时训练，严禁30km以上长距离全程不补糖',
      '赛前2周必须完全停止，避免过度消耗影响比赛状态'
    ]
  },
  economy: {
    icon: '⚙️',
    name: '跑步经济性专项训练',
    shortDesc: '提升动作效率，减少能量浪费',
    difficulty: 'low',
    difficultyText: '入门',
    goal: '提升跑步动作效率，减少能量浪费，让用户用更少体力、更低心率跑出更快配速，零成本提升耐力上限。',
    cycle: '全备战周期均可训练，无周期限制',
    frequency: '每周2-3次，每次10-15分钟',
    targetAudience: [
      { icon: '👥', text: '所有跑者，纯新手可安全训练' },
      { icon: '📊', text: '步频＜170、跑姿有明显缺陷的跑者' },
      { icon: '💓', text: '同等配速下心率远高于同水平跑者的跑者' }
    ],
    plans: [
      {
        version: '技术激活训练',
        distance: '热身必做',
        detail: '小步跑、高抬腿、后蹬跑、折叠摆腿、侧向交叉步，每个动作30秒×2组，组间休息30秒'
      },
      {
        version: '步频专项（入门版）',
        distance: '40-60分钟',
        detail: '慢跑，节拍器定180步频，每跑10分钟嵌入3分钟180步频节奏跑，重复3次'
      },
      {
        version: '步频专项（进阶版）',
        distance: '60-90分钟',
        detail: '慢跑，全程维持180步频，配速稳定，心率不超有氧区间'
      }
    ],
    standards: [
      '优先保证动作质量，步频提升循序渐进，不要一次性从160强行提到180',
      '不要刻意改变落地方式，步频提升后落地方式会自然优化',
      '禁止为凑步频缩小步幅到踮脚跑，反而降低动作效率'
    ]
  },
  strength: {
    icon: '💪',
    name: '马拉松专项力量耐力训练',
    shortDesc: '提升肌群力量耐力与核心稳定性',
    difficulty: 'low',
    difficultyText: '入门',
    goal: '提升跑步相关肌群的力量耐力与核心稳定性，减少能量浪费，降低受伤风险，避免后半程因肌肉疲劳导致的配速崩盘。',
    cycle: '全备战周期均可训练，基础期重点强化，专项期维持，赛前2周减量停训',
    frequency: '每周2次，每次30-40分钟',
    targetAudience: [
      { icon: '👥', text: '所有跑者，纯新手必须纳入训练' },
      { icon: '🏃', text: '比赛后半程核心不稳、动作变形的跑者' },
      { icon: '🩹', text: '有跑步伤病、力量薄弱的跑者' }
    ],
    plans: [
      {
        version: '核心稳定性',
        distance: '20分钟',
        detail: '死虫式60秒×3组、平板支撑60秒×3组、侧桥45秒/侧×3组、鸟狗式45秒/侧×3组、腹式呼吸训练5分钟'
      },
      {
        version: '下肢专项力量',
        distance: '20分钟',
        detail: '保加利亚分腿蹲、自重弓步走、罗马尼亚硬拉、站姿提踵、蚌式髋外展，每个动作12-15次/组，3-4组'
      },
      {
        version: '功能性激活',
        distance: '5分钟',
        detail: '臀桥、髋屈肌拉伸、小腿拉伸、踝关节环绕，激活臀大肌，避免大腿代偿'
      }
    ],
    standards: [
      '马拉松核心需求是力量耐力，而非绝对力量，严禁练大重量深蹲、卧推等绝对力量训练',
      '不要只练腹肌，忽略深层核心与后侧链（臀、腘绳肌）',
      '动作变形时立即停止，不要强行凑次数'
    ]
  }
}

// 根据路由参数获取训练数据
const trainingData = computed(() => {
  const trainingId = route.params.id
  return trainingDetails[trainingId] || null
})

// 返回列表
const goBack = () => {
  router.push('/advance-marathon/special-training')
}
</script>

<style scoped>
.training-detail {
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

/* 训练头部 */
.training-header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 2rem;
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.training-title {
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
}

.difficulty-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.difficulty-badge.low {
  background: #4caf50;
}

.difficulty-badge.medium {
  background: #ff9800;
}

.difficulty-badge.high {
  background: #f44336;
}

.training-short-desc {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* 内容区块 */
.content-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.content-section:last-child {
  border-bottom: none;
}

.section-title {
  color: #667eea;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-left: 0.75rem;
  border-left: 4px solid #667eea;
}

/* 适用人群 */
.target-audience {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.audience-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.audience-icon {
  font-size: 1.5rem;
}

.audience-text {
  color: #333;
  font-size: 0.9rem;
}

/* 训练目标 */
.goal-text {
  color: #333;
  font-size: 1rem;
  line-height: 1.8;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

/* 周期信息 */
.cycle-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cycle-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.cycle-label {
  color: #666;
  font-weight: 500;
}

.cycle-value {
  color: #667eea;
  font-weight: 600;
}

/* 执行方案表格 */
.plan-table {
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

.plan-row {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  gap: 1rem;
}

.plan-row:last-child {
  border-bottom: none;
}

.plan-row.header {
  background: #667eea;
  color: white;
  font-weight: bold;
}

.plan-version {
  color: #667eea;
  font-weight: 600;
}

.plan-distance {
  color: #333;
  font-weight: 500;
}

.plan-detail {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 执行标准 */
.standards-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.standard-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff3e0;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.standard-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.standard-item p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 配速参考 */
.pace-reference-box {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.pace-item {
  margin: 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
}

.pace-item strong {
  color: #667eea;
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found p {
  color: #666;
  margin-bottom: 1rem;
}

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
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }

  .training-header {
    padding: 1.5rem;
  }

  .training-title {
    font-size: 1.4rem;
  }

  .plan-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .plan-row.header {
    display: none;
  }

  .cycle-item {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>