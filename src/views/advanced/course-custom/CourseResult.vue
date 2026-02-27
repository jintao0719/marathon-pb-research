<template>
  <div class="course-result">
    <div class="container">
      <!-- 返回进阶专区入口 -->
      <div class="back-nav">
        <router-link to="/advanced" class="back-link">
          <span class="back-icon">←</span>
          <span>返回进阶专区</span>
        </router-link>
      </div>
      
      <h1 class="page-title">马拉松训练规划</h1>
      <p class="page-subtitle">为您定制科学的马拉松训练计划</p>
      
      <!-- 训练类型说明 -->
      <div class="training-type-legend">
        <h3>训练类型说明</h3>
        <div class="legend-cards">
          <div class="legend-card course-type-long">
            <span class="legend-title">长距离跑</span>
            <span class="legend-description">以较慢的配速进行长距离训练，增强耐力和心肺功能</span>
          </div>
          <div class="legend-card course-type-easy">
            <span class="legend-title">轻松跑</span>
            <span class="legend-description">以舒适的配速进行训练，促进恢复和基础耐力建设</span>
          </div>
          <div class="legend-card course-type-tempo">
            <span class="legend-title">节奏跑</span>
            <span class="legend-description">以接近乳酸阈值的配速训练，提高有氧能力</span>
          </div>
          <div class="legend-card course-type-interval">
            <span class="legend-title">间歇跑</span>
            <span class="legend-description">高强度间歇训练，提高速度和无氧能力</span>
          </div>
          <div class="legend-card course-type-recovery">
            <span class="legend-title">恢复跑</span>
            <span class="legend-description">低强度恢复跑，促进身体恢复和血液循环</span>
          </div>
          <div class="legend-card course-type-pace">
            <span class="legend-title">马拉松配速跑</span>
            <span class="legend-description">以目标PB的平均完赛配速训练，强化配速感知</span>
          </div>
        </div>
      </div>
      
      <!-- 训练计划展示 -->
      <div class="training-plan">
        <div v-for="week in courseWeeks" :key="week.weekNumber" class="week-container">
          <div class="week-header">
            <h3 class="week-title">第 {{ week.weekNumber }} 周</h3>
            <div class="week-info">
              <span class="week-date">{{ getWeekDateRange(week.weekNumber) }}</span>
              <span class="week-distance">总里程: {{ calculateWeeklyDistanceFromCourses(week.courses) }}公里</span>
            </div>
          </div>
          <div class="week-courses">
            <div 
              v-for="(course, index) in week.courses" 
              :key="index"
              class="course-card"
              :class="getCourseTypeClass(course.type)"
            >
              <div class="course-type">{{ course.type }}</div>
              <div class="course-day">{{ course.day }}</div>
              <div class="course-details">
                <div class="detail-item">
                  <span class="detail-label">距离：</span>
                  <span class="detail-value">{{ course.distance }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">配速：</span>
                  <span class="detail-value">{{ course.pace }}</span>
                </div>
                <div class="detail-description">{{ course.goal }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 导出按钮 -->
      <button @click="exportPDF" class="export-btn">
        导出课表
      </button>
      
      <!-- 重新填写按钮 -->
      <div class="form-actions">
        <button @click="goBack" class="btn btn-secondary">
          重新填写表单
        </button>
      </div>
      
      <!-- 导出成功提示 -->
      <div v-if="showExportSuccess" class="success-toast">
        导出成功
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import html2pdf from 'html2pdf.js'

const router = useRouter()
const route = useRoute()

const showExportModal = ref(false)
const showExportSuccess = ref(false)

// 从路由参数获取表单数据
const formData = ref({
  currentWeeklyDistance: 19,
  targetWeeklyDistance: 36,
  distanceGrowthMode: 'progressive',
  trainingDays: 3
})

// 初始化时从路由参数加载数据
onMounted(() => {
  if (route.query) {
    formData.value = {
      raceType: route.query.raceType || 'full',
      currentPB: route.query.currentPB || '',
      targetPB: route.query.targetPB || '',
      raceDate: route.query.raceDate || '',
      trainingDays: parseInt(route.query.trainingDays) || 3,
      currentWeeklyDistance: parseFloat(route.query.currentWeeklyDistance) || 19,
      targetWeeklyDistance: parseFloat(route.query.targetWeeklyDistance) || 36,
      distanceGrowthMode: route.query.distanceGrowthMode || 'progressive',
      injuryHistory: route.query.injuryHistory || 'none',
      trainingLocation: route.query.trainingLocation || 'road'
    }
    // 重新生成训练计划
    courseWeeks.value = generateTrainingPlan()
  }
})

// 计算每周的里程
const calculateWeeklyDistance = (weekNumber, totalWeeks, phase) => {
  // 先计算基础里程（根据增长模式）
  let baseDistance
  if (formData.value.distanceGrowthMode === 'fixed') {
    // 固定里程：始终使用目标周里程
    baseDistance = parseFloat(formData.value.targetWeeklyDistance)
  } else {
    // 渐进式增长：从current逐步增加到target
    const current = parseFloat(formData.value.currentWeeklyDistance)
    const target = parseFloat(formData.value.targetWeeklyDistance)
    const increasePerWeek = (target - current) / (totalWeeks - 1)
    baseDistance = current + increasePerWeek * (weekNumber - 1)
  }
  
  // 根据阶段调整里程
  if (phase === 'base') {
    // 基础期逻辑
    if (formData.value.distanceGrowthMode === 'progressive') {
      // 渐进式增长模式下，第1周应该等于current
      // 渐进式增长已经在baseDistance中计算好了，直接返回
      return Math.round(baseDistance * 10) / 10
    } else {
      // 固定里程模式下，基础期保持目标周里程不变
      return Math.round(baseDistance * 10) / 10
    }
  } else if (phase === 'taper') {
    // 减量期：逐步减少（两种模式都适用）
    if (weekNumber === 15) return Math.round(baseDistance * 0.6 * 10) / 10
    if (weekNumber === 16) return Math.round(baseDistance * 0.3 * 10) / 10
  }
  
  // 强化期和巅峰期保持标准里程
  return Math.round(baseDistance * 10) / 10
}

// 生成训练计划
const generateTrainingPlan = () => {
  const weeks = 16 // 固定16周训练计划
  const trainingPlan = []
  
  // 解析当前PB和目标PB，确定训练强度
  const parsePB = (pb) => {
    if (!pb) return { hours: 4, minutes: 0, seconds: 0 }
    const parts = pb.split(':')
    return {
      hours: parseInt(parts[0]) || 0,
      minutes: parseInt(parts[1]) || 0,
      seconds: parseInt(parts[2]) || 0
    }
  }
  
  const currentPB = parsePB(formData.value.currentPB)
  const targetPB = parsePB(formData.value.targetPB)
  
  // 根据目标PB确定训练强度级别
  const getTrainingLevel = () => {
    const targetTotalMinutes = targetPB.hours * 60 + targetPB.minutes
    if (targetTotalMinutes >= 240) return 'beginner' // 破4
    if (targetTotalMinutes >= 210) return 'intermediate' // 破330
    if (targetTotalMinutes >= 190) return 'advanced' // 破310
    return 'elite' // 破3
  }
  
  const trainingLevel = getTrainingLevel()
  
  // 获取配速配置
  const getPaceConfig = (level) => {
    const configs = {
      beginner: {
        easy: '6:50-7:20',
        recovery: '7:20-7:40',
        long: '7:00-7:30',
        tempo: '5:30-6:00',
        interval: '5:00-5:10',
        mp: '5:35-5:40'
      },
      intermediate: {
        easy: '6:10-6:30',
        recovery: '6:30-6:50',
        long: '6:00-6:20',
        tempo: '4:40-4:45',
        interval: '4:10-4:30',
        mp: '4:55-5:00'
      },
      advanced: {
        easy: '5:40-6:00',
        recovery: '5:50-6:10',
        long: '5:30-5:50',
        tempo: '4:20-4:30',
        interval: '3:50-4:00',
        mp: '4:25-4:30'
      },
      elite: {
        easy: '5:20-5:40',
        recovery: '5:30-5:50',
        long: '5:10-5:30',
        tempo: '4:00-4:10',
        interval: '3:35-3:40',
        mp: '4:10-4:15'
      }
    }
    return configs[level] || configs.beginner
  }
  
  const pace = getPaceConfig(trainingLevel)
  
  // 根据训练天数和水平生成周训练计划
  const generateWeeklyCourses = (weekNumber, weeklyDistance, phase) => {
    const trainingDays = formData.value.trainingDays
    const courses = []
    
    // 辅助函数：创建课程
    const createCourse = (day, type, distance, pace, goal) => ({
      day,
      type,
      distance: `${Math.round(distance * 10) / 10}公里`,
      pace,
      goal
    })
    
    // 2天训练：周三 + 周日
    if (trainingDays === 2) {
      if (trainingLevel === 'beginner') {
        // 纯新手入门版：2次全有氧 (35% + 65% = 100%)
        const easyDist = weeklyDistance * 0.35
        const longDist = weeklyDistance * 0.65
        
        courses.push(createCourse('周三', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      } else {
        // 进阶维持版：1次强度 + 1次LSD (30% + 70% = 100%)
        let intensityType = '间歇跑'
        if (trainingLevel === 'intermediate') intensityType = '节奏跑'
        
        const intensityDist = weeklyDistance * 0.3
        const longDist = weeklyDistance * 0.7
        
        // 基础期改为轻松跑
        if (phase === 'base') {
          courses.push(createCourse('周二', '轻松跑', intensityDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周二', intensityType, intensityDist, intensityType === '间歇跑' ? pace.interval : pace.tempo, 
            intensityType === '间歇跑' ? '高强度间歇训练，提高速度和无氧能力' : '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      }
    }
    // 3天训练：周二 + 周四 + 周日
    else if (trainingDays === 3) {
      if (trainingLevel === 'beginner') {
        // 新手入门版：3次全有氧 (25% + 25% + 50% = 100%)
        const easyDist = weeklyDistance * 0.25
        const longDist = weeklyDistance * 0.5
        
        courses.push(createCourse('周二', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周四', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      } else {
        // 进阶提升版：1次强度 + 1次轻松 + 1次LSD (25% + 25% + 50% = 100%)
        let intensityType = '间歇跑'
        if (trainingLevel === 'intermediate') intensityType = '节奏跑'
        
        const intensityDist = weeklyDistance * 0.25
        const easyDist = weeklyDistance * 0.25
        const longDist = weeklyDistance * 0.5
        
        if (phase === 'base') {
          courses.push(createCourse('周二', '轻松跑', intensityDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周二', intensityType, intensityDist, intensityType === '间歇跑' ? pace.interval : pace.tempo,
            intensityType === '间歇跑' ? '高强度间歇训练，提高速度和无氧能力' : '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周四', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，作为强度课与LSD之间的恢复缓冲'))
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      }
    }
    // 4天训练：周二 + 周四 + 周六 + 周日
    else if (trainingDays === 4) {
      if (trainingLevel === 'beginner') {
        // 有氧进阶版：4次全有氧 (20% + 20% + 20% + 40% = 100%)
        const easyDist = weeklyDistance * 0.2
        const longDist = weeklyDistance * 0.4
        
        courses.push(createCourse('周二', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周四', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周六', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，为周日长距离做准备'))
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      } else {
        // PB突破版：间歇 + 恢复 + 节奏 + LSD (20% + 15% + 20% + 45% = 100%)
        const intervalDist = weeklyDistance * 0.2
        const recoveryDist = weeklyDistance * 0.15
        const tempoDist = weeklyDistance * 0.2
        const longDist = weeklyDistance * 0.45
        
        if (phase === 'base') {
          courses.push(createCourse('周二', '轻松跑', intervalDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周三', '轻松跑', recoveryDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周五', '轻松跑', tempoDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周二', '间歇跑', intervalDist, pace.interval, '高强度间歇训练，提高速度和无氧能力'))
          courses.push(createCourse('周三', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，促进身体恢复和血液循环'))
          courses.push(createCourse('周五', '节奏跑', tempoDist, pace.tempo, '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      }
    }
    // 5天训练：周二 + 周三 + 周四 + 周六 + 周日（周五休息）
    else if (trainingDays === 5) {
      if (trainingLevel === 'beginner') {
        // 有氧巩固进阶版：3次轻松 + 1次节奏 + 1次LSD (20% + 20% + 15% + 20% + 40% = 115%)
        // 调整为：20% + 20% + 15% + 15% + 40% = 110%，再调整为 18% + 18% + 14% + 14% + 40% = 104%
        // 最终：15% * 3 + 15% + 40% = 100%
        const easyDist = weeklyDistance * 0.15
        const tempoDist = weeklyDistance * 0.15
        const longDist = weeklyDistance * 0.4
        
        courses.push(createCourse('周二', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周三', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        if (phase === 'base') {
          courses.push(createCourse('周四', '轻松跑', tempoDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周四', '节奏跑', tempoDist, pace.tempo, '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周六', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，为周日长距离做准备'))
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      } else {
        // PB突破备赛版：间歇 + 恢复 + 轻松 + 节奏 + LSD
        // 20% + 10% + 15% + 15% + 40% = 100%
        const intervalDist = weeklyDistance * 0.2
        const recoveryDist = weeklyDistance * 0.1
        const easyDist = weeklyDistance * 0.15
        const tempoDist = weeklyDistance * 0.15
        const longDist = weeklyDistance * 0.4
        
        if (phase === 'base') {
          courses.push(createCourse('周二', '轻松跑', intervalDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周三', '轻松跑', recoveryDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周四', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周六', '轻松跑', tempoDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周二', '间歇跑', intervalDist, pace.interval, '高强度间歇训练，提高速度和无氧能力'))
          courses.push(createCourse('周三', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，消除间歇跑疲劳'))
          courses.push(createCourse('周四', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，作为次强度课铺垫'))
          courses.push(createCourse('周六', '节奏跑', tempoDist, pace.tempo, '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      }
    }
    // 6天训练：周一休息 + 周二 + 周三 + 周四 + 周五 + 周六 + 周日（实际6次训练）
    else if (trainingDays === 6) {
      if (trainingLevel === 'beginner') {
        // 高阶有氧备赛版：3次轻松 + 1次节奏 + 1次恢复 + 1次LSD
        // 15% * 3 + 15% + 10% + 40% = 100%
        const easyDist = weeklyDistance * 0.15
        const tempoDist = weeklyDistance * 0.15
        const recoveryDist = weeklyDistance * 0.1
        const longDist = weeklyDistance * 0.4
        
        courses.push(createCourse('周一', '休息', 0, '休息', '完全休息，给身体充足的恢复时间'))
        courses.push(createCourse('周二', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周三', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        if (phase === 'base') {
          courses.push(createCourse('周四', '轻松跑', tempoDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周四', '节奏跑', tempoDist, pace.tempo, '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周五', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，消除强度课疲劳'))
        courses.push(createCourse('周六', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，为周日长距离做准备'))
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      } else {
        // 精英PB突破版：间歇 + 恢复 + MP + 轻松 + 节奏 + LSD
        // 20% + 10% + 15% + 10% + 15% + 30% = 100%
        const intervalDist = weeklyDistance * 0.2
        const recoveryDist = weeklyDistance * 0.1
        const mpDist = weeklyDistance * 0.15
        const easyDist = weeklyDistance * 0.1
        const tempoDist = weeklyDistance * 0.15
        const longDist = weeklyDistance * 0.3
        
        courses.push(createCourse('周一', '休息', 0, '休息', '完全休息，给身体充足的恢复时间'))
        if (phase === 'base') {
          courses.push(createCourse('周二', '轻松跑', intervalDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周三', '轻松跑', recoveryDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周四', '轻松跑', mpDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周五', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周六', '轻松跑', tempoDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周二', '间歇跑', intervalDist, pace.interval, '高强度间歇训练，提高速度和无氧能力'))
          courses.push(createCourse('周三', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，促进身体恢复和血液循环'))
          courses.push(createCourse('周四', '马拉松配速跑', mpDist, pace.mp, '强化配速感知，模拟比赛节奏'))
          courses.push(createCourse('周五', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周六', '节奏跑', tempoDist, pace.tempo, '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      }
    }
    // 7天训练：周一 + 周二 + 周三 + 周四 + 周五 + 周六 + 周日（7次训练，无休息日）
    else if (trainingDays === 7) {
      if (trainingLevel === 'beginner') {
        // 有氧堆量基础版：2次恢复 + 4次轻松 + 1次LSD
        // 10% * 2 + 12.5% * 4 + 35% = 100%
        const easyDist = weeklyDistance * 0.125
        const recoveryDist = weeklyDistance * 0.1
        const longDist = weeklyDistance * 0.35
        
        courses.push(createCourse('周一', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，消除上周长距离疲劳'))
        courses.push(createCourse('周二', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周三', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周四', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        courses.push(createCourse('周五', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，为周末长距离留力'))
        courses.push(createCourse('周六', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，背靠背长距离铺垫'))
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      } else {
        // 精英极限备赛版：2次恢复 + 间歇 + MP + 轻松 + 节奏 + LSD
        // 10% * 2 + 10% + 15% + 10% + 12% + 35% = 102%，调整为 8% + 10% + 10% + 15% + 10% + 12% + 35% = 100%
        const intervalDist = weeklyDistance * 0.08
        const recoveryDist = weeklyDistance * 0.1
        const mpDist = weeklyDistance * 0.15
        const easyDist = weeklyDistance * 0.1
        const tempoDist = weeklyDistance * 0.12
        const longDist = weeklyDistance * 0.35
        
        courses.push(createCourse('周一', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，消除周日长距离疲劳'))
        if (phase === 'base') {
          courses.push(createCourse('周二', '轻松跑', intervalDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周三', '轻松跑', recoveryDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周四', '轻松跑', mpDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周五', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周六', '轻松跑', tempoDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
        } else {
          courses.push(createCourse('周二', '间歇跑', intervalDist, pace.interval, '高强度间歇训练，提高速度和无氧能力'))
          courses.push(createCourse('周三', '恢复跑', recoveryDist, pace.recovery, '低强度恢复跑，消除间歇跑疲劳'))
          courses.push(createCourse('周四', '马拉松配速跑', mpDist, pace.mp, '强化配速感知，模拟比赛节奏'))
          courses.push(createCourse('周五', '轻松跑', easyDist, pace.easy, '以舒适的配速进行训练，促进恢复和基础耐力建设'))
          courses.push(createCourse('周六', '节奏跑', tempoDist, pace.tempo, '以接近乳酸阈值的配速训练，提高有氧能力'))
        }
        courses.push(createCourse('周日', '长距离跑', longDist, pace.long, '以较慢的配速进行长距离训练，增强耐力和心肺功能'))
      }
    }
    
    return courses
  }
  
  // 生成16周训练计划
  for (let weekNumber = 1; weekNumber <= weeks; weekNumber++) {
    // 确定训练阶段
    let phase = ''
    if (weekNumber <= 4) phase = 'base' // 基础期(1-4周)
    else if (weekNumber <= 12) phase = 'build' // 强化期(5-12周)
    else if (weekNumber <= 14) phase = 'peak' // 巅峰期(13-14周)
    else phase = 'taper' // 减量期(15-16周)
    
    // 计算每周总里程
    const weeklyDistance = calculateWeeklyDistance(weekNumber, weeks, phase)
    
    // 生成该周的训练课程
    const courses = generateWeeklyCourses(weekNumber, weeklyDistance, phase)
    
    trainingPlan.push({
      weekNumber,
      courses
    })
  }
  
  return trainingPlan
}

// 初始化训练计划
const courseWeeks = ref(generateTrainingPlan())

// 根据训练类型返回对应的CSS类
const getCourseTypeClass = (type) => {
  switch (type) {
    case '轻松跑':
      return 'course-type-easy'
    case '速度训练':
    case '间歇跑':
      return 'course-type-interval'
    case '长距离跑':
      return 'course-type-long'
    case '节奏跑':
      return 'course-type-tempo'
    case '恢复跑':
      return 'course-type-recovery'
    case '马拉松配速跑':
      return 'course-type-pace'
    default:
      return ''
  }
}

// 计算每周总里程（从课程列表中）
const calculateWeeklyDistanceFromCourses = (courses) => {
  return courses.reduce((total, course) => {
    const distanceStr = course.distance;
    const distanceMatch = distanceStr.match(/\d+(\.\d+)?/);
    if (distanceMatch) {
      return total + parseFloat(distanceMatch[0]);
    }
    return total;
  }, 0).toFixed(1);
}

// 计算每周的日期范围
const getWeekDateRange = (weekNumber) => {
  // 假设训练从2026年3月1日开始
  const startDate = new Date(2026, 2, 1); // 月份从0开始，2代表3月
  
  // 计算第weekNumber周的开始日期
  const weekStartDate = new Date(startDate);
  weekStartDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  
  // 计算第weekNumber周的结束日期
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);
  
  // 格式化日期
  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  };
  
  return `2026年${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`;
}

// 导出功能
const exportPDF = async () => {
  showExportModal.value = false
  
  try {
    // 生成默认文件名
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const defaultFilename = `训练课表_${year}${month}${day}_${hours}${minutes}${seconds}.pdf`
    
    // 请求用户选择保存位置
    const handle = await window.showSaveFilePicker({
      suggestedName: defaultFilename,
      types: [
        {
          description: 'PDF文件',
          accept: { 'application/pdf': ['.pdf'] }
        }
      ]
    })
    
    // 创建一个包含训练课表内容的HTML元素
    const pdfContent = document.createElement('div')
    pdfContent.style.padding = '20px'
    pdfContent.style.fontFamily = 'Arial, sans-serif'
    
    // 添加标题和副标题
    pdfContent.innerHTML = `
      <h1 style="text-align: center; color: #333;">马拉松训练规划</h1>
      <h2 style="text-align: center; color: #666; font-size: 14px;">为您定制科学的马拉松训练计划</h2>
      
      <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">训练类型说明</h3>
      <div style="margin: 10px 0;">1. 长距离跑: 以较慢的配速进行长距离训练，增强耐力和心肺功能</div>
      <div style="margin: 10px 0;">2. 轻松跑: 以舒适的配速进行训练，促进恢复和基础耐力建设</div>
      <div style="margin: 10px 0;">3. 节奏跑: 以接近乳酸阈值的配速训练，提高有氧能力</div>
      <div style="margin: 10px 0;">4. 间歇跑: 高强度间歇训练，提高速度和无氧能力</div>
      <div style="margin: 10px 0;">5. 恢复跑: 低强度恢复跑，促进身体恢复和血液循环</div>
      <div style="margin: 10px 0;">6. 比赛: 模拟比赛强度的训练，适应比赛节奏</div>
      
      <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">训练计划</h3>
    `
    
    // 添加每周训练计划
    courseWeeks.value.forEach((week) => {
      const dateRange = getWeekDateRange(week.weekNumber)
      const weeklyDistance = calculateWeeklyDistanceFromCourses(week.courses)
      
      const weekDiv = document.createElement('div')
      weekDiv.style.margin = '20px 0'
      weekDiv.style.padding = '10px'
      weekDiv.style.border = '1px solid #ddd'
      weekDiv.style.borderRadius = '5px'
      
      weekDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px;">第 ${week.weekNumber} 周 - 日期: ${dateRange} - 总里程: ${weeklyDistance}公里</div>
      `
      
      week.courses.forEach((course) => {
        const courseDiv = document.createElement('div')
        courseDiv.style.margin = '5px 0'
        courseDiv.style.padding = '5px'
        courseDiv.style.backgroundColor = '#f9f9f9'
        courseDiv.style.borderRadius = '3px'
        
        courseDiv.innerHTML = `
          <div>${course.day} - ${course.type}</div>
          <div>距离: ${course.distance} | 配速: ${course.pace}</div>
          <div>目标: ${course.goal}</div>
        `
        
        weekDiv.appendChild(courseDiv)
      })
      
      pdfContent.appendChild(weekDiv)
    })
    
    // 使用html2pdf生成PDF
    const opt = {
      margin: 10,
      filename: defaultFilename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }
    
    // 生成PDF Blob
    const pdfBlob = await html2pdf().set(opt).from(pdfContent).outputPdf('blob')
    
    // 创建文件写入流
    const writable = await handle.createWritable()
    
    // 写入文件
    await writable.write(pdfBlob)
    await writable.close()
    
    // 显示成功反馈
    showExportSuccess.value = true
    setTimeout(() => {
      showExportSuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('导出PDF失败:', error)
    // 用户取消保存操作时不显示错误
  }
}

// 返回表单页
const goBack = () => {
  router.push('/advance-marathon/course-custom/course-form')
}
</script>

<style scoped>
.course-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
  position: relative;
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

/* 训练类型说明 */
.training-type-legend {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.training-type-legend h3 {
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #667eea;
}

.legend-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.legend-card {
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.legend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.legend-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
}

.legend-description {
  font-size: 0.85rem;
  line-height: 1.4;
}

/* 训练计划展示样式 */
.training-plan {
  margin-bottom: 2rem;
}

.week-container {
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.week-header {
  background: #f8f9fa;
  color: #333;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.week-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.week-info {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.week-date {
  white-space: nowrap;
}

.week-distance {
  font-weight: 600;
  color: #333;
}

.week-courses {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.course-card {
  flex: 1;
  padding: 1rem;
  text-align: center;
  border-right: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.course-card:last-child {
  border-right: none;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 训练类型颜色 */
.course-type-easy {
  background: #e3f2fd;
}

.course-type-interval {
  background: #fce4ec;
}

.course-type-long {
  background: #e8f5e8;
}

.course-type-tempo {
  background: #fff3e0;
}

.course-type-recovery {
  background: #f3e5f5;
}

.course-type-pace {
  background: #e0f7fa;
}

.course-type {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.course-day {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.course-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.detail-label {
  font-size: 0.8rem;
  color: #666;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.detail-description {
  font-size: 0.75rem;
  line-height: 1.3;
  color: #555;
  margin-top: 0.5rem;
  text-align: center;
}

/* 导出按钮 */
.export-btn {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
}

.export-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* 表单操作 */
.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* 导出模态框 */
.export-modal {
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

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
}

.export-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.export-option {
  flex: 1;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.export-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.option-icon {
  font-size: 2rem;
}

.option-label {
  font-size: 0.9rem;
  color: #333;
}

/* 成功提示 */
.success-toast {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  z-index: 1000;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translate(-50%, -20px); }
  20% { opacity: 1; transform: translate(-50%, 0); }
  80% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -20px); }
}

@media (max-width: 768px) {
  .container {
    margin: 0 1rem;
    padding: 1.5rem;
  }
  
  .legend-cards {
    grid-template-columns: 1fr;
  }
  
  .week-courses {
    flex-direction: column;
  }
  
  .course-card {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .course-card:last-child {
    border-bottom: none;
  }
  
  .export-btn {
    position: static;
    margin: 1rem 0;
    width: 100%;
  }
}
</style>