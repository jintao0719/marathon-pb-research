<template>
  <div class="races-page">
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

    <div class="main-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>赛事报名专区</h1>
        <p>全国马拉松赛事信息查询，一键直达官方报名</p>
      </div>

      <!-- 筛选器 -->
      <div class="filter-section card">
        <div class="filter-header">
          <span class="filter-icon">🔍</span>
          <span class="filter-title">赛事筛选</span>
          <button v-if="hasActiveFilters" class="btn-reset" @click="resetFilters">
            重置筛选
          </button>
        </div>
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">比赛时间</label>
            <select v-model="filters.month" class="filter-select">
              <option value="">全部时间</option>
              <option value="2026-03">2026年3月</option>
              <option value="2026-04">2026年4月</option>
              <option value="2026-05">2026年5月</option>
              <option value="2026-06">2026年6月</option>
              <option value="2026-07">2026年7月</option>
              <option value="2026-08">2026年8月</option>
              <option value="2026-09">2026年9月</option>
              <option value="2026-10">2026年10月</option>
              <option value="2026-11">2026年11月</option>
              <option value="2026-12">2026年12月</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">举办地区</label>
            <select v-model="filters.province" class="filter-select">
              <option value="">全部地区</option>
              <option value="北京市">北京市</option>
              <option value="上海市">上海市</option>
              <option value="江苏省">江苏省</option>
              <option value="浙江省">浙江省</option>
              <option value="湖北省">湖北省</option>
              <option value="四川省">四川省</option>
              <option value="重庆市">重庆市</option>
              <option value="甘肃省">甘肃省</option>
              <option value="云南省">云南省</option>
              <option value="广东省">广东省</option>
              <option value="福建省">福建省</option>
              <option value="山东省">山东省</option>
              <option value="河北省">河北省</option>
              <option value="江西省">江西省</option>
              <option value="陕西省">陕西省</option>
              <option value="辽宁省">辽宁省</option>
              <option value="吉林省">吉林省</option>
              <option value="广西壮族自治区">广西壮族自治区</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">赛事等级</label>
            <select v-model="filters.level" class="filter-select">
              <option value="">全部等级</option>
              <option value="platinum">🏆 白金标赛事</option>
              <option value="gold">🥇 金标赛事</option>
              <option value="silver">🥈 银标赛事</option>
              <option value="bronze">🥉 铜标赛事</option>
              <option value="label">📛 标牌赛事</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">比赛项目</label>
            <select v-model="filters.distance" class="filter-select">
              <option value="">全部项目</option>
              <option value="full">全程马拉松</option>
              <option value="half">半程马拉松</option>
              <option value="both">全马+半马</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">报名状态</label>
            <select v-model="filters.regStatus" class="filter-select">
              <option value="">全部状态</option>
              <option value="open">🔥 报名中</option>
              <option value="upcoming">⏰ 即将开始</option>
              <option value="pending">🔜 即将开启报名</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 赛事列表 -->
      <div class="races-content">
        <div class="section-header">
          <h2>赛事列表</h2>
          <span class="result-count">共 {{ filteredRaces.length }} 场赛事</span>
        </div>

        <div v-if="filteredRaces.length === 0" class="empty-state">
          <span class="empty-icon">🔍</span>
          <p>暂无符合条件的赛事</p>
          <button class="btn btn-secondary" @click="resetFilters">重置筛选</button>
        </div>

        <div v-else class="races-grid">
          <div 
            v-for="race in filteredRaces" 
            :key="race.id"
            class="race-card card"
            @click="goToDetail(race.id)"
          >
            <div class="race-image">
              <img :src="race.image" :alt="race.name" class="race-image-src">
              <span class="status-badge" :class="calculateRaceStatus(race).status">{{ calculateRaceStatus(race).label }}</span>
            </div>
            <div class="race-info">
              <h3>{{ race.name }}</h3>
              <div class="race-meta">
                <p class="meta-item">
                  <span class="meta-icon">📍</span>
                  {{ race.location }}
                </p>
                <p class="meta-item">
                  <span class="meta-icon">📅</span>
                  {{ formatDate(race.date) }}
                </p>
                <p class="meta-item">
                  <span class="meta-icon">🏃</span>
                  {{ getDistancesLabel(race) }}
                </p>
              </div>
              <div v-if="calculateRaceStatus(race).status === 'open'" class="race-actions">
                <a 
                  :href="race.regLink" 
                  target="_blank" 
                  class="btn btn-primary btn-sm"
                  @click.stop
                >
                  去报名
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllRaces } from '../api/races.js'
import { updatePageMeta, pageSEO, calculateRaceStatus } from '../utils/seo.js'
import { getAllRaces as getStaticRaces } from '../data/races-static.js'

const router = useRouter()
const races = ref([])
const loading = ref(false)

// 设置页面SEO
updatePageMeta(pageSEO.races)

// 筛选条件
const filters = ref({
  month: '',
  province: '',
  level: '',
  distance: '',
  regStatus: ''
})

// 计算是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '')
})

// 状态排序权重（数字越小越靠前）
const statusWeight = {
  'open': 1,      // 报名中
  'pending': 2,   // 即将开启报名
  'upcoming': 3,  // 即将开始
  'finished': 4   // 比赛已结束
}

// 赛事等级排序权重（数字越小越靠前，级别越高）
const levelWeight = {
  'platinum': 1,  // 白金标
  'gold': 2,      // 金标
  'silver': 3,    // 银标
  'bronze': 4,    // 铜标
  'local': 5      // 地方赛
}

