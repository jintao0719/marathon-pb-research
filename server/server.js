/**
 * 马拉松赛事数据服务
 * 提供赛事数据API和定时抓取任务
 */

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');
const { scrapeRaces, generateNewRaces } = require('./scraper');
const { incrementalUpdate, calculateRaceStatus } = require('./scraper-improved');
const { runAutoUpdate } = require('./auto-update');

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, 'data', 'races.json');

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * 读取赛事数据
 */
async function readRacesData() {
  try {
    const data = await fs.readJson(DATA_FILE);
    return data;
  } catch (error) {
    console.error('读取赛事数据失败:', error.message);
    return { lastUpdated: new Date().toISOString(), races: [] };
  }
}

/**
 * 保存赛事数据
 */
async function saveRacesData(data) {
  try {
    await fs.ensureDir(path.dirname(DATA_FILE));
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('保存赛事数据失败:', error.message);
    return false;
  }
}

/**
 * 增量更新赛事数据
 * 只新增不删除，避免重复
 */
async function incrementalUpdate() {
  console.log(`\n[${new Date().toLocaleString()}] 开始增量更新赛事数据...`);
  
  try {
    // 读取现有数据
    const existingData = await readRacesData();
    const existingRaces = existingData.races || [];
    const existingNames = new Set(existingRaces.map(r => r.name));
    
    console.log(`现有赛事数量: ${existingRaces.length}`);
    
    // 抓取新数据
    let newRaces = await scrapeRaces();
    
    // 如果没有抓取到新数据，生成模拟数据（演示用）
    if (newRaces.length === 0) {
      // 实际项目中这里应该返回空数组
      // 这里仅用于演示增量更新功能
      console.log('尝试生成新赛事数据...');
      newRaces = generateNewRaces(existingRaces);
    }
    
    // 过滤掉已存在的赛事（根据赛事名称去重）
    const trulyNewRaces = newRaces.filter(race => !existingNames.has(race.name));
    
    console.log(`发现新赛事: ${trulyNewRaces.length} 条`);
    
    if (trulyNewRaces.length > 0) {
      // 合并数据：保留原有数据 + 新增数据
      const updatedRaces = [...existingRaces, ...trulyNewRaces];
      
      // 保存更新后的数据
      const updatedData = {
        lastUpdated: new Date().toISOString(),
        races: updatedRaces
      };
      
      const saved = await saveRacesData(updatedData);
      
      if (saved) {
        console.log(`✅ 增量更新成功！赛事总数: ${updatedRaces.length}`);
        console.log('新增赛事:');
        trulyNewRaces.forEach(race => {
          console.log(`  - ${race.name} (${race.date})`);
        });
        return {
          success: true,
          added: trulyNewRaces.length,
          total: updatedRaces.length,
          newRaces: trulyNewRaces
        };
      } else {
        console.error('❌ 保存数据失败');
        return { success: false, error: '保存数据失败' };
      }
    } else {
      console.log('✅ 没有发现新赛事，数据保持最新');
      // 更新最后检查时间
      existingData.lastUpdated = new Date().toISOString();
      await saveRacesData(existingData);
      return { success: true, added: 0, total: existingRaces.length, message: '没有新赛事' };
    }
  } catch (error) {
    console.error('❌ 增量更新失败:', error.message);
    return { success: false, error: error.message };
  }
}

// ==================== API 路由 ====================

/**
 * 获取所有赛事（前台使用，按比赛日期倒序）
 * GET /api/races
 */
