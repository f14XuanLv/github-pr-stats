# 部署指南

## 🚀 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/f14xuanlv/github-pr-stats)

立即部署你的专属PR统计服务，5分钟内即可开始使用！

## 🛠️ 环境变量

部署前需要配置以下环境变量：

```env
# GitHub API Token（必需）
GITHUB_TOKEN=ghp_your_github_token_here

# Redis缓存URL（可选，但强烈推荐）
REDIS_URL=redis://default:password@host:6379
```

**注意**：
- `GITHUB_TOKEN` 是必需的，用于访问GitHub API
- `REDIS_URL` 是可选的，但强烈推荐配置以提高性能和减少API调用

## 🔑 GitHub Token 创建

1. 访问 [GitHub Token 设置](https://github.com/settings/tokens/new)

2. 填写Token信息：
   - **Note**: 输入 `GitHub PR Stats`
   - **Expiration**: 选择 `No expiration`

3. 选择权限（只需最小权限）：
   - ✅ `public_repo`：访问公开仓库（必选）
   - ✅ `read:user`：读取用户资料（用于GraphQL）

   ![创建 GitHub Token](/images/create_github_token.png)

4. 点击页面底部的 `Generate token` 按钮

5. **重要**：立即复制生成的Token（只显示一次）

## 🗄️ Vercel Redis 创建

1. 登录 [Vercel 控制台](https://vercel.com/dashboard)

2. 访问 [Vercel Storage](https://vercel.com/dashboard/stores) 页面

3. 点击 `Create Database` → 选择 `Redis (Serverless Redis)` → 继续
![创建 Vercel Redis](/images/create_vercel_redis.png)

4. 填写数据库信息：
   - **Name**: 自定义输入
   - **Region**: 自定选择区域

5. 创建完成后，进入数据库详情页面将复制的URL添加到环境变量：
   ```env
   REDIS_URL=redis://default:your_password@your_host:6379
   ```

## ⚙️ 完整配置示例

```env
# GitHub API Token（必需）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Redis缓存URL（可选，但强烈推荐以提高性能）
REDIS_URL=redis://default:AbCdEf123456@redis-12345.upstash.io:6379
```

## 🏗️ 系统架构

### 技术栈
- **Frontend**: React + TypeScript + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: Redis (缓存)
- **API**: GitHub GraphQL API

### 数据流
1. **参数解析** → 验证查询参数
2. **缓存检查** → Redis缓存优化
3. **数据获取** → GitHub GraphQL API
4. **数据处理** → 筛选、排序、聚合
5. **结果限制** → 选取前limit个记录
6. **SVG生成** → 主题渲染
7. **响应输出** → 标准SVG格式

### 安全特性
- Token服务端隔离
- 只读API访问
- 智能缓存策略
- 模块化设计