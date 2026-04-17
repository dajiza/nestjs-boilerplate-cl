# Boulevard 数据同步

## 如何调用

### 全量同步

```bash
# 同步所有数据
curl -X POST http://localhost:3008/api/v1/sync/all

# 单独同步某个实体
curl -X POST http://localhost:3008/api/v1/sync/business
curl -X POST http://localhost:3008/api/v1/sync/locations
curl -X POST http://localhost:3008/api/v1/sync/service-categories
curl -X POST http://localhost:3008/api/v1/sync/services
curl -X POST http://localhost:3008/api/v1/sync/staff
curl -X POST http://localhost:3008/api/v1/sync/staff-roles
curl -X POST http://localhost:3008/api/v1/sync/clients
curl -X POST http://localhost:3008/api/v1/sync/appointments
curl -X POST http://localhost:3008/api/v1/sync/shifts
curl -X POST http://localhost:3008/api/v1/sync/timeblocks
```

### 增量同步

```bash
# 增量同步所有表
curl -X POST http://localhost:3008/api/v1/sync/incremental

# 增量同步单个表
curl -X POST http://localhost:3008/api/v1/sync/incremental/business
curl -X POST http://localhost:3008/api/v1/sync/incremental/locations
curl -X POST http://localhost:3008/api/v1/sync/incremental/service-categories
curl -X POST http://localhost:3008/api/v1/sync/incremental/services
curl -X POST http://localhost:3008/api/v1/sync/incremental/staff
curl -X POST http://localhost:3008/api/v1/sync/incremental/staff-roles
curl -X POST http://localhost:3008/api/v1/sync/incremental/clients
curl -X POST http://localhost:3008/api/v1/sync/incremental/appointments
curl -X POST http://localhost:3008/api/v1/sync/incremental/shifts
curl -X POST http://localhost:3008/api/v1/sync/incremental/timeblocks
```

---

## 全量同步 `/sync/all`

每次都写入所有数据，不进行对比。

**同步顺序**: business → locations → serviceCategories → services → staff → staffRoles → clients → appointments → shifts → timeblocks

**返回结果**:
```json
[
  { "entity": "business", "created": 1, "updated": 0, "failed": 0, "errors": [] },
  { "entity": "locations", "created": 1, "updated": 0, "failed": 0, "errors": [] },
  { "entity": "staff", "created": 10, "updated": 0, "failed": 0, "errors": [] }
]
```

---

## 增量同步 `/sync/incremental`

对比本地数据，只处理有变化的记录。

**主要逻辑**:
1. 从 Boulevard 获取所有记录
2. 逐条查询本地数据库
3. 对比字段是否有变化
4. 创建/更新/跳过

**返回结果**:
```json
[
  { "entity": "business", "fetched": 1, "created": 0, "updated": 0, "skipped": 1, "failed": 0, "errors": [] },
  { "entity": "locations", "fetched": 1, "created": 0, "updated": 0, "skipped": 1, "failed": 0, "errors": [] },
  { "entity": "staff", "fetched": 10, "created": 0, "updated": 2, "skipped": 8, "failed": 0, "errors": [] }
]
```

---

## 对比

| 特性 | 全量同步 | 增量同步 |
|------|---------|---------|
| 写入方式 | 直接写入 | 先对比再写入 |
| 性能 | 较慢 | 较快 |
| 适用场景 | 首次同步、数据修复 | 日常定时同步 |

---

## 代码位置

- `src/sync/sync.service.ts` - 全量同步
- `src/sync/sync-incremental.service.ts` - 增量同步
- `src/sync/sync.controller.ts` - API 控制器
