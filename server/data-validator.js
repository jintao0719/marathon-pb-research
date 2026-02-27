/**
 * 赛事数据验证模块
 * 提供数据质量检查和报告功能
 */

const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'races.json');
const REPORT_FILE = path.join(__dirname, 'logs', 'data-quality-report.json');

/**
 * 验证单条赛事数据
 */
function validateRace(race) {
  const issues = [];
  
  // 必填字段检查
  const requiredFields = ['name', 'date', 'location', 'distance', 'status'];
  requiredFields.forEach(field => {
    if (!race[field]) {
      issues.push({
        type: 'missing_field',
        field: field,
        message: `缺少必填字段: ${field}`
      });
    }
  });
  
  // 日期格式检查
  if (race.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(race.date)) {
      issues.push({
        type: 'invalid_format',
        field: 'date',
        message: '日期格式不正确，应为 YYYY-MM-DD'
      });
    } else {
      // 检查日期是否合理（不能早于2020年，不能晚于2030年）
      const year = parseInt(race.date.split('-')[0]);
      if (year < 2020 || year > 2030) {
        issues.push({
          type: 'invalid_value',
          field: 'date',
          message: `日期年份 ${year} 超出合理范围 (2020-2030)`
        });
      }
    }
  }
  
  // 报名日期逻辑检查
  if (race.regStart && race.regEnd && race.date) {
    const regStart = new Date(race.regStart);
    const regEnd = new Date(race.regEnd);
    const raceDate = new Date(race.date);
    
    if (regEnd > raceDate) {
      issues.push({
        type: 'logic_error',
        field: 'regEnd',
        message: '报名截止时间不能晚于比赛日期'
      });
    }
    
    if (regStart > regEnd) {
      issues.push({
        type: 'logic_error',
        field: 'regStart',
        message: '报名开始时间不能晚于报名截止时间'
      });
    }
  }
  
  // 报名费用检查
  if (race.fee) {
    const feeMatch = race.fee.match(/(\d+)/);
    if (feeMatch) {
      const fee = parseInt(feeMatch[1]);
      if (fee < 50 || fee > 2000) {
        issues.push({
          type: 'suspicious_value',
          field: 'fee',
          message: `报名费用 ${fee} 元 超出常见范围 (50-2000元)`
        });
      }
    }
  }
  
  // 参赛规模检查
  if (race.scale) {
    const scaleMatch = race.scale.match(/(\d+)/);
    if (scaleMatch) {
      const scale = parseInt(scaleMatch[1]);
      if (scale < 100 || scale > 100000) {
        issues.push({
          type: 'suspicious_value',
          field: 'scale',
          message: `参赛规模 ${scale} 人 超出常见范围 (100-100000人)`
        });
      }
    }
  }
  
  // 报名链接检查
  if (race.regLink) {
    try {
      new URL(race.regLink);
    } catch {
      issues.push({
        type: 'invalid_format',
        field: 'regLink',
        message: '报名链接格式不正确'
      });
    }
  }
  
  // 状态一致性检查
  const now = new Date();
  const raceDate = new Date(race.date);
  
  if (raceDate < now && race.status !== 'finished') {
    issues.push({
      type: 'status_mismatch',
      field: 'status',
      message: `比赛日期已过，但状态为 "${race.status}"，应改为 "finished"`
    });
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * 生成数据质量报告
 */
async function generateDataQualityReport() {
  try {
    const data = await fs.readJson(DATA_FILE);
    const races = data.races || [];
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRaces: races.length,
        validRaces: 0,
        racesWithIssues: 0,
        totalIssues: 0
      },
      statusDistribution: {
        open: 0,
        upcoming: 0,
        finished: 0,
        pending: 0
      },
      levelDistribution: {
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        local: 0
      },
      issues: [],
      racesNeedingAttention: []
    };
    
    // 统计分布
    races.forEach(race => {
      // 状态分布
      if (report.statusDistribution[race.status] !== undefined) {
        report.statusDistribution[race.status]++;
      }
      
      // 级别分布
      if (report.levelDistribution[race.level] !== undefined) {
        report.levelDistribution[race.level]++;
      }
      
      // 验证数据
      const validation = validateRace(race);
      
      if (validation.valid) {
        report.summary.validRaces++;
      } else {
        report.summary.racesWithIssues++;
        report.summary.totalIssues += validation.issues.length;
        
        const raceReport = {
          id: race.id,
          name: race.name,
          date: race.date,
          issues: validation.issues
        };
        
        report.issues.push(raceReport);
        
        // 标记需要关注的赛事（严重问题）
        const seriousIssues = validation.issues.filter(i => 
          i.type === 'missing_field' || i.type === 'logic_error' || i.type === 'status_mismatch'
        );
        
        if (seriousIssues.length > 0) {
          report.racesNeedingAttention.push({
            ...raceReport,
            seriousIssues: seriousIssues
          });
        }
      }
    });
    
    // 保存报告
    await fs.ensureDir(path.dirname(REPORT_FILE));
    await fs.writeJson(REPORT_FILE, report, { spaces: 2 });
    
    return report;
  } catch (error) {
    console.error('生成数据质量报告失败:', error);
    throw error;
  }
}

/**
 * 获取需要审核的赛事列表
 */
async function getRacesNeedingReview() {
  const report = await generateDataQualityReport();
  return report.racesNeedingAttention;
}

/**
 * 标记赛事为已审核
 */
async function markRaceAsReviewed(raceId, reviewer, notes = '') {
  try {
    const data = await fs.readJson(DATA_FILE);
    const race = data.races.find(r => r.id === raceId);
    
    if (!race) {
      throw new Error('赛事未找到');
    }
    
    race.reviewedAt = new Date().toISOString();
    race.reviewedBy = reviewer;
    race.reviewNotes = notes;
    race.updatedAt = new Date().toISOString();
    
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    
    return {
      success: true,
      message: '赛事已标记为已审核',
      race: race
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  validateRace,
  generateDataQualityReport,
  getRacesNeedingReview,
  markRaceAsReviewed
};