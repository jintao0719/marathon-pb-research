# 🚀 马拉松PB研究院 - 快速开始指南

## 常用命令（直接复制执行，不要复制#开头的注释）

### 1. 查看日志
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website/server && tail -f logs/scraper.log
```

### 2. 启动后端服务
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website/server && npm start
```

### 3. 启动前端开发服务器
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website && npm run dev
```

### 4. 构建前端（生产环境）
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website && npm run build
```

### 5. 一键部署
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website && ./deploy.sh
```

---

## 📋 部署步骤

### 第一步：执行部署脚本
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website
./deploy.sh
```

### 第二步：启动后端服务
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website/server
npm start
```

### 第三步：访问网站
- 前端：http://localhost:3000
- 后端：http://localhost:3002

---

## 🔍 查看日志

### 实时查看抓取日志
```bash
tail -f /Users/jintao/Documents/trae_projects/marathon-run-website/server/logs/scraper.log
```

### 查看报名链接更新日志
```bash
tail -f /Users/jintao/Documents/trae_projects/marathon-run-website/server/logs/reg-link-updates.log
```

### 查看自动更新日志
```bash
tail -f /Users/jintao/Documents/trae_projects/marathon-run-website/server/logs/auto-update.log
```

---

## 🛠️ 常用维护命令

### 手动更新赛事数据
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website/server
node auto-update.js
```

### 检查并更新报名链接
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website/server
node update-reg-links.js
```

### 生成数据质量报告
```bash
cd /Users/jintao/Documents/trae_projects/marathon-run-website/server
node -e "const {generateDataQualityReport} = require('./data-validator'); generateDataQualityReport().then(r => console.log('报告已生成'));"
```

---

## ⚠️ 注意事项

1. **不要执行以#开头的行** - 那些是注释，不是命令
2. **确保在正确的目录执行命令** - 每个命令前都有`cd`确保路径正确
3. **先启动后端再访问前端** - 后端服务必须在3002端口运行
4. **查看日志用tail -f** - 可以实时看到更新

---

## 🆘 故障排除

### 端口被占用
```bash
# 查找占用3002端口的进程
lsof -i :3002

# 结束进程（将<PID>替换为实际的进程ID）
kill -9 <PID>
```

### 依赖安装失败
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules
npm install
```

### 数据文件损坏
```bash
# 备份并重新初始化数据
cd /Users/jintao/Documents/trae_projects/marathon-run-website/server/data
cp races.json races.json.backup
echo '{"lastUpdated": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'", "races": []}' > races.json
```

---

## 📞 需要帮助？

查看详细文档：
- [RELEASE-v1.0.md](./RELEASE-v1.0.md) - 发布说明
- [CHANGELOG.md](./CHANGELOG.md) - 更新日志
- [README.md](./README.md) - 项目说明
