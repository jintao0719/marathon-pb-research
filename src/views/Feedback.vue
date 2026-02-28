<template>
  <div class="feedback-page">
    <!-- 导航栏 -->
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
          <router-link to="/feedback" class="nav-link active">跑者心声</router-link>
        </div>
      </div>
    </nav>

    <div class="main-container">
      <!-- 头部区域 -->
      <div class="feedback-hero">
        <div class="hero-content">
          <h1>🏃‍♂️ 与万千跑者同行</h1>
          <p class="hero-subtitle">您的每一条建议，都是我们前进的动力</p>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- 左侧：情感文案 -->
        <div class="inspiration-section">
          <div class="inspiration-card">
            <div class="quote-icon">💬</div>
            <h3>致每一位热爱跑步的你</h3>
            <div class="inspiration-text">
              <p>还记得第一次踏上跑道时的忐忑吗？</p>
              <p>还记得突破5公里时的喜悦吗？</p>
              <p>还记得冲过终点线时的泪水吗？</p>
              <br>
              <p><strong>跑步，不只是一项运动，更是一种生活态度。</strong></p>
              <br>
              <p>每一次迈出的脚步，都是对更好自己的追求；</p>
              <p>每一滴流淌的汗水，都是对生命热爱的证明。</p>
              <br>
              <p>在这里，我们汇聚万千跑者的力量，</p>
              <p>分享赛事资讯、训练心得、装备推荐……</p>
              <p>只为让更多人感受到跑步的魅力。</p>
              <br>
              <p class="highlight">🌟 您的建议，是我们进步的方向</p>
              <p class="highlight">🌟 您的反馈，是我们优化的动力</p>
              <br>
              <p>无论是网站功能的改进建议，</p>
              <p>还是赛事信息的补充完善，</p>
              <p>亦或是您想分享的跑步故事……</p>
              <br>
              <p><strong>我们都期待听到您的声音！</strong></p>
              <br>
              <p class="slogan">一起跑，一起更好！🏃‍♀️🏃‍♂️</p>
            </div>
          </div>
        </div>

        <!-- 右侧：反馈表单 -->
        <div class="form-section">
          <div class="form-card">
            <h2>📝 提交反馈</h2>
            
            <form @submit.prevent="submitFeedback">
              <!-- 反馈内容 -->
              <div class="form-group">
                <label class="form-label">
                  反馈内容 <span class="required">*</span>
                </label>
                <textarea
                  v-model="form.content"
                  class="form-textarea"
                  placeholder="请详细描述您的建议或反馈..."
                  rows="6"
                  maxlength="1000"
                  required
                ></textarea>
                <div class="char-count">{{ form.content.length }}/1000</div>
              </div>

              <!-- 图片上传 -->
              <div class="form-group">
                <label class="form-label">上传图片（可选，最多5张）</label>
                <div class="image-upload-area" @click="triggerFileInput">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    style="display: none"
                    @change="handleFileChange"
                  >
                  <div v-if="form.images.length === 0" class="upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <p>点击上传图片</p>
                    <p class="upload-hint">支持 JPG、PNG 格式</p>
                  </div>
                  <div v-else class="image-preview-list">
                    <div
                      v-for="(image, index) in form.images"
                      :key="index"
                      class="image-preview-item"
                    >
                      <img :src="image" alt="预览">
                      <button
                        type="button"
                        class="remove-image-btn"
                        @click.stop="removeImage(index)"
                      >
                        ✕
                      </button>
                    </div>
                    <div
                      v-if="form.images.length < 5"
                      class="add-more-images"
                      @click.stop="triggerFileInput"
                    >
                      <span>+</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 联系方式 -->
              <div class="form-group">
                <label class="form-label">联系方式（可选）</label>
                <input
                  v-model="form.contact"
                  type="text"
                  class="form-input"
                  placeholder="手机号或邮箱，方便我们回复您"
                >
              </div>

              <!-- 提交按钮 -->
              <button
                type="submit"
                class="submit-btn"
                :disabled="isSubmitting || !form.content.trim()"
              >
                <span v-if="isSubmitting">提交中...</span>
                <span v-else>✨ 提交反馈</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示弹窗 -->
    <div v-if="showSuccess" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="success-icon">🎉</div>
        <h3>反馈提交成功！</h3>
        <p>感谢您的宝贵建议，我们会认真阅读每一条反馈。</p>
        <button class="modal-btn" @click="closeModal">知道了</button>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>© 2026 马拉松跑步知识网 | 让每一步都更有意义</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { updatePageMeta, pageSEO } from '../utils/seo.js'

