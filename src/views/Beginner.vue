<template>
  <div class="beginner-page">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="container navbar-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🏃</span>
          <span class="logo-text">马拉松PB研究院</span>
        </div>
        <div class="nav-links">
          <router-link to="/beginner" class="nav-link active">入门专区</router-link>
          <router-link to="/races" class="nav-link">参赛专区</router-link>
          <router-link to="/advanced" class="nav-link">进阶专区</router-link>
          <router-link to="/feedback" class="nav-link">跑者心声</router-link>
        </div>
      </div>
    </nav>

    <div class="main-container">
      <!-- 左侧分类栏 - 桌面端 -->
      <aside class="sidebar desktop-only">
        <div class="sidebar-header">
          <h3>新手入门</h3>
          <p>从零开始跑马拉松</p>
        </div>
        <nav class="sidebar-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="nav-item"
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            <span class="nav-icon">{{ tab.icon }}</span>
            <span class="nav-label">{{ tab.label }}</span>
          </button>
        </nav>
      </aside>

      <!-- 顶部标签栏 - 手机端 -->
      <div class="mobile-tabs mobile-only">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="mobile-tab"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 右侧内容区 -->
      <main class="content">
        <!-- 基础知识 -->
        <section v-if="currentTab === 'basics'" class="content-section">
          <h2>马拉松基础知识</h2>
          
          <div class="content-block">
            <h3>什么是马拉松？</h3>
            <p>马拉松是一项考验耐力的长跑运动，源自古希腊传说。现代马拉松比赛的标准距离为<strong>42.195公里</strong>（26英里385码），是对跑者体能和意志力的极大挑战。</p>
            <div class="info-card">
              <span class="info-icon">📏</span>
              <div class="info-content">
                <h4>标准距离</h4>
                <p>42.195公里 - 国际田联认证的标准马拉松距离</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>马拉松距离分类</h3>
            <div class="distance-grid">
              <div class="distance-card">
                <div class="distance-emoji">🏃</div>
                <h4>迷你马拉松</h4>
                <p class="distance">5-10公里</p>
                <p class="desc">适合跑步新手，体验赛事氛围</p>
              </div>
              <div class="distance-card">
                <div class="distance-emoji">🏃‍♂️</div>
                <h4>半程马拉松</h4>
                <p class="distance">21.0975公里</p>
                <p class="desc">进阶跑者首选，挑战与可达成平衡</p>
              </div>
              <div class="distance-card">
                <div class="distance-emoji">🏃‍♀️</div>
                <h4>全程马拉松</h4>
                <p class="distance">42.195公里</p>
                <p class="desc">终极挑战，需要系统训练</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>马拉松赛事与趋势</h3>
            <p>马拉松运动在全球范围内持续升温，特别是在中国，参与人数和赛事数量都呈现爆发式增长。</p>
            
            <div class="info-vertical">
              <div class="info-card">
                <span class="info-icon">📊</span>
                <div class="info-content">
                  <h4>2025年赛事规模</h4>
                  <p>2025年全国共举办566场路跑赛事，其中全半程马拉松542场，10公里等其他赛事24场。</p>
                  <p>预计2025年国内马拉松参赛总人次将超过800万，较2023年的700万增长约14%。</p>
                </div>
              </div>
              
              <div class="info-card">
                <span class="info-icon">👥</span>
                <div class="info-content">
                  <h4>参赛规模与男女占比</h4>
                  <p>2025年兰州马拉松以4万人的参赛人数暂列国内A级赛事第一，北京马拉松增至3.2万人，上海马拉松参赛规模3.8万人。</p>
                  <p>性别分布：全程马拉松项目男性占比约78.5%，女性约21.5%；半程马拉松项目男性占比约70.2%，女性约29.8%。女性跑者比例逐年上升，2025年成都马拉松女性报名人数较2024年增加16220人。</p>
                </div>
              </div>
              
              <div class="info-card">
                <span class="info-icon">🔥</span>
                <div class="info-content">
                  <h4>报名热度与中签率</h4>
                  <p>2025年无锡马拉松报名人数达42.9万，上海马拉松报名人数35.7万，成都马拉松报名人数28.8万，均创历史新高。</p>
                  <p>热门赛事中签率：无锡马拉松全程项目中签率仅6%，上海马拉松全程项目中签率7.2%，成都马拉松全程项目中签率19.02%、半程项目仅6.4%。</p>
                </div>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>跑马拉松的益处</h3>
            <div class="benefits-grid">
              <div class="benefit-item">
                <div class="benefit-icon">💪</div>
                <h4>增强心肺功能</h4>
                <p>长期坚持跑步能显著提升心肺耐力，降低心血管疾病风险</p>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🧠</div>
                <h4>改善心理健康</h4>
                <p>跑步释放内啡肽，减轻压力和焦虑，提升整体幸福感</p>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🤝</div>
                <h4>社交连接</h4>
                <p>马拉松社区提供了结交志同道合朋友的机会，增强社交网络</p>
              </div>
              <div class="benefit-item">
                <div class="benefit-icon">🎯</div>
                <h4>培养毅力</h4>
                <p>训练和比赛过程培养坚韧不拔的品质，对生活和工作都有积极影响</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>马拉松精神</h3>
            <p>马拉松不仅仅是一项运动，更是一种生活态度。它教会我们：</p>
            <ul class="marathon-spirit">
              <li><strong>坚持</strong> - 面对困难不轻易放弃</li>
              <li><strong>自律</strong> - 规律训练，自我管理</li>
              <li><strong>突破</strong> - 不断挑战个人极限</li>
              <li><strong>感恩</strong> - 珍惜每一步，享受过程</li>
            </ul>
          </div>

          <div class="content-block">
            <h3>新手常见误区</h3>
            <div class="mistake-list">
              <div class="mistake-item">
                <span class="mistake-icon">❌</span>
                <div class="mistake-content">
                  <h4>误区一：跑量越多越好</h4>
                  <p>过度训练容易导致伤病。新手应遵循"10%原则"，每周跑量增幅不超过10%。</p>
                </div>
              </div>
              <div class="mistake-item">
                <span class="mistake-icon">❌</span>
                <div class="mistake-content">
                  <h4>误区二：忽视力量训练</h4>
                  <p>核心和下肢力量是预防伤病的关键，每周应安排2-3次力量训练。</p>
                </div>
              </div>
              <div class="mistake-item">
                <span class="mistake-icon">❌</span>
                <div class="mistake-content">
                  <h4>误区三：比赛时配速过快</h4>
                  <p>起跑过快是新手最常犯的错误，建议前半程比目标配速慢5-10秒。</p>
                </div>
              </div>
              <div class="mistake-item">
                <span class="mistake-icon">❌</span>
                <div class="mistake-content">
                  <h4>误区四：不重视恢复</h4>
                  <p>休息也是训练的一部分，每周至少安排1-2天完全休息日。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 装备指南 -->
        <section v-if="currentTab === 'gear'" class="content-section">
          <h2>马拉松装备指南</h2>
          
          <div class="content-block">
            <h3>跑鞋选择</h3>
            <p>跑鞋是马拉松最重要的装备，选择合适的跑鞋能有效预防伤病。</p>
            <div class="gear-cards">
              <div class="gear-card">
                <div class="gear-image" style="background: #E3F2FD;">👟</div>
                <div class="gear-info">
                  <h4>缓震型跑鞋</h4>
                  <p class="gear-for">适合：正常足/高足弓</p>
                  <p class="gear-desc">提供优秀的缓震保护，适合长距离训练</p>
                  <span class="gear-tag">新手推荐</span>
                </div>
              </div>
              <div class="gear-card">
                <div class="gear-image" style="background: #FFF3E0;">👟</div>
                <div class="gear-info">
                  <h4>稳定型跑鞋</h4>
                  <p class="gear-for">适合：扁平足/过度内旋</p>
                  <p class="gear-desc">提供足弓支撑，纠正跑姿</p>
                  <span class="gear-tag">矫正推荐</span>
                </div>
              </div>
              <div class="gear-card">
                <div class="gear-image" style="background: #E8F5E9;">👟</div>
                <div class="gear-info">
                  <h4>竞速型跑鞋</h4>
                  <p class="gear-for">适合：进阶跑者</p>
                  <p class="gear-desc">轻量化设计，提升比赛成绩</p>
                  <span class="gear-tag">比赛专用</span>
                </div>
              </div>
            </div>
            <div class="tips-box">
              <h4>💡 选鞋小贴士</h4>
              <ul>
                <li>下午试鞋（脚会略微膨胀）</li>
                <li>预留约一指宽的空间</li>
                <li>穿着跑步袜试鞋</li>
                <li>跑鞋寿命约500-800公里</li>
              </ul>
            </div>

            <div class="content-subsection">
              <h4>如何测量足弓类型</h4>
              <div class="arch-test">
                <div class="test-step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h5>湿脚测试法</h5>
                    <p>将脚浸湿，踩在干燥的纸巾或深色地面上，观察脚印形状：</p>
                    <div class="arch-images">
                      <div class="arch-image-item">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=high%20arch%20foot%20print%20with%20minimal%20inner%20trace%2C%20medical%20diagram%2C%20clear%20and%20professional&image_size=square" alt="高足弓脚印" class="arch-image">
                        <p class="image-caption">高足弓：脚印内侧几乎没有痕迹</p>
                        <div class="arch-indicator high-arch">⬆️ 内侧无痕迹</div>
                      </div>
                      <div class="arch-image-item">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=normal%20arch%20foot%20print%20with%20complete%20arch%20curve%2C%20medical%20diagram%2C%20clear%20and%20professional&image_size=square" alt="正常足弓脚印" class="arch-image">
                        <p class="image-caption">正常足弓：脚印呈现完整的弧形</p>
                        <div class="arch-indicator normal-arch">🔄 完整弧形</div>
                      </div>
                      <div class="arch-image-item">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=complete%20flat%20foot%20wet%20test%20footprint%20full%20foot%20length%2C%20complete%20solid%20shadow%2C%20no%20arch%20gap%2C%20no%20labels%2C%20clear%20white%20background%2C%20professional%20medical%20style&image_size=landscape_4_3" alt="扁平足脚印" class="arch-image">
                        <p class="image-caption">扁平足：脚印几乎完整</p>
                        <div class="arch-indicator flat-arch">⬇️ 几乎完整</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="test-step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h5>视角测量法</h5>
                    <p>站立时从侧面观察脚的形状：</p>
                    <ul>
                      <li><strong>高足弓：</strong>足弓明显凸起，脚跟上抬，鞋底内侧磨损较少</li>
                      <li><strong>正常足弓：</strong>足弓自然弯曲，脚跟着地平稳，鞋底均匀磨损</li>
                      <li><strong>扁平足：</strong>足弓几乎与地面接触，脚内侧着地，鞋底内侧磨损严重</li>
                    </ul>
                    <div class="arch-side-view">
                      <div class="arch-image-item">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=high%20arch%20foot%20side%20view%20with%20pronounced%20arch%2C%20medical%20diagram%2C%20clear%20and%20professional&image_size=square" alt="高足弓侧面" class="arch-image">
                        <p class="image-caption">高足弓：足弓明显凸起</p>
                        <div class="arch-indicator high-arch">⬆️ 明显凸起</div>
                      </div>
                      <div class="arch-image-item">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=normal%20arch%20foot%20side%20view%20with%20natural%20curve%2C%20medical%20diagram%2C%20clear%20and%20professional&image_size=square" alt="正常足弓侧面" class="arch-image">
                        <p class="image-caption">正常足弓：自然弯曲</p>
                        <div class="arch-indicator normal-arch">🔄 自然弯曲</div>
                      </div>
                      <div class="arch-image-item">
                        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=flat%20foot%20side%20view%20with%20almost%20flat%20arch%2C%20medical%20diagram%2C%20clear%20and%20professional&image_size=square" alt="扁平足侧面" class="arch-image">
                        <p class="image-caption">扁平足：足弓几乎接触地面</p>
                        <div class="arch-indicator flat-arch">⬇️ 几乎接触地面</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="test-step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h5>观察跑姿</h5>
                    <p>请朋友拍摄你跑步的侧面视频，观察脚踝落地时的状态：</p>
                    <ul>
                      <li><strong>内旋不足：</strong>脚踝向外翻，适合缓震型跑鞋</li>
                      <li><strong>正常内旋：</strong>脚踝自然落地，适合中性跑鞋</li>
                      <li><strong>过度内旋：</strong>脚踝向内翻，适合稳定型跑鞋</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-subsection">
              <h4>碳板 vs 非碳板跑鞋</h4>
              <div class="carbon-comparison">
                <div class="comparison-card">
                  <div class="card-header">
                    <h5>碳板跑鞋</h5>
                    <span class="tag tag-blue">进阶跑者</span>
                  </div>
                  <div class="card-content">
                    <p><strong>特点：</strong>鞋底内置碳纤维板，提供推进力，轻量化设计</p>
                    <p><strong>优势：</strong>提高跑步效率，减少能量损耗，适合比赛</p>
                    <p><strong>适合：</strong>有一定跑步基础，追求PB的跑者</p>
                    <p><strong>注意：</strong>价格较高，需要适应期，不适合日常训练</p>
                  </div>
                </div>
                <div class="comparison-card">
                  <div class="card-header">
                    <h5>非碳板跑鞋</h5>
                    <span class="tag tag-green">所有跑者</span>
                  </div>
                  <div class="card-content">
                    <p><strong>特点：</strong>传统设计，注重舒适度和稳定性</p>
                    <p><strong>优势：</strong>价格适中，适合日常训练，适应性强</p>
                    <p><strong>适合：</strong>新手跑者，日常训练，长距离慢跑</p>
                    <p><strong>注意：</strong>推进力相对较弱，比赛成绩提升有限</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>服装选择</h3>
            <div class="gear-cards">
              <div class="gear-card">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20running%20technical%20t-shirt%20with%20mesh%20panels%2C%20quick%20dry%20fabric%2C%20athletic%20fit%2C%20not%20a%20polo%20shirt%2C%20sports%20apparel%20on%20clean%20white%20background%2C%20no%20shadow%2C%20product%20photography" alt="速干T恤" class="gear-image-real">
                <div class="gear-info">
                  <h4>速干T恤</h4>
                  <p class="gear-desc">排汗速干，避免棉质衣物</p>
                </div>
              </div>
              <div class="gear-card">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20running%20shorts%20and%20compression%20tights%20side%20by%20side%2C%20athletic%20fit%2C%20moisture%20wicking%20fabric%2C%20sports%20apparel%20on%20clean%20white%20background%2C%20no%20shadow%2C%20product%20photography%2C%20clear%20view" alt="跑步短裤/紧身裤" class="gear-image-real">
                <div class="gear-info">
                  <h4>跑步短裤/紧身裤</h4>
                  <p class="gear-desc">减少摩擦，提升舒适度</p>
                </div>
              </div>
              <div class="gear-card">
                <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20running%20socks%20with%20cushioning%20and%20arch%20support%2C%20moisture%20wicking%2C%20athletic%20apparel%20on%20clean%20white%20background%2C%20no%20shadow%2C%20product%20photography" alt="专业跑步袜" class="gear-image-real">
                <div class="gear-info">
                  <h4>专业跑步袜</h4>
                  <p class="gear-desc">防起水泡，提供足弓支撑</p>
                </div>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h3>补给清单</h3>
            <div class="supply-list">
              <div class="supply-category">
                <h4>🥤 能量补给</h4>
                <ul>
                  <li>能量胶（比赛必备）</li>
                  <li>能量棒/香蕉</li>
                  <li>盐丸（防抽筋）</li>
                </ul>
              </div>
              <div class="supply-category">
                <h4>🧴 防护用品</h4>
                <ul>
                  <li>防晒霜</li>
                  <li>凡士林（防摩擦）</li>
                  <li>创可贴</li>
                </ul>
              </div>
              <div class="supply-category">
                <h4>⌚ 辅助装备</h4>
                <ul>
                  <li>运动手表/心率带</li>
                  <li>运动腰包</li>
                  <li>遮阳帽/空顶帽</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- AI健康评估 -->
        <section v-if="currentTab === 'health'" class="content-section">
          <h2>AI健康评估</h2>
          <p class="section-desc">填写以下信息，获取个性化的马拉松入门建议</p>
          
          <div class="assessment-form card">
            <div class="form-group">
              <label>年龄</label>
              <input v-model="healthForm.age" type="number" class="input" placeholder="请输入年龄" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>身高 (cm)</label>
                <input v-model="healthForm.height" type="number" class="input" placeholder="175" />
              </div>
              <div class="form-group">
                <label>体重 (kg)</label>
                <input v-model="healthForm.weight" type="number" class="input" placeholder="70" />
              </div>
            </div>
            <div class="form-group">
              <label>运动基础</label>
              <select v-model="healthForm.experience" class="input">
                <option value="">请选择</option>
                <option value="none">零基础（很少运动）</option>
                <option value="beginner">偶尔运动（每周1-2次）</option>
                <option value="intermediate">经常运动（每周3-4次）</option>
                <option value="advanced">运动达人（每周5次以上）</option>
              </select>
            </div>
            <div class="form-group">
              <label>过往伤病史</label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input v-model="healthForm.injuries" type="checkbox" value="knee" />
                  <span>膝盖问题</span>
                </label>
                <label class="checkbox-label">
                  <input v-model="healthForm.injuries" type="checkbox" value="ankle" />
                  <span>脚踝扭伤</span>
                </label>
                <label class="checkbox-label">
                  <input v-model="healthForm.injuries" type="checkbox" value="back" />
                  <span>腰背疼痛</span>
                </label>
                <label class="checkbox-label">
                  <input v-model="healthForm.injuries" type="checkbox" value="none" />
                  <span>无伤病史</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>目标距离</label>
              <select v-model="healthForm.goal" class="input">
                <option value="">请选择</option>
                <option value="5k">5公里（入门体验）</option>
                <option value="10k">10公里（挑战自我）</option>
                <option value="half">半程马拉松（21公里）</option>
                <option value="full">全程马拉松（42公里）</option>
              </select>
            </div>
            <button class="btn btn-primary btn-full" @click="generateAdvice">
              生成建议
            </button>
          </div>

          <!-- 评估结果 -->
          <div v-if="assessmentResult" class="assessment-result card">
            <h3>🎯 您的个性化建议</h3>
            <div v-if="assessmentResult.healthAssessment" class="result-section health-assessment">
              <h4>🏥 健康准入评估</h4>
              <p class="health-text">{{ assessmentResult.healthAssessment }}</p>
            </div>
            <div class="result-section">
              <h4>当前状态评估</h4>
              <p :class="assessmentResult.status.includes('不符合') ? 'age-warning' : ''">{{ assessmentResult.status }}</p>
            </div>
            <div class="result-section">
              <h4>入门建议</h4>
              <ul>
                <li v-for="(tip, index) in assessmentResult.tips" :key="index">{{ tip }}</li>
              </ul>
            </div>
            <div v-if="assessmentResult.timeline" class="result-section">
              <h4>推荐训练周期</h4>
              <p class="highlight-text">{{ assessmentResult.timeline }}</p>
            </div>
            <div v-if="assessmentResult.warnings.length" class="result-section warnings">
              <h4>⚠️ 注意事项</h4>
              <ul>
                <li v-for="(warning, index) in assessmentResult.warnings" :key="index">{{ warning }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 参赛指引 -->
        <section v-if="currentTab === 'guide'" class="content-section">
          <h2>从0到1参赛指引</h2>
          <p class="section-desc">四个步骤，带你完成人生第一场马拉松</p>

          <div class="steps-timeline">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-content card">
                <div class="step-header">
                  <span class="step-icon">🏃</span>
                  <h3>基础训练阶段</h3>
                  <span class="step-duration">8-12周</span>
                </div>
                <div class="step-body">
                  <h4>训练重点：</h4>
                  <ul>
                    <li>建立跑步习惯，每周3-4次训练</li>
                    <li>从走跑结合开始，逐步增加跑量</li>
                    <li>加入基础力量训练（深蹲、平板支撑）</li>
                    <li>学习正确的跑步姿势</li>
                  </ul>
                  <div class="milestone">
                    <span class="milestone-tag">阶段目标</span>
                    <p>能连续慢跑30分钟以上</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-content card">
                <div class="step-header">
                  <span class="step-icon">🔍</span>
                  <h3>选择合适赛事</h3>
                  <span class="step-duration">提前2-3个月</span>
                </div>
                <div class="step-body">
                  <h4>选赛要点：</h4>
                  <ul>
                    <li>首次参赛建议选择本地赛事</li>
                    <li>关注赛事规模（万人以下更友好）</li>
                    <li>了解赛道特点（平坦赛道适合PB）</li>
                    <li>查看赛事口碑和组织水平</li>
                  </ul>
                  <div class="milestone">
                    <span class="milestone-tag">推荐首赛</span>
                    <p>10公里或半程马拉松</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-content card">
                <div class="step-header">
                  <span class="step-icon">📋</span>
                  <h3>赛前准备</h3>
                  <span class="step-duration">赛前1-2周</span>
                </div>
                <div class="step-body">
                  <h4>准备清单：</h4>
                  <ul>
                    <li>领取参赛包（号码布、计时芯片）</li>
                    <li>准备比赛日装备（提前试穿）</li>
                    <li>制定比赛策略（配速计划）</li>
                    <li>调整作息，保证充足睡眠</li>
                    <li>赛前3天开始补充碳水</li>
                  </ul>
                  <div class="checklist-preview">
                    <h4>📱 下载完整清单</h4>
                    <p>包含装备、补给、交通等详细准备事项</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-content card">
                <div class="step-header">
                  <span class="step-icon">🏁</span>
                  <h3>比赛日注意事项</h3>
                  <span class="step-duration">比赛当天</span>
                </div>
                <div class="step-body">
                  <h4>关键提醒：</h4>
                  <ul>
                    <li>提前1.5-2小时到达赛场</li>
                    <li>充分热身15-20分钟</li>
                    <li>起跑不要过快，按目标配速跑</li>
                    <li>每5公里补充水和能量胶</li>
                    <li>出现疼痛立即减速或停止</li>
                    <li>享受比赛，安全第一</li>
                  </ul>
                  <div class="milestone success">
                    <span class="milestone-tag">🎉 恭喜你</span>
                    <p>完成人生第一场马拉松！</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { updatePageMeta, pageSEO } from '../utils/seo.js'

const currentTab = ref('basics')

// 设置页面SEO
onMounted(() => {
  updatePageMeta(pageSEO.beginner)
})

const tabs = [
  { id: 'basics', label: '基础知识', icon: '📚' },
  { id: 'gear', label: '装备指南', icon: '👟' },
  { id: 'health', label: '健康评估', icon: '💪' },
  { id: 'guide', label: '参赛指引', icon: '🎯' }
]

const healthForm = reactive({
  age: '',
  height: '',
  weight: '',
  experience: '',
  injuries: [],
  goal: ''
})

const assessmentResult = ref(null)

const generateAdvice = () => {
  if (!healthForm.age || !healthForm.experience || !healthForm.goal) {
    alert('请填写完整信息')
    return
  }

  const age = parseInt(healthForm.age)
  const bmi = healthForm.weight && healthForm.height 
    ? (healthForm.weight / ((healthForm.height / 100) ** 2)).toFixed(1)
    : null
  const bmiValue = bmi ? parseFloat(bmi) : 0

  let status = ''
  let tips = []
  let timeline = ''
  let warnings = []
  let healthAssessment = ''

  // 健康准入评估
  if (healthForm.injuries.includes('knee') || healthForm.injuries.includes('ankle') || healthForm.injuries.includes('back')) {
    healthAssessment = '您有运动损伤史，属于高风险人群，建议先咨询医生并进行全面评估，再决定是否开始马拉松训练。'
  }

  if (age > 50 && healthForm.experience === 'none') {
    healthAssessment = '您年龄较大且无运动基础，属于高风险人群，建议先进行体检并在专业指导下开始训练。'
  }

  if (bmiValue >= 32) {
    healthAssessment = '您的BMI超过32，属于绝对禁忌人群，建议先通过其他方式减重，再考虑马拉松训练。'
  } else if (bmiValue >= 28) {
    healthAssessment = '您的BMI在28-32之间，属于高风险人群，建议先减重并在专业指导下开始训练。'
  }

  // 根据经验水平和目标生成建议
  switch (healthForm.experience) {
    case 'none':
      status = '您是跑步新手，建议从基础开始循序渐进'
      if (healthForm.goal === '5k' || healthForm.goal === '10k') {
        tips = [
          '从快走和慢跑交替开始：第1-4周慢跑1分钟+快走2分钟，循环10-12组',
          '每周训练3次，跑一休一，给身体充分恢复时间',
          '重点关注正确跑姿，避免受伤',
          '每周2次核心力量训练（平板支撑、臀桥、靠墙静蹲），每次15分钟',
          '训练时心率控制在（220-年龄）×65%-80%，能正常说话为准'
        ]
        timeline = '建议准备8-12周达到5公里目标，12-16周达到10公里目标'
      } else if (healthForm.goal === 'half') {
        tips = [
          '第一阶段（1-3个月）：建立运动习惯，能连续不间断慢跑30分钟',
          '第二阶段（4-6个月）：稳定有氧基础，能轻松跑完10公里',
          '第三阶段（7-9个月）：半马备赛期，完成18km长距离慢跑',
          '每周跑量涨幅不超过10%，每4周安排1个减量周',
          '长距离训练同步练习补给，每5-6km补充能量胶'
        ]
        timeline = '标准安全周期：6-12个月，体能差/超重人群建议12个月'
      } else if (healthForm.goal === 'full') {
        tips = [
          '零基础直接挑战全马风险极高，建议先完成半马进阶',
          '第一阶段：建立运动习惯，能连续慢跑30分钟',
          '第二阶段：能轻松跑完10公里',
          '第三阶段：完成半马比赛',
          '第四阶段：半马完赛后再开始全马备赛'
        ]
        timeline = '建议准备24-36个月，累计跑步时长不低于18个月'
        warnings.push('从零基础到全程马拉松需要长期系统训练，严禁压缩时间')
      }
      break
    case 'beginner':
      status = '您有一定运动基础，可以开始系统训练'
      if (healthForm.goal === '5k' || healthForm.goal === '10k') {
        tips = [
          '逐步增加跑量，每周增幅不超过10%',
          '加入间歇训练提升速度和耐力',
          '重视跑后拉伸和恢复，每次训练后做5-10分钟静态拉伸',
          '尝试周末长距离慢跑（LSD），逐步增加距离',
          '选择中国田协认证的A类赛事，安全保障更完善'
        ]
        timeline = '建议准备4-8周达到5公里目标，8-12周达到10公里目标'
      } else if (healthForm.goal === 'half') {
        tips = [
          '每周3-4次训练：2-3次轻松跑 + 1次长距离 + 1次力量训练',
          '长距离训练：第1个月6km，第2个月8km，第3个月10km',
          '半马备赛期（12周）：长距离逐步增加到18km',
          '训练时心率控制在（220-年龄）×65%-80%',
          '赛前1个月内完成18km连续慢跑，验证完赛能力'
        ]
        timeline = '建议准备12-16周'
      } else if (healthForm.goal === 'full') {
        tips = [
          '半马是全马的必要基础，建议先完成半马比赛',
          '稳定月跑量120-150km，持续3个月以上',
          '全马备赛周期：24周（6个月）',
          '备赛期内至少完成2次30km、1次35km的长距离慢跑',
          '模拟比赛补给节奏，适应30km后的「撞墙期」'
        ]
        timeline = '建议准备18-24个月，累计跑步时长不低于18个月'
      }
      break
    case 'intermediate':
      status = '您的运动基础良好，可以挑战更高目标'
      if (healthForm.goal === 'half') {
        tips = [
          '制定周期化训练计划，包含轻松跑、节奏跑和长距离',
          '每周4次训练：2次轻松跑 + 1次节奏跑 + 1次长距离',
          '节奏跑提升耐力，配速比轻松跑稍快，能说短句',
          '长距离逐步增加到18km，每4周安排1个减量周',
          '赛前2周开始 taper 减量，调整到最佳状态'
        ]
        timeline = '建议准备8-12周'
      } else if (healthForm.goal === 'full') {
        tips = [
          '每周4-5次训练：2次轻松跑 + 1次节奏/间歇跑 + 1次长距离 + 1次力量训练',
          '长距离训练：逐步增加到30km、35km',
          '模拟比赛补给，每5-6km补充能量胶，每10km补充盐丸',
          '关注核心和下肢力量训练，预防损伤',
          '赛前1个月内完成35km连续慢跑，验证完赛能力'
        ]
        timeline = '建议准备16-24周'
      }
      break
    case 'advanced':
      status = '您是运动达人，具备挑战全程马拉松的基础'
      tips = [
        '制定科学的周期训练计划，包含基础期、强化期和 taper 期',
        '关注配速策略和比赛战术，根据赛道特点制定计划',
        '定期进行体能测试评估，调整训练强度',
        '重视恢复和营养，保证7-8小时睡眠，每日补充蛋白质',
        '可以尝试冲击个人最佳成绩，但安全完赛仍是首要目标'
      ]
      timeline = '建议准备12-16周'
      break
  }

  // 根据目标距离添加专项建议
  if (healthForm.goal === 'full') {
    tips.push('全程马拉松难度绝非半马的2倍，而是身体负荷的指数级上升，30km后「撞墙期」是极限考验')
    tips.push('参赛必须购买赛事专属意外险，提前留存赛道医疗点、急救电话')
  }

  // 根据伤病史添加警告
  if (healthForm.injuries.includes('knee')) {
    warnings.push('有膝盖伤病史，建议加强腿部力量训练，选择缓震好的跑鞋')
    warnings.push('出现疼痛优先休息，不要带伤训练，轻微拉伤冰敷+休息')
  }
  if (healthForm.injuries.includes('ankle')) {
    warnings.push('有脚踝伤病史，注意路面选择，避免越野赛道')
    warnings.push('可以使用肌效贴提供额外支撑')
  }
  if (healthForm.injuries.includes('back')) {
    warnings.push('有腰背疼痛史，建议加强核心力量训练，保持正确跑姿')
  }

  // 根据年龄调整
  if (age > 50) {
    warnings.push('50岁以上跑者建议赛前进行全面的体检，包括心电图、血压、血常规等')
    tips.push('增加恢复时间，训练强度适度降低，每周至少2天完全休息')
  }

  // 根据BMI调整
  if (bmiValue >= 28) {
    warnings.push('BMI较高，建议先减重再增加跑量，保护膝关节')
    tips.push('配合饮食控制，先以快走为主，逐步过渡到慢跑')
    tips.push('选择支撑性好的跑鞋，减少关节压力')
  }

  // 年龄要求评估
  let ageRequirement = ''
  let ageEligibility = true
  let ageWarning = ''
  
  if (healthForm.goal === 'full') {
    if (age < 18) {
      ageEligibility = false
      ageWarning = '您当前年龄不符合全程马拉松参赛要求，官方基准年龄要求为比赛当年须年满20周岁'
      ageRequirement = '全程马拉松官方基准年龄要求为比赛当年须年满20周岁，少数赛事允许18-20周岁选手报名，需额外提交含心电图的体检报告 + 监护人/法定代理人签署的参赛同意书'
    } else if (age < 20) {
      ageRequirement = '全程马拉松官方基准年龄要求为比赛当年须年满20周岁，您属于18-20周岁区间，需额外提交含心电图的体检报告 + 监护人/法定代理人签署的参赛同意书'
    }
  } else if (healthForm.goal === 'half') {
    if (age < 16) {
      ageEligibility = false
      ageWarning = '您当前年龄不符合半程马拉松参赛要求，官方基准年龄要求为比赛当年须年满16周岁'
      ageRequirement = '半程马拉松官方基准年龄要求为比赛当年须年满16周岁，2026年多数高规格金牌赛事、全国锦标赛已收紧至年满18周岁'
    } else if (age < 18) {
      ageRequirement = '半程马拉松18周岁以下未成年人参赛，必须由监护人/法定代理人签署参赛声明'
    }
  } else if (healthForm.goal === '10k') {
    if (age < 16) {
      ageEligibility = false
      ageWarning = '您当前年龄不符合10公里路跑参赛要求，官方基准年龄要求为比赛当年须年满16周岁'
      ageRequirement = '10公里路跑官方基准年龄要求为比赛当年须年满16周岁'
    } else if (age < 18) {
      ageRequirement = '10公里路跑18周岁以下未成年人参赛，需监护人签署参赛声明'
    }
  } else if (healthForm.goal === '5k') {
    if (age < 5) {
      ageEligibility = false
      ageWarning = '您当前年龄不符合5公里/迷你跑/欢乐跑参赛要求，普遍要求比赛当年年满5-6周岁'
      ageRequirement = '5公里/迷你跑/欢乐跑普遍要求比赛当年须年满5-6周岁'
    } else if (age < 13) {
      ageRequirement = '13周岁以下未成年人参加5公里/迷你跑/欢乐跑，必须有监护人/老师同时报名同项目并全程陪跑'
    } else if (age < 18) {
      ageRequirement = '18周岁以下参加5公里/迷你跑/欢乐跑，需监护人签署参赛声明'
    }
  }
  
  // 如果年龄不符合要求，修改状态评估和建议
  if (!ageEligibility) {
    status = ageWarning
    // 替换为休闲跑步的建议
    tips = [
      '建议从休闲跑步开始，培养运动习惯',
      '每周2-3次，每次20-30分钟的轻松跑',
      '重点关注正确跑姿，避免受伤',
      '配合基础力量训练，增强核心稳定性',
      '选择适合自己年龄的运动强度，循序渐进'
    ]
    // 清空时间线，后续会隐藏
    timeline = ''
  } else {
    // 年龄符合要求时添加通用安全建议
    tips.push('训练/比赛全程，心率必须控制在（220-年龄）×65%-80%')
    tips.push('出现胸闷/胸痛/胸部压榨感、头晕眼前发黑、心慌心悸等症状必须立刻停止')
    tips.push('装备选择：合脚的专业慢跑鞋，提前3个月以上上脚磨合，绝对禁止穿新鞋参赛')
    tips.push('补给训练：长距离训练就要同步练习补给，不要等到口渴再喝水')
    tips.push('恢复铁则：跑休结合，每周必须有1-2天完全休息，训练后做静态拉伸')

    // 新手误区提醒
    warnings.push('绝对不能踩的误区：盲目跳级、突击加量、只跑不练力量、带伤硬扛、比赛冲速度、忽略恢复')
  }
  
  if (ageRequirement) {
    tips.push('年龄要求：' + ageRequirement)
  }

  assessmentResult.value = {
    status,
    healthAssessment,
    tips,
    timeline,
    warnings
  }
}
</script>

<style scoped>
.beginner-page {
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
  text-decoration: none;
  color: var(--text-dark);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-blue);
}

