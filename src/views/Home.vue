<template>
  <div class="home">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🏃</span>
          <span class="logo-text">马拉松PB研究院</span>
        </div>
        
        <div class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
          <router-link to="/beginner" class="nav-link">入门专区</router-link>
          <router-link to="/races" class="nav-link">参赛专区</router-link>
          <router-link to="/advanced" class="nav-link">进阶专区</router-link>
          <router-link to="/feedback" class="nav-link">跑者心声</router-link>
        </div>
        
        <div class="nav-right">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索赛事/训练计划/知识..."
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">🔍</button>
          </div>
          <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
            ☰
          </button>
        </div>
      </div>
    </nav>

    <!-- 轮播图 -->
    <section class="carousel">
      <div class="carousel-container">
        <div 
          v-for="(slide, index) in carouselSlides" 
          :key="index"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
        >
          <div class="slide-content">
            <h2>{{ slide.title }}</h2>
            <p>{{ slide.subtitle }}</p>
            <button class="btn btn-primary" @click="$router.push(slide.link)">
              {{ slide.buttonText }}
            </button>
          </div>
          <div class="slide-bg" :style="{ backgroundImage: `url(${slide.bgImage})` }"></div>
        </div>
        <div class="carousel-dots">
          <span 
            v-for="(slide, index) in carouselSlides" 
            :key="index"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="currentSlide = index"
          ></span>
        </div>
      </div>
    </section>

    <!-- 核心板块入口 -->
    <section class="core-sections">
      <div class="container">
        <h2 class="section-title">核心板块</h2>
        <div class="sections-grid">
          <div class="section-card card" @click="$router.push('/beginner')">
            <div class="card-icon">🎯</div>
            <h3>新手入门</h3>
            <p>从零开始了解马拉松，掌握基础知识、装备选择和参赛指引</p>
            <span class="card-link">立即了解 →</span>
          </div>
          <div class="section-card card" @click="$router.push('/advanced')">
            <div class="card-icon">📈</div>
            <h3>训练计划</h3>
            <p>科学的训练计划，配速计算器和瓶颈诊断工具，助你突破PB</p>
            <span class="card-link">查看计划 →</span>
          </div>
          <div class="section-card card" @click="$router.push('/races')">
            <div class="card-icon">🏆</div>
            <h3>赛事信息</h3>
            <p>全国马拉松赛事查询，报名时间、路线信息一目了然</p>
            <span class="card-link">浏览赛事 →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门赛事预览 -->
    <section class="hot-races">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">热门赛事</h2>
          <router-link to="/races" class="view-all">查看全部 →</router-link>
        </div>
        <div v-if="hotRaces.length > 0" class="races-grid">
          <div 
            v-for="race in hotRaces" 
            :key="race.id"
            class="race-card card"
            @click="$router.push(`/race/${race.id}`)"
          >
            <div class="race-image" :style="{ backgroundImage: `url(${race.image})` }">
              <span class="race-status-badge" :class="race.statusType">{{ race.status }}</span>
            </div>
            <div class="race-info">
              <h4>{{ race.name }}</h4>
              <p class="race-location">📍 {{ race.location }}</p>
              <p class="race-date">📅 {{ race.date }}</p>
              <div class="race-tags">
                <span class="tag tag-blue">{{ race.distance }}</span>
                <span class="tag" :class="race.statusType === 'open' ? 'tag-orange' : 'tag-blue'">
                  {{ race.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>正在加载热门赛事...</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="logo-icon">🏃</span>
            <span>马拉松PB研究院</span>
            <p>专注马拉松知识分享，助力跑者突破PB</p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>入门专区</h4>
              <router-link to="/beginner">基础知识</router-link>
              <router-link to="/beginner">装备指南</router-link>
              <router-link to="/beginner">健康评估</router-link>
            </div>
            <div class="link-group">
              <h4>进阶专区</h4>
              <router-link to="/advanced">训练计划</router-link>
              <router-link to="/advanced">配速计算</router-link>
              <router-link to="/advanced">瓶颈诊断</router-link>
            </div>
            <div class="link-group">
              <h4>参赛专区</h4>
              <router-link to="/races">赛事查询</router-link>
              <router-link to="/races">报名入口</router-link>
            </div>
            <div class="link-group">
              <h4>联系我们</h4>
              <router-link to="/feedback">用户反馈</router-link>
              <router-link to="/feedback">意见建议</router-link>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 马拉松PB研究院 - 让每一步都更有意义</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllRaces as getStaticRaces } from '../data/races-static.js'
import { updatePageMeta, pageSEO } from '../utils/seo.js'

const router = useRouter()
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const currentSlide = ref(0)
const races = ref([])

const carouselSlides = [
  {
    title: '2026马拉松赛季开始',
    subtitle: '全国50+场赛事火热报名中，选择你的挑战',
    buttonText: '浏览赛事',
    link: '/races',
    bgImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Marathon%20season%202026%2C%20runners%20at%20starting%20line%2C%20city%20skyline%2C%20sunrise%20energy%2C%20dynamic%20movement%2C%20professional%20sports%20photography&image_size=landscape_16_9'
  },
  {
    title: '新手入门指南',
    subtitle: '从零开始，科学备战你的第一场马拉松',
    buttonText: '开始了解',
    link: '/beginner',
    bgImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beginner%20runner%20training%2C%20morning%20jogging%2C%20park%20trail%2C%20sunrise%20light%2C%20motivational%20atmosphere%2C%20professional%20sports%20photography&image_size=landscape_16_9'
  },
  {
    title: '突破个人最佳',
    subtitle: '专业训练计划，助你实现PB目标',
    buttonText: '查看计划',
    link: '/advanced',
    bgImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Elite%20marathon%20runner%20sprinting%2C%20finish%20line%20victory%2C%20crowd%20cheering%2C%20golden%20hour%20lighting%2C%20professional%20sports%20photography&image_size=landscape_16_9'
  }
]

// 计算赛事状态
const calculateRaceStatus = (race) => {
  const now = new Date()
  const regStart = race.regStart ? new Date(race.regStart) : null
  const regEnd = race.regEnd ? new Date(race.regEnd) : null
  const raceDate = race.date ? new Date(race.date) : null
  
  if (raceDate && now > raceDate) {
    return { status: 'finished', label: '比赛已结束' }
  }
  
  if (regStart && regEnd && now >= regStart && now <= regEnd) {
    return { status: 'open', label: '报名中' }
  }
  
  if (regStart && now < regStart) {
    return { status: 'pending', label: '即将开启报名' }
  }
  
  if (regEnd && raceDate && now > regEnd) {
    return { status: 'upcoming', label: '即将开始' }
  }
  
  return { status: 'upcoming', label: '即将开始' }
}

// 状态排序权重
const statusWeight = {
  'open': 1,
  'pending': 2,
  'upcoming': 3,
  'finished': 4
}

// 赛事等级权重
const levelWeight = {
  'platinum': 1,
  'gold': 2,
  'silver': 3,
  'bronze': 4,
  'label': 5
}

// 热门赛事：优先展示报名中、即将开启报名、即将开始的赛事，并按赛事等级降序排
const hotRaces = computed(() => {
  console.log('总赛事数:', races.value.length)
  
  // 取报名中、即将开启报名、即将开始的赛事（比赛未结束的）
  const eligibleRaces = races.value.filter(race => {
    const statusInfo = calculateRaceStatus(race)
    const isEligible = statusInfo.status === 'open' || statusInfo.status === 'pending' || statusInfo.status === 'upcoming'
    if (isEligible) {
      console.log('符合条件的赛事:', race.name, '状态:', statusInfo.status)
    }
    return isEligible
  })
  
  console.log('符合条件的赛事数:', eligibleRaces.length)
  
  // 排序：先按状态排序（报名中 > 即将开启报名 > 即将开始），再按赛事等级降序
  const sorted = eligibleRaces.sort((a, b) => {
    const statusA = calculateRaceStatus(a).status
    const statusB = calculateRaceStatus(b).status
    
    // 按状态权重排序
    const weightA = statusWeight[statusA] || 5
    const weightB = statusWeight[statusB] || 5
    
    if (weightA !== weightB) {
      return weightA - weightB
    }
    
    // 同状态下按赛事等级降序
    const levelA = levelWeight[a.level] || 5
    const levelB = levelWeight[b.level] || 5
    return levelA - levelB
  })
  
  // 取前4个
  const result = sorted.slice(0, 4).map(race => {
    const statusInfo = calculateRaceStatus(race)
    const distanceLabel = race.distances 
      ? (race.distances.includes('full') && race.distances.includes('half') ? '全马+半马' : 
         race.distances.includes('full') ? '全程' : '半程')
      : (race.distance === 'full' ? '全程' : '半程')
    
    return {
      id: race.id,
      name: race.name,
      location: race.location,
      date: race.date,
      distance: distanceLabel,
      status: statusInfo.label,
      statusType: statusInfo.status,
      image: race.image
    }
  })
  
  console.log('最终展示的赛事数:', result.length)
  return result
})

let slideInterval

onMounted(async () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
  }, 5000)
  
  // 设置页面SEO
  updatePageMeta(pageSEO.home)
  
  // 加载赛事数据（优先API，失败使用静态数据）
  try {
    const apiRaces = await getAllRaces()
    if (apiRaces && apiRaces.length > 0) {
      races.value = apiRaces
      console.log('API数据:', apiRaces.length)
    } else {
      const staticData = getStaticRaces()
      races.value = staticData || []
      console.log('静态数据:', staticData.length)
    }
  } catch (error) {
    console.error('API加载失败，使用静态数据:', error)
    const staticData = getStaticRaces()
    races.value = staticData || []
  }
})

