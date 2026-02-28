/**
 * 数据迁移脚本
 * 为现有赛事数据添加新的数据管理字段
 */

const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'races.json');

async function migrateData() {
  console.log('开始数据迁移...');
  
  // 读取现有数据
  const data = await fs.readJson(DATA_FILE);
  const races = data.races || [];
  
  console.log(`共有 ${races.length} 条赛事数据需要迁移`);
  
  // 迁移每条赛事数据
  const migratedRaces = races.map(race => {
    // 判断报名链接类型
    const isBaiduLink = race.regLink && race.regLink.includes('baidu.com');
    const isOfficialLink = race.regLink && !isBaiduLink && !race.regLink.includes('search');
    
    // 确定报名状态
    let regStatus = 'unknown';
    if (race.regStart && race.regEnd) {
      const now = new Date();
      const start = new Date(race.regStart);
      const end = new Date(race.regEnd);
      
      if (now < start) {
        regStatus = 'upcoming';
      } else if (now >= start && now <= end) {
        regStatus = 'open';
      } else {
        regStatus = 'closed';
      }
    }
    
    return {
      ...race,
      
      // 赛事信息管理字段
      infoSource: race.infoSource || 'manual',
      infoVerified: race.infoVerified !== undefined ? race.infoVerified : true,
      infoManual: race.infoManual !== undefined ? race.infoManual : true,
      infoLastUpdate: race.infoLastUpdate || race.updatedAt || new Date().toISOString(),
      
      // 报名信息管理字段
      regStatus: regStatus,
      regSource: isOfficialLink ? 'official' : (isBaiduLink ? 'search' : 'unknown'),
      regVerified: isOfficialLink,
      regManual: race.regManual !== undefined ? race.regManual : false,
      regLastUpdate: race.regLastUpdate || race.updatedAt || new Date().toISOString(),
      
      // 人工锁定标记
      manualLock: {
        info: race.manualLock?.info || false,
        reg: race.manualLock?.reg || false
      },
      
      // 更新时间
      updatedAt: new Date().toISOString()
    };
  });
  
  // 保存迁移后的数据
  const newData = {
    lastUpdated: new Date().toISOString(),
    races: migratedRaces
  };
  
  await fs.writeJson(DATA_FILE, newData, { spaces: 2 });
  
  console.log('数据迁移完成！');
  console.log(`- 总赛事数: ${migratedRaces.length}`);
  console.log(`- 已验证报名链接: ${migratedRaces.filter(r => r.regVerified).length}`);
  console.log(`- 百度搜索链接: ${migratedRaces.filter(r => r.regSource === 'search').length}`);
}

migrateData().catch(console.error);
