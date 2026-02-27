<template>
  <div class="course-form">
    <div class="container">
      <!-- 返回进阶专区入口 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>
      
      <h1 class="page-title">马拉松备赛课表定制</h1>
      <p class="page-subtitle">填写以下信息，为您生成专属的标准化备赛课表</p>
      
      <!-- 表单内容 -->
      <div class="form-content">
        <!-- 基础信息 -->
        <div class="form-section">
          <h2 class="section-title">基础信息</h2>
          <div class="form-group">
            <label class="form-label">参赛项目 <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" v-model="formData.raceType" value="full" />
                <span>全马</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="formData.raceType" value="half" />
                <span>半马</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">当前 PB 成绩 <span class="required">*</span></label>
            <div class="time-selector">
              <select v-model="currentPB.hour" class="time-select">
                <option value="">时</option>
                <option v-for="hour in hourOptions" :key="hour" :value="hour.toString().padStart(2, '0')">
                  {{ hour }}
                </option>
              </select>
              <span class="time-separator">:</span>
              <select v-model="currentPB.minute" class="time-select">
                <option value="">分</option>
                <option v-for="minute in minuteOptions" :key="minute" :value="minute.toString().padStart(2, '0')">
                  {{ minute }}
                </option>
              </select>
              <span class="time-separator">:</span>
              <select v-model="currentPB.second" class="time-select">
                <option value="">秒</option>
                <option v-for="second in secondOptions" :key="second" :value="second.toString().padStart(2, '0')">
                  {{ second }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">目标 PB 成绩 <span class="required">*</span></label>
            <div class="time-selector">
              <select v-model="targetPB.hour" class="time-select">
                <option value="">时</option>
                <option v-for="hour in hourOptions" :key="hour" :value="hour.toString().padStart(2, '0')">
                  {{ hour }}
                </option>
              </select>
              <span class="time-separator">:</span>
              <select v-model="targetPB.minute" class="time-select">
                <option value="">分</option>
                <option v-for="minute in minuteOptions" :key="minute" :value="minute.toString().padStart(2, '0')">
                  {{ minute }}
                </option>
              </select>
              <span class="time-separator">:</span>
              <select v-model="targetPB.second" class="time-select">
                <option value="">秒</option>
                <option v-for="second in secondOptions" :key="second" :value="second.toString().padStart(2, '0')">
                  {{ second }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- 训练计划 -->
        <div class="form-section">
          <h2 class="section-title">训练计划</h2>
          <div class="form-group">
            <label class="form-label">目标赛事举办日期 <span class="required">*</span></label>
            <div class="date-picker-container">
              <p class="date-warning">⚠️ 马拉松进阶备赛计划最短需 8 周，请选择距今 56 天及以上的日期</p>
              <input 
                type="date" 
                v-model="formData.raceDate" 
                :min="minDate" 
                class="form-input"
              />
              <p v-if="weekInfo" class="week-info">{{ weekInfo }}</p>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">每周可训练天数 <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" v-model="formData.trainingDays" value="2" />
                <span>2 天</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="formData.trainingDays" value="3" />
                <span>3 天</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="formData.trainingDays" value="4" />
                <span>4 天</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="formData.trainingDays" value="5" />
                <span>5 天</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="formData.trainingDays" value="6" />
                <span>6 天</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="formData.trainingDays" value="7" />
                <span>7 天</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">当前周里程（KM） <span class="required">*</span></label>
            <input 
              type="number" 
              v-model="formData.currentWeeklyDistance" 
              min="1" 
              step="0.1" 
              class="form-input"
              placeholder="请输入当前每周跑的公里数"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">目标周里程（KM） <span class="required">*</span></label>
            <input 
              type="number" 
              v-model="formData.targetWeeklyDistance" 
              min="1" 
              step="0.1" 
              class="form-input"
              placeholder="请输入目标每周跑的最大公里数"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">里程增长模式 <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" v-model="formData.distanceGrowthMode" value="progressive" />
                <span>渐进式增长</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="formData.distanceGrowthMode" value="fixed" />
                <span>固定里程</span>
              </label>
            </div>
          </div>
        </div>
        

      </div>
      
      <!-- 按钮区域 -->
      <div class="form-actions">
        <button 
          @click="generateCourse" 
          :disabled="!isFormValid" 
          class="btn btn-primary"
        >
          生成专属课表
        </button>
      </div>
      
      <!-- 提示弹窗 -->
      <div v-if="showAlert" class="alert-modal">
        <div class="alert-content">
          <h3>目标 PB 合理性提示</h3>
          <p>{{ alertMessage }}</p>
          <div class="alert-actions">
            <button @click="showAlert = false" class="btn btn-secondary">取消</button>
            <button @click="confirmGenerate" class="btn btn-primary">确认继续</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const formData = ref({
  raceType: '',
  currentPB: '',
  targetPB: '',
  raceDate: '',
  trainingDays: '',
  currentWeeklyDistance: '',
  targetWeeklyDistance: '',
  distanceGrowthMode: '',
  injuryHistory: 'none',
  trainingLocation: 'road'
})

// 时分秒选择数据
const currentPB = ref({
  hour: '',
  minute: '00',
  second: '00'
})

const targetPB = ref({
  hour: '',
  minute: '00',
  second: '00'
})

const showAlert = ref(false)
const alertMessage = ref('')

// 从 localStorage 加载表单数据
const loadFormDataFromStorage = () => {
  const savedData = localStorage.getItem('marathonCourseFormData')
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData)
      // 恢复表单数据
      formData.value = {
        raceType: parsedData.raceType || '',
        currentPB: parsedData.currentPB || '',
        targetPB: parsedData.targetPB || '',
        raceDate: parsedData.raceDate || '',
        trainingDays: parsedData.trainingDays || '',
        currentWeeklyDistance: parsedData.currentWeeklyDistance || '',
        targetWeeklyDistance: parsedData.targetWeeklyDistance || '',
        distanceGrowthMode: parsedData.distanceGrowthMode || '',
        injuryHistory: parsedData.injuryHistory || 'none',
        trainingLocation: parsedData.trainingLocation || 'road'
      }
      
      // 解析 currentPB
      if (parsedData.currentPB) {
        const parts = parsedData.currentPB.split(':')
        currentPB.value.hour = parts[0] || ''
        currentPB.value.minute = parts[1] || '00'
        currentPB.value.second = parts[2] || '00'
      }
      
      // 解析 targetPB
      if (parsedData.targetPB) {
        const parts = parsedData.targetPB.split(':')
        targetPB.value.hour = parts[0] || ''
        targetPB.value.minute = parts[1] || '00'
        targetPB.value.second = parts[2] || '00'
      }
    } catch (error) {
      console.error('加载表单数据失败:', error)
    }
  }
}

