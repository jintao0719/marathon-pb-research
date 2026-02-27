<template>
  <div class="posture-detail">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <button @click="goBack" class="back-btn">← 返回跑姿分析首页</button>

      <!-- 错误跑姿头部信息 -->
      <div class="posture-header" v-if="postureData">
        <div class="header-icon">{{ postureData.icon }}</div>
        <h1 class="posture-title">{{ postureData.name }}</h1>
        <p class="posture-short-desc">{{ postureData.shortDesc }}</p>
      </div>

      <!-- 错误跑姿内容 -->
      <div class="posture-content" v-if="postureData">
        <!-- 错误核心特征 -->
        <section class="content-section">
          <h2 class="section-title">一、错误核心特征</h2>
          <div class="features-list">
            <div v-for="(feature, index) in postureData.features" :key="index" class="feature-item">
              <span class="feature-icon">⚠️</span>
              <p>{{ feature }}</p>
            </div>
          </div>
        </section>

        <!-- 主要危害 -->
        <section class="content-section">
          <h2 class="section-title">二、主要危害</h2>
          <div class="harm-box">
            <p>{{ postureData.harm }}</p>
          </div>
        </section>

        <!-- 分步骤调整方案 -->
        <section class="content-section">
          <h2 class="section-title">三、分步骤调整方案</h2>
          <div class="solution-list">
            <div v-for="(solution, index) in postureData.solutions" :key="index" class="solution-item">
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
        <section class="content-section" v-if="postureData.checklist">
          <h2 class="section-title">四、执行检查清单</h2>
          <div class="checklist">
            <label v-for="(item, index) in postureData.checklist" :key="index" class="checklist-item">
              <input type="checkbox" v-model="checkedItems[index]" />
              <span :class="{ checked: checkedItems[index] }">{{ item }}</span>
            </label>
          </div>
        </section>
      </div>

      <!-- 未找到 -->
      <div v-else class="not-found">
        <p>未找到该跑姿类型</p>
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

