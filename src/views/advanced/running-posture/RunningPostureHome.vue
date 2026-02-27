<template>
  <div class="running-posture-home">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">跑步经济性跑姿分析</h1>
      <p class="page-subtitle">科学跑姿黄金标准 · 零成本自测方法 · 精准调整方案</p>

      <!-- 核心定义 -->
      <div class="definition-card">
        <div class="definition-icon">💡</div>
        <div class="definition-content">
          <h3>跑步经济性的核心</h3>
          <p>相同配速下，身体<span class="highlight">能量消耗最低</span>、<span class="highlight">关节负荷最小</span>、<span class="highlight">动作可持续性最强</span>的跑步模式。不存在绝对统一的"完美跑姿"，但有基于运动生物力学的通用黄金标准。</p>
        </div>
      </div>

      <!-- 黄金标准 -->
      <div class="standards-section">
        <h2 class="section-title">
          <span class="section-icon">🏆</span>
          最经济跑步姿势的黄金标准
        </h2>

        <div class="standards-grid">
          <div v-for="(standard, index) in goldenStandards" :key="index" class="standard-card">
            <div class="standard-header">
              <span class="standard-icon">{{ standard.icon }}</span>
              <h3>{{ standard.title }}</h3>
            </div>
            <div class="standard-body">
              <div class="core-standard">
                <h4>核心标准</h4>
                <p>{{ standard.standard }}</p>
              </div>
              <div class="biomechanics">
                <h4>生物力学逻辑</h4>
                <p>{{ standard.biomechanics }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 跑姿自测评估 -->
      <div class="assessment-section">
        <h2 class="section-title">
          <span class="section-icon">📱</span>
          跑姿自测评估
        </h2>
        <p class="section-desc">根据您的跑步感受和数据分析，快速定位可能的跑姿问题</p>

        <div class="assessment-form">
          <div class="question-group">
            <h3 class="question-title">1. 跑步后哪里最先出现酸痛/疼痛？</h3>
            <div class="options">
              <label v-for="(option, idx) in painOptions" :key="idx" class="option-item">
                <input type="radio" v-model="assessment.painLocation" :value="option.value" />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </div>

          <div class="question-group">
            <h3 class="question-title">2. 您的步频情况如何？</h3>
            <div class="options">
              <label class="option-item">
                <input type="radio" v-model="assessment.cadence" value="low" />
                <span>&lt;165步/分钟，步幅过大</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.cadence" value="normal" />
                <span>165-175步/分钟</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.cadence" value="good" />
                <span>≥180步/分钟</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.cadence" value="unknown" />
                <span>不清楚/未测量</span>
              </label>
            </div>
          </div>

          <div class="question-group">
            <h3 class="question-title">3. 跑步时的身体感受？</h3>
            <div class="options">
              <label class="option-item">
                <input type="radio" v-model="assessment.feeling" value="bumpy" />
                <span>身体上下颠簸严重，像"蹦蹦跳跳"</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.feeling" value="unstable" />
                <span>身体左右晃动，核心不稳</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.feeling" value="tense" />
                <span>肩颈紧绷，呼吸不畅</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.feeling" value="smooth" />
                <span>动作流畅，体感轻松</span>
              </label>
            </div>
          </div>

          <div class="question-group">
            <h3 class="question-title">4. 长距离后半程表现？</h3>
            <div class="options">
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="form" />
                <span>跑姿严重变形，核心垮塌</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="knee" />
                <span>膝盖不适，感觉承受冲击</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="maintain" />
                <span>能维持跑姿，但比较费力</span>
              </label>
              <label class="option-item">
                <input type="radio" v-model="assessment.longRun" value="good" />
                <span>跑姿稳定，越跑越顺</span>
              </label>
            </div>
          </div>

          <button @click="analyzePosture" class="btn btn-primary btn-analyze">
            分析跑姿问题
          </button>
        </div>

        <!-- 分析结果 -->
        <div v-if="analysisResult" class="analysis-result">
          <h3 class="result-title">可能的跑姿问题</h3>
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

      <!-- 零成本自测方法 -->
      <div class="selftest-section">
        <h2 class="section-title">
          <span class="section-icon">📹</span>
          零成本自我跑姿分析（3步完成）
        </h2>

        <div class="steps-container">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>静态基础评估</h3>
            <p class="step-desc">排查先天/体态根源问题</p>
            <div class="step-detail">
              <p><strong>操作方法：</strong>自然站立，双脚与肩同宽，全身放松，用手机正面、侧面、背面各拍1张全身照</p>
              <div class="check-items">
                <h4>核心分析维度：</h4>
                <ul>
                  <li><strong>正面：</strong>是否有高低肩、骨盆高低不一、膝盖内扣/外撇、足内翻/外翻</li>
                  <li><strong>侧面：</strong>是否有骨盆前倾/后倾、含胸驼背、头前伸、膝盖超伸</li>
                  <li><strong>背面：</strong>是否有脊柱侧弯、骨盆旋转、足弓塌陷</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">2</div>
            <h3>动态慢动作拍摄</h3>
            <p class="step-desc">核心环节，多角度拍摄</p>
            <div class="step-detail">
              <p><strong>操作方法：</strong>手机开启240fps慢动作模式，分别在侧面、正面、背面三个角度，拍摄日常训练配速下的平地跑步（单次10-20米，重复3-5次）</p>
              <div class="check-items">
                <h4>核心分析维度：</h4>
                <ul>
                  <li><strong>侧面视角（最关键）：</strong>落地点是否在重心正下方、是否有跨步刹车、躯干前倾角度、垂直振幅、小腿折叠程度、触地模式</li>
                  <li><strong>正面视角：</strong>摆臂是否过中线、膝盖是否内扣/外撇、脚尖是否朝正前方、身体是否左右晃动</li>
                  <li><strong>背面视角：</strong>骨盆是否旋转、是否有足内翻/外翻、落地时是否重心偏移</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">3</div>
            <h3>体感+数据交叉验证</h3>
            <p class="step-desc">结合日常跑步定位问题</p>
            <div class="step-detail">
              <p><strong>操作方法：</strong>结合日常跑步的体感、运动手表的核心数据，交叉定位跑姿问题</p>
              <div class="check-items">
                <h4>核心分析维度：</h4>
                <ul>
                  <li><strong>体感维度：</strong>跑步后哪里最先酸痛/疼痛？腰腹酸痛→核心不稳；膝盖内侧痛→膝内扣；小腿前侧酸痛→跨步刹车；肩颈酸痛→上半身/摆臂紧张</li>
                  <li><strong>数据维度：</strong>重点看步频、触地时间、垂直振幅、垂直步幅比（优秀跑者&lt;6%，大众跑者需控制在7%以内）、左右平衡</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6大错误跑姿类型 -->
      <div class="errors-section">
        <h2 class="section-title">
          <span class="section-icon">⚠️</span>
          6大常见错误跑姿类型
        </h2>

        <div class="errors-grid">
          <div
            v-for="error in errorTypes"
            :key="error.id"
            class="error-card"
            @click="goToDetail(error.id)"
          >
            <div class="error-header">
              <span class="error-icon">{{ error.icon }}</span>
              <h3>{{ error.name }}</h3>
              <span :class="['risk-badge', error.risk]">{{ error.riskText }}</span>
            </div>
            <p class="error-short-desc">{{ error.shortDesc }}</p>
            <div class="error-symptoms">
              <strong>典型特征：</strong>
              <span v-for="(symptom, idx) in error.symptoms" :key="idx" class="symptom-tag">{{ symptom }}</span>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>
      </div>

      <!-- 黄金原则 -->
      <div class="principles-section">
        <h2 class="section-title">
          <span class="section-icon">👑</span>
          跑姿优化的核心黄金原则
        </h2>
        <div class="principles-list">
          <div v-for="(principle, index) in goldenPrinciples" :key="index" class="principle-item">
            <span class="principle-number">{{ index + 1 }}</span>
            <div class="principle-content">
              <h4>{{ principle.title }}</h4>
              <p>{{ principle.desc }}</p>
            </div>
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
  painLocation: '',
  cadence: '',
  feeling: '',
  longRun: ''
})

