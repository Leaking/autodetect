'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLocale } from '@/i18n/context'
import { LanguageSwitch } from '@/components/LanguageSwitch'

interface ProtocolConfig {
  host: string
  port: number
  secure: boolean
  username: string
  encryption: string
  insecure?: boolean
}

interface DetailedEmailConfig {
  imap: ProtocolConfig | null
  smtp: ProtocolConfig | null
  pop3: ProtocolConfig | null
  ews: ProtocolConfig | null
  eas: ProtocolConfig | null
}

const EmailProviderIcons = () => (
  <div className="flex justify-center gap-6 mb-12">
    <div className="w-10 h-10">
      <Image
        src="/icons/office.svg"
        alt="Microsoft Office"
        width={40}
        height={40}
        priority
      />
    </div>
    <div className="w-10 h-10">
      <Image
        src="/icons/outlook.svg"
        alt="Microsoft Outlook"
        width={40}
        height={40}
        priority
      />
    </div>
    <div className="w-10 h-10">
      <Image
        src="/icons/exchange.svg"
        alt="Microsoft Exchange"
        width={40}
        height={40}
        priority
      />
    </div>
    <div className="w-10 h-10">
      <Image
        src="/icons/gmail.svg"
        alt="Gmail"
        width={40}
        height={40}
        priority
      />
    </div>
    <div className="w-10 h-10">
      <Image
        src="/icons/icloud.svg"
        alt="iCloud"
        width={40}
        height={40}
        priority
      />
    </div>
    <div className="w-10 h-10">
      <Image
        src="/icons/yahoo.svg"
        alt="Yahoo"
        width={40}
        height={40}
        priority
      />
    </div>
  </div>
)

function getEncryptionType(protocol: ProtocolConfig) {
  if (protocol.encryption === 'ssl') return 'ssl'
  if (protocol.encryption === 'starttls') return 'starttls'
  return 'none'
}

function ProtocolConfig({
  config,
  title,
  t,
}: {
  config: ProtocolConfig
  title: string
  t: any
}) {
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <dl className="grid grid-cols-2 gap-4">
        <dt className="font-medium">{t.fields.host}:</dt>
        <dd>{config.host}</dd>
        <dt className="font-medium">{t.fields.port}:</dt>
        <dd>{config.port}</dd>
        <dt className="font-medium">{t.fields.encryption}:</dt>
        <dd>{t.encryption[getEncryptionType(config)]}</dd>
        <dt className="font-medium">{t.fields.authentication}:</dt>
        <dd>
          {config.insecure
            ? t.authentication.insecure
            : t.authentication.secure}
        </dd>
        <dt className="font-medium">{t.fields.username}:</dt>
        <dd>{config.username}</dd>
      </dl>
    </div>
  )
}

export default function Home() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [config, setConfig] = useState<DetailedEmailConfig | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rawResponse, setRawResponse] = useState<string>('')

  // 使用防抖进行自动查询
  useEffect(() => {
    if (!email) {
      setConfig(null)
      setRawResponse('')
      return
    }

    const timer = setTimeout(async () => {
      try {
        setError('')
        setLoading(true)
        setRawResponse('')

        const response = await fetch('/api/email-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()

        // 保存原始响应
        setRawResponse(JSON.stringify(data.original, null, 2))

        if (!response.ok) {
          throw new Error(data.error)
        }

        setConfig(data.formatted)
      } catch (err) {
        setError(err instanceof Error ? err.message : '查询失败')
      } finally {
        setLoading(false)
      }
    }, 500) // 500ms 的防抖延迟

    return () => clearTimeout(timer)
  }, [email])

  return (
    <div className="min-h-screen p-8">
      <LanguageSwitch />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <EmailProviderIcons />
          <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
          <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t.subtitle}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-500 max-w-lg mx-auto">
            {t.description}
          </p>
        </div>

        <div className="mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
          />
        </div>

        {loading && (
          <div className="text-center text-gray-500">{t.loading}</div>
        )}

        {error && (
          <div className="p-4 mb-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {config && (
          <div className="space-y-6">
            {config.imap && (
              <ProtocolConfig
                config={config.imap}
                title={t.protocols.imap}
                t={t}
              />
            )}

            {config.smtp && (
              <ProtocolConfig
                config={config.smtp}
                title={t.protocols.smtp}
                t={t}
              />
            )}

            {config.pop3 && (
              <ProtocolConfig
                config={config.pop3}
                title={t.protocols.pop3}
                t={t}
              />
            )}

            {config.ews && (
              <ProtocolConfig
                config={config.ews}
                title={t.protocols.ews}
                t={t}
              />
            )}

            {config.eas && (
              <ProtocolConfig
                config={config.eas}
                title={t.protocols.eas}
                t={t}
              />
            )}

            {/* 显示原始响应 */}
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">{t.rawResponse}</h2>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                {rawResponse}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
