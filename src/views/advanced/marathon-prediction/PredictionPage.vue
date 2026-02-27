<template>
  <div class="prediction-page">
    <div class="container">
      <!-- 返回导航 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>

      <h1 class="page-title">马拉松全马成绩预测</h1>
      <p class="page-subtitle">基于里格利公式 + 多因素修正，科学预测您的全马成绩</p>

      <!-- 输入表单 -->
      <div v-if="!showResult" class="input-section">
        <!-- 核心必填信息 -->
        <div class="form-card">
          <h2 class="section-title">
            <span class="section-icon">📋</span>
            核心信息（必填）
          </h2>
          
          <div class="form-group">
            <label class="form-label">已知比赛距离 <span class="required">*</span></label>
            <select v-model="formData.knownDistance" class="form-select">
              <option value="">请选择</option>
              <option value="5">5公里</option>
              <option value="10">10公里</option>
              <option value="21.0975">半程马拉松 (21.0975km)</option>
              <option value="30">30公里</option>
            </select>
            <p class="form-hint">请选择3个月内全力竞速的标准路跑距离</p>
          </div>

          <div class="form-group">
            <label class="form-label">已知完赛时间 <span class="required">*</span></label>
            <div class="time-input-group">
              <input 
                v-model="knownTime.hour" 
                type="number" 
                class="time-input" 
                placeholder="时"
                min="0"
                max="9"
              />
              <span class="time-separator">:</span>
              <input 
                v-model="knownTime.minute" 
                type="number" 
                class="time-input" 
                placeholder="分"
                min="0"
                max="59"
              />
              <span class="time-separator">:</span>
              <input 
                v-model="knownTime.second" 
                type="number" 
                class="time-input" 
                placeholder="秒"
                min="0"
                max="59"
              />
            </div>
            <p class="form-hint">例：1小时45分填「01:45:00」，仅支持全力竞速成绩</p>
          </div>

          <div class="form-group">
            <label class="form-label">成绩比赛日期 <span class="required">*</span></label>
            <input 
              v-model="formData.raceDate" 
              type="date" 
              class="form-input"
              :max="maxDate"
              :min="minDate"
            />
            <p class="form-hint">请选择成绩对应的比赛日期（仅支持6个月内）</p>
          </div>
        </div>

        <!-- 辅助优化信息 -->
        <div class="form-card">
          <h2 class="section-title">
            <span class="section-icon">⚙️</span>
            辅助信息（选填）
          </h2>
          <p class="section-desc">未填写时按最优条件计算</p>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">月均跑量（km）</label>
              <input 
                v-model.number="formData.monthlyMileage" 
                type="number" 
                class="form-input"
                min="0"
                max="999"
                placeholder="300"
              />
            </div>

            <div class="form-group">
              <label class="form-label">近3个月30km+长距离次数</label>
              <input 
                v-model.number="formData.longRunsCount" 
                type="number" 
                class="form-input"
                min="0"
                max="20"
                placeholder="3"
              />
            </div>

            <div class="form-group">
              <label class="form-label">系统训练时长</label>
              <select v-model="formData.trainingDuration" class="form-select">
                <option value="<3"><3个月</option>
                <option value="3-6">3-6个月</option>
                <option value=">6">>6个月</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">年龄</label>
              <input 
                v-model.number="formData.age" 
                type="number" 
                class="form-input"
                min="18"
                max="80"
                placeholder="30"
              />
            </div>

            <div class="form-group">
              <label class="form-label">性别</label>
              <select v-model="formData.gender" class="form-select">
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">比赛赛道累计爬升（m）</label>
              <input
                v-model.number="formData.elevation"
                type="number"
                class="form-input"
                min="0"
                max="2000"
                placeholder="0"
              />
            </div>

            <div class="form-group">
              <label class="form-label">比赛日预测温度</label>
              <select v-model="formData.temperature" class="form-select">
                <option value="<15"><15℃</option>
                <option value="15-20">15-20℃</option>
                <option value="20-25">20-25℃</option>
                <option value=">25">>25℃</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">比赛日相对湿度</label>
              <select v-model="formData.humidity" class="form-select">
                <option value="<60"><60%</option>
                <option value="60-70">60%-70%</option>
                <option value="70-80">70%-80%</option>
                <option value=">80">>80%</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">比赛日风力</label>
              <select v-model="formData.wind" class="form-select">
                <option value="none">无风/微风</option>
                <option value="light">3级及以下逆风</option>
                <option value="strong">3级以上逆风</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button @click="startPrediction" class="btn btn-primary btn-large">
            开始预测
          </button>
          <button @click="resetForm" class="btn btn-secondary">
            重置
          </button>
        </div>
      </div>

      <!-- 预测结果 -->
      <div v-else class="result-section">
        <div class="result-card">
          <h2 class="result-title">预测结果</h2>
          
          <div class="main-result">
            <div class="result-label">预测全马成绩</div>
            <div class="result-time">{{ finalResult.timeStr }}</div>
            <div class="result-pace">平均配速：{{ finalResult.paceStr }}/km</div>
          </div>

          <!-- 计算说明 -->
          <div class="calculation-detail">
            <h3 @click="showDetail = !showDetail" class="detail-toggle">
              <span>计算说明</span>
              <span class="toggle-icon">{{ showDetail ? '▼' : '▶' }}</span>
            </h3>
            
            <div v-show="showDetail" class="detail-content">
              <!-- 基础计算 -->
              <div class="detail-section">
                <h4>1. 里格利公式基础计算</h4>
                <div class="formula">
                  T₂ = T₁ × (D₂/D₁)^1.06
                </div>
                <div class="calc-steps">
                  <p>已知{{ getDistanceLabel(formData.knownDistance) }}成绩：{{ formatTime(calculation.base.knownTime) }}</p>
                  <p>基础预测时间 = {{ calculation.base.knownTime }} × (42.195/{{ formData.knownDistance }})^{{ calculation.base.fatigueIndex }}</p>
                  <p>≈ {{ calculation.base.baseTime.toFixed(2) }} 分钟（{{ formatTime(calculation.base.baseTime * 60) }}）</p>
                </div>
              </div>

              <!-- 修正系数 -->
              <div class="detail-section">
                <h4>2. 多因素修正系数</h4>
                <div class="correction-list">
                  <div class="correction-item">
                    <span>训练水平系数</span>
                    <span class="correction-value">{{ calculation.corrections.training.value }}</span>
                    <span class="correction-desc">{{ calculation.corrections.training.desc }}</span>
                  </div>
                  <div class="correction-item">
                    <span>年龄系数</span>
                    <span class="correction-value">{{ calculation.corrections.age.value }}</span>
                    <span class="correction-desc">{{ calculation.corrections.age.desc }}</span>
                  </div>
                  <div class="correction-item">
                    <span>性别系数</span>
                    <span class="correction-value">{{ calculation.corrections.gender.value }}</span>
                    <span class="correction-desc">{{ calculation.corrections.gender.desc }}</span>
                  </div>
                  <div class="correction-item">
                    <span>赛道爬升系数</span>
                    <span class="correction-value">{{ calculation.corrections.elevation.value }}</span>
                    <span class="correction-desc">{{ calculation.corrections.elevation.desc }}</span>
                  </div>
                  <div class="correction-item">
                    <span>温度系数</span>
                    <span class="correction-value">{{ calculation.corrections.temperature.value }}</span>
                    <span class="correction-desc">{{ calculation.corrections.temperature.desc }}</span>
                  </div>
                  <div class="correction-item">
                    <span>湿度系数</span>
                    <span class="correction-value">{{ calculation.corrections.humidity.value }}</span>
                    <span class="correction-desc">{{ calculation.corrections.humidity.desc }}</span>
                  </div>
                  <div class="correction-item">
                    <span>风力系数</span>
                    <span class="correction-value">{{ calculation.corrections.wind.value }}</span>
                    <span class="correction-desc">{{ calculation.corrections.wind.desc }}</span>
                  </div>
                </div>
                <div class="total-correction">
                  <span>总修正系数</span>
                  <span class="total-value">{{ calculation.totalFactor.toFixed(4) }}</span>
                </div>
              </div>

              <!-- 最终计算 -->
              <div class="detail-section">
                <h4>3. 最终预测</h4>
                <div class="final-calc">
                  <p>最终预测时间 = {{ calculation.base.baseTime.toFixed(2) }} × {{ calculation.totalFactor.toFixed(4) }}</p>
                  <p>≈ {{ calculation.finalTime.toFixed(2) }} 分钟</p>
                  <p>= {{ finalResult.timeStr }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 结果操作 -->
          <div class="result-actions">
            <button @click="downloadResult" class="btn btn-primary">
              下载结果
            </button>
            <button @click="showResult = false" class="btn btn-secondary">
              重新预测
            </button>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'

// 表单数据
const formData = reactive({
  knownDistance: '',
  raceDate: '',
  monthlyMileage: 300,
  longRunsCount: 3,
  trainingDuration: '>6',
  age: 30,
  gender: 'male',
  elevation: 0,
  temperature: '<15',
  humidity: '<60',
  wind: 'none'
})

// 已知成绩时间
const knownTime = reactive({
  hour: '',
  minute: '',
  second: ''
})

// 页面状态
const showResult = ref(false)
const showDetail = ref(true)

// 计算结果
const calculation = reactive({
  base: {
    knownTime: 0,
    fatigueIndex: 1.06,
    baseTime: 0
  },
  corrections: {
    training: { value: 1.0, desc: '最优训练水平' },
    age: { value: 1.0, desc: '18-39岁' },
    gender: { value: 1.0, desc: '男性' },
    elevation: { value: 1.0, desc: '0-100m' },
    temperature: { value: 1.0, desc: '<15℃' },
    humidity: { value: 1.0, desc: '<60%' },
    wind: { value: 1.0, desc: '无风/微风' }
  },
  totalFactor: 1.0,
  finalTime: 0
})

// 最终结果
const finalResult = reactive({
  timeStr: '',
  paceStr: ''
})

// 日期限制
const maxDate = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const minDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() - 6)
  return date.toISOString().split('T')[0]
})

