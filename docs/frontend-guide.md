# 前端对接指南

## Swagger 文档

后端提供完整的 Swagger UI：

- **Swagger UI：** `http://localhost:3008/docs`
- **OpenAPI JSON：** `http://localhost:3008/docs-json`

前端开发者可直接通过 Swagger 了解所有接口的参数、返回值和示例。

## TypeScript 类型生成

从 Swagger 自动生成前端类型定义，详见 [前端类型生成](integrations/frontend-type-generation.md)。

快速使用：

```bash
# 安装
npm install -D openapi-typescript

# 生成类型
npx openapi-typescript http://localhost:3008/docs-json -o src/types/api.d.ts
```

## 国际化

接口通过请求头切换语言：

```
x-custom-lang: en   # 英文（默认）
x-custom-lang: zh   # 中文
```

## 认证

所有需要认证的接口，在请求头中携带：

```
Authorization: Bearer <accessToken>
```

## 文件上传

上传文件使用 `multipart/form-data`：

```bash
curl -X POST http://localhost:3008/api/v1/files/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/file.jpg"
```