// 筛选后的赛事列表
const filteredRaces = computed(() => {
  const filtered = races.value.filter(race => {
    // 月份筛选
    if (filters.value.month && race.date) {
      const raceMonth = race.date.substring(0, 7)
      if (raceMonth !== filters.value.month) return false
    }
    
    // 省份筛选
    if (filters.value.province) {
      // 优先使用 province 字段，如果没有则使用 region 字段
      const raceProvince = race.province || race.region
      if (!raceProvince || raceProvince !== filters.value.province) return false
    }
    
    // 赛事等级筛选
    if (filters.value.level && race.level) {
      if (race.level !== filters.value.level) return false
    }
    
    // 比赛项目筛选
    if (filters.value.distance) {
      if (filters.value.distance === 'both') {
        // 全马+半马：需要有distances数组且包含full和half
        if (!race.distances || !race.distances.includes('full') || !race.distances.includes('half')) {
          return false
        }
      } else if (filters.value.distance === 'full') {
        // 全程马拉松：distance为full或有distances包含full
        if (race.distance !== 'full' && (!race.distances || !race.distances.includes('full'))) {
          return false
        }
      } else if (filters.value.distance === 'half') {
        // 半程马拉松：distance为half或有distances包含half
        if (race.distance !== 'half' && (!race.distances || !race.distances.includes('half'))) {
          return false
        }
      }
    }
    
    // 报名状态筛选
    if (filters.value.regStatus) {
      const status = calculateRaceStatus(race).status
      if (status !== filters.value.regStatus) return false
    }
    
    return true
  })
  
  // 排序：先按状态排序 -> 同状态下按赛事级别降序 -> 同级别按比赛日期倒排（日期近的在前）
  return filtered.sort((a, b) => {
    const statusA = calculateRaceStatus(a).status
    const statusB = calculateRaceStatus(b).status
    
    // 按状态权重排序
    const statusWeightA = statusWeight[statusA] || 5
    const statusWeightB = statusWeight[statusB] || 5
    
    if (statusWeightA !== statusWeightB) {
      return statusWeightA - statusWeightB
    }
    
    // 同状态下按赛事级别降序（级别高的在前）
    const levelA = levelWeight[a.level] || 5
    const levelB = levelWeight[b.level] || 5
    
    if (levelA !== levelB) {
      return levelA - levelB
    }
    
    // 同状态同级别下按比赛日期倒排（日期近的在前）
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA - dateB
  })
})

// 重置筛选
const resetFilters = () => {
  filters.value = {
    month: '',
    province: '',
    level: '',
    distance: '',
    regStatus: ''
  }
}

const loadRaces = async () => {
  loading.value = true
  try {
    // 优先从API获取数据（本地开发环境）
    const apiRaces = await getAllRaces()
    if (apiRaces && apiRaces.length > 0) {
      races.value = apiRaces
      console.log(`已加载 ${apiRaces.length} 场赛事（API数据）`)
    } else {
      // API无数据，使用静态数据（Vercel部署备用）
      const staticData = getStaticRaces()
      races.value = staticData
      console.log(`已加载 ${staticData.length} 场赛事（静态数据）`)
    }
  } catch (error) {
    console.error('API加载失败，使用静态数据:', error)
    // API失败，使用静态数据
    const staticData = getStaticRaces()
    races.value = staticData
    console.log(`已加载 ${staticData.length} 场赛事（静态数据）`)
  } finally {
    loading.value = false
  }
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

const getDistancesLabel = (race) => {
  // 如果有distances数组，显示所有距离类型
  if (race.distances && race.distances.length > 0) {
    const labels = race.distances.map(d => getDistanceLabel(d))
    return labels.join('、')
  }
  // 否则显示单个distance
  return getDistanceLabel(race.distance)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const goToDetail = (id) => {
  router.push(`/race/${id}`)
}

onMounted(async () => {
  await loadRaces()
})
</script>

<style scoped>
.races-page {
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

/* 筛选器样式 */
.filter-section {
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.filter-icon {
  font-size: 18px;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  flex: 1;
}

.btn-reset {
  padding: 6px 14px;
  font-size: 13px;
  color: var(--primary-blue);
  background: transparent;
  border: 1px solid var(--primary-blue);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background: var(--primary-blue);
  color: white;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  flex: 1;
  min-width: 160px;
}

.filter-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-gray);
  margin-bottom: 6px;
}

.filter-select {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--text-dark);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.filter-select:hover {
  border-color: var(--primary-blue);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

/* 赛事内容 */
.races-content {
  margin-top: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
}

.result-count {
  color: var(--text-gray);
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 64px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  color: var(--text-gray);
  margin-bottom: 20px;
}

/* 赛事网格 */
.races-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.race-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.race-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.race-image {
  height: 160px;
  position: relative;
  overflow: hidden;
}

.race-image-src {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
  background: #4CAF50;
  color: white;
}

.status-badge.upcoming {
  background: var(--primary-orange);
}

.status-badge.closed {
  background: #9E9E9E;
}

.status-badge.finished {
  background: #757575;
}

.status-badge.pending {
  background: #2196F3;
}

.race-info {
  padding: 20px;
}

.race-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-dark);
}

.race-meta {
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-gray);
  font-size: 13px;
  margin-bottom: 6px;
}

.meta-icon {
  font-size: 14px;
}

.race-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .races-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 16px;
  }

  .races-grid {
    grid-template-columns: 1fr;
  }
}
</style>