// 6大错误跑姿详细数据
const postureDetails = {
  braking: {
    icon: '🛑',
    name: '跨步刹车型跑姿',
    shortDesc: '最常见、最影响经济性的错误',
    features: [
      '落地点在身体重心前方很远的位置，小腿完全伸直，脚跟先砸地，形成明显的"刹车效应"',
      '步频过低（<165步/分钟）、步幅过大',
      '触地时间长（>280ms）'
    ],
    harm: '水平方向动能损耗极大，跑步极度费力，经济性极差；同时给膝关节、腰椎带来巨大的纵向冲击力，极易引发膝痛、足跟痛、胫骨应力综合征',
    solutions: [
      {
        title: '核心调整：提升步频',
        desc: '用节拍器锁定步频，从日常步频提升5-10步/分钟开始，逐步提升至170-180步/分钟',
        details: [
          { label: '目标', content: '强制缩短步幅，让落地点向重心正下方靠拢' },
          { label: '工具', content: '使用节拍器APP或手表节拍器功能' }
        ]
      },
      {
        title: '动作纠正：缩短触地时间',
        desc: '跑步时想象"脚下是滚烫的马路"，缩短触地时间',
        details: [
          { label: '落地方式', content: '落地时脚踝、膝盖保持微屈，实现自然缓冲' },
          { label: '禁止动作', content: '禁止伸直小腿砸地' }
        ]
      },
      {
        title: '肌力强化：提升缓冲能力',
        desc: '重点强化腘绳肌、小腿三头肌的离心力量',
        details: [
          { label: '训练动作', content: '罗马尼亚硬拉、单腿硬拉、提踵训练' },
          { label: '训练目标', content: '提升下肢的缓冲和控制能力' }
        ]
      },
      {
        title: '辅助训练：形成肌肉记忆',
        desc: '每周1次10km节奏跑，全程用节拍器锁步频',
        details: [
          { label: '训练重点', content: '刻意练习重心正下方落地' },
          { label: '目标', content: '形成正确的落地肌肉记忆' }
        ]
      }
    ],
    checklist: [
      '使用节拍器，步频逐步提升至170-180步/分钟',
      '落地时脚踝、膝盖保持微屈',
      '想象"脚下是滚烫的马路"，缩短触地时间',
      '每周进行罗马尼亚硬拉、提踵训练',
      '每周1次节拍器节奏跑，练习正确落地',
      '拍摄侧面视频，检查落地点位置'
    ]
  },
  instability: {
    icon: '🌊',
    name: '核心失稳型跑姿',
    shortDesc: '所有跑姿问题的底层根源',
    features: [
      '跑步时塌腰、弓背、骨盆前倾/旋转、身体左右晃动严重，核心完全放松',
      '摆臂带动上半身扭转，步幅左右不对称'
    ],
    harm: '上下肢发力完全脱节，大量能量被身体晃动消耗，跑步经济性极差；同时给腰椎、髋关节、膝关节带来额外侧向负荷，极易引发腰痛、髋痛、膝痛，长距离后半程跑姿直接垮掉',
    solutions: [
      {
        title: '核心调整：收紧核心',
        desc: '跑步时保持核心中等收紧，想象"肚脐向脊柱方向收紧"',
        details: [
          { label: '目标姿态', content: '全程维持脊柱中立，像一个刚性圆柱体' }
        ]
      },
      {
        title: '动作纠正：控制摆臂',
        desc: '躯干前倾从脚踝发力，而非弯腰驼背',
        details: [
          { label: '摆臂要求', content: '摆臂严格控制在前后方向，不越过身体中线' },
          { label: '目的', content: '避免带动上半身扭转' }
        ]
      },
      {
        title: '肌力强化：核心稳定训练',
        desc: '每周2次核心稳定训练',
        details: [
          { label: '训练动作', content: '死虫式、平板支撑、侧平板、鸟狗式、臀桥' },
          { label: '训练量', content: '每个动作4组×60秒' },
          { label: '训练目标', content: '强化深层核心和骨盆稳定能力' }
        ]
      },
      {
        title: '辅助训练：上坡跑强化',
        desc: '每周1次3-5°坡地上坡跑',
        details: [
          { label: '训练效果', content: '上坡跑强制收紧核心，纠正身体晃动' },
          { label: '训练目标', content: '提升核心控制能力' }
        ]
      }
    ],
    checklist: [
      '跑步时想象"肚脐向脊柱收紧"，保持核心收紧',
      '躯干前倾从脚踝发力，保持脊柱中立',
      '摆臂前后方向，不越过身体中线',
      '每周2次核心训练（平板支撑、侧平板、臀桥等）',
      '每周1次上坡跑，强化核心控制',
      '拍摄正面视频，检查身体是否左右晃动'
    ]
  },
  knee: {
    icon: '🦴',
    name: '膝盖内扣/外撇型跑姿',
    shortDesc: '最高伤病风险的错误',
    features: [
      '落地和蹬伸时，膝盖向内扣（超过脚尖中线，俗称"X型腿跑姿"），或向外撇（俗称"O型腿跑姿"）',
      '膝盖与脚尖方向不一致',
      '背面视角看，落地时双腿呈明显的"X"或"O"型'
    ],
    harm: '膝关节承受巨大的侧向剪切力，极易引发髌股关节疼痛综合征、髂胫束综合征、半月板损伤；同时发力方向偏移，蹬地动力无法完全转化为向前的动能，跑步经济性大幅下降',
    solutions: [
      {
        title: '核心调整：膝盖对准脚尖',
        desc: '跑步时全程保持膝盖与脚尖方向完全一致，朝向正前方',
        details: [
          { label: '落地要求', content: '落地时膝盖顺着脚尖方向自然弯曲，不内扣、不外撇' }
        ]
      },
      {
        title: '动作纠正：激活臀部肌群',
        desc: '每次训练前做10分钟弓步走、侧向螃蟹走',
        details: [
          { label: '目的', content: '激活臀部肌群，形成膝盖朝前的肌肉记忆' },
          { label: '辅助手段', content: '通过正面视角拍摄，实时纠正动作偏差' }
        ]
      },
      {
        title: '肌力强化：强化臀部力量',
        desc: '重点强化臀中肌、臀大肌、股四头肌内侧头',
        details: [
          { label: '训练动作', content: '蚌式开合、侧向弹力带行走、保加利亚分腿蹲、靠墙静蹲' },
          { label: '训练量', content: '每个动作3组×15次' },
          { label: '训练目标', content: '解决臀部无力导致的膝盖代偿' }
        ]
      },
      {
        title: '辅助训练：单腿站立',
        desc: '单腿站立训练',
        details: [
          { label: '训练量', content: '每次30秒×4组' },
          { label: '训练目标', content: '提升单腿支撑的稳定性，纠正落地时的膝盖偏移' }
        ]
      }
    ],
    checklist: [
      '跑步时全程保持膝盖与脚尖方向一致',
      '训练前做弓步走、侧向螃蟹走激活臀部',
      '每周进行蚌式开合、保加利亚分腿蹲训练',
      '每天进行单腿站立训练（30秒×4组）',
      '拍摄正面视频，检查膝盖是否内扣/外撇',
      '必要时使用弹力带进行侧向行走训练'
    ]
  },
  upper: {
    icon: '🙅',
    name: '上半身代偿型跑姿',
    shortDesc: '最容易被忽略的能耗大户',
    features: [
      '含胸驼背、头前伸、耸肩，上半身全程紧绷',
      '摆臂左右横摆、上下甩动',
      '手肘弯曲角度过大/过小，摆幅超过身体中线'
    ],
    harm: '含胸驼背限制胸腔扩张，导致呼吸效率下降，供氧不足，很快出现疲劳；错误摆臂会造成身体额外的扭转和晃动，消耗大量无用能量，长距离后半程肩颈酸痛难忍，跑步经济性大幅下降',
    solutions: [
      {
        title: '核心调整：放松上半身',
        desc: '跑步时头顶向上牵引，肩膀放松下沉，挺胸收腹，保持胸腔打开',
        details: [
          { label: '手肘角度', content: '手肘固定90°弯曲' },
          { label: '摆臂方向', content: '前后方向摆臂，前不超肩、后不超腰，不越过身体中线' },
          { label: '手部状态', content: '双手半握拳，不紧绷发力' }
        ]
      },
      {
        title: '动作纠正：放松肩颈',
        desc: '每次训练前做5分钟扩胸运动、肩部绕环',
        details: [
          { label: '目的', content: '放松肩颈紧张肌肉' },
          { label: '手部要求', content: '跑步时双手半握拳，不紧绷，避免全身连带紧张' }
        ]
      },
      {
        title: '肌力强化：强化上背部',
        desc: '强化上背部肌群，改善含胸驼背体态',
        details: [
          { label: '训练动作', content: 'YTWL训练、高位下拉、划船' },
          { label: '训练量', content: '每个动作3组×15次' },
          { label: '附加训练', content: '强化肩袖肌群，提升摆臂稳定性' }
        ]
      },
      {
        title: '辅助训练：原地摆臂',
        desc: '原地摆臂训练',
        details: [
          { label: '训练量', content: '每组1分钟×4组' },
          { label: '动作要求', content: '固定手肘90°前后摆臂' },
          { label: '训练目标', content: '形成正确的摆臂肌肉记忆' }
        ]
      }
    ],
    checklist: [
      '跑步时头顶向上牵引，肩膀放松下沉',
      '挺胸收腹，保持胸腔打开',
      '手肘90°弯曲，前后方向摆臂',
      '双手半握拳，不紧绷',
      '每周进行YTWL训练、划船训练',
      '每天进行原地摆臂训练（1分钟×4组）'
    ]
  },
  bouncing: {
    icon: '🦘',
    name: '过度蹬地/垂直振幅过大',
    shortDesc: '最费力的"颠簸跑"',
    features: [
      '跑步时刻意向上蹬地，身体上下颠簸严重',
      '垂直振幅>8cm，垂直步幅比>8%',
      '蹬地时小腿过度发力，脚跟刻意向臀部甩，步幅完全靠蹬地实现'
    ],
    harm: '大量能量被用在向上的垂直运动上，向前的动能占比极低，跑步极度费力，经济性极差；同时地面冲击力大幅提升，极易引发小腿、足底、膝关节的伤病，长距离很快力竭',
    solutions: [
      {
        title: '核心调整：贴着地面跑',
        desc: '跑步时想象"贴着地面跑"，把向前的动能放在第一位',
        details: [
          { label: '禁止动作', content: '禁止刻意向上蹬地' },
          { label: '控制指标', content: '把垂直振幅控制在7cm以内，垂直步幅比控制在7%以内' }
        ]
      },
      {
        title: '动作纠正：利用弹性势能',
        desc: '利用跟腱的弹性势能实现滚动触地，而非肌肉主动蹬地',
        details: [
          { label: '技术要点', content: '缩短触地时间，减少地面停留时间' },
          { label: '避免动作', content: '避免过度蹬伸' }
        ]
      },
      {
        title: '肌力强化：强化脚踝弹性',
        desc: '强化脚踝的弹性和离心控制能力',
        details: [
          { label: '训练动作', content: '跳绳、提踵跳、下坡跑' },
          { label: '训练目标', content: '提升跟腱的弹性利用效率，减少肌肉主动发力' }
        ]
      },
      {
        title: '辅助训练：弹性跑练习',
        desc: '每周1次草地/塑胶跑道弹性跑',
        details: [
          { label: '技术重点', content: '刻意练习低振幅、高步频的跑法' },
          { label: '感受目标', content: '感受贴地飞行的发力感' }
        ]
      }
    ],
    checklist: [
      '想象"贴着地面跑"，减少上下颠簸',
      '控制垂直振幅<7cm，垂直步幅比<7%',
      '利用跟腱弹性，减少主动蹬地',
      '每周进行跳绳、提踵跳训练',
      '每周1次弹性跑练习',
      '使用运动手表监控垂直振幅数据'
    ]
  },
  foot: {
    icon: '🦶',
    name: '足型代偿型跑姿',
    shortDesc: '足内翻/外翻，底层结构问题',
    features: [
      '落地时足过度内翻（足弓塌陷，脚心向内倒），或过度外翻（脚心向外翻，足外侧负重）',
      '足底压力分布不均',
      '步宽过大/过小，左右平衡偏差>3%'
    ],
    harm: '足底、脚踝的缓冲能力完全丧失，冲击力直接向上传导到膝关节、髋关节、腰椎，极易引发足底筋膜炎、跟腱炎、膝痛、腰痛；同时发力轨迹偏移，蹬地动力流失，跑步经济性下降',
    solutions: [
      {
        title: '核心调整：全掌滚动触地',
        desc: '落地时保持中足全掌滚动触地，足底压力均匀分布',
        details: [
          { label: '足部状态', content: '足弓保持自然支撑，不刻意内翻/外翻' }
        ]
      },
      {
        title: '动作纠正：选择适配跑鞋',
        desc: '根据足型选择适配跑鞋',
        details: [
          { label: '足内翻', content: '选择支撑型跑鞋' },
          { label: '足外翻', content: '选择缓震型跑鞋' },
          { label: '步宽调整', content: '调整步宽与肩同宽，避免步宽过大导致的足内翻' }
        ]
      },
      {
        title: '肌力强化：强化足底肌群',
        desc: '强化足底肌群和胫骨前肌',
        details: [
          { label: '训练动作', content: '抓毛巾、足底滚球、提踵、勾脚训练' },
          { label: '训练量', content: '每个动作3组×20次' },
          { label: '训练目标', content: '提升足弓的支撑能力，改善足内外翻' }
        ]
      },
      {
        title: '辅助训练：赤脚感知训练',
        desc: '赤脚在瑜伽垫上做原地高抬腿、小步跑',
        details: [
          { label: '训练目标', content: '感受足底的均匀触地' },
          { label: '能力提升', content: '提升脚踝的控制能力' }
        ]
      }
    ],
    checklist: [
      '保持中足全掌滚动触地',
      '根据足型选择支撑型或缓震型跑鞋',
      '调整步宽与肩同宽',
      '每天进行抓毛巾、足底滚球训练',
      '每周进行提踵、勾脚训练',
      '赤脚进行原地高抬腿、小步跑感知训练'
    ]
  }
}

// 根据路由参数获取跑姿数据
const postureData = computed(() => {
  const postureId = route.params.id
  return postureDetails[postureId] || null
})

// 页面加载时滚动到顶部（无动画）
onMounted(() => {
  window.scrollTo(0, 0)
})

// 返回列表
const goBack = () => {
  router.push('/advance-marathon/running-posture')
}
</script>

<style scoped>
.posture-detail {
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

/* 跑姿头部 */
.posture-header {
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

.posture-title {
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
}

.posture-short-desc {
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

/* 错误特征 */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #fff3e0;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
}

.feature-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.feature-item p {
  margin: 0;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 主要危害 */
.harm-box {
  background: #ffebee;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #f44336;
}

.harm-box p {
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

  .posture-header {
    padding: 1.5rem;
  }

  .posture-title {
    font-size: 1.4rem;
  }

  .feature-item {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>