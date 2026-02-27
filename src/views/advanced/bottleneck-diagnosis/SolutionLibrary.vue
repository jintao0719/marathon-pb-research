<template>
  <div class="solution-library">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">瓶颈解决方案库</h1>
      <p class="page-subtitle">针对进阶跑者高频瓶颈的分类解决方案</p>
      
      <!-- 瓶颈分类卡片 -->
      <div class="bottleneck-cards">
        <div 
          v-for="bottleneck in bottlenecks" 
          :key="bottleneck.id"
          class="bottleneck-card"
          @click="goToSolution(bottleneck.id)"
        >
          <div class="bottleneck-header">
            <h3 class="bottleneck-name">{{ bottleneck.name }}</h3>
            <span class="arrow-icon">→</span>
          </div>
          <div class="bottleneck-content">
            <p class="bottleneck-desc">{{ bottleneck.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 瓶颈分类数据
const bottlenecks = ref([
  {
    id: 1,
    name: '后半程掉速',
    description: '比赛后半程配速明显下降，无法维持目标速度'
  },
  {
    id: 2,
    name: '配速稳定性差',
    description: '比赛中配速波动过大，能量消耗不均'
  },
  {
    id: 3,
    name: '坡地能力弱',
    description: '在上下坡路段表现不佳，影响整体成绩'
  },
  {
    id: 4,
    name: '乳酸阈值不足',
    description: '高强度运动时乳酸堆积过快，导致疲劳提前'
  },
  {
    id: 5,
    name: '过度训练',
    description: '训练负荷过大，恢复不足，导致性能下降'
  },
  {
    id: 6,
    name: '赛事崩盘',
    description: '比赛中因各种原因导致体力完全耗尽，无法完成比赛'
  },
  {
    id: 7,
    name: '有氧能力不足',
    description: '基础有氧能力薄弱，无法支撑长距离跑步'
  },
  {
    id: 8,
    name: '力量短板',
    description: '核心力量和下肢力量不足，影响跑步效率和稳定性'
  },
  {
    id: 9,
    name: '技术瓶颈',
    description: '跑步技术存在问题，影响跑步效率和伤病风险'
  },
  {
    id: 10,
    name: '补给策略失误',
    description: '比赛中补给时机和种类不当，影响能量供应'
  }
])

// 跳转到解决方案详情页
const goToSolution = (id) => {
  // 实际项目中可以跳转到具体的解决方案详情页
  // 这里暂时使用 alert 模拟
  alert(`查看 ${bottlenecks.value.find(b => b.id === id).name} 的解决方案`)
}
</script>

<style scoped>
.solution-library {
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

/* 瓶颈分类卡片 */
.bottleneck-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.bottleneck-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bottleneck-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.bottleneck-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.bottleneck-name {
  color: #333;
  margin: 0;
  font-size: 1.1rem;
}

.arrow-icon {
  color: #667eea;
  font-size: 1.2rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.bottleneck-card:hover .arrow-icon {
  transform: translateX(5px);
}

.bottleneck-content {
  flex: 1;
}

.bottleneck-desc {
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
  
  .bottleneck-cards {
    grid-template-columns: 1fr;
  }
}
</style>