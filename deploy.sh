#!/bin/bash

# 马拉松PB研究院 v1.0 部署脚本
# 使用方法: ./deploy.sh [环境]
# 示例: ./deploy.sh production

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
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

# 获取当前目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

print_info "开始部署 马拉松PB研究院 v1.0..."
print_info "项目目录: $PROJECT_DIR"
echo ""

# 检查Node.js版本
print_info "检查Node.js版本..."
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装，请先安装Node.js"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js 版本过低，需要 v16+，当前版本: $(node -v)"
    exit 1
fi
print_success "Node.js 版本检查通过: $(node -v)"
echo ""

# 步骤1: 安装前端依赖
print_info "步骤 1/6: 安装前端依赖..."
npm install
print_success "前端依赖安装完成"
echo ""

# 步骤2: 构建前端
print_info "步骤 2/6: 构建前端项目..."
npm run build
print_success "前端构建完成，输出目录: dist/"
echo ""

# 步骤3: 安装后端依赖
print_info "步骤 3/6: 安装后端依赖..."
cd server
npm install
print_success "后端依赖安装完成"
echo ""

# 步骤4: 检查数据文件
print_info "步骤 4/6: 检查数据文件..."
if [ ! -d "data" ]; then
    mkdir -p data
    print_warning "创建 data 目录"
fi

if [ ! -f "data/races.json" ]; then
    print_warning "races.json 不存在，将创建初始数据文件"
    echo '{"lastUpdated": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'", "races": []}' > data/races.json
fi

if [ ! -f "data/feedback.json" ]; then
    print_warning "feedback.json 不存在，将创建初始反馈文件"
    echo '{"feedback": [], "lastId": 0}' > data/feedback.json
fi
print_success "数据文件检查完成"
echo ""

# 步骤5: 创建日志目录
print_info "步骤 5/6: 创建日志目录..."
mkdir -p logs
print_success "日志目录创建完成"
echo ""

# 步骤6: 启动服务
print_info "步骤 6/6: 启动服务..."
echo ""
print_info "您可以选择以下启动方式:"
echo "  1) 开发模式 (npm run dev)"
echo "  2) 生产模式 (npm start)"
echo "  3) PM2进程管理 (pm2 start server.js --name marathon-pb)"
echo ""

# 返回项目根目录
cd "$PROJECT_DIR"

print_success "部署准备完成!"
echo ""
echo "========================================"
echo "🎉 马拉松PB研究院 v1.0 部署就绪"
echo "========================================"
echo ""
echo "📁 项目结构:"
echo "  - 前端构建: dist/"
echo "  - 后端服务: server/"
echo "  - 数据文件: server/data/"
echo "  - 日志文件: server/logs/"
echo ""
echo "🚀 启动服务:"
echo "  cd server && npm start"
echo ""
echo "📖 查看日志:"
echo "  tail -f server/logs/scraper.log"
echo ""
echo "🌐 访问地址:"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:3002"
echo ""
echo "========================================"
