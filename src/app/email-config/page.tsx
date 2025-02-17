'use client'

import { useState } from 'react'

interface EmailConfig {
  imap: {
    host: string
    port: number
    secure: boolean
  }
  smtp: {
    host: string
    port: number
    secure: boolean
  }
}

export default function EmailConfigPage() {
  const [email, setEmail] = useState('')
  const [config, setConfig] = useState<EmailConfig | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setConfig(null)
    setLoading(true)

    try {
      const response = await fetch('/api/email-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">邮箱配置查询</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
              {loading ? '查询中...' : '查询'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {config && (
          <div className="space-y-6">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">IMAP 配置</h2>
              <dl className="grid grid-cols-2 gap-4">
                <dt className="font-medium">服务器地址：</dt>
                <dd>{config.imap.host}</dd>
                <dt className="font-medium">端口：</dt>
                <dd>{config.imap.port}</dd>
                <dt className="font-medium">安全连接：</dt>
                <dd>{config.imap.secure ? '是' : '否'}</dd>
              </dl>
            </div>

            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">SMTP 配置</h2>
              <dl className="grid grid-cols-2 gap-4">
                <dt className="font-medium">服务器地址：</dt>
                <dd>{config.smtp.host}</dd>
                <dt className="font-medium">端口：</dt>
                <dd>{config.smtp.port}</dd>
                <dt className="font-medium">安全连接：</dt>
                <dd>{config.smtp.secure ? '是' : '否'}</dd>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
