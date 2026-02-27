<template>
  <div class="special-list">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">专项训练</h1>
      <p class="page-subtitle">针对不同训练目标的专项训练包</p>
      
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
      
      <!-- 筛选条件 -->
      <div class="filter-section">
        <div class="filter-item">
          <label>难度等级：</label>
          <select v-model="difficultyFilter" class="filter-select">
            <option value="">全部</option>
            <option value="beginner">入门级</option>
            <option value="intermediate">进阶级</option>
            <option value="elite">精英级</option>
          </select>
        </div>
        <div class="filter-item">
          <label>训练周期：</label>
          <select v-model="cycleFilter" class="filter-select">
            <option value="">全部</option>
            <option value="4">4 周</option>
            <option value="6">6 周</option>
            <option value="8">8 周</option>
          </select>
        </div>
      </div>
      
      <!-- 训练包列表 -->
      <div class="training-packages">
        <div 
              v-for="pkg in filteredPackages" 
              :key="pkg.id"
              class="package-card"
              @click="goToDetail(pkg.id)"
            >
              <div class="package-header">
                <h3 class="package-name">{{ pkg.name }}</h3>
                <div class="package-badges">
                  <span class="badge difficulty">{{ pkg.difficultyText }}</span>
                  <span class="badge cycle">{{ pkg.cycle }} 周</span>
                </div>
              </div>
              <div class="package-content">
                <div class="package-info">
                  <div class="info-item">
                    <span class="info-label">适用人群：</span>
                    <span class="info-value">{{ pkg.targetAudience }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">核心目标：</span>
                    <span class="info-value">{{ pkg.coreGoal }}</span>
                  </div>
                </div>
              </div>
              <div class="package-footer">
                <span class="view-detail">查看详情 →</span>
              </div>
            </div>
      </div>
      
      <!-- 无数据提示 -->
      <div v-if="filteredPackages.length === 0" class="no-data">
        <p>暂无符合条件的训练包</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分类数据
const categories = [
  { id: 'endurance', name: '耐力专项' },
  { id: 'speed', name: '速度专项' },
  { id: 'track', name: '赛道适配专项' },
  { id: 'environment', name: '环境适配专项' },
  { id: 'technique', name: '技术专项' },
  { id: 'strength', name: '力量专项' },
  { id: 'injury', name: '伤病预防专项' }
]

const currentCategory = ref('endurance')
const difficultyFilter = ref('')
const cycleFilter = ref('')

// 模拟训练包数据
const trainingPackages = ref([
  {
    id: 1,
    name: '有氧耐力提升',
    category: 'endurance',
    difficulty: 'beginner',
    difficultyText: '入门级',
    cycle: 8,
    targetAudience: '初级跑者',
    coreGoal: '提高有氧基础，增强耐力'
  },
  {
    id: 2,
    name: '乳酸阈值训练',
    category: 'endurance',
    difficulty: 'intermediate',
    difficultyText: '进阶级',
    cycle: 6,
    targetAudience: '中级跑者',
    coreGoal: '提高乳酸阈值，增强持续运动能力'
  },
  {
    id: 3,
    name: '速度爆发力',
    category: 'speed',
    difficulty: 'intermediate',
    difficultyText: '进阶级',
    cycle: 4,
    targetAudience: '中级跑者',
    coreGoal: '提高跑步速度和爆发力'
  },
  {
    id: 4,
    name: '精英速度训练',
    category: 'speed',
    difficulty: 'elite',
    difficultyText: '精英级',
    cycle: 8,
    targetAudience: '高级跑者',
    coreGoal: '突破速度瓶颈，提升竞技水平'
  },
  {
    id: 5,
    name: '山地赛道适应',
    category: 'track',
    difficulty: 'intermediate',
    difficultyText: '进阶级',
    cycle: 6,
    targetAudience: '中级跑者',
    coreGoal: '适应山地赛道，提高爬坡能力'
  },
  {
    id: 6,
    name: '高温环境训练',
    category: 'environment',
    difficulty: 'intermediate',
    difficultyText: '进阶级',
    cycle: 4,
    targetAudience: '所有跑者',
    coreGoal: '提高高温环境下的适应能力'
  },
  {
    id: 7,
    name: '跑姿优化',
    category: 'technique',
    difficulty: 'beginner',
    difficultyText: '入门级',
    cycle: 8,
    targetAudience: '所有跑者',
    coreGoal: '纠正跑姿，提高跑步效率'
  },
  {
    id: 8,
    name: '核心力量训练',
    category: 'strength',
    difficulty: 'beginner',
    difficultyText: '入门级',
    cycle: 6,
    targetAudience: '所有跑者',
    coreGoal: '增强核心力量，提高跑步稳定性'
  },
  {
    id: 9,
    name: '膝盖保护',
    category: 'injury',
    difficulty: 'beginner',
    difficultyText: '入门级',
    cycle: 4,
    targetAudience: '有膝盖不适的跑者',
    coreGoal: '加强膝盖周围肌肉，预防膝盖损伤'
  }
])

// 筛选训练包
const filteredPackages = computed(() => {
  return trainingPackages.value.filter(pkg => {
    const categoryMatch = pkg.category === currentCategory.value
    const difficultyMatch = difficultyFilter.value ? pkg.difficulty === difficultyFilter.value : true
    const cycleMatch = cycleFilter.value ? pkg.cycle.toString() === cycleFilter.value : true
    return categoryMatch && difficultyMatch && cycleMatch
  })
})

// 跳转到详情页
const goToDetail = (id) => {
  router.push(`/advance-marathon/special-training/special-detail?id=${id}`)
}
</script>

<style scoped>
.special-list {
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

/* 筛选条件 */
.filter-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-item label {
  font-weight: 500;
  color: #333;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* 训练包列表 */
.training-packages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.package-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.package-header {
  margin-bottom: 1rem;
}

.package-name {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.package-badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge.difficulty {
  background: #e3f2fd;
  color: #1565c0;
}

.badge.cycle {
  background: #e8f5e8;
  color: #2e7d32;
}

.package-content {
  margin-bottom: 1rem;
}

.package-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  font-size: 0.9rem;
}

.info-label {
  font-weight: bold;
  color: #666;
}

.info-value {
  color: #555;
}

.package-footer {
  text-align: right;
}

.view-detail {
  color: #667eea;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-detail:hover {
  color: #5a6fd8;
}

/* 无数据提示 */
.no-data {
  text-align: center;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 8px;
  color: #666;
  margin-top: 2rem;
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
  
  .filter-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-item {
    width: 100%;
  }
  
  .filter-select {
    flex: 1;
  }
  
  .training-packages {
    grid-template-columns: 1fr;
  }
}
</style>