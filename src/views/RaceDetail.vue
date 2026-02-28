<template>
  <div class="race-detail-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🏃</span>
          <span class="logo-text">马拉松PB研究院</span>
        </div>
        <div class="nav-links">
          <router-link to="/beginner" class="nav-link">入门专区</router-link>
          <router-link to="/races" class="nav-link active">参赛专区</router-link>
          <router-link to="/advanced" class="nav-link">进阶专区</router-link>
          <router-link to="/feedback" class="nav-link">跑者心声</router-link>
        </div>
      </div>
    </nav>

    <div v-if="race" class="main-container">
      <!-- 赛事封面 -->
      <div class="race-hero">
        <div class="hero-image-container">
          <img :src="race.image" :alt="race.name" class="hero-image">
          <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
          <div class="hero-badges">
            <span class="status-badge" :class="calculateRaceStatus(race).status">{{ calculateRaceStatus(race).label }}</span>
            <span class="distance-badge">{{ getDistanceLabel(race.distance) }}</span>
            <span v-if="race.level" class="level-badge" :class="race.level">{{ getLevelLabel(race.level) }}</span>
          </div>
          <h1>{{ race.name }}</h1>
          <div class="hero-info">
            <div class="info-item">
              <span class="info-icon">📅</span>
              <span>{{ formatFullDate(race.date) }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">📍</span>
              <span>{{ race.location }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">👥</span>
              <span>{{ race.scale || '约30000人' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 核心信息 -->
      <div class="info-grid">
        <div class="info-card card">
          <span class="info-icon">📅</span>
          <div class="info-content">
            <label>赛事日期</label>
            <p>{{ formatFullDate(race.date) }}</p>
          </div>
        </div>
        <div class="info-card card">
          <span class="info-icon">📍</span>
          <div class="info-content">
            <label>举办地点</label>
            <p>{{ race.location }}</p>
          </div>
        </div>
        <div class="info-card card">
          <span class="info-icon">⏰</span>
          <div class="info-content">
            <label>报名时间</label>
            <p>{{ formatFullDate(race.regStart) }} - {{ formatFullDate(race.regEnd) }}</p>
          </div>
        </div>
        <div class="info-card card">
          <span class="info-icon">👥</span>
          <div class="info-content">
            <label>赛事规模</label>
            <p>{{ race.scale || '约30000人' }}</p>
          </div>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="content-layout">
        <div class="main-content">
          <!-- 报名须知 -->
          <section class="content-section card">
            <h2>报名须知</h2>
            <div class="notice-content">
              <div class="notice-item">
                <h4>报名费用</h4>
                <p>{{ race.fee || '全程马拉松：200元/人，半程马拉松：160元/人' }}</p>
              </div>
              <div class="notice-item">
                <h4>年龄要求</h4>
                <p>全程马拉松：20周岁以上（2004年12月31日前出生）<br>
                   半程马拉松：16周岁以上（2008年12月31日前出生）</p>
              </div>
              <div class="notice-item">
                <h4>健康要求</h4>
                <p>参赛选手应身体健康，有长期参加跑步锻炼的基础。有以下身体状况者不宜参加比赛：</p>
                <ul>
                  <li>先天性心脏病和风湿性心脏病</li>
                  <li>高血压和脑血管疾病</li>
                  <li>心肌炎和其他心脏病</li>
                  <li>冠状动脉病和严重心律不齐</li>
                  <li>血糖过高或过低的糖尿病</li>
                  <li>比赛日前两周以内患感冒</li>
                  <li>妊娠</li>
                </ul>
              </div>
              <div class="notice-item">
                <h4>装备领取</h4>
                <p>赛前3天至赛前1天，凭本人身份证原件到指定地点领取参赛装备。代领需提供代领人身份证原件及被代领人身份证复印件。</p>
              </div>
            </div>
          </section>

          <!-- 赛事路线 -->
          <section class="content-section card">
            <h2>赛事路线</h2>
            <div class="route-content">
              <div class="route-info">
                <div class="route-stats">
                  <div class="stat-item">
                    <span class="stat-label">起点</span>
                    <span class="stat-value">{{ race.startPoint || '天安门广场' }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">终点</span>
                    <span class="stat-value">{{ race.endPoint || '奥林匹克公园' }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">海拔爬升</span>
                    <span class="stat-value">{{ race.elevation || '约50米' }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">赛道认证</span>
                    <span class="stat-value">{{ race.certification || '中国田协A1类认证' }}</span>
                  </div>
                </div>
                <div class="route-desc">
                  <h4>赛道特点</h4>
                  <p>{{ race.routeDesc || '赛道平坦，适合创造个人最佳成绩。沿途经过城市主要景点，风景优美。' }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 奖励办法 -->
          <section class="content-section card">
            <h2>奖励办法</h2>
            <div class="reward-content">
              <div v-if="race.rewards && race.rewards.length > 0" class="reward-section">
                <h4>名次奖</h4>
                <table class="reward-table">
                  <thead>
                    <tr>
                      <th>名次</th>
                      <th>奖金</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(reward, index) in race.rewards" :key="index">
                      <td>{{ reward.rank }}</td>
                      <td>{{ reward.prize }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="reward-section">
                <h4>名次奖</h4>
                <table class="reward-table">
                  <thead>
                    <tr>
                      <th>名次</th>
                      <th>奖金（人民币）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>第一名</td>
                      <td>20,000元</td>
                    </tr>
                    <tr>
                      <td>第二名</td>
                      <td>15,000元</td>
                    </tr>
                    <tr>
                      <td>第三名</td>
                      <td>10,000元</td>
                    </tr>
                    <tr>
                      <td>第四至六名</td>
                      <td>5,000元</td>
                    </tr>
                    <tr>
                      <td>第七至十名</td>
                      <td>2,000元</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="reward-section">
                <h4>完赛奖励</h4>
                <ul class="reward-list">
                  <li>在关门时间内完成比赛的选手可获得完赛奖牌</li>
                  <li>完赛选手可于赛后24小时内下载电子成绩证书</li>
                  <li>完赛选手可获得完赛包（含完赛毛巾、补给品等）</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <!-- 侧边栏 -->
        <aside class="sidebar">
          <div class="action-card card">
            <h3>报名参赛</h3>
            <p class="action-desc">点击按钮前往官方报名页面</p>
            <a :href="race.regLink" target="_blank" class="btn btn-primary btn-full btn-large">
              立即报名
            </a>
            <div class="action-meta">
              <p>报名截止时间：{{ formatFullDate(race.regEnd) }}</p>
            </div>
          </div>

          <div class="info-card-sidebar card">
            <h3>赛事信息</h3>
            <div class="sidebar-info-list">
              <div class="sidebar-info-item">
                <span class="info-label">主办单位</span>
                <span class="info-value">{{ race.organizer || '中国田径协会、北京市体育局' }}</span>
              </div>
              <div class="sidebar-info-item">
                <span class="info-label">承办单位</span>
                <span class="info-value">{{ race.undertaker || '北京市体育竞赛管理中心' }}</span>
              </div>
              <div class="sidebar-info-item">
                <span class="info-label">官方电话</span>
                <span class="info-value">{{ race.phone || '010-12345678' }}</span>
              </div>
              <div class="sidebar-info-item">
                <span class="info-label">官方邮箱</span>
                <span class="info-value">{{ race.email || 'info@marathon.com' }}</span>
              </div>
            </div>
          </div>

          <div class="tips-card card">
            <h3>参赛贴士</h3>
            <ul class="tips-list">
              <li>提前了解赛道特点，制定配速策略</li>
              <li>赛前一周减少训练量，保证充足休息</li>
              <li>比赛当天提前2小时到达赛场</li>
              <li>携带能量胶和盐丸，及时补充</li>
              <li>注意天气变化，准备合适装备</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="not-found">
      <div class="container">
        <span class="not-found-icon">😕</span>
        <h2>赛事未找到</h2>
        <p>抱歉，您查找的赛事不存在或已被删除</p>
        <router-link to="/races" class="btn btn-primary">
          返回赛事列表
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRaceById, getAllRaces } from '../api/races.js'
import { getRaceById as getStaticRaceById } from '../data/races-static.js'
import { updatePageMeta, pageSEO, generateRaceStructuredData, addStructuredData, calculateRaceStatus } from '../utils/seo.js'

const route = useRoute()
const router = useRouter()

const race = ref(null)
const loading = ref(false)

// 更新页面SEO
const updateRaceSEO = (raceData) => {
  if (!raceData) return
  
  // 更新meta标签
  const seoConfig = pageSEO.raceDetail(raceData.name, raceData.location, raceData.date)
  updatePageMeta(seoConfig)
  
  // 添加结构化数据
  const structuredData = generateRaceStructuredData(raceData)
  addStructuredData(structuredData)
}

// 默认赛事数据（API不可用时使用）
const defaultRaces = [
  {
    id: 1,
    name: '2024北京马拉松',
    location: '北京市',
    region: '北京',
    date: '2024-10-20',
    distance: 'full',
    level: 'platinum',
    status: 'open',
    regStart: '2024-09-01',
    regEnd: '2024-09-15',
    regLink: 'https://www.beijing-marathon.com',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20Forbidden%20City%20landmark%2C%20traditional%20Chinese%20architecture%2C%20clear%20blue%20sky%2C%20professional%20photography&image_size=landscape_4_3',
    scale: '30000人',
    fee: '全程马拉松：200元/人',
    startPoint: '天安门广场',
    endPoint: '奥林匹克公园',
    elevation: '约50米',
    certification: '世界田联金标赛事',
    routeDesc: '从天安门广场出发，途经长安街、复兴路、花园桥、玲珑塔，最终到达奥林匹克公园景观大道。赛道平坦宽阔，是创造PB的理想赛道。',
    organizer: '中国田径协会、北京市体育局',
    undertaker: '北京市体育竞赛管理中心',
    phone: '010-12345678',
    email: 'info@beijing-marathon.com'
  }
]

const getStatusLabel = (status) => {
  const map = {
    'open': '报名中',
    'upcoming': '即将开始',
    'closed': '已结束'
  }
  return map[status] || status
}

const getDistanceLabel = (distance) => {
  const map = {
    '5k': '5公里',
    '10k': '10公里',
    'half': '半程马拉松',
    'full': '全程马拉松'
  }
  return map[distance] || distance
}

const getLevelLabel = (level) => {
  const map = {
    'platinum': '白金标',
    'gold': '金标',
    'silver': '银标',
    'bronze': '铜标',
    'local': '地方赛'
  }
  return map[level] || level
}

const formatFullDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(async () => {
  loading.value = true
  const raceId = parseInt(route.params.id)
  console.log('RaceDetail - 路由参数ID:', raceId, '原始值:', route.params.id)

  try {
    // 优先从API获取数据
    console.log('RaceDetail - 开始调用API获取赛事:', raceId)
    const apiRace = await getRaceById(raceId)
    console.log('RaceDetail - API返回结果:', apiRace)
    if (apiRace) {
      race.value = apiRace
      console.log('RaceDetail - 从API加载赛事详情成功:', apiRace.name)
    } else {
      console.log('RaceDetail - API返回空，尝试静态数据')
      // API无数据，使用静态数据
      const staticRace = getStaticRaceById(raceId)
      if (staticRace) {
        race.value = staticRace
        console.log('RaceDetail - 从静态数据加载赛事详情:', staticRace.name)
      } else {
        console.log('RaceDetail - 静态数据也未找到，使用默认数据')
        race.value = defaultRaces.find(r => r.id === raceId)
      }
    }
  } catch (error) {
    console.error('RaceDetail - API加载失败:', error)
    const staticRace = getStaticRaceById(raceId)
    if (staticRace) {
      race.value = staticRace
    } else {
      race.value = defaultRaces.find(r => r.id === raceId)
    }
  } finally {
    loading.value = false
    console.log('RaceDetail - 最终加载的赛事:', race.value?.name || '未找到')
  }
  
  // 更新SEO
  if (race.value) {
    updateRaceSEO(race.value)
  }
  
  if (!race.value) {
    console.log('RaceDetail - 赛事未找到')
  }
})
</script>

<style scoped>
.race-detail-page {
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
  padding: 0 24px 48px;
}

/* 赛事封面 */
.race-hero {
  height: 280px;
  border-radius: 0 0 24px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 -24px 32px;
  position: relative;
  overflow: hidden;
}

.hero-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
  z-index: 2;
}

.hero-content {
  text-align: center;
  z-index: 3;
  color: white;
  padding: 0 24px;
  max-width: 800px;
}

.hero-badges {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.race-hero h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.hero-info {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.info-icon {
  font-size: 16px;
}

.level-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.level-badge.platinum {
  background: #E5E4E2;
  color: #333;
}

.level-badge.gold {
  background: #FFD700;
  color: #333;
}

.level-badge.silver {
  background: #C0C0C0;
  color: #333;
}

.level-badge.bronze {
  background: #CD7F32;
  color: white;
}

.level-badge.local {
  background: #87CEEB;
  color: #333;
}

.status-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.open {
  background: #4CAF50;
  color: white;
}

.status-badge.upcoming {
  background: var(--primary-orange);
  color: white;
}

.status-badge.closed {
  background: #9E9E9E;
  color: white;
}

.distance-badge {
  padding: 8px 20px;
  background: var(--primary-blue);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.info-icon {
  font-size: 32px;
}

.info-content label {
  display: block;
  font-size: 12px;
  color: var(--text-gray);
  margin-bottom: 4px;
}

.info-content p {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
}

/* 内容布局 */
.content-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-section {
  padding: 24px;
}

.content-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-dark);
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

/* 报名须知 */
.notice-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notice-item h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.notice-item p {
  color: var(--text-gray);
  line-height: 1.8;
  font-size: 14px;
}

.notice-item ul {
  padding-left: 20px;
  margin-top: 8px;
}

.notice-item li {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 6px;
}

/* 赛事路线 */
.route-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.route-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.route-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: var(--bg-gray);
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-gray);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
}

.route-desc h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.route-desc p {
  color: var(--text-gray);
  line-height: 1.8;
  font-size: 14px;
}

/* 奖励办法 */
.reward-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.reward-section h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-dark);
}

.reward-table {
  width: 100%;
  border-collapse: collapse;
}

.reward-table th,
.reward-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.reward-table th {
  background: var(--bg-gray);
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
}

.reward-table td {
  color: var(--text-gray);
  font-size: 14px;
}

.reward-list {
  padding-left: 20px;
}

.reward-list li {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-card {
  padding: 24px;
  background: linear-gradient(135deg, var(--primary-blue) 0%, #1565C0 100%);
  color: white;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.action-desc {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.btn-large {
  padding: 14px 24px;
  font-size: 16px;
  background: white;
  color: var(--primary-blue);
  margin-bottom: 16px;
}

.btn-large:hover {
  background: var(--bg-gray);
}

.action-meta {
  text-align: center;
  font-size: 12px;
  opacity: 0.9;
}

.info-card-sidebar,
.tips-card {
  padding: 20px;
}

.info-card-sidebar h3,
.tips-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-dark);
}

.sidebar-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--text-gray);
}

.info-value {
  font-size: 13px;
  color: var(--text-dark);
}

.tips-list {
  padding-left: 16px;
}

.tips-list li {
  color: var(--text-gray);
  font-size: 13px;
  margin-bottom: 10px;
  line-height: 1.6;
}

/* 未找到 */
.not-found {
  text-align: center;
  padding: 120px 20px;
}

.not-found-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.not-found h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-dark);
}

.not-found p {
  color: var(--text-gray);
  margin-bottom: 24px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 0 16px 32px;
  }

  .race-hero {
    height: 240px;
    margin: 0 -16px 24px;
  }

  .race-hero h1 {
    font-size: 24px;
  }

  .hero-info {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .info-item {
    font-size: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .route-stats {
    grid-template-columns: 1fr;
  }

  .reward-table {
    font-size: 13px;
  }

  .reward-table th,
  .reward-table td {
    padding: 10px;
  }
}
</style>
