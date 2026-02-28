<template>
  <div class="admin-page">
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🏃</span>
          <span class="logo-text">马拉松PB研究院</span>
        </div>
        <div class="nav-links">
          <router-link to="/beginner" class="nav-link">入门专区</router-link>
          <router-link to="/races" class="nav-link">参赛专区</router-link>
          <router-link to="/advanced" class="nav-link">进阶专区</router-link>
        </div>
      </div>
    </nav>

    <div class="main-container">
      <div v-if="!isLoggedIn" class="login-container">
        <div class="login-card card">
          <div class="login-header">
            <span class="login-icon">🔐</span>
            <h2>管理员登录</h2>
            <p>请输入管理员密码进入后台</p>
          </div>
          <div class="login-form">
            <div class="form-group">
              <label>密码</label>
              <input 
                v-model="loginPassword" 
                type="password" 
                class="input" 
                placeholder="请输入管理员密码"
                @keyup.enter="handleLogin"
              />
            </div>
            <button class="btn btn-primary btn-full" @click="handleLogin">
              登录
            </button>
          </div>
          <p class="login-hint">默认密码: admin123</p>
        </div>
      </div>

      <div v-else class="admin-dashboard">
        <aside class="admin-sidebar">
          <div class="sidebar-header">
            <span class="admin-icon">👤</span>
            <div class="admin-info">
              <h4>管理员</h4>
              <p>内容管理系统</p>
            </div>
          </div>
          <nav class="sidebar-nav">
            <button 
              v-for="tab in adminTabs" 
              :key="tab.id"
              class="nav-item"
              :class="{ active: currentTab === tab.id }"
              @click="currentTab = tab.id"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span class="nav-label">{{ tab.label }}</span>
            </button>
          </nav>
          <button class="logout-btn" @click="handleLogout">
            <span>🚪</span>
            <span>退出登录</span>
          </button>
        </aside>

        <main class="admin-content">
          <section v-if="currentTab === 'races'" class="content-section">
            <div class="section-header">
              <h2>赛事信息管理</h2>
              <button class="btn btn-primary" @click="openRaceModal()">
                <span>+</span>
                添加赛事
              </button>
            </div>

            <div v-if="loading" class="loading-container">
              <p>加载中...</p>
            </div>
            <div v-else class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>赛事名称</th>
                    <th>举办城市</th>
                    <th>日期</th>
                    <th>距离</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="race in races" :key="race.id">
                    <td>{{ race.name }}</td>
                    <td>{{ race.city || race.region }}</td>
                    <td>{{ race.date }}</td>
                    <td>{{ getDistanceLabel(race.distance) }}</td>
                    <td>
                      <span class="status-tag" :class="race.status">
                        {{ getStatusLabel(race.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="action-btns">
                        <button class="btn-icon" @click="openRaceModal(race)" title="编辑">✏️</button>
                        <button class="btn-icon" @click="deleteRaceHandler(race.id)" title="删除">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section v-if="currentTab === 'plans'" class="content-section">
            <div class="section-header">
              <h2>训练计划管理</h2>
              <button class="btn btn-primary" @click="openPlanModal()">
                <span>+</span>
                添加计划
              </button>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>计划名称</th>
                    <th>目标</th>
                    <th>周期</th>
                    <th>难度</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="plan in trainingPlans" :key="plan.id">
                    <td>{{ plan.name }}</td>
                    <td>{{ getGoalLabel(plan.goal) }}</td>
                    <td>{{ plan.duration }}周</td>
                    <td>{{ plan.difficulty }}</td>
                    <td>
                      <div class="action-btns">
                        <button class="btn-icon" @click="openPlanModal(plan)" title="编辑">✏️</button>
                        <button class="btn-icon" @click="deletePlan(plan.id)" title="删除">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 反馈管理 -->
          <section v-if="currentTab === 'feedback'" class="content-section">
            <div class="section-header">
              <h2>用户反馈管理</h2>
              <button class="btn btn-primary" @click="$router.push('/admin/feedback')">
                <span>📋</span>
                查看全部反馈
              </button>
            </div>
            <div class="feedback-summary">
              <div class="summary-card" @click="$router.push('/admin/feedback')">
                <span class="summary-icon">💬</span>
                <div class="summary-info">
                  <h4>用户反馈</h4>
                  <p>查看和管理用户提交的反馈建议</p>
                </div>
                <span class="summary-arrow">→</span>
              </div>
            </div>
          </section>

          <section v-if="currentTab === 'knowledge'" class="content-section">
            <div class="section-header">
              <h2>入门知识管理</h2>
              <button class="btn btn-primary" @click="openKnowledgeModal()">
                <span>+</span>
                添加文章
              </button>
            </div>

            <div class="knowledge-list">
              <div v-for="article in knowledgeArticles" :key="article.id" class="knowledge-card card">
                <div class="knowledge-header">
                  <h4>{{ article.title }}</h4>
                  <span class="knowledge-category">{{ article.category }}</span>
                </div>
                <p class="knowledge-summary">{{ article.summary }}</p>
                <div class="knowledge-meta">
                  <span class="knowledge-date">更新于 {{ article.updateTime }}</span>
                  <div class="action-btns">
                    <button class="btn-icon" @click="openKnowledgeModal(article)" title="编辑">✏️</button>
                    <button class="btn-icon" @click="deleteKnowledge(article.id)" title="删除">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <div v-if="showRaceModal" class="modal-overlay" @click.self="closeRaceModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingRace.id ? '编辑赛事' : '添加赛事' }}</h3>
          <button class="close-btn" @click="closeRaceModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>赛事名称 *</label>
            <input v-model="editingRace.name" type="text" class="input" placeholder="例如：2024北京马拉松" />
          </div>
          <div class="form-group">
            <label>举办城市 *</label>
            <div class="city-selector">
              <select v-model="selectedProvince" class="input" @change="onProvinceChange">
                <option value="">请选择省份</option>
                <option v-for="province in chinaRegions" :key="province.code" :value="province.code">
                  {{ province.name }}
                </option>
              </select>
              <select v-model="selectedCity" class="input" @change="onCityChange" :disabled="!selectedProvince">
                <option value="">请选择城市</option>
                <option v-for="city in currentCities" :key="city.code" :value="city.code">
                  {{ city.name }}
                </option>
              </select>
              <select v-model="selectedDistrict" class="input" :disabled="!selectedCity">
                <option value="">请选择区/县（可选）</option>
                <option v-for="district in currentDistricts" :key="district" :value="district">
                  {{ district }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>赛事日期 *</label>
              <input v-model="editingRace.date" type="date" class="input" />
            </div>
            <div class="form-group">
              <label>距离 *</label>
              <select v-model="editingRace.distance" class="input">
                <option value="full">全程马拉松</option>
                <option value="half">半程马拉松</option>
                <option value="10k">10公里</option>
                <option value="5k">5公里</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>报名开始 *</label>
              <input v-model="editingRace.regStart" type="date" class="input" />
            </div>
            <div class="form-group">
              <label>报名截止 *</label>
              <input v-model="editingRace.regEnd" type="date" class="input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>报名状态 *</label>
              <select v-model="editingRace.status" class="input">
                <option value="open">报名中</option>
                <option value="upcoming">即将开始</option>
                <option value="closed">已结束</option>
              </select>
            </div>
            <div class="form-group">
              <label>报名链接 *</label>
              <input v-model="editingRace.regLink" type="text" class="input" placeholder="https://..." />
            </div>
          </div>
          <div class="form-group">
            <label>详细地址</label>
            <input v-model="editingRace.location" type="text" class="input" placeholder="例如：北京市朝阳区..." />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeRaceModal">取消</button>
          <button class="btn btn-primary" @click="saveRace">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showPlanModal" class="modal-overlay" @click.self="closePlanModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingPlan.id ? '编辑计划' : '添加计划' }}</h3>
          <button class="close-btn" @click="closePlanModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>计划名称 *</label>
            <input v-model="editingPlan.name" type="text" class="input" placeholder="例如：半程马拉松基础计划" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>目标 *</label>
              <select v-model="editingPlan.goal" class="input">
                <option value="half">半程马拉松</option>
                <option value="full">全程马拉松</option>
                <option value="sub3">破3挑战</option>
              </select>
            </div>
            <div class="form-group">
              <label>周期（周）*</label>
              <input v-model.number="editingPlan.duration" type="number" class="input" placeholder="12" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>难度 *</label>
              <select v-model="editingPlan.difficulty" class="input">
                <option value="中等">中等</option>
                <option value="较难">较难</option>
                <option value="困难">困难</option>
                <option value="极难">极难</option>
              </select>
            </div>
            <div class="form-group">
              <label>适合水平 *</label>
              <select v-model="editingPlan.level" class="input">
                <option value="beginner">大众</option>
                <option value="advanced">进阶</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>计划简介</label>
            <textarea v-model="editingPlan.description" class="input" rows="3" placeholder="简要描述该计划的特点和适合人群"></textarea>
          </div>
          <div class="form-group">
            <label>注意事项（每行一条）</label>
            <textarea v-model="editingPlan.tipsText" class="input" rows="4" placeholder="每周跑量递增不超过10%&#10;注意跑前热身和跑后拉伸"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closePlanModal">取消</button>
          <button class="btn btn-primary" @click="savePlan">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showKnowledgeModal" class="modal-overlay" @click.self="closeKnowledgeModal">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3>{{ editingKnowledge.id ? '编辑文章' : '添加文章' }}</h3>
          <button class="close-btn" @click="closeKnowledgeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>文章标题 *</label>
              <input v-model="editingKnowledge.title" type="text" class="input" placeholder="文章标题" />
            </div>
            <div class="form-group">
              <label>分类 *</label>
              <select v-model="editingKnowledge.category" class="input">
                <option value="基础知识">基础知识</option>
                <option value="装备指南">装备指南</option>
                <option value="健康评估">健康评估</option>
                <option value="参赛指引">参赛指引</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>文章摘要</label>
            <textarea v-model="editingKnowledge.summary" class="input" rows="2" placeholder="简要描述文章内容"></textarea>
          </div>
          <div class="form-group">
            <label>文章内容 *</label>
            <textarea v-model="editingKnowledge.content" class="input content-editor" rows="15" placeholder="支持富文本编辑...&#10;&#10;可以使用以下格式：&#10;- 标题：## 标题&#10;- 列表：- 项目&#10;- 强调：**粗体**&#10;- 链接：[文字](url)"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeKnowledgeModal">取消</button>
          <button class="btn btn-primary" @click="saveKnowledge">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getAllRacesAdmin, createRace, updateRace, deleteRace } from '../api/races'
import { chinaRegions } from '../data/china-regions'

const isLoggedIn = ref(false)
const loginPassword = ref('')
const currentTab = ref('races')

const adminTabs = [
  { id: 'races', label: '赛事管理', icon: '🏆' },
  { id: 'feedback', label: '反馈管理', icon: '💬' },
  { id: 'plans', label: '训练计划', icon: '📈' },
  { id: 'knowledge', label: '入门知识', icon: '📚' }
]

const races = ref([])
const loading = ref(false)

const selectedProvince = ref('')
const selectedCity = ref('')
const selectedDistrict = ref('')

const currentCities = computed(() => {
  const province = chinaRegions.find(p => p.code === selectedProvince.value)
  return province ? province.cities : []
})

const currentDistricts = computed(() => {
  const province = chinaRegions.find(p => p.code === selectedProvince.value)
  if (!province) return []
  const city = province.cities.find(c => c.code === selectedCity.value)
  return city ? city.districts : []
})

const loadRaces = async () => {
  loading.value = true
  try {
    const data = await getAllRacesAdmin()
    races.value = data
  } catch (error) {
    console.error('加载赛事数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) {
    loadRaces()
  }
})

const trainingPlans = ref([
  {
    id: 1,
    name: '半程马拉松基础计划',
    goal: 'half',
    level: 'beginner',
    difficulty: '中等',
    duration: 12,
    description: '适合首次挑战半程马拉松的跑者',
    tips: ['每周跑量递增不超过10%', '注意跑前热身和跑后拉伸']
  },
  {
    id: 2,
    name: '全程马拉松完赛计划',
    goal: 'full',
    level: 'beginner',
    difficulty: '较难',
    duration: 16,
    description: '帮助跑者安全完成首马',
    tips: ['最长LSD距离达到32-35公里', '赛前3周开始减量']
  }
])

const knowledgeArticles = ref([
  {
    id: 1,
    title: '什么是马拉松？',
    category: '基础知识',
    summary: '马拉松是一项考验耐力的长跑运动，标准距离为42.195公里',
    content: '马拉松是一项考验耐力的长跑运动，源自古希腊传说...',
    updateTime: '2024-01-15'
  },
  {
    id: 2,
    title: '如何选择合适的跑鞋',
    category: '装备指南',
    summary: '跑鞋是马拉松最重要的装备，选择合适的跑鞋能有效预防伤病',
    content: '跑鞋是马拉松最重要的装备...',
    updateTime: '2024-01-10'
  }
])

const showRaceModal = ref(false)
const showPlanModal = ref(false)
const showKnowledgeModal = ref(false)

const editingRace = reactive({
  id: null,
  name: '',
  location: '',
  region: '',
  city: '',
  province: '',
  district: '',
  date: '',
  distance: 'full',
  status: 'upcoming',
  regStart: '',
  regEnd: '',
  regLink: ''
})

const editingPlan = reactive({
  id: null,
  name: '',
  goal: 'half',
  level: 'beginner',
  difficulty: '中等',
  duration: 12,
  description: '',
  tipsText: ''
})

const editingKnowledge = reactive({
  id: null,
  title: '',
  category: '基础知识',
  summary: '',
  content: ''
})

const handleLogin = () => {
  if (loginPassword.value === 'admin123') {
    isLoggedIn.value = true
    loginPassword.value = ''
    loadRaces()
  } else {
    alert('密码错误')
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  currentTab.value = 'races'
}

const getDistanceLabel = (distance) => {
  const map = { '5k': '5公里', '10k': '10公里', 'half': '半程马拉松', 'full': '全程马拉松' }
  return map[distance] || distance
}

const getStatusLabel = (status) => {
  const map = { 'open': '报名中', 'upcoming': '即将开始', 'closed': '已结束' }
  return map[status] || status
}

const getGoalLabel = (goal) => {
  const map = { 'half': '半程马拉松', 'full': '全程马拉松', 'sub3': '破3挑战' }
  return map[goal] || goal
}

const onProvinceChange = () => {
  selectedCity.value = ''
  selectedDistrict.value = ''
  updateCityDisplay()
}

const onCityChange = () => {
  selectedDistrict.value = ''
  updateCityDisplay()
}

const updateCityDisplay = () => {
  const province = chinaRegions.find(p => p.code === selectedProvince.value)
  const city = province ? province.cities.find(c => c.code === selectedCity.value) : null
  
  if (province && city) {
    let cityName = `${province.name} ${city.name}`
    if (selectedDistrict.value) {
      cityName += ` ${selectedDistrict.value}`
    }
    editingRace.city = cityName
    editingRace.region = cityName
    // 设置province字段为完整的省份名称，用于筛选功能
    editingRace.province = province.name
  } else {
    editingRace.city = ''
    editingRace.region = ''
    editingRace.province = ''
  }
}

const openRaceModal = (race = null) => {
  if (race) {
    Object.assign(editingRace, race)
    // 根据race.city或race.region解析并设置省份和城市选择器
    const cityStr = race.city || race.region || ''
    if (cityStr) {
      // 尝试匹配省份
      const provinceMatch = chinaRegions.find(p => cityStr.includes(p.name))
      if (provinceMatch) {
        selectedProvince.value = provinceMatch.code
        // 尝试匹配城市
        const cityMatch = provinceMatch.cities.find(c => cityStr.includes(c.name))
        if (cityMatch) {
          selectedCity.value = cityMatch.code
        } else {
          selectedCity.value = ''
        }
      } else {
        selectedProvince.value = ''
        selectedCity.value = ''
      }
    } else {
      selectedProvince.value = ''
      selectedCity.value = ''
    }
    selectedDistrict.value = ''
  } else {
    Object.assign(editingRace, {
      id: null,
      name: '',
      location: '',
      region: '',
      city: '',
      province: '',
      district: '',
      date: '',
      distance: 'full',
      status: 'upcoming',
      regStart: '',
      regEnd: '',
      regLink: ''
    })
    selectedProvince.value = ''
    selectedCity.value = ''
    selectedDistrict.value = ''
  }
  showRaceModal.value = true
}

const closeRaceModal = () => {
  showRaceModal.value = false
}

const saveRace = async () => {
  if (!editingRace.name || !selectedCity.value || !editingRace.date) {
    alert('请填写必填项')
    return
  }

  updateCityDisplay()

  if (editingRace.id) {
    const result = await updateRace(editingRace.id, editingRace)
    if (result.success) {
      alert('赛事更新成功！')
      await loadRaces()
      closeRaceModal()
    } else {
      alert('更新失败：' + (result.error || '未知错误'))
    }
  } else {
    const result = await createRace(editingRace)
    if (result.success) {
      alert('赛事添加成功！')
      await loadRaces()
      closeRaceModal()
    } else {
      alert('添加失败：' + (result.error || '未知错误'))
    }
  }
}

const deleteRaceHandler = async (id) => {
  if (confirm('确定要删除这个赛事吗？')) {
    const result = await deleteRace(id)
    if (result.success) {
      alert('赛事删除成功！')
      await loadRaces()
    } else {
      alert('删除失败：' + (result.error || '未知错误'))
    }
  }
}

const openPlanModal = (plan = null) => {
  if (plan) {
    Object.assign(editingPlan, {
      ...plan,
      tipsText: plan.tips ? plan.tips.join('\n') : ''
    })
  } else {
    Object.assign(editingPlan, {
      id: null,
      name: '',
      goal: 'half',
      level: 'beginner',
      difficulty: '中等',
      duration: 12,
      description: '',
      tipsText: ''
    })
  }
  showPlanModal.value = true
}

const closePlanModal = () => {
  showPlanModal.value = false
}

const savePlan = () => {
  if (!editingPlan.name) {
    alert('请填写计划名称')
    return
  }

  const planData = {
    ...editingPlan,
    tips: editingPlan.tipsText.split('\n').filter(t => t.trim())
  }
  delete planData.tipsText

  if (editingPlan.id) {
    const index = trainingPlans.value.findIndex(p => p.id === editingPlan.id)
    if (index !== -1) {
      trainingPlans.value[index] = planData
    }
  } else {
    const newId = Math.max(...trainingPlans.value.map(p => p.id), 0) + 1
    trainingPlans.value.push({ ...planData, id: newId })
  }
  closePlanModal()
}

const deletePlan = (id) => {
  if (confirm('确定要删除这个训练计划吗？')) {
    trainingPlans.value = trainingPlans.value.filter(p => p.id !== id)
  }
}

const openKnowledgeModal = (article = null) => {
  if (article) {
    Object.assign(editingKnowledge, article)
  } else {
    Object.assign(editingKnowledge, {
      id: null,
      title: '',
      category: '基础知识',
      summary: '',
      content: ''
    })
  }
  showKnowledgeModal.value = true
}

const closeKnowledgeModal = () => {
  showKnowledgeModal.value = false
}

const saveKnowledge = () => {
  if (!editingKnowledge.title || !editingKnowledge.content) {
    alert('请填写必填项')
    return
  }

  const articleData = {
    ...editingKnowledge,
    updateTime: new Date().toISOString().split('T')[0]
  }

  if (editingKnowledge.id) {
    const index = knowledgeArticles.value.findIndex(a => a.id === editingKnowledge.id)
    if (index !== -1) {
      knowledgeArticles.value[index] = articleData
    }
  } else {
    const newId = Math.max(...knowledgeArticles.value.map(a => a.id), 0) + 1
    knowledgeArticles.value.push({ ...articleData, id: newId })
  }
  closeKnowledgeModal()
}

const deleteKnowledge = (id) => {
  if (confirm('确定要删除这篇文章吗？')) {
    knowledgeArticles.value = knowledgeArticles.value.filter(a => a.id !== id)
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--bg-gray);
}

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

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.login-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.login-header p {
  color: var(--text-gray);
}

.login-form .form-group {
  margin-bottom: 20px;
}

.login-form label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.login-hint {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-light);
}

.admin-dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

.admin-sidebar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: fit-content;
}