/* 主布局 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  gap: 24px;
}

/* 侧边栏 */
.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.sidebar-header {
  background: linear-gradient(135deg, var(--primary-blue) 0%, #1565C0 100%);
  color: white;
  padding: 24px;
  border-radius: 12px 12px 0 0;
}

.sidebar-header h3 {
  font-size: 20px;
  margin-bottom: 4px;
}

.sidebar-header p {
  font-size: 13px;
  opacity: 0.9;
}

.sidebar-nav {
  background: white;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  color: var(--text-dark);
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
  font-size: 20px;
}

/* 手机标签栏 */
.mobile-tabs {
  display: none;
  background: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow-x: auto;
  gap: 8px;
}

.mobile-tab {
  flex-shrink: 0;
  padding: 10px 20px;
  border: none;
  background: var(--bg-gray);
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.mobile-tab.active {
  background: var(--primary-blue);
  color: white;
}

/* 内容区 */
.content {
  flex: 1;
  min-width: 0;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.content-section h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.section-desc {
  color: var(--text-gray);
  margin-bottom: 24px;
}

.content-block {
  margin-bottom: 32px;
}

.content-block h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-dark);
}

.content-block p {
  color: var(--text-gray);
  line-height: 1.8;
  margin-bottom: 16px;
}

/* 信息卡片 */
.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-gray);
  padding: 20px;
  border-radius: 12px;
  margin-top: 16px;
}

