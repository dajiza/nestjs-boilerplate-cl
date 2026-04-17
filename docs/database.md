# 数据库

## 配置

使用 PostgreSQL + TypeORM，通过环境变量配置连接：

```env
DATABASE_URL=postgresql://root:secret@localhost:5432/api
# 或分别配置
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=root
DATABASE_PASSWORD=secret
DATABASE_NAME=api
```

连接池最大连接数：`DATABASE_MAX_CONNECTIONS`（默认 100）

## 迁移

```bash
# 修改 entity 后，自动生成迁移文件
npm run migration:generate -- src/database/migrations/MigrationName

# 创建空迁移文件（手动写 SQL）
npm run migration:create -- src/database/migrations/MigrationName

# 执行迁移
npm run migration:run

# 回滚上一次迁移
npm run migration:revert

# 删除所有表（危险）
npm run schema:drop
```

**注意：** 生产环境 `DATABASE_SYNCHRONIZE` 必须为 `false`，通过迁移管理表结构。

## 种子数据

```bash
npm run seed:run:relational
```

种子数据创建：
- 管理员账户（admin@example.com）
- 测试用户（user@example.com）
- 角色和状态枚举

## 已同步的 Boulevard 表

以下 10 张表的字段与 Boulevard API 对齐，禁止随意修改字段名和类型：

| 表名 | 说明 |
|------|------|
| `business` | 商户信息 |
| `location` | 门店位置 |
| `service_category` | 服务分类 |
| `service` | 服务项目 |
| `staff` | 员工 |
| `staff_role` | 员工角色 |
| `client` | 客户 |
| `appointment` | 预约 |
| `shift` | 班次 |
| `timeblock` | 时间块 |

修改这些表的 entity 时，必须参照 `boulevard/SCHEMA_REFERENCE.md` 和 `boulevard/schema.json`。
