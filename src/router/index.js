import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Beginner from '../views/Beginner.vue'
import Advanced from '../views/Advanced.vue'
import Races from '../views/Races.vue'
import RaceDetail from '../views/RaceDetail.vue'
import Admin from '../views/Admin.vue'
import Feedback from '../views/Feedback.vue'
import AdminFeedback from '../views/AdminFeedback.vue'

// 进阶专区路由
import CourseForm from '../views/advanced/course-custom/CourseForm.vue'
import CourseResult from '../views/advanced/course-custom/CourseResult.vue'
import SpecialTrainingHome from '../views/advanced/special-training/SpecialTrainingHome.vue'
import TrainingDetail from '../views/advanced/special-training/TrainingDetail.vue'
import BottleneckHome from '../views/advanced/bottleneck-diagnosis/BottleneckHome.vue'
import BottleneckDetail from '../views/advanced/bottleneck-diagnosis/BottleneckDetail.vue'
import RunningPostureHome from '../views/advanced/running-posture/RunningPostureHome.vue'
import PostureDetail from '../views/advanced/running-posture/PostureDetail.vue'
import PredictionPage from '../views/advanced/marathon-prediction/PredictionPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/beginner',
    name: 'Beginner',
    component: Beginner
  },
  {
    path: '/advanced',
    name: 'Advanced',
    component: Advanced
  },
  // 进阶专区子路由
  {
    path: '/advance-marathon/course-custom/course-form',
    name: 'CourseForm',
    component: CourseForm
  },
  {
    path: '/advance-marathon/course-custom/course-result',
    name: 'CourseResult',
    component: CourseResult
  },
  {
    path: '/advance-marathon/special-training',
    name: 'SpecialTrainingHome',
    component: SpecialTrainingHome
  },
  {
    path: '/advance-marathon/special-training/:id',
    name: 'TrainingDetail',
    component: TrainingDetail
  },
  {
    path: '/advance-marathon/bottleneck-diagnosis',
    name: 'BottleneckHome',
    component: BottleneckHome
  },
  {
    path: '/advance-marathon/bottleneck-diagnosis/:id',
    name: 'BottleneckDetail',
    component: BottleneckDetail
  },
  {
    path: '/advance-marathon/running-posture',
    name: 'RunningPostureHome',
    component: RunningPostureHome
  },
  {
    path: '/advance-marathon/running-posture/:id',
    name: 'PostureDetail',
    component: PostureDetail
  },
  {
    path: '/advance-marathon/prediction',
    name: 'PredictionPage',
    component: PredictionPage
  },
  {
    path: '/races',
    name: 'Races',
    component: Races
  },
  {
    path: '/race/:id',
    name: 'RaceDetail',
    component: RaceDetail
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback
  },
  {
    path: '/admin/feedback',
    name: 'AdminFeedback',
    component: AdminFeedback
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