const analysisResult = ref(null)

// 疼痛选项
const painOptions = [
  { value: 'waist', label: '腰腹酸痛 → 核心不稳' },
  { value: 'knee', label: '膝盖内侧痛 → 膝内扣' },
  { value: 'shin', label: '小腿前侧酸痛 → 跨步刹车' },
  { value: 'shoulder', label: '肩颈酸痛 → 上半身/摆臂紧张' },
  { value: 'foot', label: '足底/足跟痛 → 触地模式问题' },
  { value: 'none', label: '无明显疼痛' }
]

// 黄金标准
const goldenStandards = [
  {
    icon: '🎯',
    title: '躯干与核心',
    standard: '身体从脚踝处微微前倾（5-8°），头顶向上牵引，脊柱保持中立位，不塌腰、不弓背、不左右扭转；核心全程保持中等收紧状态，形成稳定的"刚性圆柱体"',
    biomechanics: '中立躯干+稳定核心，能最大化减少上下肢的能量内耗，避免身体晃动造成的动力流失，同时降低腰椎、骨盆的负荷，让下肢发力直接、高效地转化为向前的动能'
  },
  {
    icon: '💪',
    title: '上半身与摆臂',
    standard: '双肩放松下沉，不耸肩、不含胸；手肘固定90°左右弯曲，严格沿前后方向摆臂，摆幅前不超肩、后不超腰，全程不越过身体中线；双手半握拳，不紧绷发力',
    biomechanics: '正确摆臂能平衡下肢的扭转力，维持身体平衡，同时为跑步提供辅助动力；左右横摆、耸肩含胸会造成额外能量消耗，还会限制胸腔扩张，直接降低呼吸与供氧效率'
  },
  {
    icon: '🦵',
    title: '下肢摆动',
    standard: '大腿前摆幅度适中，小腿自然折叠，脚跟向臀部方向靠近，不刻意蹬伸、不甩小腿；膝盖始终与脚尖方向一致，朝向正前方',
    biomechanics: '小腿折叠能缩短下肢摆动半径，减少转动惯量，让摆腿更省力；膝盖朝向一致能避免膝关节承受侧向剪切力，大幅降低伤病风险，同时保证发力方向完全向前'
  },
  {
    icon: '👟',
    title: '触地模式',
    standard: '落地点在身体重心的正下方（或略微靠前），采用中足/全掌滚动式触地；触地时脚踝、膝盖保持微屈，实现自然缓冲；触地时间越短越好（大众跑者控制在200-250ms）',
    biomechanics: '重心正下方落地点能彻底避免"刹车效应"，减少水平方向的动能损耗；滚动式触地能最大化利用跟腱的弹性势能，减少肌肉主动发力，同时分散足底、膝关节的冲击负荷'
  },
  {
    icon: '⚡',
    title: '步频步幅',
    standard: '大众跑者步频稳定在170-180步/分钟，精英跑者180+步/分钟；步幅与身高、肌力匹配，不刻意追求大步幅，步幅增长来自发力效率提升，而非刻意前伸小腿',
    biomechanics: '高频小幅的模式能降低垂直振幅（控制在5-7cm以内），减少触地时的地面冲击力，同时降低单步的能量消耗，提升动作的可持续性，是大众跑者提升跑步经济性最易落地的方式'
  }
]

