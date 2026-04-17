# 项目架构

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | NestJS 11 |
| ORM | TypeORM 0.3 |
| 数据库 | PostgreSQL 17 |
| 认证 | Passport + JWT |
| 文档 | Swagger / OpenAPI |
| 文件存储 | 本地 / AWS S3 |
| 国际化 | nestjs-i18n |
| 邮件 | Nodemailer |

## 目录结构

```
src/
├── app.module.ts              # 根模块，注册所有子模块
├── main.ts                    # 入口，配置 Swagger、CORS、全局管道
│
├── config/                    # 环境变量配置定义
│   └── config.type.ts         # AllConfigType（app/auth/database/file/mail）
│
├── database/                  # 数据库
│   ├── data-source.ts         # TypeORM DataSource（CLI 用）
│   ├── typeorm-config.service.ts
│   ├── migrations/            # 迁移文件
│   └── seeds/                 # 种子数据
│
├── auth/                      # 认证模块
├── users/                     # 用户管理
├── session/                   # JWT 会话管理
├── roles/                     # 角色枚举（admin/user）
├── statuses/                  # 状态枚举（active/inactive）
│
├── clients/                   # 客户
├── staff/                     # 员工
├── staff-roles/               # 员工角色
├── services/                  # 服务项目
├── service-categories/        # 服务分类
├── appointments/              # 预约
├── locations/                 # 门店
├── business/                  # 商户
├── rooms/                     # 房间
├── equipment/                 # 设备
├── shifts/                    # 班次
├── timeblocks/                # 时间块
├── availability/              # 可用时间
├── booking/                   # 预订系统
│
├── boulevard/                 # Boulevard API 集成
├── sync/                      # 数据同步
├── webhooks/                  # Webhook 处理
│
├── files/                     # 文件上传
├── mail/ / mailer/            # 邮件服务
├── i18n/                      # 翻译文件
├── social/                    # 社交登录接口
├── tts/                       # 文字转语音
│
├── home/                      # 健康检查端点
└── utils/                     # 工具函数
```

## 模块结构（六边形架构）

每个业务模块遵循统一结构：

```
src/<module>/
├── domain/                        # 领域层
│   └── <entity>.ts                # 领域模型（纯 TS 类）
├── dto/                           # 数据传输对象
│   ├── create-<entity>.dto.ts     # 创建请求
│   ├── query-<entity>.dto.ts      # 查询参数
│   └── <entity>.dto.ts            # 响应
├── infrastructure/
│   └── persistence/
│       ├── <entity>.repository.ts     # 仓储接口（端口）
│       └── relational/
│           ├── entities/
│           │   └── <entity>.entity.ts # TypeORM 实体
│           ├── mappers/
│           │   └── <entity>.mapper.ts # 领域模型 ↔ 实体映射
│           └── repositories/
│               └── <entity>.repository.ts  # 仓储实现（适配器）
├── <module>.module.ts             # NestJS 模块
├── <module>.service.ts            # 业务逻辑
└── <module>.controller.ts         # API 端点
```

**核心原则：**
- `domain/` 不依赖任何框架
- `infrastructure/` 实现领域层定义的接口
- Controller 通过 Service 操作 Repository 接口，不直接接触 ORM 实体

## API 路由

所有接口遵循格式：`/api/v1/<module>/<action>`

示例：
- `GET /api/v1/clients` — 获取客户列表
- `POST /api/v1/auth/email/login` — 邮箱登录
- `GET /api/v1/appointments` — 获取预约列表

## 配置体系

通过 `@nestjs/config` 管理，分为 5 个命名空间：

| 命名空间 | 前缀 | 涵盖内容 |
|----------|------|----------|
| `app` | `APP_` | 端口、名称、语言、API 前缀 |
| `auth` | `AUTH_` | JWT 密钥、过期时间、社交登录 |
| `database` | `DATABASE_` | 连接信息、连接池、SSL |
| `file` | `FILE_` | 存储驱动、S3 配置 |
| `mail` | `MAIL_` | 邮件服务器、发件人 |
