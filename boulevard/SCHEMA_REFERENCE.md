# Boulevard Schema

> **禁止修改 `schema.json` 文件**
>
> 该文件是 Boulevard GraphQL API 的 introspection 结果，作为字段定义的唯一数据源。
>
> 新增同步数据表格时，entity 字段名、类型、可空性必须严格按照 `schema.json` 中对应 type 的定义来创建。

## 已同步的 10 个 Type

| Type | schema.json 中的 type name |
|------|---------------------------|
| business | `Business` |
| location | `Location` |
| service_category | `ServiceCategory` |
| service | `Service` |
| staff | `Staff` |
| staff_role | `StaffRole` |
| client | `Client` |
| appointment | `Appointment` |
| shift | `Shift` |
| timeblock | `Timeblock` |
