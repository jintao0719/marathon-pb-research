/**
 * 每日自动更新脚本
 * 每天定时抓取最新赛事信息并更新数据
 */

const { incrementalUpdate } = require('./scraper-improved');
const fs = require('fs-extra');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs', 'auto-update.log');

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

/**
 * 执行自动更新
 */
async function runAutoUpdate() {
  await ensureLogDir();
  await log('========================================');
  await log('开始执行每日自动更新');
  await log('========================================');
  
  try {
    const result = await incrementalUpdate();
    
    if (result.success) {
      await log(`✅ 自动更新成功`);
      await log(`   - 新增赛事: ${result.added} 条`);
      await log(`   - 更新赛事: ${result.updated} 条`);
      await log(`   - 当前总数: ${result.total} 条`);
      
      if (result.errors && result.errors.length > 0) {
        await log(`⚠️  警告: ${result.errors.length} 个数据源抓取失败`);
        result.errors.forEach(err => {
          log(`   - ${err.source}: ${err.error}`, 'warn');
        });
      }
    } else {
      await log(`❌ 自动更新失败: ${result.error}`, 'error');
    }
    
  } catch (error) {
    await log(`❌ 执行异常: ${error.message}`, 'error');
  }
  
  await log('========================================');
  await log('自动更新结束');
  await log('========================================\n');
}

// 如果直接运行此脚本
if (require.main === module) {
  runAutoUpdate();
}

module.exports = { runAutoUpdate };