.info-icon {
  font-size: 40px;
}

.info-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-content p {
  color: var(--text-gray);
  margin: 0;
}

/* 距离分类 */
.distance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.distance-card {
  background: var(--bg-gray);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.distance-emoji {
  font-size: 48px;
  margin-bottom: 12px;
}

.distance-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.distance {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: 8px;
}

.distance-card .desc {
  font-size: 13px;
  color: var(--text-gray);
  margin: 0;
}

/* 误区列表 */
.mistake-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mistake-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--bg-gray);
  border-radius: 12px;
}

.mistake-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.mistake-content h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-dark);
}

.mistake-content p {
  color: var(--text-gray);
  font-size: 14px;
  margin: 0;
}

/* 信息垂直布局 */
.info-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.info-vertical .info-card {
  width: 100%;
}

/* 益处网格 */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.benefit-item {
  background: var(--bg-gray);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.benefit-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.benefit-item h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.benefit-item p {
  color: var(--text-gray);
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

/* 马拉松精神 */
.marathon-spirit {
  padding-left: 20px;
  margin-top: 12px;
}

.marathon-spirit li {
  color: var(--text-gray);
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 装备卡片 */
.gear-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.gear-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.gear-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.gear-image-real {
  width: 100%;
  height: 120px;
  object-fit: contain;
  display: block;
}

.gear-info {
  padding: 16px;
}

.gear-info h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}

.gear-for {
  font-size: 13px;
  color: var(--primary-blue);
  margin-bottom: 8px;
}

.gear-desc {
  font-size: 13px;
  color: var(--text-gray);
  margin-bottom: 12px;
}

.gear-tag {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(30, 136, 229, 0.1);
  color: var(--primary-blue);
  border-radius: 20px;
  font-size: 12px;
}

.tips-box {
  background: rgba(255, 152, 0, 0.1);
  border-left: 4px solid var(--primary-orange);
  padding: 20px;
  border-radius: 0 12px 12px 0;
  margin-top: 24px;
}

.tips-box h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--primary-orange);
}

