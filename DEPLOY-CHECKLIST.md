# ✅ 阿里云部署检查清单

## 📋 部署前准备

### 1. 阿里云账号
- [ ] 注册阿里云账号
- [ ] 完成实名认证（需要身份证）
- [ ] 申请免费试用（3个月）

### 2. 创建 ECS 实例
- [ ] 选择地域：华东1（杭州）或 华东2（上海）
- [ ] 实例规格：1核2G（ecs.t6-c1m2.large）
- [ ] 操作系统：Ubuntu 22.04 64位
- [ ] 带宽：1Mbps
- [ ] 安全组规则：
  - [ ] 开放 22 端口（SSH）
  - [ ] 开放 80 端口（HTTP）
  - [ ] 开放 443 端口（HTTPS）
  - [ ] 开放 3002 端口（后端API）

### 3. 获取连接信息
- [ ] 公网 IP 地址
- [ ] root 密码（或密钥对）

---

## 🚀 部署步骤

### 方式一：一键部署（推荐）

```bash
# 1. 连接服务器
ssh root@YOUR_SERVER_IP

# 2. 下载部署脚本
curl -O https://raw.githubusercontent.com/jintao0719/marathon-pb-research/main/aliyun-setup.sh

# 3. 运行脚本
chmod +x aliyun-setup.sh
sudo ./aliyun-setup.sh
```

### 方式二：手动部署

参考 [ALIYUN-DEPLOY.md](./ALIYUN-DEPLOY.md) 逐步执行。

---

## 🔍 部署后验证

### 1. 服务状态检查
```bash
# 检查 Nginx
systemctl status nginx

# 检查 PM2
pm2 status

# 检查端口
netstat -tlnp | grep -E '80|3002'
```

### 2. 网站访问测试
- [ ] 浏览器访问 `http://YOUR_SERVER_IP`
- [ ] 确认首页正常显示
- [ ] 点击导航链接测试
- [ ] 测试赛事详情页
- [ ] 测试反馈功能

### 3. 后端 API 测试
```bash
# 测试 API
curl http://YOUR_SERVER_IP:3002/api/races

# 应该返回赛事数据 JSON
```

### 4. 自动化功能验证
- [ ] 检查定时任务是否运行
- [ ] 查看日志文件：`/opt/marathon-pb-research/server/logs/`

---

## 🛠️ 常见问题

### 问题1：无法访问网站
**排查步骤：**
1. 检查安全组是否开放 80 端口
2. 检查 Nginx 是否运行：`systemctl status nginx`
3. 检查防火墙：`ufw status`
4. 查看 Nginx 错误日志：`tail -f /var/log/nginx/error.log`

### 问题2：后端 API 无法访问
**排查步骤：**
1. 检查 PM2 状态：`pm2 status`
2. 查看后端日志：`pm2 logs marathon-pb`
3. 检查端口占用：`lsof -i :3002`
4. 检查安全组是否开放 3002 端口

### 问题3：页面显示空白
**排查步骤：**
1. 检查 dist 目录是否存在：`ls -la /opt/marathon-pb-research/dist/`
2. 重新构建前端：`cd /opt/marathon-pb-research && npm run build`
3. 检查 Nginx 配置：`cat /etc/nginx/sites-available/marathon-pb`

### 问题4：定时任务不执行
**排查步骤：**
1. 检查 PM2 日志：`pm2 logs marathon-pb`
2. 手动测试更新：`cd /opt/marathon-pb-research/server && node auto-update.js`
3. 检查数据文件权限：`ls -la /opt/marathon-pb-research/server/data/`

---

## 📝 部署完成确认

- [ ] 网站可以通过公网 IP 访问
- [ ] 所有页面功能正常
- [ ] 后端 API 返回数据正常
- [ ] 用户反馈功能可用
- [ ] 定时任务正常运行
- [ ] 已配置开机自启
- [ ] 已保存 PM2 配置

---

## 🔄 后续维护

### 日常维护命令
```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs marathon-pb

# 重启服务
pm2 restart marathon-pb

# 更新代码
cd /opt/marathon-pb-research
git pull
npm run build
pm2 restart marathon-pb
```

### 监控检查
- [ ] 每周检查一次日志
- [ ] 每月检查一次磁盘空间：`df -h`
- [ ] 每季度更新系统和依赖

---

## 📞 获取帮助

- 阿里云文档：https://help.aliyun.com/
- 项目 Issues：https://github.com/jintao0719/marathon-pb-research/issues
- 部署教程：[ALIYUN-DEPLOY.md](./ALIYUN-DEPLOY.md)

---

**🎉 恭喜！部署完成后，您就拥有了一个完整的马拉松PB研究院网站！**
