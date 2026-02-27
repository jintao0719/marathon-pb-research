/**
 * 赛事数据 API 服务
 */

const API_BASE_URL = 'http://localhost:3002/api'

/**
 * 获取所有赛事
 */
export async function getAllRaces() {
  try {
    const response = await fetch(`${API_BASE_URL}/races`)
    const data = await response.json()
    return data.success ? data.races : []
  } catch (error) {
    console.error('获取赛事列表失败:', error)
    return []
  }
}

/**
 * 获取单个赛事详情
 */
export async function getRaceById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/races/${id}`)
    const data = await response.json()
    return data.success ? data.race : null
  } catch (error) {
    console.error('获取赛事详情失败:', error)
    return null
  }
}

/**
 * 搜索赛事
 */
export async function searchRaces(keyword) {
  try {
    const response = await fetch(`${API_BASE_URL}/races/search?q=${encodeURIComponent(keyword)}`)
    const data = await response.json()
    return data.success ? data.races : []
  } catch (error) {
    console.error('搜索赛事失败:', error)
    return []
  }
}

/**
 * 获取更新状态
 */
export async function getUpdateStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/races/status`)
    const data = await response.json()
    return data.success ? data : null
  } catch (error) {
    console.error('获取更新状态失败:', error)
    return null
  }
}

/**
 * 手动触发更新
 */
export async function triggerUpdate() {
  try {
    const response = await fetch(`${API_BASE_URL}/races/update`, {
      method: 'POST'
    })
    return await response.json()
  } catch (error) {
    console.error('触发更新失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 获取所有赛事（管理员后台用，按创建时间倒序）
 */
export async function getAllRacesAdmin() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/races`)
    const data = await response.json()
    return data.success ? data.races : []
  } catch (error) {
    console.error('获取赛事列表失败:', error)
    return []
  }
}

/**
 * 创建新赛事
 */
export async function createRace(raceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/races`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(raceData)
    })
    return await response.json()
  } catch (error) {
    console.error('创建赛事失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 更新赛事
 */
export async function updateRace(id, raceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/races/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(raceData)
    })
    return await response.json()
  } catch (error) {
    console.error('更新赛事失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 删除赛事
 */
export async function deleteRace(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/races/${id}`, {
      method: 'DELETE'
    })
    return await response.json()
  } catch (error) {
    console.error('删除赛事失败:', error)
    return { success: false, error: error.message }
  }
}
