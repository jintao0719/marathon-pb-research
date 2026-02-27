/**
 * 改进的赛事数据抓取模块
 * 支持多数据源抓取、数据验证和增量更新
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data', 'races.json');
const LOG_FILE = path.join(__dirname, 'logs', 'scraper.log');

// 确保日志目录存在
async function ensureLogDir() {
  await fs.ensureDir(path.dirname(LOG_FILE));
}

// 写入日志
async function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
  console.log(logEntry.trim());
  await fs.appendFile(LOG_FILE, logEntry);
}

// 赛事数据源配置
const DATA_SOURCES = {
  // 官方数据源（优先）
  official: [
    {
      name: '中国田径协会',
      url: 'http://www.athletics.org.cn/competition/',
      enabled: true,
      priority: 1,
      scraper: scrapeCAA
    },
    {
      name: '浙江马拉松官网',
      url: 'https://www.zjim.org/',
      enabled: true,
      priority: 2,
      scraper: scrapeZJMarathon
    }
  ],
  // 第三方平台
  thirdParty: [
    {
      name: '最酷',
      url: 'https://www.zuicool.com/events',
      enabled: true,
      priority: 3,
      scraper: scrapeZuicool
    },
    {
      name: '跑哪儿',
      url: 'https://www.paonaer.com/events',
      enabled: true,
      priority: 4,
      scraper: scrapePaonaer
    },
    {
      name: '马拉马拉',
      url: 'https://www.malamala.cn/events',
      enabled: true,
      priority: 5,
      scraper: scrapeMalaMala
    }
  ]
};

/**
 * 主抓取函数
 */
async function scrapeRaces() {
  await ensureLogDir();
  await log('开始抓取赛事数据...');
  
  const allRaces = [];
  const errors = [];
  
  // 按优先级抓取数据源
  const allSources = [...DATA_SOURCES.official, ...DATA_SOURCES.thirdParty];
  allSources.sort((a, b) => a.priority - b.priority);
  
  for (const source of allSources) {
    if (!source.enabled) continue;
    
    try {
      await log(`正在从 ${source.name} 抓取数据...`);
      const races = await source.scraper();
      
      if (races && races.length > 0) {
        await log(`从 ${source.name} 成功抓取 ${races.length} 条赛事`);
        allRaces.push(...races);
      } else {
        await log(`${source.name} 没有返回数据`, 'warn');
      }
    } catch (error) {
      await log(`从 ${source.name} 抓取失败: ${error.message}`, 'error');
      errors.push({ source: source.name, error: error.message });
    }
  }
  
  // 数据去重和合并
  const uniqueRaces = deduplicateRaces(allRaces);
  await log(`去重后共有 ${uniqueRaces.length} 条唯一赛事`);
  
  return {
    races: uniqueRaces,
    errors: errors,
    totalSources: allSources.filter(s => s.enabled).length,
    successSources: allSources.filter(s => s.enabled).length - errors.length
  };
}

/**
 * 赛事数据去重
 */
function deduplicateRaces(races) {
  const raceMap = new Map();
  
  races.forEach(race => {
    const key = `${race.name}_${race.date}`;
    
    if (raceMap.has(key)) {
      // 合并数据，优先使用官方数据源的信息
      const existing = raceMap.get(key);
      raceMap.set(key, mergeRaceData(existing, race));
    } else {
      raceMap.set(key, race);
    }
  });
  
  return Array.from(raceMap.values());
}

/**
 * 合并赛事数据（优先使用更可靠的数据）
 */
function mergeRaceData(existing, newRace) {
  // 优先使用官方数据源的数据
  const isOfficial = newRace.source === 'official';
  
  return {
    ...existing,
    ...newRace,
    // 保留更详细的描述
    routeDesc: newRace.routeDesc?.length > existing.routeDesc?.length 
      ? newRace.routeDesc 
      : existing.routeDesc,
    // 更新时间戳
    updatedAt: new Date().toISOString()
  };
}

/**
 * 验证赛事数据完整性
 */