.tips-box ul {
  padding-left: 20px;
}

.tips-box li {
  color: var(--text-gray);
  margin-bottom: 8px;
}

/* 内容子部分 */
.content-subsection {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.content-subsection h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-dark);
}

/* 足弓测试 */
.arch-test {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.test-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--primary-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h5 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.step-content p {
  color: var(--text-gray);
  margin-bottom: 12px;
  line-height: 1.6;
}

.step-content ul {
  padding-left: 20px;
}

.step-content li {
  color: var(--text-gray);
  margin-bottom: 6px;
  line-height: 1.6;
}

/* 足弓图片 */
.arch-images,
.arch-side-view {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.arch-image-item {
  text-align: center;
}

.image-placeholder {
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 8px;
}

.arch-image {
  width: 100%;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
  background: white;
}

.image-caption {
  font-size: 12px;
  color: var(--text-gray);
  line-height: 1.4;
  margin-bottom: 4px;
}

.arch-indicator {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}

.arch-indicator.high-arch {
  background: rgba(30, 136, 229, 0.1);
  color: var(--primary-blue);
}

.arch-indicator.normal-arch {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.arch-indicator.flat-arch {
  background: rgba(255, 152, 0, 0.1);
  color: var(--primary-orange);
}

/* 碳板比较 */
.carbon-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.comparison-card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--bg-gray);
  border-bottom: 1px solid var(--border-color);
}

.card-header h5 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.card-content {
  padding: 16px;
}

.card-content p {
  color: var(--text-gray);
  margin-bottom: 8px;
  line-height: 1.6;
  font-size: 14px;
}

/* 标签样式 */
.tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.tag-blue {
  background: rgba(30, 136, 229, 0.1);
  color: var(--primary-blue);
}

.tag-green {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

/* 响应式 */
@media (max-width: 768px) {
  .carbon-comparison {
    grid-template-columns: 1fr;
  }
  
  .test-step {
    flex-direction: column;
    gap: 12px;
  }
  
  .step-number {
    align-self: flex-start;
  }
  
  .arch-images,
  .arch-side-view {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .image-placeholder {
    height: 60px;
    font-size: 24px;
  }
  
  .image-caption {
    font-size: 11px;
  }
}

/* 补给清单 */
.supply-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.supply-category {
  background: var(--bg-gray);
  padding: 20px;
  border-radius: 12px;
}

.supply-category h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.supply-category ul {
  padding-left: 20px;
}

.supply-category li {
  color: var(--text-gray);
  font-size: 14px;
  margin-bottom: 8px;
}

/* 健康评估表单 */
.assessment-form {
  padding: 24px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-gray);
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-blue);
}

.btn-full {
  width: 100%;
  margin-top: 8px;
}

/* 评估结果 */
.assessment-result {
  padding: 24px;
  background: linear-gradient(135deg, rgba(30, 136, 229, 0.05) 0%, rgba(255, 152, 0, 0.05) 100%);
}

.assessment-result h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-dark);
}