onUnmounted(() => {
  clearInterval(slideInterval)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/races',
      query: { search: searchQuery.value }
    })
  }
}
</script>

<style scoped>
/* 导航栏样式 */
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
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
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-blue);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-blue);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--bg-gray);
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  width: 200px;
  font-size: 14px;
}

.search-btn {
  background: var(--primary-blue);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

/* 轮播图样式 */
.carousel {
  height: 480px;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide.active {
  opacity: 1;
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 20px;
}

.slide-content h2 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.slide-content p {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.95;
}

.slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-size: cover;
  background-position: center;
}

.slide-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.carousel-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  width: 24px;
  border-radius: 5px;
}

/* 核心板块样式 */
.core-sections {
  padding: 64px 0;
  background: var(--bg-gray);
}

.section-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 48px;
  color: var(--text-dark);
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.section-card {
  padding: 32px;
  text-align: center;
  cursor: pointer;
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.section-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-dark);
}

.section-card p {
  color: var(--text-gray);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-link {
  color: var(--primary-blue);
  font-weight: 500;
  font-size: 14px;
}

/* 热门赛事样式 */
.hot-races {
  padding: 64px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.view-all {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 500;
}

.races-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.race-card {
  cursor: pointer;
}

.race-image {
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.race-status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.race-status-badge.open {
  background: #4CAF50;
}

.race-status-badge.pending {
  background: #2196F3;
}

.race-status-badge.upcoming {
  background: #FF9800;
}

.race-status-badge.finished {
  background: #9E9E9E;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-gray);
}

.race-info {
  padding: 16px;
}

.race-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.race-location,
.race-date {
  font-size: 13px;
  color: var(--text-gray);
  margin-bottom: 4px;
}

.race-tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

/* 页脚样式 */
.footer {
  background: var(--text-dark);
  color: white;
  padding: 48px 0 24px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.footer-brand {
  font-size: 20px;
  font-weight: 700;
}

.footer-brand p {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-light);
  margin-top: 12px;
}

.footer-links {
  display: flex;
  gap: 64px;
}

.link-group h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.link-group a {
  display: block;
  color: var(--text-light);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--text-light);
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .sections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .races-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .nav-links.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .search-box {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .carousel {
    height: 360px;
  }
  
  .slide-content h2 {
    font-size: 28px;
  }
  
  .slide-content p {
    font-size: 16px;
  }
  
  .sections-grid {
    grid-template-columns: 1fr;
  }
  
  .races-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 32px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
