/**
 * SEO工具函数
 * 用于动态管理页面meta信息
 */

// 页面SEO配置
export const pageSEO = {
  home: {
    title: '2026马拉松赛事报名_马拉松训练计划_跑步知识 - 马拉松跑步知识网',
    description: '马拉松跑步知识网提供2026年全国马拉松赛事报名信息、科学训练计划、新手入门指南、配速计算工具，助力跑者从新手到PB突破。',
    keywords: '马拉松,马拉松报名,马拉松赛事,马拉松训练,跑步知识,配速计算,全马,半马,2026马拉松'
  },
  races: {
    title: '2026马拉松赛事报名_全国马拉松比赛时间 - 马拉松跑步知识网',
    description: '2026年全国马拉松赛事报名信息平台，包含无锡马拉松、武汉马拉松、重庆马拉松等50+场赛事报名时间、比赛路线、报名入口。',
    keywords: '马拉松报名,马拉松赛事,2026马拉松,无锡马拉松,武汉马拉松,马拉松比赛时间'
  },
  raceDetail: (raceName, location, date) => ({
    title: `${raceName}_报名时间_比赛路线 - 马拉松跑步知识网`,
    description: `${raceName}定于${date}在${location}举行，查看报名时间、比赛路线、赛事规程、报名入口等详细信息。`,
    keywords: `${raceName},马拉松报名,马拉松赛事,跑步比赛`
  }),
  beginner: {
    title: '马拉松新手入门指南_从零开始跑马拉松 - 马拉松跑步知识网',
    description: '马拉松新手入门完整指南：如何开始跑步、装备选择、训练计划、健康评估，帮助你安全完成人生第一个马拉松。',
    keywords: '马拉松入门,跑步新手,马拉松训练,马拉松装备,第一次马拉松'
  },
  advanced: {
    title: '马拉松进阶训练_配速计算_PB突破 - 马拉松跑步知识网',
    description: '专业马拉松训练计划、配速计算器、瓶颈诊断工具，科学训练助你突破个人最佳成绩，实现PB目标。',
    keywords: '马拉松训练,配速计算,马拉松PB,全马训练,跑步训练计划'
  },
  calculator: {
    title: '马拉松配速计算器_跑步配速换算 - 马拉松跑步知识网',
    description: '免费的马拉松配速计算器，支持配速与速度换算、完赛时间预测、分段配速规划，科学制定比赛策略。',
    keywords: '配速计算器,马拉松配速,跑步配速,配速换算'
  }
}

/**
 * 更新页面标题和meta标签
 * @param {Object} seoConfig - SEO配置对象
 */
export function updatePageMeta(seoConfig) {
  if (!seoConfig) return
  
  const { title, description, keywords } = seoConfig
  
  // 更新标题
  if (title) {
    document.title = title
  }
  
  // 更新description
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)
  }
  
  // 更新keywords
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', keywords)
  }
  
  // 更新Open Graph标签
  if (title) {
    updateMetaProperty('og:title', title)
  }
  if (description) {
    updateMetaProperty('og:description', description)
  }
}

/**
 * 更新Open Graph meta属性
 * @param {string} property - 属性名
 * @param {string} content - 属性值
 */
function updateMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

/**
 * 生成赛事结构化数据
 * @param {Object} race - 赛事对象
 * @returns {Object} 结构化数据对象
 */
export function generateRaceStructuredData(race) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: race.name,
    startDate: `${race.date}T07:30:00`,
    endDate: `${race.date}T13:30:00`,
    location: {
      '@type': 'Place',
      name: race.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: race.city || race.location,
        addressRegion: race.province || race.region,
        addressCountry: 'CN'
      }
    },
    description: race.routeDesc || `${race.name}是一场${race.certification || '马拉松赛事'}`,
    organizer: {
      '@type': 'Organization',
      name: race.organizer || '赛事组委会'
    },
    offers: race.regLink ? {
      '@type': 'Offer',
      url: race.regLink,
      availability: race.status === 'open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    } : undefined
  }
}

/**
 * 添加结构化数据到页面
 * @param {Object} data - 结构化数据对象
 */
export function addStructuredData(data) {
  if (!data) return
  
  // 移除已有的结构化数据
  const existingScript = document.querySelector('script[type="application/ld+json"]')
  if (existingScript) {
    existingScript.remove()
  }
  
  // 添加新的结构化数据
  const script = document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * 计算赛事状态
 * @param {Object} race - 赛事对象
 * @returns {Object} 状态对象 {status, label}
 */
export function calculateRaceStatus(race) {
  if (!race) return { status: 'upcoming', label: '即将开始' }
  
  const now = new Date()
  const regStart = race.regStart ? new Date(race.regStart) : null
  const regEnd = race.regEnd ? new Date(race.regEnd) : null
  const raceDate = race.date ? new Date(race.date) : null
  
  // 如果当前时间已过比赛时间，状态为：比赛已结束
  if (raceDate && now > raceDate) {
    return { status: 'finished', label: '比赛已结束' }
  }
  
  // 如果当前时间在报名开始时间和报名截止时间之间，状态为：报名中
  if (regStart && regEnd && now >= regStart && now <= regEnd) {
    return { status: 'open', label: '报名中' }
  }
  
  // 如果当前时间还未到报名开始时间，状态为：即将开启报名
  if (regStart && now < regStart) {
    return { status: 'pending', label: '即将开启报名' }
  }
  
  // 如果当前时间在报名截止时间和比赛开始时间之间，状态为：即将开始
  if (regEnd && raceDate && now > regEnd && now < raceDate) {
    return { status: 'upcoming', label: '即将开始' }
  }
  
  // 如果有报名截止时间但已过报名期，且比赛未开始，状态为：即将开始
  if (regEnd && raceDate && now > regEnd) {
    return { status: 'upcoming', label: '即将开始' }
  }
  
  // 默认返回数据中的状态
  return { status: race.status || 'upcoming', label: getStatusLabel(race.status || 'upcoming') }
}

/**
 * 获取状态标签
 * @param {string} status - 状态码
 * @returns {string} 状态标签
 */
export function getStatusLabel(status) {
  const map = {
    'open': '报名中',
    'upcoming': '即将开始',
    'closed': '已结束',
    'finished': '比赛已结束',
    'pending': '即将开启报名'
  }
  return map[status] || status
}
