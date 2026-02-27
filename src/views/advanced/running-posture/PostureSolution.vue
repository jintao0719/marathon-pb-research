<template>
  <div class="posture-solution">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">跑姿问题纠正方案</h1>
      <p class="page-subtitle">高频错误跑姿的识别方法、危害与纠正训练方案</p>
      
      <!-- 错误跑姿分类卡片 -->
      <div class="problem-cards">
        <div 
          v-for="problem in problems" 
          :key="problem.id"
          class="problem-card"
          @click="goToSolution(problem.id)"
        >
          <div class="problem-header">
            <h3 class="problem-name">{{ problem.name }}</h3>
            <span class="arrow-icon">→</span>
          </div>
          <div class="problem-content">
            <p class="problem-desc">{{ problem.description }}</p>
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

// 错误跑姿分类数据
const problems = ref([
  {
    id: 1,
    name: '触地时间过长',
    description: '脚与地面接触时间超过250毫秒，影响跑步效率，增加能量消耗'
  },
  {
    id: 2,
    name: '左右不平衡',
    description: '左右脚触地时间和力量差异过大，导致单侧肌肉过度负荷'
  },
  {
    id: 3,
    name: '过度跨步',
    description: '步幅过大，着地时脚落在身体前方，增加着地冲击力'
  },
  {
    id: 4,
    name: '重心起伏过大',
    description: '跑步时身体上下移动幅度过大，浪费能量，降低跑步效率'
  },
  {
    id: 5,
    name: '足内翻 / 外翻',
    description: '脚部落地时过度内翻或外翻，增加脚踝和膝盖的压力'
  },
  {
    id: 6,
    name: '躯干前倾不足',
    description: '跑步时躯干过于直立，无法有效利用重力前进'
  },
  {
    id: 7,
    name: '膝盖屈曲异常',
    description: '跑步时膝盖弯曲角度不当，增加关节压力'
  },
  {
    id: 8,
    name: '摆臂不规范',
    description: '手臂摆动幅度过大或过小，影响身体平衡和跑步效率'
  },
  {
    id: 9,
    name: '步频过低',
    description: '步频低于170步/分钟，增加着地冲击力，增加伤病风险'
  },
  {
    id: 10,
    name: '步幅过大',
    description: '步幅超过1.5米，增加着地冲击力，影响跑步稳定性'
  },
  {
    id: 11,
    name: '落地冲击力过大',
    description: '着地时冲击力过大，增加关节压力和伤病风险'
  },
  {
    id: 12,
    name: '步幅一致性差',
    description: '步幅忽大忽小，影响跑步节奏和效率'
  }
])

// 跳转到纠正方案详情页
const goToSolution = (id) => {
  // 实际项目中可以跳转到具体的纠正方案详情页
  // 这里暂时使用 alert 模拟
  alert(`查看 ${problems.value.find(p => p.id === id).name} 的纠正方案`)
}
</script>

<style scoped>
.posture-solution {
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

/* 错误跑姿分类卡片 */
.problem-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.problem-card {
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

.problem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.problem-name {
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

.problem-card:hover .arrow-icon {
  transform: translateX(5px);
}

.problem-content {
  flex: 1;
}

.problem-desc {
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
  
  .problem-cards {
    grid-template-columns: 1fr;
  }
}
</style>