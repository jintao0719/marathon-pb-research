#!/bin/bash

# 阿里云 ECS 一键部署脚本
# 使用方法：在服务器上运行 ./aliyun-setup.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 项目配置
PROJECT_NAME="marathon-pb-research"
PROJECT_DIR="/opt/$PROJECT_NAME"
GITHUB_REPO="https://github.com/jintao0719/marathon-pb-research.git"

print_info "========================================"
print_info "🚀 马拉松PB研究院 - 阿里云部署脚本"
print_info "========================================"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    print_error "请使用 root 用户运行此脚本"
    print_info "使用方法: sudo ./aliyun-setup.sh"
    exit 1
fi

# 第一步：更新系统
print_info "步骤 1/8: 更新系统..."
apt update && apt upgrade -y
print_success "系统更新完成"
echo ""

# 第二步：安装 Node.js
print_info "步骤 2/8: 安装 Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    print_success "Node.js 安装完成: $(node -v)"
else
    print_success "Node.js 已存在: $(node -v)"
fi
echo ""

# 第三步：安装 Git
print_info "步骤 3/8: 安装 Git..."
if ! command -v git &> /dev/null; then
    apt install git -y
    print_success "Git 安装完成"
else
    print_success "Git 已存在: $(git --version)"
fi
echo ""

# 第四步：安装 PM2
print_info "步骤 4/8: 安装 PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    print_success "PM2 安装完成"
else
    print_success "PM2 已存在: $(pm2 --version)"
fi
echo ""

# 第五步：克隆代码
print_info "步骤 5/8: 克隆项目代码..."
if [ -d "$PROJECT_DIR" ]; then
    print_warning "项目目录已存在，更新代码..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    mkdir -p "$PROJECT_DIR"
    git clone "$GITHUB_REPO" "$PROJECT_DIR"
    print_success "代码克隆完成"
fi
echo ""

# 第六步：安装依赖并构建
print_info "步骤 6/8: 安装依赖并构建..."
cd "$PROJECT_DIR"

# 前端依赖
print_info "安装前端依赖..."
npm install

# 构建前端
print_info "构建前端..."
npm run build

# 后端依赖
print_info "安装后端依赖..."
cd server
npm install

cd "$PROJECT_DIR"
print_success "依赖安装和构建完成"
echo ""

# 第七步：配置 Nginx
print_info "步骤 7/8: 配置 Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    print_success "Nginx 安装完成"
fi

# 创建 Nginx 配置
cat > /etc/nginx/sites-available/marathon-pb << EOF
server {
    listen 80;
    server_name _;

    # 前端静态文件
    location / {
        root $PROJECT_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        index index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # 日志
    access_log /var/log/nginx/marathon-pb-access.log;
    error_log /var/log/nginx/marathon-pb-error.log;
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/marathon-pb /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# 测试并重载 Nginx
nginx -t && systemctl restart nginx
systemctl enable nginx

print_success "Nginx 配置完成"
echo ""

# 第八步：启动服务
print_info "步骤 8/8: 启动后端服务..."
cd "$PROJECT_DIR/server"

# 停止旧的服务（如果存在）
pm2 delete marathon-pb 2>/dev/null || true

# 启动新的服务
pm2 start server.js --name marathon-pb \
    --watch \
    --ignore-watch="data logs node_modules" \
    --max-memory-restart 500M \
    --env production

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup systemd -u root --hp /root

print_success "后端服务启动完成"
echo ""

# 显示完成信息
IP_ADDRESS=$(curl -s ifconfig.me)

print_success "========================================"
print_success "🎉 部署完成！"
print_success "========================================"
echo ""
print_info "📱 访问地址:"
echo "  - 网站: http://$IP_ADDRESS"
echo "  - 后端: http://$IP_ADDRESS:3002"
echo ""
print_info "📁 项目目录: $PROJECT_DIR"
print_info "📊 PM2 管理:"
echo "  - 查看状态: pm2 status"
echo "  - 查看日志: pm2 logs marathon-pb"
echo "  - 重启服务: pm2 restart marathon-pb"
echo ""
print_info "🔄 后续更新:"
echo "  cd $PROJECT_DIR && git pull && npm run build && pm2 restart marathon-pb"
echo ""
print_success "========================================"