// 6大错误跑姿类型
const errorTypes = [
  {
    id: 'braking',
    icon: '🛑',
    name: '跨步刹车型跑姿',
    shortDesc: '最常见、最影响经济性的错误',
    risk: 'high',
    riskText: '高风险',
    symptoms: ['落地点在重心前方', '步频<165', '触地时间>280ms']
  },
  {
    id: 'instability',
    icon: '🌊',
    name: '核心失稳型跑姿',
    shortDesc: '所有跑姿问题的底层根源',
    risk: 'high',
    riskText: '高风险',
    symptoms: ['塌腰弓背', '身体左右晃动', '步幅不对称']
  },
  {
    id: 'knee',
    icon: '🦴',
    name: '膝盖内扣/外撇型跑姿',
    shortDesc: '最高伤病风险的错误',
    risk: 'high',
    riskText: '高风险',
    symptoms: ['膝盖内扣/外撇', '与脚尖方向不一致', '双腿呈X/O型']
  },
  {
    id: 'upper',
    icon: '🙅',
    name: '上半身代偿型跑姿',
    shortDesc: '最容易被忽略的能耗大户',
    risk: 'medium',
    riskText: '中风险',
    symptoms: ['含胸驼背', '耸肩', '摆臂横摆']
  },
  {
    id: 'bouncing',
    icon: '🦘',
    name: '过度蹬地/垂直振幅过大',
    shortDesc: '最费力的"颠簸跑"',
    risk: 'medium',
    riskText: '中风险',
    symptoms: ['垂直振幅>8cm', '刻意向上蹬地', '小腿过度发力']
  },
  {
    id: 'foot',
    icon: '🦶',
    name: '足型代偿型跑姿',
    shortDesc: '足内翻/外翻，底层结构问题',
    risk: 'medium',
    riskText: '中风险',
    symptoms: ['足过度内翻/外翻', '足底压力不均', '左右平衡偏差>3%']
  }
]