.result-section {
  margin-bottom: 20px;
}

.result-section h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--primary-blue);
}

.result-section p {
  color: var(--text-gray);
  line-height: 1.6;
}

.result-section ul {
  padding-left: 20px;
}

.result-section li {
  color: var(--text-gray);
  margin-bottom: 8px;
  line-height: 1.6;
}

.highlight-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-orange) !important;
}

.warnings h4 {
  color: #E53935;
}

.health-assessment {
  background: rgba(30, 136, 229, 0.05);
  border-left: 4px solid var(--primary-blue);
  padding: 16px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 16px;
}

.health-text {
  color: var(--text-dark);
  line-height: 1.6;
  font-weight: 500;
}

.age-warning {
  color: #E53935;
  font-weight: 600;
  line-height: 1.6;
}

/* 步骤时间线 */
.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-item {
  display: flex;
  gap: 16px;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--primary-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding: 24px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.step-icon {
  font-size: 28px;
}

.step-header h3 {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  margin: 0;
}

.step-duration {
  padding: 6px 12px;
  background: rgba(30, 136, 229, 0.1);
  color: var(--primary-blue);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.step-body h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-dark);
}

.step-body ul {
  padding-left: 20px;
  margin-bottom: 16px;
}

.step-body li {
  color: var(--text-gray);
  margin-bottom: 8px;
  line-height: 1.6;
}

.milestone {
  background: var(--bg-gray);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone.success {
  background: rgba(76, 175, 80, 0.1);
}

.milestone-tag {
  padding: 4px 12px;
  background: var(--primary-blue);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.milestone.success .milestone-tag {
  background: #4CAF50;
}

.milestone p {
  margin: 0;
  font-weight: 500;
  color: var(--text-dark);
}

.checklist-preview {
  background: rgba(30, 136, 229, 0.1);
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.checklist-preview h4 {
  margin-bottom: 4px;
}

.checklist-preview p {
  margin: 0;
  font-size: 13px;
}

/* 响应式 */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    padding: 16px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .content-section {
    padding: 20px;
  }

  .distance-grid,
  .gear-cards,
  .supply-list {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .step-item {
    flex-direction: column;
    gap: 12px;
  }

  .step-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-grid,
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .benefit-item {
    padding: 16px;
  }
}
</style>