// 设置页面SEO
onMounted(() => {
  updatePageMeta({
    title: '用户反馈_意见建议 - 马拉松跑步知识网',
    description: '提交您的宝贵建议和反馈，帮助我们改进马拉松跑步知识网，为跑者提供更好的服务。',
    keywords: '用户反馈,意见建议,马拉松网站,跑步社区'
  })
})

const fileInput = ref(null)
const isSubmitting = ref(false)
const showSuccess = ref(false)

const form = ref({
  content: '',
  images: [],
  contact: ''
})

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 5 - form.value.images.length
  
  if (remainingSlots <= 0) {
    alert('最多只能上传5张图片')
    return
  }
  
  const filesToProcess = files.slice(0, remainingSlots)
  
  filesToProcess.forEach(file => {
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} 不是图片文件`)
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} 超过5MB限制`)
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
  
  // 清空input，允许重复选择同一文件
  event.target.value = ''
}

// 移除图片
const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

// 提交反馈
const submitFeedback = async () => {
  if (!form.value.content.trim()) {
    alert('请填写反馈内容')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: form.value.content,
        images: form.value.images,
        contact: form.value.contact
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      showSuccess.value = true
      // 重置表单
      form.value = {
        content: '',
        images: [],
        contact: ''
      }
    } else {
      alert(data.error || '提交失败，请重试')
    }
  } catch (error) {
    console.error('提交反馈失败:', error)
    console.error('错误详情:', error.message)
    alert('网络错误: ' + error.message + '\n请检查网络连接或稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 关闭弹窗
const closeModal = () => {
  showSuccess.value = false
}
</script>

<style scoped>
.feedback-page {
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
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--primary-blue);
}

/* 头部区域 */
.feedback-hero {
  background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
  padding: 48px 0;
  text-align: center;
  color: white;
}

.feedback-hero h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.9;
}

/* 主内容区 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* 左侧文案 */
.inspiration-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.inspiration-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.quote-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.inspiration-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-blue);
  margin-bottom: 20px;
}

.inspiration-text {
  color: var(--text-dark);
  line-height: 1.8;
  font-size: 14px;
}

.inspiration-text p {
  margin-bottom: 8px;
}

.inspiration-text .highlight {
  color: var(--primary-blue);
  font-weight: 500;
}

.inspiration-text .slogan {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-orange);
  text-align: center;
  margin-top: 16px;
}

/* 右侧表单 */
.form-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.form-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.form-card h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-dark);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.required {
  color: #f44336;
}

.form-textarea,
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  resize: vertical;
}

.form-textarea:focus,
.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: var(--text-gray);
  margin-top: 4px;
}

/* 图片上传 */
.image-upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.image-upload-area:hover {
  border-color: var(--primary-blue);
}

.upload-placeholder {
  color: var(--text-gray);
}

.upload-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  margin-top: 4px;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-more-images {
  width: 80px;
  height: 80px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--text-gray);
  cursor: pointer;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #1E88E5 0%, #1565C0 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 成功弹窗 */
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
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.modal-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.modal-content p {
  color: var(--text-gray);
  margin-bottom: 24px;
}

.modal-btn {
  padding: 12px 32px;
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

/* 页脚 */
.footer {
  background: white;
  padding: 24px 0;
  text-align: center;
  color: var(--text-gray);
  font-size: 14px;
  margin-top: 40px;
}

/* 响应式 */
@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .inspiration-section,
  .form-section {
    position: static;
  }
  
  .feedback-hero h1 {
    font-size: 24px;
  }
}
</style>