// 获取距离标签
const getDistanceLabel = (distance) => {
  const labels = {
    '5': '5公里',
    '10': '10公里',
    '21.0975': '半程马拉松',
    '30': '30公里'
  }
  return labels[distance] || distance + 'km'
}

// 格式化时间（秒 → HH:MM:SS）
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.round(totalSeconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// 计算训练水平系数
const calculateTrainingFactor = () => {
  const mileage = formData.monthlyMileage || 300
  const longRuns = formData.longRunsCount || 3
  const duration = formData.trainingDuration || '>6'
  
  // 最优条件
  if (mileage >= 300 && longRuns >= 3 && duration === '>6') {
    return { value: 1.0, desc: '月跑量≥300km，30km+次数≥3，训练>6个月' }
  }
  // 中等条件
  if (mileage >= 150 && mileage < 300 && longRuns >= 1 && longRuns <= 2 && duration === '3-6') {
    return { value: 1.05, desc: '月跑量150-299km，30km+次数1-2，训练3-6个月' }
  }
  // 较差条件
  if (mileage < 150 && longRuns === 0 && duration === '<3') {
    return { value: 1.12, desc: '月跑量<150km，30km+次数0，训练<3个月' }
  }
  
  // 中间情况，根据条件判断
  let factor = 1.0
  let desc = []
  
  if (mileage < 150) {
    factor += 0.06
    desc.push('月跑量<150km')
  } else if (mileage < 300) {
    factor += 0.025
    desc.push('月跑量150-299km')
  }
  
  if (longRuns < 3) {
    factor += 0.02
    desc.push('30km+次数<3')
  }
  
  if (duration === '<3') {
    factor += 0.04
    desc.push('训练<3个月')
  } else if (duration === '3-6') {
    factor += 0.02
    desc.push('训练3-6个月')
  }
  
  return { 
    value: Math.min(factor, 1.12), 
    desc: desc.length > 0 ? desc.join('，') : '综合训练水平良好'
  }
}

// 计算年龄系数
const calculateAgeFactor = () => {
  const age = formData.age || 30
  if (age >= 18 && age <= 39) return { value: 1.0, desc: '18-39岁' }
  if (age >= 40 && age <= 49) return { value: 1.02, desc: '40-49岁' }
  if (age >= 50 && age <= 59) return { value: 1.04, desc: '50-59岁' }
  return { value: 1.07, desc: '≥60岁' }
}

// 计算性别系数
const calculateGenderFactor = () => {
  return formData.gender === 'female' 
    ? { value: 0.99, desc: '女性' }
    : { value: 1.0, desc: '男性' }
}

// 计算爬升系数
const calculateElevationFactor = () => {
  const elevation = formData.elevation || 0
  if (elevation <= 100) return { value: 1.0, desc: '0-100m' }
  if (elevation <= 300) return { value: 1.04, desc: '100-300m' }
  if (elevation <= 500) return { value: 1.08, desc: '300-500m' }
  return { value: 1.12, desc: '>500m' }
}

// 计算温度系数
const calculateTemperatureFactor = () => {
  const temp = formData.temperature || '<15'
  const factors = {
    '<15': { value: 1.0, desc: '<15℃' },
    '15-20': { value: 1.02, desc: '15-20℃' },
    '20-25': { value: 1.05, desc: '20-25℃' },
    '>25': { value: 1.10, desc: '>25℃' }
  }
  return factors[temp]
}

// 计算湿度系数
const calculateHumidityFactor = () => {
  const humidity = formData.humidity || '<60'
  const factors = {
    '<60': { value: 1.0, desc: '<60%' },
    '60-70': { value: 1.01, desc: '60%-70%' },
    '70-80': { value: 1.03, desc: '70%-80%' },
    '>80': { value: 1.05, desc: '>80%' }
  }
  return factors[humidity]
}

// 计算风力系数
const calculateWindFactor = () => {
  const wind = formData.wind || 'none'
  const factors = {
    'none': { value: 1.0, desc: '无风/微风' },
    'light': { value: 1.03, desc: '3级及以下逆风' },
    'strong': { value: 1.06, desc: '3级以上逆风' }
  }
  return factors[wind]
}

// 开始预测
const startPrediction = () => {
  // 校验必填项
  if (!formData.knownDistance) {
    alert('请选择已知比赛距离')
    return
  }
  if (!knownTime.hour && !knownTime.minute && !knownTime.second) {
    alert('请输入已知完赛时间')
    return
  }
  if (!formData.raceDate) {
    alert('请选择成绩比赛日期')
    return
  }

  // 转换已知时间为秒
  const hours = parseInt(knownTime.hour) || 0
  const minutes = parseInt(knownTime.minute) || 0
  const seconds = parseInt(knownTime.second) || 0
  
  if (minutes > 59 || seconds > 59) {
    alert('请输入有效的时间格式（分钟和秒不能超过59）')
    return
  }
  
  const knownTimeInSeconds = hours * 3600 + minutes * 60 + seconds
  const knownTimeInMinutes = knownTimeInSeconds / 60
  
  // 计算疲劳衰减指数
  const monthlyMileage = formData.monthlyMileage || 300
  const trainingDuration = formData.trainingDuration || '>6'
  const fatigueIndex = (monthlyMileage < 150 && trainingDuration === '<3') ? 1.08 : 1.06
  
  // 里格利公式基础计算
  const d1 = parseFloat(formData.knownDistance)
  const d2 = 42.195 // 全马距离
  const baseTime = knownTimeInMinutes * Math.pow(d2 / d1, fatigueIndex)
  
  calculation.base = {
    knownTime: knownTimeInMinutes,
    fatigueIndex,
    baseTime
  }
  
  // 计算各修正系数
  calculation.corrections.training = calculateTrainingFactor()
  calculation.corrections.age = calculateAgeFactor()
  calculation.corrections.gender = calculateGenderFactor()
  calculation.corrections.elevation = calculateElevationFactor()
  calculation.corrections.temperature = calculateTemperatureFactor()
  calculation.corrections.humidity = calculateHumidityFactor()
  calculation.corrections.wind = calculateWindFactor()
  
  // 计算总修正系数
  calculation.totalFactor = 
    calculation.corrections.training.value *
    calculation.corrections.age.value *
    calculation.corrections.gender.value *
    calculation.corrections.elevation.value *
    calculation.corrections.temperature.value *
    calculation.corrections.humidity.value *
    calculation.corrections.wind.value
  
  // 最终预测时间（分钟）
  calculation.finalTime = baseTime * calculation.totalFactor
  
  // 格式化最终结果
  const finalSeconds = calculation.finalTime * 60
  finalResult.timeStr = formatTime(finalSeconds)
  
  // 计算配速
  const paceSeconds = finalSeconds / 42.195
  const paceMin = Math.floor(paceSeconds / 60)
  const paceSec = Math.round(paceSeconds % 60)
  finalResult.paceStr = `${paceMin}:${paceSec.toString().padStart(2, '0')}`
  
  // 显示结果
  showResult.value = true
  
  // 异常提示
  if (calculation.finalTime < 120) {
    alert('⚠️ 该预测成绩为理论值（<2小时），需结合实际训练水平验证')
  }
}

// 重置表单
const resetForm = () => {
  formData.knownDistance = ''
  formData.raceDate = ''
  formData.monthlyMileage = 300
  formData.longRunsCount = 3
  formData.trainingDuration = '>6'
  formData.age = 30
  formData.gender = 'male'
  formData.elevation = 0
  formData.temperature = '<15'
  formData.humidity = '<60'
  formData.wind = 'none'
  
  knownTime.hour = ''
  knownTime.minute = ''
  knownTime.second = ''
}

// 下载结果为PDF
const downloadResult = async () => {
  try {
    // 检查浏览器是否支持 File System Access API
    if (!('showSaveFilePicker' in window)) {
      alert('您的浏览器不支持文件保存功能，请使用最新版 Chrome/Edge 浏览器')
      return
    }

    // 生成默认文件名
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
    const defaultFilename = `成绩预测_${dateStr}_${timeStr}.pdf`

    // 调用系统原生文件保存对话框
    const handle = await window.showSaveFilePicker({
      suggestedName: defaultFilename,
      types: [{
        description: 'PDF文件',
        accept: { 'application/pdf': ['.pdf'] }
      }]
    })

    // 创建PDF内容容器
    const pdfContent = document.createElement('div')
    pdfContent.style.padding = '20px'
    pdfContent.style.fontFamily = 'Arial, sans-serif'
    pdfContent.style.backgroundColor = 'white'

    // 添加标题
    const titleDiv = document.createElement('div')
    titleDiv.style.textAlign = 'center'
    titleDiv.style.marginBottom = '20px'
    titleDiv.style.borderBottom = '2px solid #667eea'
    titleDiv.style.paddingBottom = '10px'
    titleDiv.innerHTML = `
      <h1 style="color: #667eea; margin: 0; font-size: 24px;">马拉松全马成绩预测报告</h1>
      <p style="color: #666; margin: 5px 0 0 0; font-size: 12px;">生成时间：${now.toLocaleString()}</p>
    `
    pdfContent.appendChild(titleDiv)

    // 添加核心结果
    const resultDiv = document.createElement('div')
    resultDiv.style.backgroundColor = '#f5f5f5'
    resultDiv.style.padding = '20px'
    resultDiv.style.borderRadius = '8px'
    resultDiv.style.marginBottom = '20px'
    resultDiv.style.textAlign = 'center'
    resultDiv.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 10px;">预测全马成绩</div>
      <div style="font-size: 32px; font-weight: bold; color: #667eea; margin-bottom: 10px;">${finalResult.timeStr}</div>
      <div style="font-size: 16px; color: #333;">平均配速：${finalResult.paceStr}/km</div>
    `
    pdfContent.appendChild(resultDiv)

    // 添加输入信息
    const inputDiv = document.createElement('div')
    inputDiv.style.marginBottom = '20px'
    inputDiv.innerHTML = `
      <h3 style="color: #333; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #667eea; padding-left: 10px;">输入信息</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
        <div><strong>已知距离：</strong>${getDistanceLabel(formData.knownDistance)}</div>
        <div><strong>已知成绩：</strong>${formatTime(calculation.base.knownTime * 60)}</div>
        <div><strong>比赛日期：</strong>${formData.raceDate}</div>
        <div><strong>月均跑量：</strong>${formData.monthlyMileage}km</div>
        <div><strong>30km+次数：</strong>${formData.longRunsCount}次</div>
        <div><strong>训练时长：</strong>${formData.trainingDuration === '<3' ? '<3个月' : formData.trainingDuration === '3-6' ? '3-6个月' : '>6个月'}</div>
        <div><strong>年龄：</strong>${formData.age}岁</div>
        <div><strong>性别：</strong>${formData.gender === 'male' ? '男' : '女'}</div>
        <div><strong>赛道爬升：</strong>${formData.elevation}m</div>
        <div><strong>温度：</strong>${formData.temperature === '<15' ? '<15℃' : formData.temperature === '15-20' ? '15-20℃' : formData.temperature === '20-25' ? '20-25℃' : '>25℃'}</div>
        <div><strong>湿度：</strong>${formData.humidity === '<60' ? '<60%' : formData.humidity === '60-70' ? '60%-70%' : formData.humidity === '70-80' ? '70%-80%' : '>80%'}</div>
        <div><strong>风力：</strong>${formData.wind === 'none' ? '无风/微风' : formData.wind === 'light' ? '3级及以下逆风' : '3级以上逆风'}</div>
      </div>
    `
    pdfContent.appendChild(inputDiv)

    // 添加计算说明
    const calcDiv = document.createElement('div')
    calcDiv.style.marginBottom = '20px'
    calcDiv.innerHTML = `
      <h3 style="color: #333; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #667eea; padding-left: 10px;">计算说明</h3>

      <div style="margin-bottom: 15px;">
        <h4 style="color: #667eea; font-size: 14px; margin-bottom: 8px;">1. 里格利公式基础计算</h4>
        <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; margin-bottom: 8px;">
          T₂ = T₁ × (D₂/D₁)^${calculation.base.fatigueIndex}
        </div>
        <p style="font-size: 11px; color: #666; margin: 4px 0;">已知${getDistanceLabel(formData.knownDistance)}成绩：${formatTime(calculation.base.knownTime * 60)}</p>
        <p style="font-size: 11px; color: #666; margin: 4px 0;">基础预测时间 = ${calculation.base.knownTime.toFixed(2)} × (42.195/${formData.knownDistance})^${calculation.base.fatigueIndex}</p>
        <p style="font-size: 11px; color: #666; margin: 4px 0;">≈ ${calculation.base.baseTime.toFixed(2)} 分钟（${formatTime(calculation.base.baseTime * 60)}）</p>
      </div>

      <div style="margin-bottom: 15px;">
        <h4 style="color: #667eea; font-size: 14px; margin-bottom: 8px;">2. 多因素修正系数</h4>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 6px; border: 1px solid #ddd;">训练水平系数</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${calculation.corrections.training.value}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${calculation.corrections.training.desc}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #ddd;">年龄系数</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${calculation.corrections.age.value}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${calculation.corrections.age.desc}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 6px; border: 1px solid #ddd;">性别系数</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${calculation.corrections.gender.value}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${calculation.corrections.gender.desc}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #ddd;">赛道爬升系数</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${calculation.corrections.elevation.value}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${calculation.corrections.elevation.desc}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 6px; border: 1px solid #ddd;">温度系数</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${calculation.corrections.temperature.value}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${calculation.corrections.temperature.desc}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #ddd;">湿度系数</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${calculation.corrections.humidity.value}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${calculation.corrections.humidity.desc}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 6px; border: 1px solid #ddd;">风力系数</td>
            <td style="padding: 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #667eea;">${calculation.corrections.wind.value}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${calculation.corrections.wind.desc}</td>
          </tr>
        </table>
        <div style="background: #667eea; color: white; padding: 10px; border-radius: 4px; margin-top: 10px; text-align: center;">
          <strong>总修正系数：${calculation.totalFactor.toFixed(4)}</strong>
        </div>
      </div>

      <div>
        <h4 style="color: #667eea; font-size: 14px; margin-bottom: 8px;">3. 最终预测</h4>
        <p style="font-size: 11px; color: #666; margin: 4px 0;">最终预测时间 = ${calculation.base.baseTime.toFixed(2)} × ${calculation.totalFactor.toFixed(4)}</p>
        <p style="font-size: 11px; color: #666; margin: 4px 0;">≈ ${calculation.finalTime.toFixed(2)} 分钟</p>
        <p style="font-size: 11px; color: #666; margin: 4px 0;">= ${finalResult.timeStr}</p>
      </div>
    `
    pdfContent.appendChild(calcDiv)

    // 添加备注
    const noteDiv = document.createElement('div')
    noteDiv.style.marginTop = '20px'
    noteDiv.style.padding = '10px'
    noteDiv.style.backgroundColor = '#fff3e0'
    noteDiv.style.borderLeft = '4px solid #ff9800'
    noteDiv.style.fontSize = '10px'
    noteDiv.style.color = '#666'
    noteDiv.innerHTML = `
      <strong>说明：</strong>本预测基于里格利公式和多因素修正模型，仅供参考。实际成绩受训练状态、比赛策略、身体状况等多种因素影响。
    `
    pdfContent.appendChild(noteDiv)

    // 使用html2pdf生成PDF
    const opt = {
      margin: 10,
      filename: defaultFilename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    // 生成PDF Blob
    const pdfBlob = await html2pdf().set(opt).from(pdfContent).outputPdf('blob')

    // 创建文件写入流
    const writable = await handle.createWritable()

    // 写入文件
    await writable.write(pdfBlob)
    await writable.close()

    // 显示成功反馈
    alert('PDF下载成功！')
  } catch (error) {
    console.error('下载PDF失败:', error)
    // 用户取消保存操作时不显示错误
  }
}

// 页面加载时初始化
onMounted(() => {
  // 设置默认日期为1个月前
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  formData.raceDate = date.toISOString().split('T')[0]
})
</script>

<style scoped>
.prediction-page {
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

/* 页面标题 */
.page-title {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.page-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

/* 表单卡片 */
.form-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
}

.section-title {
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.2rem;
}

.section-desc {
  color: #999;
  font-size: 0.85rem;
  margin-top: -1rem;
  margin-bottom: 1rem;
}

/* 表单元素 */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.required {
  color: #f44336;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.form-hint {
  color: #999;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* 时间输入 */
.time-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
}

.time-separator {
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* 按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-text {
  background: transparent;
  color: #667eea;
  text-decoration: underline;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

/* 结果卡片 */
.result-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #eee;
}

.result-title {
  text-align: center;
  color: #667eea;
  margin-bottom: 1.5rem;
}

.main-result {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  margin-bottom: 2rem;
}

.result-label {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.result-time {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.result-pace {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 计算说明 */
.calculation-detail {
  margin-bottom: 2rem;
}

.detail-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
}

.toggle-icon {
  color: #667eea;
}

.detail-content {
  background: white;
  border-radius: 6px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  color: #333;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.formula {
  background: #f5f5f5;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 1.1rem;
  color: #667eea;
  margin-bottom: 0.75rem;
}

.calc-steps p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

/* 修正系数列表 */
.correction-list {
  margin-bottom: 1rem;
}

.correction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.correction-item:last-child {
  border-bottom: none;
}

.correction-value {
  font-weight: bold;
  color: #667eea;
  min-width: 50px;
  text-align: center;
}

.correction-desc {
  color: #999;
  font-size: 0.85rem;
  flex: 1;
  text-align: right;
  margin-left: 1rem;
}

.total-correction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-weight: bold;
}

.total-value {
  color: #667eea;
  font-size: 1.1rem;
}

.final-calc p {
  margin: 0.25rem 0;
  color: #666;
}

/* 结果操作 */
.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .time-input-group {
    flex-wrap: wrap;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .result-time {
    font-size: 2rem;
  }
  
  .correction-item {
    flex-wrap: wrap;
  }
  
  .correction-desc {
    width: 100%;
    text-align: left;
    margin-left: 0;
    margin-top: 0.25rem;
  }
}
</style>