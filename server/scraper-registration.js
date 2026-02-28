/**
 * 报名链接专项爬虫
 * 定期扫描各大报名平台，获取真实报名链接
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'races.json');
const LOG_FILE = path.join(__dirname, 'logs', 'registration-scraper.log');

// 报名平台配置
const REG_PLATFORMS = {
  zuicool: {
    name: '最酷',
    url: 'https://www.zuicool.com/events',
    searchUrl: 'https://www.zuicool.com/events/search?q=',
    enabled: true
  },
  paonaer: {
    name: '跑哪儿',
    url: 'https://www.paonaer.com/events',
    searchUrl: 'https://www.paonaer.com/events/search?keyword=',
    enabled: true
  },
  malamala: {
    name: '马拉马拉',
    url: 'https://www.malamala.cn/events',
    searchUrl: 'https://www.malamala.cn/events/search?keyword=',
    enabled: true
  },
  tianxie: {
    name: '田协认证',
    url: 'http://www.athletics.org.cn/competition/',
    enabled: true
  }
};

/**
 * 写入日志
 */
async function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
  console.log(logEntry.trim());
  await fs.ensureDir(path.dirname(LOG_FILE));
  await fs.appendFile(LOG_FILE, logEntry);
}

/**
 * 搜索最酷平台的报名链接
 */
async function searchZuicool(raceName) {
  try {
    const searchQuery = encodeURIComponent(raceName.replace(/\d{4}/, '').trim());
    const url = `${REG_PLATFORMS.zuicool.searchUrl}${searchQuery}`;
    
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events = [];
    
    // 解析赛事列表
    $('.event-item, .race-item, .item').each((i, elem) => {
      const title = $(elem).find('.title, .name, h3').text().trim();
      const link = $(elem).find('a').attr('href');
      const status = $(elem).find('.status, .reg-status').text().trim();
      
      if (title && link) {
        events.push({
          title,
          link: link.startsWith('http') ? link : `https://www.zuicool.com${link}`,
          status,
          platform: '最酷'
        });
      }
    });
    
    return events;
  } catch (error) {
    await log(`最酷搜索失败: ${error.message}`, 'error');
    return [];
  }
}

/**
 * 搜索跑哪儿平台的报名链接
 */
async function searchPaonaer(raceName) {
  try {
    const searchQuery = encodeURIComponent(raceName.replace(/\d{4}/, '').trim());
    const url = `${REG_PLATFORMS.paonaer.searchUrl}${searchQuery}`;
    
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events = [];
    
    // 解析赛事列表
    $('.event-card, .race-item').each((i, elem) => {
      const title = $(elem).find('.title, .name').text().trim();
      const link = $(elem).find('a').attr('href');
      const status = $(elem).find('.status').text().trim();
      
      if (title && link) {
        events.push({
          title,
          link: link.startsWith('http') ? link : `https://www.paonaer.com${link}`,
          status,
          platform: '跑哪儿'
        });
      }
    });
    
    return events;
  } catch (error) {
    await log(`跑哪儿搜索失败: ${error.message}`, 'error');
    return [];
  }
}

/**
 * 匹配赛事名称
 */
function matchRaceName(raceName, searchResult) {
  // 提取赛事名称中的关键信息（城市名）
  const cityMatch = raceName.match(/([^\d]+)马拉松/);
  const city = cityMatch ? cityMatch[1] : raceName;
  
  // 检查搜索结果是否包含城市名
  return searchResult.title.includes(city);
}

/**
 * 更新赛事报名链接
 */
async function updateRaceRegistration(race, regInfo) {
  // 如果人工锁定了报名信息，不自动更新
  if (race.manualLock?.reg) {
    await log(`赛事 ${race.name} 已人工锁定，跳过更新`);
    return null;
  }
  
  const updates = {
    regLink: regInfo.link,
    regSource: regInfo.platform,
    regVerified: true,
    regManual: false,
    regLastUpdate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 更新报名状态
  if (regInfo.status) {
    if (regInfo.status.includes('报名中') || regInfo.status.includes('开放')) {
      updates.regStatus = 'open';
    } else if (regInfo.status.includes('即将') || regInfo.status.includes('未开始')) {
      updates.regStatus = 'upcoming';
    } else if (regInfo.status.includes('截止') || regInfo.status.includes('结束')) {
      updates.regStatus = 'closed';
    }
  }
  
  return updates;
}

/**
 * 主函数：扫描所有赛事的报名链接
 */
async function scanRegistrationLinks() {
  await log('开始扫描报名链接...');
  
  // 读取现有数据
  const data = await fs.readJson(DATA_FILE);
  const races = data.races || [];
  
  // 只处理未验证或来源为搜索的赛事
  const racesToUpdate = races.filter(r => 
    !r.regVerified || 
    r.regSource === 'search' || 
    r.regSource === 'unknown'
  );
  
  await log(`需要更新的赛事: ${racesToUpdate.length}/${races.length}`);
  
  let updatedCount = 0;
  let failedCount = 0;
  
  for (const race of racesToUpdate) {
    try {
      await log(`正在搜索: ${race.name}`);
      
      // 并行搜索多个平台
      const [zuicoolResults, paonaerResults] = await Promise.all([
        searchZuicool(race.name),
        searchPaonaer(race.name)
      ]);
      
      // 合并搜索结果
      const allResults = [...zuicoolResults, ...paonaerResults];
      
      // 找到匹配的赛事
      const matched = allResults.find(r => matchRaceName(race.name, r));
      
      if (matched) {
        await log(`找到报名链接: ${race.name} -> ${matched.platform}`);
        
        // 更新赛事数据
        const updates = await updateRaceRegistration(race, matched);
        if (updates) {
          Object.assign(race, updates);
          updatedCount++;
        }
      } else {
        await log(`未找到报名链接: ${race.name}`, 'warn');
        failedCount++;
      }
      
      // 延迟，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      await log(`处理失败 ${race.name}: ${error.message}`, 'error');
      failedCount++;
    }
  }
  
  // 保存更新后的数据
  data.lastUpdated = new Date().toISOString();
  await fs.writeJson(DATA_FILE, data, { spaces: 2 });
  
  await log('扫描完成！');
  await log(`更新成功: ${updatedCount}, 失败: ${failedCount}`);
  
  return {
    total: racesToUpdate.length,
    updated: updatedCount,
    failed: failedCount
  };
}

// 如果直接运行此脚本
if (require.main === module) {
  scanRegistrationLinks().catch(console.error);
}

module.exports = {
  scanRegistrationLinks,
  searchZuicool,
  searchPaonaer
};
