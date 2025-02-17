import { NextResponse } from 'next/server'

const AUTODETECT_URL = 'https://prod-autodetect.outlookmobile.com/detect'

interface ProtocolConfig {
  host: string
  port: number
  secure: boolean
  username: string
}

interface EmailConfig {
  imap: ProtocolConfig | null
  smtp: ProtocolConfig | null
  pop3: ProtocolConfig | null
  ews: ProtocolConfig | null
  eas: ProtocolConfig | null
}

interface AutoDetectResponse {
  protocols?: Array<{
    protocol: string
    hostname: string
    port: number
    encryption: string
    username: string
  }>
  error?: string
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 })
    }

    // 调用自动检测服务
    const queryParams = new URLSearchParams({
      services: 'office365,outlook,google,icloud,yahoo,yahoo.co.jp',
      protocols: 'all',
      timeout: '30',
    })

    const response = await fetch(`${AUTODETECT_URL}?${queryParams}`, {
      headers: {
        Accept: '*/*',
        'x-email': email,
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    }).catch(() => {
      throw new Error('网络连接失败，请检查您的网络')
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('未找到该邮箱的配置信息')
      }
      if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后再试')
      }
      throw new Error(`服务器响应错误 (${response.status})`)
    }

    const originalData = await response.json().catch(() => {
      throw new Error('解析服务器响应失败')
    })

    if (originalData.error) {
      throw new Error(originalData.error)
    }

    // 转换响应格式
    const config: EmailConfig = {
      imap: null,
      smtp: null,
      pop3: null,
      ews: null,
      eas: null,
    }

    // 处理返回的协议配置
    if (
      !originalData.protocols ||
      !Array.isArray(originalData.protocols) ||
      originalData.protocols.length === 0
    ) {
      throw new Error('未找到该邮箱的配置信息')
    }

    originalData.protocols.forEach((protocol: any) => {
      const protocolConfig: ProtocolConfig = {
        host: protocol.hostname,
        port: protocol.port,
        secure: protocol.encryption === 'ssl',
        username: protocol.username,
      }

      switch (protocol.protocol.toLowerCase()) {
        case 'imap':
          config.imap = protocolConfig
          break
        case 'smtp':
          config.smtp = protocolConfig
          break
        case 'pop3':
          config.pop3 = protocolConfig
          break
        case 'ews':
          config.ews = protocolConfig
          break
        case 'eas':
          config.eas = protocolConfig
          break
      }
    })

    // 确保至少有一个协议配置
    if (
      !config.imap &&
      !config.smtp &&
      !config.pop3 &&
      !config.ews &&
      !config.eas
    ) {
      throw new Error('未找到支持的邮箱协议配置')
    }

    // 返回原始数据和处理后的配置
    return NextResponse.json({
      original: originalData,
      formatted: config,
    })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : '获取邮箱配置失败'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
