# 认证

## 认证方式

| 方式 | 端点 | 说明 |
|------|------|------|
| 邮箱密码 | `POST /api/v1/auth/email/login` | 返回 accessToken + refreshToken |
| 邮箱注册 | `POST /api/v1/auth/email/register` | 发送确认邮件 |
| Facebook | 社交登录流程 | 通过 Facebook ID 验证 |
| Google | 社交登录流程 | 通过 Google ID 验证 |
| Apple | 社交登录流程 | 通过 Apple ID 验证 |

## JWT 机制

使用双 Token 方案：

| Token | 有效期 | 用途 |
|-------|--------|------|
| Access Token | 24h | API 请求认证，放在 `Authorization: Bearer <token>` |
| Refresh Token | 3650d | 刷新 Access Token，支持多设备会话 |

### Token 流程

```
登录 → 返回 accessToken + refreshToken
         ↓
请求 API 时带 accessToken
         ↓
accessToken 过期 → 用 refreshToken 调用 /api/v1/auth/refresh
         ↓
返回新的 accessToken + refreshToken（轮转）
```

### 会话管理

每次登录创建一条 Session 记录，支持多设备：
- 刷新 Token 时更新 Session hash
- 登出时删除对应 Session

## 主要 API

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `auth/email/login` | 无 | 登录 |
| POST | `auth/email/register` | 无 | 注册 |
| POST | `auth/email/confirm` | 无 | 确认邮箱 |
| POST | `auth/forgot/password` | 无 | 忘记密码（发邮件） |
| POST | `auth/reset/password` | 无 | 重置密码 |
| GET | `auth/me` | JWT | 获取当前用户 |
| POST | `auth/refresh` | Refresh JWT | 刷新 Token |
| POST | `auth/logout` | JWT | 登出（删除会话） |
| PATCH | `auth/me` | JWT | 更新资料 |
| DELETE | `auth/me` | JWT | 注销账户（软删除） |

## 角色

| 角色 | 值 | 权限 |
|------|-----|------|
| admin | 1 | 全部权限 |
| user | 2 | 普通用户权限 |
