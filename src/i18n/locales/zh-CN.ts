export default {
  title: '添加邮箱账号',
  subtitle: '输入您的邮箱地址',
  description:
    '支持 Microsoft 365、Outlook.com、Exchange、Google、iCloud、Yahoo 等邮箱的 IMAP、SMTP、POP3 配置查询',
  inputPlaceholder: '请输入邮箱地址',
  loading: '正在查询配置...',
  protocols: {
    imap: 'IMAP 配置',
    smtp: 'SMTP 配置',
    pop3: 'POP3 配置',
    ews: 'Exchange Web Services (EWS) 配置',
    eas: 'Exchange ActiveSync (EAS) 配置',
  },
  fields: {
    host: '服务器地址',
    port: '端口',
    secure: '安全连接',
    username: '用户名',
    encryption: '连接方式',
    authentication: '认证方式',
  },
  boolean: {
    true: '是',
    false: '否',
  },
  rawResponse: '原始响应数据',
  errors: {
    invalidEmail: '邮箱格式不正确',
    networkError: '网络连接失败，请检查您的网络',
    notFound: '未找到该邮箱的配置信息',
    tooManyRequests: '请求过于频繁，请稍后再试',
    serverError: '服务器响应错误',
    parseError: '解析服务器响应失败',
    noProtocols: '未找到支持的邮箱协议配置',
  },
  encryption: {
    ssl: 'SSL/TLS',
    starttls: 'STARTTLS',
    none: '无加密',
  },
  authentication: {
    secure: '安全认证',
    insecure: '普通认证',
  },
}