function validateRaceData(race) {
  const required = ['name', 'date', 'location', 'distance'];
  const missing = required.filter(field => !race[field]);
  
  if (missing.length > 0) {
    return {
      valid: false,
      error: `缺少必填字段: ${missing.join(', ')}`
    };
  }
  
  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(race.date)) {
    return {
      valid: false,
      error: '日期格式不正确，应为 YYYY-MM-DD'
    };
  }
  
  // 验证报名日期逻辑
  if (race.regStart && race.regEnd) {
    const regStart = new Date(race.regStart);
    const regEnd = new Date(race.regEnd);
    const raceDate = new Date(race.date);
    
    if (regEnd > raceDate) {
      return {
        valid: false,
        error: '报名截止时间不能晚于比赛日期'
      };
    }
  }
  
  return { valid: true };
}

/**
 * 计算赛事状态（基于当前时间）
 */
function calculateRaceStatus(race) {
  const now = new Date();
  const raceDate = new Date(race.date);
  const regStart = race.regStart ? new Date(race.regStart) : null;
  const regEnd = race.regEnd ? new Date(race.regEnd) : null;
  
  // 比赛已结束
  if (raceDate < now) {
    return 'finished';
  }
  
  // 报名中
  if (regStart && regEnd && now >= regStart && now <= regEnd) {
    return 'open';
  }
  
  // 报名已截止，比赛未开始
  if (regEnd && now > regEnd && raceDate > now) {
    return 'upcoming';
  }
  
  // 即将开启报名
  if (regStart && now < regStart) {
    return 'pending';
  }
  
  return race.status || 'upcoming';
}

/**
 * 增量更新赛事数据
 */
async function incrementalUpdate() {
  await log('开始增量更新...');
  
  try {
    // 读取现有数据
    const existingData = await fs.readJson(DATA_FILE);
    const existingRaces = existingData.races || [];
    
    await log(`现有赛事数量: ${existingRaces.length}`);
    
    // 抓取新数据
    const scrapeResult = await scrapeRaces();
    const newRaces = scrapeResult.races;
    
    if (newRaces.length === 0) {
      await log('没有获取到新赛事数据，跳过更新');
      return {
        success: true,
        added: 0,
        updated: 0,
        message: '没有新数据'
      };
    }
    
    // 创建赛事名称映射
    const existingMap = new Map(existingRaces.map(r => [`${r.name}_${r.date}`, r]));
    
    let added = 0;
    let updated = 0;
    
    // 处理新抓取的赛事
    for (const newRace of newRaces) {
      // 验证数据
      const validation = validateRaceData(newRace);
      if (!validation.valid) {
        await log(`数据验证失败 [${newRace.name}]: ${validation.error}`, 'warn');
        continue;
      }
      
      // 计算状态
      newRace.status = calculateRaceStatus(newRace);
      newRace.updatedAt = new Date().toISOString();
      
      const key = `${newRace.name}_${newRace.date}`;
      
      if (existingMap.has(key)) {
        // 更新现有赛事
        const existing = existingMap.get(key);
        const merged = mergeRaceData(existing, newRace);
        
        // 检查是否有实质性变化
        const hasChanges = JSON.stringify(existing) !== JSON.stringify(merged);
        if (hasChanges) {
          Object.assign(existing, merged);
          updated++;
        }
      } else {
        // 添加新赛事
        newRace.id = Math.max(...existingRaces.map(r => r.id), 0) + 1;
        newRace.createdAt = new Date().toISOString();
        existingRaces.push(newRace);
        added++;
      }
    }
    
    // 保存更新后的数据
    const updatedData = {
      lastUpdated: new Date().toISOString(),
      races: existingRaces
    };
    
    await fs.writeJson(DATA_FILE, updatedData, { spaces: 2 });
    
    await log(`增量更新完成: 新增 ${added} 条, 更新 ${updated} 条`);
    
    return {
      success: true,
      added,
      updated,
      total: existingRaces.length,
      errors: scrapeResult.errors
    };
    
  } catch (error) {
    await log(`增量更新失败: ${error.message}`, 'error');
    return {
      success: false,
      error: error.message
    };
  }
}

// ==================== 具体数据源抓取实现 ====================

/**
 * 抓取中国田径协会官网
 */
