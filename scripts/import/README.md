# Boulevard 数据导入脚本

从 Boulevard API 导出数据并导入到本地数据库的脚本集合。

## 目录结构

```
scripts/import/
├── README.md           # 本文档
├── clients/            # Client 数据导入
│   └── import.ts
├── staff/              # Staff 数据导入
│   └── import.ts
├── appointments/       # Appointment 数据导入
│   └── import.ts
├── locations/          # Location 数据导入 (待创建)
└── ...                 # 其他表
```

## 前置条件

1. 确保 `.env` 文件中配置了正确的数据库连接信息
2. 确保已运行数据库迁移，表结构已创建

## 使用方法

### 1. 从 Boulevard 获取数据

在浏览器开发者工具中，从 GraphQL API 响应中复制数据，保存为 JSON 文件。

数据格式示例（GraphQL 分页格式）：

```json
[
  {
    "node": {
      "id": "urn:blvd:Client:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "active": true,
      "createdAt": "2025-01-01T00:00:00.000000Z",
      "updatedAt": "2025-01-01T00:00:00.000000Z",
      "email": "user@example.com",
      "mobilePhone": "+1234567890",
      "name": "John Doe"
    }
  }
]
```

### 2. 运行导入脚本

```bash
# Client 导入
npx ts-node -r tsconfig-paths/register scripts/import/clients/import.ts /path/to/clients.json

# Staff 导入
npx ts-node -r tsconfig-paths/register scripts/import/staff/import.ts /path/to/staff.json

# Appointment 导入
npx ts-node -r tsconfig-paths/register scripts/import/appointments/import.ts /path/to/appointments.json

# Location 导入 (示例)
npx ts-node -r tsconfig-paths/register scripts/import/locations/import.ts /path/to/locations.json
```

### 3. 查看导入结果

```
========================================
Import completed!
========================================
  Imported: 100
  Skipped (already exists): 5
  Failed: 0
========================================
```

## 添加新的导入脚本

1. 在 `scripts/import/` 下创建新的目录，如 `appointments/`
2. 复制 `clients/import.ts` 作为模板
3. 修改实体导入路径和数据映射逻辑
4. 在 `package.json` 中添加新的 npm script

### 示例：添加 Appointment 导入

```bash
mkdir -p scripts/import/appointments
cp scripts/import/clients/import.ts scripts/import/appointments/import.ts
```

然后修改 `scripts/import/appointments/import.ts`：
- 修改接口定义 `BoulevardAppointment`
- 修改实体导入路径
- 修改字段映射

## 通用导入命令

所有导入脚本都使用相同的命令格式：

```bash
npx ts-node -r tsconfig-paths/register scripts/import/<表名>/import.ts <json文件路径>
```

## 注意事项

1. **重复数据**: 脚本会检查 ID 是否已存在，已存在的记录会被跳过
2. **必填字段**: 某些字段如果没有值，会设置默认值
3. **数据类型转换**: ISO 日期字符串会自动转换为 Date 对象
4. **错误处理**: 单条记录导入失败不会影响其他记录

## 故障排查

### 数据库连接失败

检查 `.env` 文件中的数据库配置：

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nestjs
```

### 找不到实体

确保已运行数据库迁移：

```bash
npm run migration:run
```

### JSON 格式错误

确保 JSON 文件格式正确，可以使用在线工具验证 JSON 有效性。