// 保存表单数据到 localStorage
const saveFormDataToStorage = () => {
  try {
    localStorage.setItem('marathonCourseFormData', JSON.stringify(formData.value))
  } catch (error) {
    console.error('保存表单数据失败:', error)
  }
}

// 页面加载时读取保存的数据
onMounted(() => {
  loadFormDataFromStorage()
})

// 监听表单数据变化，自动保存
watch(formData, () => {
  saveFormDataToStorage()
}, { deep: true })

// 小时选项
const hourOptions = computed(() => {
  const options = []
  if (formData.value.raceType === 'half') {
    for (let hour = 1; hour <= 4; hour++) {
      options.push(hour)
    }
  } else if (formData.value.raceType === 'full') {
    for (let hour = 2; hour <= 8; hour++) {
      options.push(hour)
    }
  }
  return options
})

// 分钟选项
const minuteOptions = computed(() => {
  const options = []
  for (let minute = 0; minute < 60; minute++) {
    options.push(minute)
  }
  return options
})

// 秒选项
const secondOptions = computed(() => {
  const options = []
  for (let second = 0; second < 60; second++) {
    options.push(second)
  }
  return options
})

// 监听时分秒变化，更新formData
watch([() => currentPB.value.hour, () => currentPB.value.minute, () => currentPB.value.second], () => {
  if (currentPB.value.hour) {
    // 确保分和秒有默认值
    const minute = currentPB.value.minute || '00'
    const second = currentPB.value.second || '00'
    formData.value.currentPB = `${currentPB.value.hour}:${minute}:${second}`
  } else {
    formData.value.currentPB = ''
  }
})