async function scrapeCAA() {
  try {
    const response = await axios.get('http://www.athletics.org.cn/competition/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const races = [];
    
    // 根据实际页面结构解析（需要根据实际网页结构调整）
    $('.race-item, .competition-item, .event-item').each((i, elem) => {
      const name = $(elem).find('.title, .name').text().trim();
      const date = $(elem).find('.date, .time').text().trim();
      const location = $(elem).find('.location, .place').text().trim();
      
      if (name && date) {
        races.push({
          name: name.includes('马拉松') ? name : `${name}马拉松`,
          date: normalizeDate(date),
          location: location || '待定',
          region: extractRegion(location),
          distance: detectDistance(name),
          level: detectLevel(name),
          source: 'official',
          status: 'upcoming'
        });
      }
    });
    
    return races;
  } catch (error) {
    throw new Error(`抓取失败: ${error.message}`);
  }
}

/**
 * 抓取浙江马拉松官网
 */
async function scrapeZJMarathon() {
  try {
    const response = await axios.get('https://www.zjim.org/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const races = [];
    
    // 解析浙江马拉松官网的赛事列表
    // 这里需要根据实际网页结构调整选择器
    
    return races;
  } catch (error) {
    throw new Error(`抓取失败: ${error.message}`);
  }
}

/**
 * 抓取最酷网
 */
async function scrapeZuicool() {
  try {
    const response = await axios.get('https://www.zuicool.com/events', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const races = [];
    
    // 解析最酷网的赛事列表
    
    return races;
  } catch (error) {
    throw new Error(`抓取失败: ${error.message}`);
  }
}

/**
 * 抓取跑哪儿
 */
async function scrapePaonaer() {
  try {
    const response = await axios.get('https://www.paonaer.com/events', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const races = [];
    
    // 解析跑哪儿的赛事列表
    
    return races;
  } catch (error) {
    throw new Error(`抓取失败: ${error.message}`);
  }
}

/**
 * 抓取马拉马拉
 */
async function scrapeMalaMala() {
  try {
    const response = await axios.get('https://www.malamala.cn/events', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const races = [];
    
    // 解析马拉马拉的赛事列表
    
    return races;
  } catch (error) {
    throw new Error(`抓取失败: ${error.message}`);
  }
}

// ==================== 工具函数 ====================

/**
 * 标准化日期格式
 */
function normalizeDate(dateStr) {
  // 处理各种日期格式
  const patterns = [
    /(\d{4})年(\d{1,2})月(\d{1,2})日/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    /(\d{4})\/(\d{1,2})\/(\d{1,2})/
  ];
  
  for (const pattern of patterns) {
    const match = dateStr.match(pattern);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, '0');
      const day = match[3].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  return dateStr;
}

/**
 * 提取地区信息
 */
function extractRegion(location) {
  if (!location) return '未知';
  
  const regionMap = {
    '北京': '北京', '上海': '上海', '天津': '天津', '重庆': '重庆',
    '浙江': '浙江', '江苏': '江苏', '广东': '广东', '山东': '山东',
    '河南': '河南', '四川': '四川', '湖北': '湖北', '湖南': '湖南',
    '河北': '河北', '福建': '福建', '安徽': '安徽', '辽宁': '辽宁',
    '陕西': '陕西', '江西': '江西', '黑龙江': '黑龙江', '吉林': '吉林',
    '云南': '云南', '贵州': '贵州', '甘肃': '甘肃', '广西': '广西',
    '海南': '海南', '内蒙古': '内蒙古', '新疆': '新疆', '西藏': '西藏',
    '宁夏': '宁夏', '青海': '青海'
  };
  
  for (const [key, value] of Object.entries(regionMap)) {
    if (location.includes(key)) return value;
  }
  
  return location.split(/[省市]/)[0] || location;
}

/**
 * 检测赛事距离
 */
function detectDistance(name) {
  const lower = name.toLowerCase();
  if (lower.includes('全程') || lower.includes('全马')) return 'full';
  if (lower.includes('半程') || lower.includes('半马')) return 'half';
  if (lower.includes('10公里') || lower.includes('10k')) return '10k';
  if (lower.includes('5公里') || lower.includes('5k')) return '5k';
  return 'full'; // 默认全程
}

/**
 * 检测赛事级别
 */
function detectLevel(name) {
  const lower = name.toLowerCase();
  if (lower.includes('白金标') || lower.includes('白金')) return 'platinum';
  if (lower.includes('金标') || lower.includes('金牌')) return 'gold';
  if (lower.includes('银标') || lower.includes('银牌')) return 'silver';
  if (lower.includes('铜标') || lower.includes('铜牌')) return 'bronze';
  return 'local';
}

module.exports = {
  scrapeRaces,
  incrementalUpdate,
  validateRaceData,
  calculateRaceStatus,
  deduplicateRaces,
  DATA_SOURCES
};