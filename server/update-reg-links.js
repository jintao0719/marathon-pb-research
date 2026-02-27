/**
 * 赛事报名链接更新工具
 * 批量检查和更新赛事报名链接
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const DATA_FILE = path.join(__dirname, 'data', 'races.json');
const LOG_FILE = path.join(__dirname, 'logs', 'reg-link-updates.log');

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

// 官方报名平台映射
const OFFICIAL_PLATFORMS = {
  '数字心动': 'https://www.数字心动.com',
  '果动赛事': 'https://register.spoorts.cn',
  '最酷': 'https://www.zuicool.com',
  '跑哪儿': 'https://www.paonaer.com',
  '马拉马拉': 'https://www.malamala.cn',
  '参赛助手': 'https://mp.weixin.qq.com/s/参赛助手',
  '汇跑赛事': 'https://www.huirun.com'
};

// 本地宝城市映射
const BENDIBAO_CITIES = {
  '北京': 'bj', '上海': 'sh', '广州': 'gz', '深圳': 'sz',
  '杭州': 'hz', '南京': 'nj', '成都': 'cd', '武汉': 'wh',
  '西安': 'xa', '重庆': 'cq', '天津': 'tj', '苏州': 'su',
  '无锡': 'wx', '厦门': 'xm', '青岛': 'qd', '大连': 'dl',
  '宁波': 'nb', '济南': 'jn', '郑州': 'zz', '长沙': 'cs',
  '沈阳': 'sy', '福州': 'fz', '合肥': 'hf', '昆明': 'km',
  '石家庄': 'sjz', '太原': 'ty', '兰州': 'lz', '海口': 'hk',
  '贵阳': 'gy', '南宁': 'nn', '哈尔滨': 'hrb', '长春': 'cc',
  '乌鲁木齐': 'wlmq', '呼和浩特': 'hhht', '银川': 'yc', '西宁': 'xn',
  '拉萨': 'ls'
};

/**
 * 检查链接是否有效
 */
async function checkLinkValidity(url) {
  try {
    // 跳过微信链接和特殊协议
    if (url.startsWith('https://mp.weixin.qq.com') || 
        url.startsWith('weixin://') ||
        !url.startsWith('http')) {
      return { valid: true, reason: '特殊链接，跳过检查' };
    }
    
    const response = await axios.head(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: (status) => status < 400
    });
    
    return { valid: true, status: response.status };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * 生成本地宝搜索链接
 */
function generateBendibaoLink(city, raceName) {
  const cityCode = BENDIBAO_CITIES[city];
  if (!cityCode) return null;
  
  // 提取赛事简称（去掉年份）
  const shortName = raceName.replace(/^\d{4}/, '').replace('马拉松', '');
  
  return `https://${cityCode}.bendibao.com/xiuxian/${shortName}marathon/`;
}

/**
 * 生成替代信息链接
 */
function generateAlternativeLink(race) {
  const { name, location, city, province } = race;
  
  // 1. 尝试生成本地宝链接
  const bendibaoLink = generateBendibaoLink(city || location, name);
  if (bendibaoLink) {
    return {
      url: bendibaoLink,
      source: '本地宝',
      type: 'info'
    };
  }
  
  // 2. 使用百度搜索
  const searchQuery = encodeURIComponent(`${name} 报名 2026`);
  return {
    url: `https://www.baidu.com/s?wd=${searchQuery}`,
    source: '百度搜索',
    type: 'search'
  };
}

/**
 * 更新所有赛事报名链接
 */
async function updateAllRegLinks() {
  await ensureLogDir();
  await log('========================================');
  await log('开始检查并更新赛事报名链接');
  await log('========================================');
  
  try {
    const data = await fs.readJson(DATA_FILE);
    const races = data.races || [];
    
    let checked = 0;
    let updated = 0;
    let invalid = 0;
    
    for (const race of races) {
      checked++;
      
      // 跳过没有报名链接的赛事
      if (!race.regLink) {
        await log(`[${race.name}] 没有报名链接，生成替代链接`);
        const alternative = generateAlternativeLink(race);
        race.regLink = alternative.url;
        race.regLinkSource = alternative.source;
        race.regLinkType = alternative.type;
        updated++;
        continue;
      }
      
      // 检查链接有效性
      const checkResult = await checkLinkValidity(race.regLink);
      
      if (!checkResult.valid) {
        invalid++;
        await log(`[${race.name}] 链接无效: ${checkResult.error}`, 'warn');
        
        // 生成替代链接
        const alternative = generateAlternativeLink(race);
        race.regLink = alternative.url;
        race.regLinkSource = alternative.source;
        race.regLinkType = alternative.type;
        
        await log(`[${race.name}] 已更新为替代链接: ${alternative.source}`);
        updated++;
      } else {
        await log(`[${race.name}] 链接有效 ✓`);
      }
    }
    
    // 保存更新后的数据
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    
    await log('========================================');
    await log(`检查完成: 共 ${checked} 条赛事`);
    await log(`无效链接: ${invalid} 条`);
    await log(`已更新: ${updated} 条`);
    await log('========================================');
    
    return {
      success: true,
      checked,
      invalid,
      updated
    };
    
  } catch (error) {
    await log(`执行失败: ${error.message}`, 'error');
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 为单个赛事更新报名链接
 */
async function updateRaceRegLink(raceId, newLink, source = 'manual') {
  try {
    const data = await fs.readJson(DATA_FILE);
    const race = data.races.find(r => r.id === raceId);
    
    if (!race) {
      throw new Error('赛事未找到');
    }
    
    const oldLink = race.regLink;
    race.regLink = newLink;
    race.regLinkSource = source;
    race.regLinkUpdatedAt = new Date().toISOString();
    
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    
    await log(`[${race.name}] 报名链接已更新`);
    await log(`  旧链接: ${oldLink}`);
    await log(`  新链接: ${newLink}`);
    await log(`  来源: ${source}`);
    
    return {
      success: true,
      race: race
    };
    
  } catch (error) {
    await log(`更新失败: ${error.message}`, 'error');
    return {
      success: false,
      error: error.message
    };
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updateAllRegLinks();
}

module.exports = {
  updateAllRegLinks,
  updateRaceRegLink,
  checkLinkValidity,
  generateAlternativeLink
};