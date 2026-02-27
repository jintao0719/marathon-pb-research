<template>
  <div class="bottleneck-detail">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <button @click="goBack" class="back-btn">← 返回诊断首页</button>

      <!-- 瓶颈头部信息 -->
      <div class="bottleneck-header" v-if="bottleneckData">
        <div class="header-icon">{{ bottleneckData.icon }}</div>
        <h1 class="bottleneck-title">{{ bottleneckData.name }}</h1>
        <p class="bottleneck-short-desc">{{ bottleneckData.shortDesc }}</p>
      </div>

      <!-- 瓶颈内容 -->
      <div class="bottleneck-content" v-if="bottleneckData">
        <!-- 判定标准 -->
        <section class="content-section">
          <h2 class="section-title">一、冲PB定向判定标准</h2>
          <div class="criteria-list">
            <div v-for="(criterion, index) in bottleneckData.criteria" :key="index" class="criterion-item">
              <span class="criterion-icon">✓</span>
              <p>{{ criterion }}</p>
            </div>
          </div>
        </section>

        <!-- 核心成因 -->
        <section class="content-section">
          <h2 class="section-title">二、核心成因</h2>
          <div class="cause-box">
            <p>{{ bottleneckData.cause }}</p>
          </div>
        </section>

        <!-- PB专属突破方案 -->
        <section class="content-section">
          <h2 class="section-title">三、PB专属突破方案</h2>
          <div class="solution-list">
            <div v-for="(solution, index) in bottleneckData.solutions" :key="index" class="solution-item">
              <div class="solution-header">
                <span class="solution-number">{{ index + 1 }}</span>
                <h4>{{ solution.title }}</h4>
              </div>
              <p class="solution-desc">{{ solution.desc }}</p>
              <div v-if="solution.details" class="solution-details">
                <div v-for="(detail, idx) in solution.details" :key="idx" class="detail-item">
                  <strong>{{ detail.label }}：</strong>{{ detail.content }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 执行检查清单 -->
        <section class="content-section" v-if="bottleneckData.checklist">
          <h2 class="section-title">四、执行检查清单</h2>
          <div class="checklist">
            <label v-for="(item, index) in bottleneckData.checklist" :key="index" class="checklist-item">
              <input type="checkbox" v-model="checkedItems[index]" />
              <span :class="{ checked: checkedItems[index] }">{{ item }}</span>
            </label>
          </div>
        </section>
      </div>

      <!-- 未找到 -->
      <div v-else class="not-found">
        <p>未找到该瓶颈类型</p>
        <button @click="goBack" class="btn btn-primary">返回列表</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 检查清单选中状态
const checkedItems = ref([])

// 页面加载时滚动到顶部（无动画）
onMounted(() => {
  window.scrollTo(0, 0)
})

// 6大瓶颈详细数据
const bottleneckDetails = {
  aerobic: {
    icon: '🏔️',
    name: '有氧基础底层瓶颈',
    shortDesc: '有氧基础不足，目标配速缺乏有氧支撑',
    criteria: [
      '轻松跑（E配速，最大心率65%-78%）配速长期停滞，相同配速下心率不降反升',
      '目标PB配速下，持续跑步时长无法突破60分钟，心率快速飙升至无氧区间',
      '25km以上长距离训练，后半程配速掉幅超20%，心率漂移超12%',
      '备赛周期内，最大摄氧量、有氧阈值等核心有氧指标无任何提升'
    ],
    cause: '冲PB急于求成，过度追逐间歇跑、速度课，忽略马拉松98%的供能来自有氧系统的本质；跑量堆积不足/质量差，轻松跑强行提速变成混氧跑，破坏有氧基础；长距离训练占比不够，身体无法适应全马距离的有氧负荷。',
    solutions: [
      {
        title: '重构备赛训练结构',
        desc: '备赛周期内，周训练量的75%-80%必须分配给低强度有氧轻松跑',
        details: [
          { label: '心率控制', content: '严格锁死E配速心率区间（最大心率65%-78%），绝对禁止轻松跑飙速' },
          { label: '强度课控制', content: '每周仅保留1次专项强度课，杜绝混氧训练占比过高' },
          { label: '核心原则', content: '先把有氧底盘打牢，再谈速度提升' }
        ]
      },
      {
        title: '长距离训练精准适配PB目标',
        desc: '每周固定1次长距离训练，距离控制在周跑量的25%-30%',
        details: [
          { label: '距离上限', content: '最长不超35km，避免过度消耗影响后续训练' },
          { label: '配速分配', content: '80%的长距离用E配速完成' },
          { label: '专项训练', content: '每月1次「PB配速分段长距离」，例如30km = 前22km E配速 + 后8km目标PB配速' }
        ]
      },
      {
        title: '有氧阈值专项提升',
        desc: '每周加入1次40-60分钟的稳态跑',
        details: [
          { label: '心率区间', content: '心率控制在最大心率的80%-82%' },
          { label: '训练方式', content: '无需间歇，持续提升身体在更高配速下的有氧供能占比' },
          { label: '训练目标', content: '让目标PB配速逐步落在你的有氧区间内，减少乳酸堆积' }
        ]
      }
    ],
    checklist: [
      '每周轻松跑占比达到75%-80%',
      '严格控制E配速心率区间，不飙速',
      '每周仅1次强度课',
      '每周1次长距离训练（25-35km）',
      '每月1次PB配速分段长距离',
      '每周1次有氧阈值稳态跑（40-60分钟）'
    ]
  },
  pace: {
    icon: '⏱️',
    name: 'PB专项配速耐力瓶颈',
    shortDesc: '有氧够了，但目标配速扛不完42km',
    criteria: [
      '轻松跑能力稳定、有氧基础扎实，但目标PB配速（M配速）的持续时长无法突破90分钟',
      '短间歇能跑出远超PB配速的成绩，但无法将间歇能力转化为全马全程的配速稳定性',
      '半马能稳住PB配速，全马后半程匀速掉速，完赛成绩与PB目标差3-8分钟',
      '乳酸阈配速长期停滞，相同乳酸浓度下配速无法提升'
    ],
    cause: '有氧基础充足，但针对PB目标的专项配速耐力严重不足，身体对PB配速的乳酸清除能力、肌肉耐受度、神经肌肉记忆完全不够；间歇训练与PB目标脱节，快的太快、慢的太慢，缺少PB配速下的持续刺激。',
    solutions: [
      {
        title: '核心课表锚定PB配速持续跑',
        desc: '每周固定1次PB配速（M配速）专项跑',
        details: [
          { label: '时长进阶', content: '总时长从60分钟逐步提升至120分钟（最长不超120分钟）' },
          { label: '配速精度', content: '配速严格贴合PB目标，误差控制在±3秒/公里' },
          { label: '训练目标', content: '强化身体对PB配速的专项适应，形成肌肉记忆' }
        ]
      },
      {
        title: '进阶临界速度间歇训练',
        desc: '将传统短间歇替换为PB定向临界速度间歇',
        details: [
          { label: '配速设定', content: '比PB配速快5-8秒/公里的乳酸阈配速（T配速）' },
          { label: '间歇方案', content: '完成3-5km/组的间歇，组间休息时长为单组跑步时长的1/3' },
          { label: '总距离', content: '单次训练总间歇距离8-12km' },
          { label: '训练目标', content: '逐步拉高乳酸阈值，让PB配速从「临界点」变成「轻松有氧区间」' }
        ]
      },
      {
        title: '疲劳状态PB配速适配训练',
        desc: '每月安排1次渐快跑，模拟全马后半程疲劳状态',
        details: [
          { label: '示例方案', content: '22km训练 = 前10km E配速 + 中间7km PB配速 + 最后5km T配速' },
          { label: '训练目标', content: '提升身体在糖原下降、肌肉疲劳时的PB配速维持能力' },
          { label: '核心目的', content: '杜绝后半程掉速' }
        ]
      }
    ],
    checklist: [
      '每周1次M配速专项跑（60-120分钟）',
      '配速误差控制在±3秒/公里',
      '每周1次T配速临界速度间歇',
      '每月1次疲劳状态渐快跑',
      '监控乳酸阈配速变化',
      '记录每次M配速跑的持续时长'
    ]
  },
  economy: {
    icon: '⚙️',
    name: '跑步经济性瓶颈',
    shortDesc: '跑姿缺陷、力量不足导致能量浪费',
    criteria: [
      '同等配速下，摄氧量、心率显著高于同水平跑者',
      '步频步幅不稳定，触地时间长、垂直振幅大',
      '长距离训练后半程，核心垮塌、含胸塌腰、骨盆晃动',
      '备赛周期内频繁出现足底筋膜炎、髂胫束综合征等伤病'
    ],
    cause: '跑步经济性不足，相同PB配速下能量消耗远高于同水平跑者；核心、臀部、下肢后侧链等跑步主力肌群力量不足，无法维持稳定跑姿，造成大量能量浪费，同时增加伤病风险。',
    solutions: [
      {
        title: '备赛期固定专项力量训练',
        desc: '每周2次，不占用跑步日',
        details: [
          { label: '核心稳定训练', content: '平板支撑、侧平板、死虫式、臀桥，每个动作4组×60秒' },
          { label: '下肢专项力量', content: '保加利亚分腿蹲、罗马尼亚硬拉、单腿提踵，每个动作3组×12-15次' },
          { label: '爆发力技术训练', content: '每周1次小步跑、高抬腿、后踢腿，每组30秒×4组' }
        ]
      },
      {
        title: 'PB配速跑姿优化训练',
        desc: '每周1次技术跑',
        details: [
          { label: '步频锁定', content: '10km轻松跑中加入4组×1km的步频锁定训练' },
          { label: '节拍器设定', content: '用节拍器将步频稳定在180步/分钟左右' },
          { label: '训练目标', content: '减少垂直振幅和能量浪费，让PB配速跑起来更轻松' }
        ]
      },
      {
        title: '抗疲劳力量强化',
        desc: '每次长距离训练后进行',
        details: [
          { label: '训练内容', content: '10分钟轻重量力量训练（臀桥、单腿提踵、平板支撑）' },
          { label: '训练目标', content: '强化肌肉在疲劳状态下的稳定性' },
          { label: '适配场景', content: '全马后半程的身体状态，保证PB配速全程不垮' }
        ]
      }
    ],
    checklist: [
      '每周2次专项力量训练（核心+下肢）',
      '每周1次爆发力技术训练',
      '每周1次步频锁定技术跑',
      '每次长距离后10分钟轻力量训练',
      '监控触地时间和垂直振幅',
      '关注跑姿视频分析'
    ]
  },
  recovery: {
    icon: '🔋',
    name: '恢复与过度训练瓶颈',
    shortDesc: '越练越累，成绩不涨反降',
    criteria: [
      '晨起静息心率持续升高，比日常基线高5-10次/分钟',
      '训练后疲劳感24小时内无法缓解，持续全身乏力',
      '相同配速下心率显著升高，体感极度疲劳',
      '备赛周期内免疫力下降，频繁感冒、伤病反复'
    ],
    cause: '冲PB心态急切，盲目加量加强度，训练负荷与身体恢复能力严重不匹配，忽略了「成绩提升来自超量恢复」的核心规律；备赛周期未设置减载周，身体长期处于分解代谢状态。',
    solutions: [
      {
        title: '强制执行备赛周期化减载',
        desc: '备赛周期内，每3周训练固定安排1周减载周',
        details: [
          { label: '减载周跑量', content: '降至前3周平均跑量的50%-60%' },
          { label: '强度课调整', content: '取消所有高强度间歇课，仅保留低强度轻松跑' },
          { label: '过度训练应对', content: '若已出现症状，立刻停训1-3天，直至静息心率恢复基线' }
        ]
      },
      {
        title: '搭建冲PB全流程恢复体系',
        desc: '睡眠+营养+主动恢复三位一体',
        details: [
          { label: '睡眠保障', content: '每晚7-9小时深度睡眠，睡前1小时远离电子设备' },
          { label: '即时恢复', content: '训练后30分钟内补充碳水+蛋白质（比例3:1-4:1）' },
          { label: '主动恢复', content: '每周固定1天完全休息日，或低强度主动恢复日（游泳、骑行）' }
        ]
      },
      {
        title: '备赛负荷实时监控',
        desc: '用RPE自觉疲劳程度监控训练',
        details: [
          { label: 'RPE控制', content: '每周平均RPE不超7分，高强度课RPE不超9分' },
          { label: '10%法则', content: '每周跑量增幅不超10%，强度课距离增幅不超5%' },
          { label: '核心原则', content: '杜绝盲目加量加强度' }
        ]
      }
    ],
    checklist: [
      '每3周安排1周减载周（跑量50%-60%）',
      '每日监控晨起静息心率',
      '每周评估RPE疲劳程度',
      '保证每晚7-9小时睡眠',
      '训练后30分钟内补充营养',
      '每周1天完全休息日'
    ]
  },
  nutrition: {
    icon: '🥤',
    name: '营养补给瓶颈',
    shortDesc: '训练能达标，比赛必崩',
    criteria: [
      '长距离训练30km后必出现严重撞墙，血糖暴跌、双腿发软',
      '训练/比赛中补给后出现肠胃不适、腹痛、腹泻',
      '备赛期训练后恢复慢，肌肉酸痛持续时间长',
      '比赛中频繁出现抽筋'
    ],
    cause: '日常碳水摄入不足，肌糖原储备无法支撑全马PB配速的能量消耗；比赛补给方案未经过训练磨合，糖和电解质补充时机、摄入量不合理；未提前训练肠胃，对运动中的补给不耐受。',
    solutions: [
      {
        title: '备赛期日常营养精准匹配',
        desc: '训练期碳水化合物占每日总热量的55%-65%',
        details: [
          { label: '碳水摄入', content: '大训练量周提升至70%，优先选择复合碳水' },
          { label: '蛋白质摄入', content: '每日每公斤体重摄入1.6-2.0g优质蛋白质' },
          { label: '脂肪摄入', content: '占总热量的20%-25%，优先选择不饱和脂肪酸' }
        ]
      },
      {
        title: '赛前糖原负荷法',
        desc: '赛前3天执行高碳水饮食',
        details: [
          { label: '碳水比例', content: '碳水占每日总热量的70%-80%' },
          { label: '其他调整', content: '减少脂肪和蛋白质摄入' },
          { label: '核心目标', content: '最大化肌糖原储备，从根源避免全马后半程撞墙' }
        ]
      },
      {
        title: 'PB定向补给方案+肠胃训练',
        desc: '全马比赛补给方案',
        details: [
          { label: '补给时机', content: '从5km开始，每45-60分钟补充30-60g碳水' },
          { label: '电解质补充', content: '每10-15km补充1次电解质' },
          { label: '补水策略', content: '少量多次补水，避免一次性大量饮水' },
          { label: '肠胃训练', content: '所有长距离训练完全模拟比赛补给方案' }
        ]
      }
    ],
    checklist: [
      '日常碳水占热量55%-65%（大训练量周70%）',
      '每日蛋白质摄入1.6-2.0g/kg体重',
      '赛前3天执行糖原负荷法',
      '长距离训练模拟比赛补给方案',
      '测试并确定比赛日补给品牌',
      '比赛中每45-60分钟补充30-60g碳水'
    ]
  },
  strategy: {
    icon: '📊',
    name: '备赛节奏与策略瓶颈',
    shortDesc: '训练型选手，比赛永远跑不出PB',
    criteria: [
      '赛前训练能轻松完成目标PB配速的30km+长距离，但比赛成绩比训练预期差5分钟以上',
      '赛前过度紧张失眠，起跑后配速失控，前半程冲太快',
      '赛前减量调整不当，要么减量不足身体疲劳，要么减量过多状态丢失',
      '比赛中遇到轻微掉速就心态崩溃，直接放弃PB配速'
    ],
    cause: '备赛周期规划不合理，没有贴合PB目标设置周期化训练；赛前Taper减量错误，无法平衡身体疲劳与竞技状态；比赛配速策略不合理；赛道细节、突发情况无预案，心理抗压能力弱。',
    solutions: [
      {
        title: 'PB定向备赛周期规划',
        desc: '根据PB目标，设置12-16周的系统备赛周期',
        details: [
          { label: '基础期（4-6周）', content: '打牢有氧基础' },
          { label: '专项期（4-6周）', content: '强化PB配速耐力' },
          { label: '赛前强化期（2周）', content: '模拟比赛节奏' },
          { label: '减量期（2周）', content: 'Taper调整' }
        ]
      },
      {
        title: '精准赛前Taper减量',
        desc: '赛前2周开始逐步减量',
        details: [
          { label: '赛前2周', content: '跑量降至峰值的60%，保留1次短距离PB配速跑' },
          { label: '赛前1周', content: '跑量降至峰值的40%，仅保留2-3次3-5km轻松跑' },
          { label: '赛前2天', content: '完全休息' },
          { label: '核心目标', content: '既消除累积疲劳，又保证比赛竞技状态' }
        ]
      },
      {
        title: 'PB专属比赛策略+细节预案',
        desc: '配速策略+赛道细节+心理建设',
        details: [
          { label: '配速策略', content: '前半程比目标PB配速慢3-5秒/公里，绝对禁止前半程冲快' },
          { label: '赛道预案', content: '赛前1个月提前勘察赛道坡道、补给点、风向' },
          { label: '心理建设', content: '将全马拆分为8个5km小目标，逐个完成' }
        ]
      }
    ],
    checklist: [
      '制定12-16周系统备赛周期',
      '赛前2周开始Taper减量',
      '赛前1个月勘察赛道',
      '制定配速策略（前半程慢3-5秒）',
      '预设比赛中各类问题的应对方案',
      '比赛时用手表实时锁速'
    ]
  }
}

// 根据路由参数获取瓶颈数据
const bottleneckData = computed(() => {
  const bottleneckId = route.params.id
  return bottleneckDetails[bottleneckId] || null
})

// 返回列表
const goBack = () => {
  router.push('/advance-marathon/bottleneck-diagnosis')
}
</script>

<style scoped>
.bottleneck-detail {
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

/* 瓶颈头部 */
.bottleneck-header {
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

.bottleneck-title {
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
}

.bottleneck-short-desc {
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

/* 判定标准 */
.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.criterion-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff3e0;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.criterion-icon {
  color: #ff9800;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.criterion-item p {
  margin: 0;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 核心成因 */
.cause-box {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.cause-box p {
  margin: 0;
  color: #333;
  font-size: 0.95rem;
  line-height: 1.8;
}

/* 解决方案 */
.solution-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.solution-item {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #eee;
}

.solution-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.solution-number {
  width: 28px;
  height: 28px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.solution-header h4 {
  color: #333;
  font-size: 1.1rem;
  margin: 0;
}

.solution-desc {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.solution-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  padding: 0.5rem 0.75rem;
  background: white;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #555;
}

.detail-item strong {
  color: #667eea;
}

/* 检查清单 */
.checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checklist-item:hover {
  background: #f0f0f0;
}

.checklist-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #667eea;
  flex-shrink: 0;
}

.checklist-item span {
  color: #333;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.checklist-item span.checked {
  color: #999;
  text-decoration: line-through;
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

  .bottleneck-header {
    padding: 1.5rem;
  }

  .bottleneck-title {
    font-size: 1.4rem;
  }

  .criterion-item {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>