// 黄金原则
const goldenPrinciples = [
  {
    title: '肌力先行，动作在后',
    desc: '90%的跑姿错误，根源都是相关肌群力量不足，而非动作不对。先强化核心、臀部、下肢、脚踝的基础力量，再调整动作，否则强行改动作只会导致新的代偿和伤病'
  },
  {
    title: '循序渐进，小步调整',
    desc: '跑姿是长期形成的肌肉记忆，每次调整只改1个核心动作（比如先提步频，再改落地点），不要一次性全改，给身体至少2-4周的适应时间，避免受伤'
  },
  {
    title: '不盲目模仿精英跑者',
    desc: '精英跑者的前掌跑法、大步幅，建立在极强的肌力、柔韧性、心肺能力之上，大众跑者盲目模仿，只会导致伤病和能耗增加'
  },
  {
    title: '经济性优先，美观其次',
    desc: '跑姿的核心目标是省力、低伤、可持续，不是好看。只要跑步时无疼痛、配速稳定、心率平稳、长距离不掉速，就是适合你的经济跑姿'
  },
  {
    title: '长期坚持，动态调整',
    desc: '跑姿优化需要3-6个月的持续训练才能形成稳定的肌肉记忆；同时随着你的肌力、配速、跑量提升，跑姿也要动态调整，建议每3个月做1次完整的跑姿分析，及时纠正问题'
  }
]

