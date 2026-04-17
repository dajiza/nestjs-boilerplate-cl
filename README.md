# CRM NestJS REST API

NestJS REST API 后端服务，集成 Boulevard 数据同步。

## 文档

[完整文档索引](docs/readme.md)

| 文档                                    | 说明                             |
| --------------------------------------- | -------------------------------- |
| [快速开始](docs/getting-started.md)     | 安装、配置、启动                 |
| [Preview 部署](docs/preview-guide.md)   | Preview 环境启动到种子数据导入   |
| [项目架构](docs/architecture.md)        | 技术栈、目录结构、模块设计       |
| [数据库](docs/database.md)              | 迁移、种子数据、Boulevard 同步表 |
| [认证](docs/auth.md)                    | JWT、社交登录、角色              |
| [前端对接](docs/frontend-guide.md)      | Swagger、类型生成、认证对接      |

## 快速启动

```bash
# 安装依赖
npm install

# 启动 PostgreSQL 等基础服务（开发环境）
docker compose --env-file .env.development -f docker-compose.development.yaml up -d

# 运行数据库迁移 + 种子数据
npm run migration:run
npm run seed:run:relational

# 启动开发服务器
npm run start:dev
```

- API：`http://localhost:3008/api/v1/`
- Swagger 文档：`http://localhost:3008/docs`
- OpenAPI JSON：`http://localhost:3000/docs-json`

## 环境配置

项目支持三套环境，每套对应独立的 env 和 docker-compose 文件：

| 环境 | Env 文件 | Docker Compose | 说明 |
|---|---|---|---|
| 开发 | `.env.development` | `docker-compose.development.yaml` | 基础设施在 Docker，API 本地运行 |
| 预览 | `.env.preview` | `docker-compose.preview.yaml` | 全部服务在 Docker，含种子数据 |
| 生产 | `.env.production` | `docker-compose.production.yaml` | 全部服务在 Docker，生产配置 |

```bash
# 预览环境：详见 docs/preview-guide.md（启动 → 种子数据导入完整流程）
docker compose --env-file .env.preview -f docker-compose.preview.yaml up -d --build

# 生产环境
docker compose --env-file .env.production -f docker-compose.production.yaml up -d --build
```

首次使用前，复制 `env-example-relational` 为对应环境文件并填写配置。

## 上游模板同步

本项目基于 [brocoders/nestjs-boilerplate](https://github.com/brocoders/nestjs-boilerplate) 模板开发，以独立仓库方式维护。如需参考上游更新，可添加 upstream remote：

```bash
# 添加上游仓库（仅需执行一次）
git remote add upstream https://github.com/brocoders/nestjs-boilerplate.git

# 查看上游最新变更
git fetch upstream

# 查看差异
git log HEAD..upstream/main --oneline

# 选择性合并某个提交
git cherry-pick <commit-hash>
```

## 文档结构

```
docs/
├── readme.md                          # 文档索引
├── getting-started.md                 # 快速开始
├── architecture.md                    # 项目架构
├── database.md                        # 数据库
├── auth.md                            # 认证
├── frontend-guide.md                  # 前端对接指南
├── preview-guide.md                   # Preview 环境部署指南
├── sync-guide.md                      # Boulevard 数据同步
├── frontend-type-generation.md        # 前端类型生成
└── vendor/                            # 原模板文档

boulevard/
└── SCHEMA_REFERENCE.md                # Boulevard Schema 参考

scripts/import/
└── README.md                          # 数据导入脚本
```
