# 快速开始

## 环境要求

- Node.js >= 16
- npm >= 8
- Docker & Docker Compose（可选，用于数据库和邮件服务）

## 安装

```bash
# 克隆项目
git clone <repo-url>
cd nestjs-boilerplate

# 安装依赖
npm install

# 复制环境变量配置（如没有 .env 文件）
cp .env.example .env
```

## 启动基础服务

```bash
# 启动 PostgreSQL、MailDev、Adminer
docker compose up -d
```

服务列表：

| 服务 | 地址 | 用途 |
|------|------|------|
| PostgreSQL | `localhost:5432` | 数据库 |
| Adminer | `http://localhost:9090` | 数据库管理界面 |
| MailDev | `http://localhost:1080` | 邮件测试界面（SMTP: 1025） |

## 数据库迁移

```bash
# 运行迁移
npm run migration:run

# 填充种子数据（创建管理员和测试用户）
npm run seed:run:relational
```

## 启动应用

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

应用启动后：

- API 地址：`http://localhost:3008/api/v1/...`
- Swagger 文档：`http://localhost:3008/docs`
- OpenAPI JSON：`http://localhost:3008/docs-json`

## 常用命令

```bash
# 创建新迁移
npm run migration:create -- src/database/migrations/MigrationName

# 自动生成迁移（基于 entity 变更）
npm run migration:generate -- src/database/migrations/MigrationName

# 回滚上一次迁移
npm run migration:revert

# 运行测试
npm run test

# E2E 测试（Docker 环境）
npm run test:e2e:relational:docker

# 代码生成（新建模块）
npm run generate:resource:relational
```

## 环境变量说明

核心环境变量定义在 `.env` 文件中：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `APP_PORT` | `3008` | 应用端口 |
| `API_PREFIX` | `api` | API 路由前缀 |
| `DATABASE_URL` | — | 数据库连接字符串 |
| `AUTH_JWT_SECRET` | — | JWT 密钥（生产环境务必修改） |
| `FILE_DRIVER` | `local` | 文件存储驱动（`local` / `s3` / `s3-presigned`） |
| `MAIL_HOST` | `localhost` | 邮件服务器地址 |

完整配置参考 `.env` 文件。