// 分析跑姿
const analyzePosture = () => {
  if (!assessment.painLocation || !assessment.cadence || !assessment.feeling || !assessment.longRun) {
    alert('请完成所有问题的选择')
    return
  }

  const results = []

  // 根据选择匹配跑姿问题
  if (assessment.painLocation === 'shin' || assessment.cadence === 'low') {
    results.push({
      id: 'braking',
      icon: '🛑',
      name: '跨步刹车型跑姿',
      matchRate: 90,
      matchReason: '小腿前侧酸痛+步频过低'
    })
  }

  if (assessment.painLocation === 'waist' || assessment.feeling === 'unstable' || assessment.longRun === 'form') {
    results.push({
      id: 'instability',
      icon: '🌊',
      name: '核心失稳型跑姿',
      matchRate: 88,
      matchReason: '腰腹酸痛+身体晃动+后半程跑姿变形'
    })
  }

  if (assessment.painLocation === 'knee') {
    results.push({
      id: 'knee',
      icon: '🦴',
      name: '膝盖内扣/外撇型跑姿',
      matchRate: 92,
      matchReason: '膝盖内侧疼痛'
    })
  }

  if (assessment.painLocation === 'shoulder' || assessment.feeling === 'tense') {
    results.push({
      id: 'upper',
      icon: '🙅',
      name: '上半身代偿型跑姿',
      matchRate: 85,
      matchReason: '肩颈酸痛+上半身紧绷'
    })
  }

  if (assessment.feeling === 'bumpy') {
    results.push({
      id: 'bouncing',
      icon: '🦘',
      name: '过度蹬地/垂直振幅过大',
      matchRate: 87,
      matchReason: '身体上下颠簸严重'
    })
  }

  if (assessment.painLocation === 'foot') {
    results.push({
      id: 'foot',
      icon: '🦶',
      name: '足型代偿型跑姿',
      matchRate: 89,
      matchReason: '足底/足跟疼痛'
    })
  }

  // 如果没有匹配到，推荐最常见的跨步刹车
  if (results.length === 0) {
    results.push({
      id: 'braking',
      icon: '🛑',
      name: '跨步刹车型跑姿',
      matchRate: 70,
      matchReason: '建议优先排查跨步刹车问题'
    })
  }

  // 按匹配度排序
  results.sort((a, b) => b.matchRate - a.matchRate)

  analysisResult.value = results
}

// 跳转到详情页
const goToDetail = (id) => {
  router.push(`/advance-marathon/running-posture/${id}`)
}
</script>

<style scoped>
.running-posture-home {
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

/* 核心定义卡片 */
.definition-card {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #667eea30;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.definition-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.definition-content h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.definition-content p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.highlight {
  color: #667eea;
  font-weight: 600;
}

/* 黄金标准网格 */
.standards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.standard-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #eee;
}

.standard-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.standard-icon {
  font-size: 1.5rem;
}

.standard-header h3 {
  color: #333;
  font-size: 1rem;
  margin: 0;
}

.standard-body h4 {
  color: #667eea;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.standard-body p {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.core-standard {
  margin-bottom: 1rem;
}

.biomechanics {
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
}

/* 评估区块 */
.assessment-section {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #667eea30;
}

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

/* 自测方法 */
.selftest-section {
  margin-bottom: 2rem;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 992px) {
  .steps-container {
    grid-template-columns: 1fr;
  }
}

.step-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
}

.step-number {
  width: 36px;
  height: 36px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.step-card h3 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.step-desc {
  color: #667eea;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.step-detail {
  background: white;
  padding: 1rem;
  border-radius: 8px;
}

.step-detail p {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.check-items h4 {
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.check-items ul {
  margin: 0;
  padding-left: 1.25rem;
}

.check-items li {
  color: #666;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.check-items li strong {
  color: #667eea;
}

/* 错误类型网格 */
.errors-section {
  margin-bottom: 2rem;
}

.errors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.error-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  position: relative;
}

.error-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.error-icon {
  font-size: 1.5rem;
}

.error-header h3 {
  flex: 1;
  color: #333;
  font-size: 1rem;
  margin: 0;
}

.risk-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

.risk-badge.high {
  background: #f44336;
  color: white;
}

.risk-badge.medium {
  background: #ff9800;
  color: white;
}

.error-short-desc {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.error-symptoms {
  font-size: 0.8rem;
  color: #888;
}

.error-symptoms strong {
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

.error-card:hover .card-arrow {
  opacity: 1;
}

/* 黄金原则 */
.principles-section {
  margin-bottom: 1rem;
}

.principles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.principle-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff8e1;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.principle-number {
  width: 28px;
  height: 28px;
  background: #ffc107;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.principle-content h4 {
  color: #333;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.principle-content p {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
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

  .standards-grid {
    grid-template-columns: 1fr;
  }

  .errors-grid {
    grid-template-columns: 1fr;
  }

  .definition-card {
    flex-direction: column;
  }

  .card-arrow {
    display: none;
  }
}
</style>