<template>
  <div class="admin-feedback-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🏃</span>
          <span class="logo-text">马拉松PB研究院</span>
        </div>
        <div class="nav-links">
          <router-link to="/admin" class="nav-link">赛事管理</router-link>
          <router-link to="/admin/feedback" class="nav-link active">反馈管理</router-link>
        </div>
      </div>
    </nav>

    <div class="main-container">
      <div class="page-header">
        <h1>📋 用户反馈管理</h1>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ feedbackList.length }}</span>
            <span class="stat-label">总反馈</span>
          </div>
          <div class="stat-item pending">
            <span class="stat-value">{{ pendingCount }}</span>
            <span class="stat-label">待处理</span>
          </div>
          <div class="stat-item processed">
            <span class="stat-value">{{ processedCount }}</span>
            <span class="stat-label">已处理</span>
          </div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <label>状态筛选：</label>
          <select v-model="filterStatus" class="filter-select">
            <option value="">全部</option>
            <option value="pending">待处理</option>
            <option value="processed">已处理</option>
          </select>
        </div>
        <button class="refresh-btn" @click="loadFeedback" :disabled="loading">
          <span v-if="loading">刷新中...</span>
          <span v-else>🔄 刷新</span>
        </button>
      </div>

      <!-- 反馈列表 -->
      <div v-if="loading" class="loading-state">
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredFeedback.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无反馈</p>
      </div>

      <div v-else class="feedback-list">
        <div
          v-for="item in filteredFeedback"
          :key="item.id"
          class="feedback-card"
          :class="{ 'processed': item.status === 'processed' }"
        >
          <div class="feedback-header">
            <div class="feedback-id">#{{ item.id }}</div>
            <div class="feedback-status">
              <span
                class="status-badge"
                :class="item.status"
                @click="toggleStatus(item)"
              >
                {{ item.status === 'pending' ? '待处理' : '已处理' }}
              </span>
            </div>
            <div class="feedback-time">{{ formatDate(item.createdAt) }}</div>
          </div>

          <div class="feedback-content">
            <p>{{ item.content }}</p>
          </div>

          <!-- 图片展示 -->
          <div v-if="item.images && item.images.length > 0" class="feedback-images">
            <div
              v-for="(image, index) in item.images"
              :key="index"
              class="image-thumb"
              @click="previewImage(image)"
            >
              <img :src="image" alt="反馈图片">
            </div>
          </div>

          <!-- 联系方式 -->
          <div v-if="item.contact" class="feedback-contact">
            <span class="contact-label">联系方式：</span>
            <span class="contact-value">{{ item.contact }}</span>
          </div>

          <div class="feedback-actions">
            <button
              class="action-btn"
              :class="item.status === 'processed' ? 'pending' : 'processed'"
              @click="toggleStatus(item)"
            >
              {{ item.status === 'processed' ? '标记为待处理' : '标记为已处理' }}
            </button>
            <button class="action-btn delete" @click="deleteFeedback(item.id)">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="previewImageUrl" class="modal-overlay" @click="closePreview">
      <div class="modal-content" @click.stop>
        <img :src="previewImageUrl" alt="预览" class="preview-image">
        <button class="close-btn" @click="closePreview">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const feedbackList = ref([])
const loading = ref(false)
const filterStatus = ref('')
const previewImageUrl = ref('')

// 筛选后的反馈列表
const filteredFeedback = computed(() => {
  if (!filterStatus.value) return feedbackList.value
  return feedbackList.value.filter(item => item.status === filterStatus.value)
})

// 待处理数量
const pendingCount = computed(() => {
  return feedbackList.value.filter(item => item.status === 'pending').length
})

// 已处理数量
const processedCount = computed(() => {
  return feedbackList.value.filter(item => item.status === 'processed').length
})

// 加载反馈列表
const loadFeedback = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/admin/feedback')
    const data = await response.json()
    if (data.success) {
      feedbackList.value = data.feedback
    }
  } catch (error) {
    console.error('加载反馈失败:', error)
    alert('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 切换状态
const toggleStatus = async (item) => {
  const newStatus = item.status === 'pending' ? 'processed' : 'pending'
  try {
    const response = await fetch(`/api/admin/feedback/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
    const data = await response.json()
    if (data.success) {
      item.status = newStatus
      item.updatedAt = data.feedback.updatedAt
    }
  } catch (error) {
    console.error('更新状态失败:', error)
    alert('更新失败，请重试')
  }
}

// 删除反馈
const deleteFeedback = async (id) => {
  if (!confirm('确定要删除这条反馈吗？')) return

  try {
    const response = await fetch(`/api/admin/feedback/${id}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    if (data.success) {
      feedbackList.value = feedbackList.value.filter(item => item.id !== id)
    }
  } catch (error) {
    console.error('删除反馈失败:', error)
    alert('删除失败，请重试')
  }
}

// 预览图片
const previewImage = (url) => {
  previewImageUrl.value = url
}

// 关闭预览
const closePreview = () => {
  previewImageUrl.value = ''
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  loadFeedback()
})
</script>

<style scoped>
.admin-feedback-page {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  color: var(--text-dark);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--primary-blue);
  background: var(--bg-gray);
}

.nav-link.active {
  color: var(--primary-blue);
  background: #E3F2FD;
}

/* 主内容区 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-dark);
}

.stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 12px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-item.pending {
  border-left: 4px solid #FF9800;
}

.stat-item.processed {
  border-left: 4px solid #4CAF50;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark);
}

.stat-label {
  font-size: 12px;
  color: var(--text-gray);
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-dark);
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.refresh-btn {
  padding: 8px 16px;
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  color: var(--text-gray);
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

/* 反馈列表 */
.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #FF9800;
  transition: all 0.2s;
}

.feedback-card.processed {
  border-left-color: #4CAF50;
  opacity: 0.8;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.feedback-id {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-gray);
  background: var(--bg-gray);
  padding: 4px 12px;
  border-radius: 6px;
}

.feedback-status {
  flex: 1;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.status-badge.pending {
  background: #FFF3E0;
  color: #E65100;
}

.status-badge.processed {
  background: #E8F5E9;
  color: #2E7D32;
}

.feedback-time {
  font-size: 12px;
  color: var(--text-gray);
}

.feedback-content {
  margin-bottom: 16px;
  line-height: 1.6;
  color: var(--text-dark);
}

/* 图片展示 */
.feedback-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.image-thumb {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  transition: border-color 0.2s;
}

.image-thumb:hover {
  border-color: var(--primary-blue);
}

.image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 联系方式 */
.feedback-contact {
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg-gray);
  border-radius: 8px;
  font-size: 14px;
}

.contact-label {
  color: var(--text-gray);
}

.contact-value {
  font-weight: 500;
  color: var(--text-dark);
}

/* 操作按钮 */
.feedback-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.processed {
  background: #4CAF50;
  color: white;
}

.action-btn.pending {
  background: #FF9800;
  color: white;
}

.action-btn.delete {
  background: #f5f5f5;
  color: #f44336;
}

.action-btn:hover {
  opacity: 0.9;
}

/* 图片预览弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .stats {
    width: 100%;
    justify-content: space-between;
  }

  .stat-item {
    flex: 1;
    padding: 8px 12px;
  }

  .filter-bar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .feedback-header {
    flex-wrap: wrap;
  }

  .feedback-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>