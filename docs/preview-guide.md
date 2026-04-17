# Preview 环境部署指南

## 前置条件

- Docker & Docker Compose 已安装
- 项目根目录下存在 `.env.preview` 文件
- 项目根目录下存在 `docker-compose.preview.yaml` 文件

## 第一步：启动所有服务

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml up -d --build
```

说明：构建并启动 3 个容器 — PostgreSQL、MailDev、API。首次运行需要构建镜像，耗时较长。

| 容器     | 端口             | 说明                                          |
| -------- | ---------------- | --------------------------------------------- |
| postgres | `localhost:5433` | 数据库（映射到主机 5433，避免与开发环境冲突） |
| maildev  | `localhost:1080` | 邮件测试                                      |
| api      | `localhost:3008` | API 服务                                      |

## 第二步：等待 API 启动完成

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml logs -f api
```

看到 `Nest application successfully started` 表示启动成功，按 `Ctrl+C` 退出日志。

说明：API 启动时会自动执行迁移（`migration:run`）和种子（`seed:run:relational`），创建基础角色、状态和管理员用户。

## 第三步：验证基础服务

```bash
# 检查容器状态
docker compose --env-file .env.preview -f docker-compose.preview.yaml ps

# 验证数据库连接
docker compose --env-file .env.preview -f docker-compose.preview.yaml exec postgres psql -U root -d api -c "SELECT 1;"
```

说明：三个容器都应该是 `Up` 状态。

## 第四步：导入 Boulevard 种子数据

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml exec api npx ts-node -r tsconfig-paths/register src/database/seeds/relational/run-seed.ts
```

说明：从 JSON 文件导入 8 张 Boulevard 业务表的数据（business、location、staff_role、staff、service_category、service、client、appointment）。种子服务会检查 `count() === 0`，只有空表才会插入，支持重复执行。

## 第五步：验证数据

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml exec postgres psql -U root -d api -c "
SELECT 'business' as tbl, COUNT(*) FROM business
UNION ALL SELECT 'location', COUNT(*) FROM location
UNION ALL SELECT 'service_category', COUNT(*) FROM service_category
UNION ALL SELECT 'service', COUNT(*) FROM service
UNION ALL SELECT 'staff_role', COUNT(*) FROM staff_role
UNION ALL SELECT 'staff', COUNT(*) FROM staff
UNION ALL SELECT 'client', COUNT(*) FROM client
UNION ALL SELECT 'appointment', COUNT(*) FROM appointment;
"
```

预期结果：

| 表               | count |
| ---------------- | ----- |
| business         | 1     |
| location         | 1     |
| service_category | 51    |
| service          | 253   |
| staff_role       | 3     |
| staff            | 10    |
| client           | 123   |
| appointment      | 571   |

## 常用操作

### 清空 Boulevard 数据（重新导入前执行）

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml exec postgres psql -U root -d api -c \
  "TRUNCATE TABLE appointment, client, service, service_category, staff, staff_role, location, business RESTART IDENTITY CASCADE;"
```

### 重建 API 容器（代码变更后）

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml up -d --build api
```

### 停止所有服务

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml down
```

### 完全清除（包括数据库卷）

```bash
docker compose --env-file .env.preview -f docker-compose.preview.yaml down -v
```

## 完整流程速查

```bash
# 1. 启动
docker compose --env-file .env.preview -f docker-compose.preview.yaml up -d --build

# 2. 等待 API 就绪（看到 "Nest application successfully started"）
docker compose --env-file .env.preview -f docker-compose.preview.yaml logs -f api

# 3. 导入种子
docker compose --env-file .env.preview -f docker-compose.preview.yaml exec api npx ts-node -r tsconfig-paths/register src/database/seeds/relational/run-seed.ts

# 4. 验证
docker compose --env-file .env.preview -f docker-compose.preview.yaml exec postgres psql -U root -d api -c "SELECT 'business' as tbl, COUNT(*) FROM business UNION ALL SELECT 'location', COUNT(*) FROM location UNION ALL SELECT 'service_category', COUNT(*) FROM service_category UNION ALL SELECT 'service', COUNT(*) FROM service UNION ALL SELECT 'staff_role', COUNT(*) FROM staff_role UNION ALL SELECT 'staff', COUNT(*) FROM staff UNION ALL SELECT 'client', COUNT(*) FROM client UNION ALL SELECT 'appointment', COUNT(*) FROM appointment;"
```
