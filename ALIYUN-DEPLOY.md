# 🚀 阿里云 ECS 部署教程

## 📋 前置准备

### 1. 申请阿里云免费试用

1. 访问 https://www.aliyun.com/
2. 点击右上角"免费试用"
3. 选择"云服务器 ECS" - "免费试用 3个月"
4. 完成实名认证（需要身份证）
5. 选择配置：
   - **地域**：华东1（杭州）或 华东2（上海）
   - **实例规格**：1核2G（ecs.t6-c1m2.large）
   - **操作系统**：Ubuntu 22.04 64位
   - **带宽**：1Mbps（免费额度）
   - **安全组**：开放 80, 443, 3000, 3002 端口

### 2. 获取服务器信息

创建成功后，您会获得：
- **公网 IP**：例如 `47.96.123.45`
- **用户名**：`root`
- **密码**：您设置的密码（或密钥）

---

## 🛠️ 服务器环境配置

### 第一步：连接服务器

```bash
# 使用 SSH 连接（Mac/Linux）
ssh root@47.96.123.45

# 输入密码
```

### 第二步：安装 Node.js

```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应该显示 v18.x.x
npm -v   # 应该显示 9.x.x
```

### 第三步：安装 Git 和 PM2

```bash
# 安装 Git
apt install git -y

# 安装 PM2（进程管理器）
npm install -g pm2

# 验证 PM2
pm2 --version
```

### 第四步：克隆代码

```bash
# 创建项目目录
mkdir -p /opt/marathon-pb-research
cd /opt/marathon-pb-research

# 克隆代码
git clone https://github.com/jintao0719/marathon-pb-research.git .

# 如果私有仓库，使用 token
git clone https://jintao0719:YOUR_TOKEN@github.com/jintao0719/marathon-pb-research.git .
```

---

## 📦 部署应用

### 第五步：运行部署脚本

```bash
# 进入项目目录
cd /opt/marathon-pb-research

# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 第六步：使用 PM2 启动服务

```bash
# 进入后端目录
cd /opt/marathon-pb-research/server

# 使用 PM2 启动
pm2 start server.js --name marathon-pb \
  --watch \
  --ignore-watch="data logs node_modules" \
  --max-memory-restart 500M

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup systemd
```

### 第七步：配置 Nginx（推荐）

```bash
# 安装 Nginx
apt install nginx -y

# 创建配置文件
cat > /etc/nginx/sites-available/marathon-pb << 'EOF'
server {
    listen 80;
    server_name _;  # 接受所有域名

    # 前端静态文件
    location / {
        root /opt/marathon-pb-research/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 日志
    access_log /var/log/nginx/marathon-pb-access.log;
    error_log /var/log/nginx/marathon-pb-error.log;
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/marathon-pb /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
systemctl enable nginx
```

---

## 🔒 安全加固（可选但推荐）

### 配置防火墙

```bash
# 安装 ufw
apt install ufw -y

# 默认拒绝所有入站
ufw default deny incoming

# 允许 SSH
ufw allow 22/tcp

# 允许 HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 允许后端端口（如果直接访问）
ufw allow 3002/tcp

# 启用防火墙
ufw enable
```

### 配置 SSL 证书（HTTPS）

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx -y

# 申请证书（需要域名）
certbot --nginx -d your-domain.com

# 自动续期测试
certbot renew --dry-run
```

---

## 🔄 后续更新

### 更新代码

```bash
# 进入项目目录
cd /opt/marathon-pb-research

# 拉取最新代码
git pull origin main

# 重新构建
npm run build
cd server && npm install

# 重启服务
pm2 restart marathon-pb
```

### 查看日志

```bash
# PM2 日志
pm2 logs marathon-pb

# Nginx 日志
tail -f /var/log/nginx/marathon-pb-error.log

# 应用日志
tail -f /opt/marathon-pb-research/server/logs/scraper.log
```

---

## 🌐 访问网站

部署完成后，通过以下地址访问：

```
http://47.96.123.45          # 直接访问 IP
http://your-domain.com       # 如果配置了域名
```

---

## 🆘 故障排除

### 问题1：端口被占用

```bash
# 查看端口占用
lsof -i :3002

# 结束进程
kill -9 <PID>
```

### 问题2：权限不足

```bash
# 修改目录权限
chown -R www-data:www-data /opt/marathon-pb-research
chmod -R 755 /opt/marathon-pb-research
```

### 问题3：Node.js 版本过低

```bash
# 使用 n 模块升级
npm install -g n
n 18
```

### 问题4：内存不足

```bash
# 添加 Swap 分区
dd if=/dev/zero of=/swapfile bs=1M count=2048
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 📞 需要帮助？

- 阿里云文档：https://help.aliyun.com/
- 项目 Issues：https://github.com/jintao0719/marathon-pb-research/issues

---

**🎉 部署完成后，您就拥有了一个完整的马拉松PB研究院网站！**