watch([() => targetPB.value.hour, () => targetPB.value.minute, () => targetPB.value.second], () => {
  if (targetPB.value.hour) {
    // 确保分和秒有默认值
    const minute = targetPB.value.minute || '00'
    const second = targetPB.value.second || '00'
    formData.value.targetPB = `${targetPB.value.hour}:${minute}:${second}`
  } else {
    formData.value.targetPB = ''
  }
})

// 计算最小日期（今天 + 56 天）
const minDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 56)
  return date.toISOString().split('T')[0]
})

// 计算周数信息
const weekInfo = computed(() => {
  if (!formData.value.raceDate) return ''
  
  const today = new Date()
  const raceDate = new Date(formData.value.raceDate)
  const diffTime = raceDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const weeks = Math.ceil(diffDays / 7)
  
  // 预配置周期
  const preConfiguredWeeks = [8, 12, 16, 20, 24]
  let selectedWeeks = 8
  
  for (let i = 0; i < preConfiguredWeeks.length; i++) {
    if (weeks <= preConfiguredWeeks[i]) {
      selectedWeeks = preConfiguredWeeks[i]
      break
    }
  }
  
  return `您选择的赛事距今约 ${weeks} 周，将为您生成 ${selectedWeeks} 周标准化备赛课表`
})

// 表单验证
const isFormValid = computed(() => {
  return formData.value.raceType &&
         formData.value.currentPB &&
         formData.value.targetPB &&
         formData.value.raceDate &&
         formData.value.trainingDays &&
         formData.value.currentWeeklyDistance &&
         formData.value.targetWeeklyDistance &&
         formData.value.distanceGrowthMode
})

// 检查目标 PB 合理性
const checkPBRationality = () => {
  // 简化实现，实际项目中需要解析时间格式并计算差值
  // 这里仅做示例
  showAlert.value = true
  alertMessage.value = '根据您的当前 PB，目标 PB 的提升幅度可能较大。确定要继续吗？'
}

// 生成课表
const generateCourse = () => {
  // 检查目标 PB 合理性
  checkPBRationality()
}

// 确认生成
const confirmGenerate = () => {
  showAlert.value = false
  // 跳转到结果页，并传递表单数据
  router.push({
    path: '/advance-marathon/course-custom/course-result',
    query: {
      raceType: formData.value.raceType,
      currentPB: formData.value.currentPB,
      targetPB: formData.value.targetPB,
      raceDate: formData.value.raceDate,
      trainingDays: formData.value.trainingDays,
      currentWeeklyDistance: formData.value.currentWeeklyDistance,
      targetWeeklyDistance: formData.value.targetWeeklyDistance,
      distanceGrowthMode: formData.value.distanceGrowthMode,
      injuryHistory: formData.value.injuryHistory,
      trainingLocation: formData.value.trainingLocation
    }
  })
}
</script>

<style scoped>
.course-form {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 800px;
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

.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.step-item {
  flex: 1;
  text-align: center;
  position: relative;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: bold;
  color: #666;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.9rem;
  color: #666;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: #667eea;
  color: white;
}

.step-item.active .step-label {
  color: #667eea;
  font-weight: bold;
}

.step-item.completed .step-number {
  background: #4caf50;
  color: white;
}

.form-content {
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-title {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.required {
  color: #f44336;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

/* 时分秒选择器样式 */
.time-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-select {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.time-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.time-separator {
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
  margin: 0 0.25rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.date-picker-container {
  position: relative;
}

.date-warning {
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.week-info {
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
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

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.alert-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alert-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.alert-content h3 {
  margin-top: 0;
  color: #333;
}

.alert-content p {
  margin-bottom: 1.5rem;
  color: #666;
}

.alert-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    width: 100%;
  }
}
</style>