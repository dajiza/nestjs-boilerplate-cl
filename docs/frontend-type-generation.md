# Frontend TypeScript Type Generation

基于后端 Swagger/OpenAPI 规范，自动生成前端 TypeScript 类型定义。

## 前置条件

- 后端服务已启动（默认 `http://localhost:3000`）
- Swagger 端点可用：`http://localhost:3000/docs`
- OpenAPI JSON 可用：`http://localhost:3000/docs-json`

## 方案一：openapi-typescript（推荐）

生成纯类型文件，零运行时依赖。

### 安装

```bash
npm install -D openapi-typescript
```

### 生成类型

```bash
# 从后端 URL 直接生成
npx openapi-typescript http://localhost:3000/docs-json -o src/types/api.d.ts
```

### 配合 npm script 自动化

```json
{
  "scripts": {
    "generate-types": "openapi-typescript http://localhost:3000/docs-json -o src/types/api.d.ts"
  }
}
```

后端 DTO 改动后，前端运行 `npm run generate-types` 即可同步类型。

### 在代码中使用

```typescript
import type { paths, components } from "./types/api";

// 使用生成的请求路径类型
type GetClientsResponse = paths["/api/v1/clients"]["get"]["responses"]["200"]["content"]["application/json"];

// 使用生成的 Schema 类型
type Client = components["schemas"]["Client"];
```

---

## 方案二：openapi-typescript + openapi-fetch

在方案一基础上，加上类型安全的 HTTP 客户端。

### 安装

```bash
npm install openapi-fetch
npm install -D openapi-typescript
```

### 使用

```typescript
import createClient from "openapi-fetch";
import type { paths } from "./types/api";

const client = createClient<paths>({ baseUrl: "http://localhost:3000" });

// GET — 自动补全路径、参数、响应类型
const { data, error } = await client.GET("/api/v1/clients");

// POST — 请求体也有类型校验
const { data: newClient } = await client.POST("/api/v1/clients", {
  body: { name: "test" },
});
```

### 带认证

```typescript
const client = createClient<paths>({
  baseUrl: "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 方案三：openapi-generator

生成完整的 SDK（包含类、方法、模型），适合大型项目。

### 安装

需要 Java 运行环境和 npm 包：

```bash
npm install -D @openapitools/openapi-generator-cli
```

### 生成

```bash
# 先导出 OpenAPI JSON
curl http://localhost:3000/docs-json > openapi.json

# 生成 TypeScript Axios 客户端
npx openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o src/api/generated \
  --additional-properties=supportsES6=true,withInterfaces=true
```

### 使用

```typescript
import { ClientsApi, Configuration } from "./api/generated";

const config = new Configuration({
  basePath: "http://localhost:3000",
  accessToken: token,
});

const clientsApi = new ClientsApi(config);
const clients = await clientsApi.getClients();
```

---

## 方案对比

| 方案 | 生成内容 | 运行时依赖 | 适合场景 |
|------|---------|-----------|---------|
| openapi-typescript | 纯类型（.d.ts） | 无 | 只需要类型，有自己的请求封装 |
| openapi-typescript + openapi-fetch | 类型 + 轻量 fetch 客户端 | openapi-fetch（~3KB） | 需要类型安全的请求，追求轻量 |
| openapi-generator | 完整 SDK（类、方法、模型） | axios 等依赖 | 大型项目，需要完整 SDK |

## 常见问题

### 后端没启动时怎么生成？

先导出 OpenAPI JSON 文件保存到项目中，从本地文件生成：

```bash
# 一次性导出（后端启动时执行）
curl http://localhost:3000/docs-json > docs/openapi.json

# 从本地文件生成（不需要后端运行）
npx openapi-typescript docs/openapi.json -o src/types/api.d.ts
```

### 生成类型不全？

检查后端 DTO 是否都有 `@ApiProperty` 装饰器：

```typescript
// 确保每个字段都有装饰器
export class ClientDto {
  @ApiProperty()
  name!: string;
}
```

---

Previous: [Documentation Index](../readme.md)
