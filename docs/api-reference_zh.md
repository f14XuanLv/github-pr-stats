# API 参考文档

## 📝 API 参数详解

### 基础参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `username` | string | **必填** | GitHub 用户名 |
| `mode` | string | `pr-list` | 展示模式：<br>• `pr-list`：PR详细列表<br>• `repo-aggregate`：仓库聚合统计 |
| `theme` | string | `dark` | 主题样式：`dark`（深色）、`light`（浅色） |
| `limit` | number | `10` | 显示数量限制（在筛选和排序后选取前limit个记录） |

### 筛选参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `status` | string | `all` | PR状态筛选（仅PR List模式）：<br>• 单值：`all`、`merged`、`open`、`closed`、`draft`<br>• 多值：`merged,open`（逗号分隔）<br>• Repository Aggregate模式忽略此参数 |
| `min_stars` | number | `0` | 最小star数筛选 |

### 排序参数

**PR List 模式**（默认：`status,stars_desc`）：
- `status`：按固定状态排序（merged → open → draft → closed）
- `stars_desc/asc`：按仓库star数排序
- `created_date_desc/asc`：按创建时间排序

**Repository Aggregate 模式**（默认：`merged_desc,stars_desc`）：
- `merged_desc/asc`：按合并PR数排序
- `merged_rate_desc/asc`：按合并率排序
- `stars_desc/asc`：按star数排序

支持多字段排序，用逗号分隔：`sort=merged_desc,stars_desc`

### 显示参数

#### 字段配置 (fields)

**PR List 模式**（默认：`repo,stars,pr_title,pr_number,status,created_date,merged_date`）：
- `repo`：仓库名称（必选）
- `stars`：star数
- `pr_title`：PR标题
- `pr_number`：PR编号  
- `status`：PR状态
- `created_date`：创建时间
- `merged_date`：合并时间

**Repository Aggregate 模式**（默认：`repo,stars,pr_numbers,total,merged,merged_rate`）：
- `repo`：仓库名称（必选）
- `stars`：star数
- `pr_numbers`：PR编号列表
- `total`：PR总数
- `merged`：已合并数
- `open`：开放状态数
- `draft`：草稿状态数  
- `closed`：已关闭数
- `merged_rate`：合并率

#### 统计信息 (stats)

默认：`total_pr,merged_pr,display_pr`

可选值：
- `all`：显示所有统计
- `total_pr`：总PR数
- `merged_pr`：已合并PR数
- `display_pr`：展示PR数
- `repos_with_pr`：贡献仓库数
- `repos_with_merged_pr`：成功贡献仓库数
- `showing_repos`：展示仓库数
- `none`：不显示统计

## 📊 使用示例

### PR List 模式示例

```bash
# 基础用法 - 显示所有PR
/api/github-pr-stats?username=yourname

# 高质量贡献 - 已合并的高star项目，取前5个
/api/github-pr-stats?username=yourname&status=merged&min_stars=1000&limit=5

# 最近活动 - 按创建时间排序，取前10个
/api/github-pr-stats?username=yourname&sort=created_date_desc&limit=10

# 多状态筛选 - 已合并和开放中的PR
/api/github-pr-stats?username=yourname&status=merged,open&limit=15

# 简化显示 - 只显示核心信息
/api/github-pr-stats?username=yourname&fields=repo,pr_title,status&stats=none
```

### Repository Aggregate 模式示例

```bash
# 基础仓库统计
/api/github-pr-stats?username=yourname&mode=repo-aggregate

# 按合并率排序 - 展示贡献质量最高的前10个仓库
/api/github-pr-stats?username=yourname&mode=repo-aggregate&sort=merged_rate_desc&limit=10

# 高影响力项目 - 筛选高star仓库
/api/github-pr-stats?username=yourname&mode=repo-aggregate&min_stars=5000

# 详细统计 - 包含各状态PR数
/api/github-pr-stats?username=yourname&mode=repo-aggregate&fields=repo,total,merged,open,closed,merged_rate

# 完整统计信息
/api/github-pr-stats?username=yourname&mode=repo-aggregate&stats=all&limit=15
```

### 主题和样式

```bash
# 浅色主题
/api/github-pr-stats?username=yourname&theme=light

# 自定义统计显示
/api/github-pr-stats?username=yourname&stats=total_pr,merged_pr,repos_with_pr

# 不显示统计信息
/api/github-pr-stats?username=yourname&stats=none
```