.sidebar-header {
  background: linear-gradient(135deg, var(--primary-blue) 0%, #1565C0 100%);
  color: white;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-icon {
  font-size: 32px;
}

.admin-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.admin-info p {
  font-size: 12px;
  opacity: 0.9;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-dark);
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: var(--bg-gray);
}

.nav-item.active {
  background: rgba(30, 136, 229, 0.1);
  color: var(--primary-blue);
  border-left: 3px solid var(--primary-blue);
}

.nav-icon {
  font-size: 18px;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-gray);
  border-top: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  color: #E53935;
  background: rgba(229, 57, 53, 0.05);
}

.admin-content {
  min-width: 0;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: var(--text-gray);
}

.data-table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background: var(--bg-gray);
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
}

.data-table td {
  font-size: 14px;
  color: var(--text-gray);
}

.data-table tr:hover td {
  background: rgba(30, 136, 229, 0.02);
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.open {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-tag.upcoming {
  background: rgba(255, 152, 0, 0.1);
  color: var(--primary-orange);
}

.status-tag.closed {
  background: rgba(158, 158, 158, 0.1);
  color: #9E9E9E;
}

.action-btns {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.btn-icon:hover {
  opacity: 1;
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.knowledge-card {
  padding: 20px;
}

.knowledge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.knowledge-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
}

.knowledge-category {
  padding: 4px 12px;
  background: rgba(30, 136, 229, 0.1);
  color: var(--primary-blue);
  border-radius: 20px;
  font-size: 12px;
}

.knowledge-summary {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.6;
}

.knowledge-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.knowledge-date {
  font-size: 12px;
  color: var(--text-light);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-gray);
  line-height: 1;
}

.close-btn:hover {
  color: var(--text-dark);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-gray);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-dark);
}

.city-selector {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.city-selector .input {
  flex: 1;
}

.content-editor {
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .admin-dashboard {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .city-selector {
    grid-template-columns: 1fr;
  }

  .data-table th,
  .data-table td {
    padding: 10px 12px;
    font-size: 13px;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .section-header .btn {
    width: 100%;
  }
}
</style>