app.get('/api/races', async (req, res) => {
  try {
    const data = await readRacesData();
    const sortedRaces = [...data.races].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({
      success: true,
      lastUpdated: data.lastUpdated,
      count: sortedRaces.length,
      races: sortedRaces
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取所有赛事（后台管理使用，按创建时间倒序）
 * GET /api/admin/races
 */
app.get('/api/admin/races', async (req, res) => {
  try {
    const data = await readRacesData();
    const sortedRaces = [...data.races].sort((a, b) => 
      new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );
    res.json({
      success: true,
      lastUpdated: data.lastUpdated,
      count: sortedRaces.length,
      races: sortedRaces
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 创建新赛事
 * POST /api/admin/races
 */
app.post('/api/admin/races', async (req, res) => {
  try {
    const data = await readRacesData();
    // 过滤掉无效的id，计算最大id
    const validIds = data.races
      .map(r => r.id)
      .filter(id => id !== null && id !== undefined && !isNaN(id));
    const maxId = validIds.length > 0 ? Math.max(...validIds) : 0;
    const now = new Date().toISOString();
    
    const newRace = {
      id: maxId + 1,
      ...req.body,
      createdAt: now,
      updatedAt: now
    };
    
    data.races.push(newRace);
    data.lastUpdated = now;
    
    await saveRacesData(data);
    
    res.json({
      success: true,
      race: newRace
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 更新赛事
 * PUT /api/admin/races/:id
 */
app.put('/api/admin/races/:id', async (req, res) => {
  try {
    const data = await readRacesData();
    const index = data.races.findIndex(r => r.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: '赛事未找到' });
    }
    
    const now = new Date().toISOString();
    data.races[index] = {
      ...data.races[index],
      ...req.body,
      updatedAt: now
    };
    data.lastUpdated = now;
    
    await saveRacesData(data);
    
    res.json({
      success: true,
      race: data.races[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 删除赛事
 * DELETE /api/admin/races/:id
 */
app.delete('/api/admin/races/:id', async (req, res) => {
  try {
    const data = await readRacesData();
    const index = data.races.findIndex(r => r.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: '赛事未找到' });
    }
    
    data.races.splice(index, 1);
    data.lastUpdated = new Date().toISOString();
    
    await saveRacesData(data);
    
    res.json({
      success: true,
      message: '赛事已删除'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取单个赛事详情
 * GET /api/races/:id
 */
app.get('/api/races/:id', async (req, res) => {
  try {
    const data = await readRacesData();
    const race = data.races.find(r => r.id === parseInt(req.params.id));
    
    if (race) {
      res.json({ success: true, race });
    } else {
      res.status(404).json({ success: false, error: '赛事未找到' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 手动触发增量更新
 * POST /api/races/update
 */
app.post('/api/races/update', async (req, res) => {
  const result = await incrementalUpdate();
  res.json(result);
});

/**
 * 获取更新状态
 * GET /api/races/status
 */
app.get('/api/races/status', async (req, res) => {
  try {
    const data = await readRacesData();
    res.json({
      success: true,
      lastUpdated: data.lastUpdated,
      totalRaces: data.races.length,
      nextScheduledUpdate: '每天 00:00:00'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 搜索赛事
 * GET /api/races/search?q=关键词
 */
app.get('/api/races/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: '请提供搜索关键词' });
    }
    
    const data = await readRacesData();
    const keyword = q.toLowerCase();
    
    const results = data.races.filter(race => 
      race.name.toLowerCase().includes(keyword) ||
      race.location.toLowerCase().includes(keyword) ||
      race.region.toLowerCase().includes(keyword)
    );
    
    res.json({
      success: true,
      count: results.length,
      races: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== 用户反馈 API ====================

const FEEDBACK_FILE = path.join(__dirname, 'data', 'feedback.json');

/**
 * 读取反馈数据
 */
async function readFeedbackData() {
  try {
    const data = await fs.readJson(FEEDBACK_FILE);
    return data;
  } catch (error) {
    console.error('读取反馈数据失败:', error.message);
    return { feedback: [], lastId: 0 };
  }
}

/**
 * 保存反馈数据
 */
async function saveFeedbackData(data) {
  try {
    await fs.ensureDir(path.dirname(FEEDBACK_FILE));
    await fs.writeJson(FEEDBACK_FILE, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('保存反馈数据失败:', error.message);
    return false;
  }
}

/**
 * 提交用户反馈
 * POST /api/feedback
 */
app.post('/api/feedback', async (req, res) => {
  try {
    const { content, images = [], contact = '' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: '反馈内容不能为空' });
    }
    
    if (content.length > 1000) {
      return res.status(400).json({ success: false, error: '反馈内容不能超过1000字' });
    }
    
    const data = await readFeedbackData();
    
    const newFeedback = {
      id: data.lastId + 1,
      content: content.trim(),
      images: images.slice(0, 5), // 最多5张图片
      contact: contact.trim(),
      status: 'pending', // pending, processed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.feedback.unshift(newFeedback);
    data.lastId = newFeedback.id;
    
    await saveFeedbackData(data);
    
    res.json({
      success: true,
      message: '反馈提交成功，感谢您的建议！',
      feedback: newFeedback
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取所有反馈（管理员后台）
 * GET /api/admin/feedback
 */
app.get('/api/admin/feedback', async (req, res) => {
  try {
    const data = await readFeedbackData();
    res.json({
      success: true,
      count: data.feedback.length,
      feedback: data.feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 更新反馈状态（管理员后台）
 * PUT /api/admin/feedback/:id
 */
app.put('/api/admin/feedback/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const data = await readFeedbackData();
    const index = data.feedback.findIndex(f => f.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: '反馈未找到' });
    }
    
    data.feedback[index] = {
      ...data.feedback[index],
      status: status || data.feedback[index].status,
      updatedAt: new Date().toISOString()
    };
    
    await saveFeedbackData(data);
    
    res.json({
      success: true,
      feedback: data.feedback[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 删除反馈（管理员后台）
 * DELETE /api/admin/feedback/:id
 */
app.delete('/api/admin/feedback/:id', async (req, res) => {
  try {
    const data = await readFeedbackData();
    const index = data.feedback.findIndex(f => f.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: '反馈未找到' });
    }
    
    data.feedback.splice(index, 1);
    await saveFeedbackData(data);
    
    res.json({
      success: true,
      message: '反馈已删除'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== 定时任务 ====================

/**
 * 每天 6:00 执行自动更新（早上更新，确保白天用户看到最新数据）
 * cron 表达式: 秒 分 时 日 月 周
 */
const updateJob = cron.schedule('0 0 6 * * *', async () => {
  console.log('\n========================================');
  console.log('🕛 定时任务触发: 每天 6:00 赛事数据自动更新');
  console.log('========================================');
  await runAutoUpdate();
  console.log('========================================\n');
}, {
  scheduled: true,
  timezone: 'Asia/Shanghai' // 使用中国时区
});

/**
 * 每天 18:00 执行状态刷新（更新赛事状态：报名中->即将开始->已结束）
 */
const statusRefreshJob = cron.schedule('0 0 18 * * *', async () => {
  console.log('\n========================================');
  console.log('🕛 定时任务触发: 每天 18:00 赛事状态刷新');
  console.log('========================================');
  await refreshRaceStatuses();
  console.log('========================================\n');
}, {
  scheduled: true,
  timezone: 'Asia/Shanghai'
});

/**
 * 刷新所有赛事状态
 */
async function refreshRaceStatuses() {
  try {
    const data = await readRacesData();
    let updated = 0;
    
    data.races.forEach(race => {
      const newStatus = calculateRaceStatus(race);
      if (race.status !== newStatus) {
        console.log(`  更新 [${race.name}]: ${race.status} -> ${newStatus}`);
        race.status = newStatus;
        race.updatedAt = new Date().toISOString();
        updated++;
      }
    });
    
    if (updated > 0) {
      data.lastUpdated = new Date().toISOString();
      await saveRacesData(data);
      console.log(`✅ 状态刷新完成: 更新 ${updated} 条赛事状态`);
    } else {
      console.log('✅ 状态检查完成: 无需更新');
    }
  } catch (error) {
    console.error('❌ 状态刷新失败:', error.message);
  }
}

// ==================== 启动服务 ====================

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🏃 马拉松赛事数据服务已启动');
  console.log('========================================');
  console.log(`📡 API 地址: http://localhost:${PORT}`);
  console.log(`📊 数据文件: ${DATA_FILE}`);
  console.log('⏰ 定时任务: 每天 00:00:00 自动更新');
  console.log('========================================\n');
  
  // 启动时显示当前数据状态
  readRacesData().then(data => {
    console.log(`📋 当前赛事数量: ${data.races.length}`);
    console.log(`🕐 最后更新: ${new Date(data.lastUpdated).toLocaleString()}`);
    console.log('\n可用 API:');
    console.log('  GET  /api/races          - 获取所有赛事');
    console.log('  GET  /api/races/:id      - 获取单个赛事');
    console.log('  GET  /api/races/search?q= - 搜索赛事');
    console.log('  GET  /api/races/status   - 获取更新状态');
    console.log('  POST /api/races/update   - 手动触发更新');
    console.log('========================================\n');
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n正在关闭服务...');
  updateJob.stop();
  statusRefreshJob.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n正在关闭服务...');
  updateJob.stop();
  statusRefreshJob.stop();
  process.exit(0);
});
