'use client'

import { useState } from 'react'

const API_URL = 'https://my-ai-tool-production-a91f.up.railway.app'

const tools = [
  { key: 'douyin', name: '抖音违禁词检测', desc: '短视频、口播、带货文案合规改写' },
  { key: 'xiaohongshu', name: '小红书违禁词检测', desc: '种草、探店、品牌软广优化' },
  { key: 'novel', name: '小说违禁词检测', desc: '网文、章节、剧情内容降敏' },
  { key: 'adlaw', name: '广告法极限词检测', desc: '企业宣传、产品卖点合规' },
  { key: 'copywriting', name: 'AI文案优化', desc: '标题、口播、成交文案优化' },
]

export default function Home() {
  const [user, setUser] = useState('')
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')
  const [selectedTool, setSelectedTool] = useState(tools[0])
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!inputUser || !password) return alert('请输入用户名和密码')

    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password }),
    })

    const data = await res.json()
    data.msg === '登录成功' ? setUser(data.user.username) : alert(data.msg)
  }

  const handleRegister = async () => {
    if (!inputUser || !password) return alert('请输入用户名和密码')

    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password }),
    })

    const data = await res.json()
    alert(data.msg)
  }

  const handleRewrite = async () => {
    if (!text.trim()) return alert('请输入要检测/改写的内容')

    setLoading(true)
    setResult('')

    try {
      const res = await fetch(`${API_URL}/ai-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedTool.key, text }),
      })

      const data = await res.json()
      setResult(data.result || data.msg || '没有返回结果')
    } catch {
      setResult('请求失败，请检查后端是否正常')
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <section style={styles.loginCard}>
          <div style={styles.badge}>AI Content Compliance</div>
          <h1 style={styles.loginTitle}>智能违禁词检测系统</h1>
          <p style={styles.loginDesc}>
            面向短视频、小红书、小说、广告法与商业文案的 AI 合规改写工具。
          </p>

          <input
            placeholder="用户名"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleLogin} style={styles.primaryBtn}>
            登录系统
          </button>

          <button onClick={handleRegister} style={styles.secondaryBtn}>
            注册账号
          </button>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <div style={styles.badge}>AI Compliance Platform</div>
          <h1 style={styles.title}>AI违禁词检测与文案改写工具</h1>
          <p style={styles.subtitle}>专业内容合规检测，适合短视频、种草、小说、广告与商业文案。</p>
        </div>

        <div style={styles.userBox}>
          <span>当前用户：{user}</span>
          <button onClick={() => setUser('')} style={styles.logoutBtn}>
            退出
          </button>
        </div>
      </header>

      <section style={styles.toolGrid}>
        {tools.map((tool) => (
          <button
            key={tool.key}
            onClick={() => {
              setSelectedTool(tool)
              setResult('')
            }}
            style={{
              ...styles.toolCard,
              border:
                selectedTool.key === tool.key
                  ? '1px solid rgba(255,255,255,0.9)'
                  : '1px solid rgba(255,255,255,0.12)',
              background:
                selectedTool.key === tool.key
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))'
                  : 'rgba(255,255,255,0.06)',
            }}
          >
            <h3 style={styles.toolName}>{tool.name}</h3>
            <p style={styles.toolDesc}>{tool.desc}</p>
          </button>
        ))}
      </section>

      <section style={styles.workArea}>
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>输入内容</h2>
          <p style={styles.panelDesc}>当前模式：{selectedTool.name}</p>

          <textarea
            rows={10}
            placeholder="请输入要检测或改写的文案..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={handleRewrite} disabled={loading} style={styles.actionBtn}>
            {loading ? 'AI正在分析改写...' : '一键检测并改写'}
          </button>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>AI改写结果</h2>
          <p style={styles.panelDesc}>系统会尽量保留原意，同时降低违规风险。</p>

          <div style={styles.resultBox}>
            {result || '改写结果会显示在这里'}
          </div>

          <div style={styles.payBox}>
            <h3 style={styles.payTitle}>高级版即将开放</h3>
            <p style={styles.payDesc}>支持批量检测、会员次数、企业词库、付费解锁。</p>
          </div>
        </div>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #243b55, #141e30 55%, #070b12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    color: '#fff',
  },
  loginCard: {
    width: '100%',
    maxWidth: '460px',
    padding: '42px',
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
    backdropFilter: 'blur(18px)',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.18)',
    fontSize: '13px',
    color: '#dbeafe',
    marginBottom: '18px',
  },
  loginTitle: {
    fontSize: '34px',
    margin: '0 0 14px',
    letterSpacing: '-1px',
  },
  loginDesc: {
    color: '#cbd5e1',
    lineHeight: 1.7,
    marginBottom: '28px',
  },
  input: {
    width: '100%',
    padding: '15px 16px',
    marginBottom: '14px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    outline: 'none',
    fontSize: '15px',
  },
  primaryBtn: {
    width: '100%',
    padding: '15px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
  },
  secondaryBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'transparent',
    color: '#e5e7eb',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '12px',
  },
  dashboard: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a, #111827 55%, #020617)',
    color: '#fff',
    padding: '34px',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '38px',
    margin: '0 0 12px',
    letterSpacing: '-1px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
  },
  userBox: {
    padding: '14px 18px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  logoutBtn: {
    border: 'none',
    borderRadius: '10px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  toolGrid: {
    maxWidth: '1200px',
    margin: '32px auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '16px',
  },
  toolCard: {
    padding: '22px',
    borderRadius: '22px',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    backdropFilter: 'blur(12px)',
  },
  toolName: {
    margin: '0 0 10px',
    fontSize: '18px',
  },
  toolDesc: {
    margin: 0,
    color: '#cbd5e1',
    lineHeight: 1.6,
    fontSize: '14px',
  },
  workArea: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  panel: {
    padding: '26px',
    borderRadius: '26px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 24px 70px rgba(0,0,0,0.25)',
  },
  panelTitle: {
    margin: '0 0 8px',
    fontSize: '24px',
  },
  panelDesc: {
    margin: '0 0 18px',
    color: '#94a3b8',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    borderRadius: '18px',
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(15,23,42,0.85)',
    color: '#fff',
    fontSize: '15px',
    lineHeight: 1.7,
    outline: 'none',
  },
  actionBtn: {
    width: '100%',
    marginTop: '18px',
    padding: '16px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  resultBox: {
    minHeight: '220px',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.8,
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(15,23,42,0.9)',
    color: '#e5e7eb',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  payBox: {
    marginTop: '18px',
    padding: '18px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, rgba(250,204,21,0.18), rgba(249,115,22,0.12))',
    border: '1px solid rgba(250,204,21,0.25)',
  },
  payTitle: {
    margin: '0 0 8px',
  },
  payDesc: {
    margin: 0,
    color: '#fde68a',
  },
}