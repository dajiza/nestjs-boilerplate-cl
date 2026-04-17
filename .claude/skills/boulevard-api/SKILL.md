---
name: boulevard-api
description: Boulevard API domain knowledge - schema gotchas, field behaviors, and integration patterns
userInvocable: true
---

# @boulevard-api (API Domain Knowledge)

## Schema Reference

- Schema file: `boulevard/schema.json` (GraphQL introspection, **禁止修改**)
- Schema doc: `boulevard/SCHEMA_REFERENCE.md`

## Synced Types (10)

`Business`, `Location`, `ServiceCategory`, `Service`, `Staff`, `StaffRole`, `Client`, `Appointment`, `Shift`, `Timeblock`

## Field Gotchas

### `keys` - customFields 的过滤参数，不是独立字段

`keys` 出现在 `Appointment`, `Business`, `Client`, `Service` 四个 Type 上，但它 **不是独立数据字段**，而是 `customFields` 的查询参数（argument）。

```graphql
# 正确用法：keys 作为 customFields 的过滤参数（必传）
customFields(keys: ["loyalty_tier", "preferred_stylist"]) {
  ... on NativeFieldTextValue { key textValue }
  ... on NativeFieldBooleanValue { key booleanValue }
}

# 错误用法：keys 不是 Type 的字段，不能独立查询
{
  customFields { ... }
  keys            # ← API 返回 "Cannot query field "keys" on type "Business"."
}
```

### `custom` - 按 key 单个读取自定义字段值

`custom` 类型是 `NativeObjectMeta`，每个子字段都需要传 `key: String!` 参数。

```graphql
# 正确用法：每个子字段都要传 key 参数
custom {
  textValue(key: "loyalty_tier")
  booleanValue(key: "some_flag")
}

# 错误用法：key/stringValue/numericValue 不是子字段
custom {
  key               # ← 不存在
  stringValue       # ← 不存在，应为 textValue
  numericValue      # ← 不存在，应为 integerValue / floatValue
}
```

`NativeObjectMeta` 的子字段：`textValue`, `booleanValue`, `integerValue`, `floatValue`, `datetimeValue`, `selectValue`, `multiselectValues`

### `customFields` - 批量读取自定义字段

`customFields` 返回 `[NativeFieldValue!]!` 接口类型，`keys` 参数是**必传的** `[String!]!`。

```graphql
# 正确用法：必须传 keys 参数 + 使用 inline fragments
customFields(keys: ["field1", "field2"]) {
  ... on NativeFieldTextValue { key textValue }
  ... on NativeFieldBooleanValue { key booleanValue }
  ... on NativeFieldIntegerValue { key integerValue }
  ... on NativeFieldFloatValue { key floatValue }
  ... on NativeFieldDatetimeValue { key datetimeValue }
}
```

`NativeFieldValue` 的具体类型都只有两个字段：`key` 和对应的值字段。

### 实际 API 验证结果（sandbox 环境）

| 查询写法 | 结果 |
|---|---|
| `keys`（独立字段） | `"Cannot query field "keys" on type "Business".` |
| `custom { key stringValue }` | `"Cannot query field "key" on type "NativeObjectMeta".` |
| `customFields { id name value }` | `"Cannot query field "id" on type "NativeFieldValue".` |
| `customFields(keys: [])` + inline fragments | 成功，返回 `[]` |
| `custom { textValue(key: "x") }` | 成功，key 不存在时返回 null + error |

## Authentication

使用 HMAC-SHA256 签名认证：
- Prefix: `blvd-admin-v1`
- Token = `HMAC-SHA256(secretKey, prefix + businessId + timestamp) + prefix + businessId + timestamp`
- Authorization: `Basic base64(apiKey:token)`

## Sync Architecture

- 全量同步: `src/sync/sync.service.ts` - `syncAll()`
- 增量同步: `src/sync/sync-incremental.service.ts` - `incrementalSyncAll()`
- Webhook 处理: `src/webhooks/handlers/appointment.handler.ts`

同步顺序（按依赖关系）：
1. Business → 2. Locations → 3. ServiceCategories → 4. Services → 5. Staff → 6. StaffRoles → 7. Clients → 8. Appointments → 9. Shifts → 10. Timeblocks

## Related Skills

- `@queryBoulevard` - API integration codebase
- `@nestjs-boilerplate` - Backend project containing sync code and entities
