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
  const [user, setUser] = useState<any>(null)
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
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
    data.msg === '登录成功' ? setUser(data.user) : alert(data.msg)
  }

  const handleRegister = async () => {
    if (!inputUser || !password) return alert('请输入用户名和密码')

    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password, inviteCode }),
    })

    const data = await res.json()
    alert(data.msg)
    if (data.user) setUser(data.user)
  }

  const handleRewrite = async () => {
    if (!text.trim()) return alert('请输入要检测/改写的内容')

    setLoading(true)
    setResult('')

    const res = await fetch(`${API_URL}/ai-rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, type: selectedTool.key, text }),
    })

    const data = await res.json()

    if (data.user) setUser(data.user)
    setResult(data.result || data.msg || '没有返回结果')

    setLoading(false)
  }

  const buyVip = async (plan: string) => {
    const res = await fetch(`${API_URL}/buy-vip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, plan }),
    })

    const data = await res.json()
    alert(data.msg)
    if (data.user) setUser(data.user)
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <section style={styles.loginCard}>
          <div style={styles.badge}>AI Content Compliance</div>
          <h1 style={styles.loginTitle}>智能违禁词检测系统</h1>
          <p style={styles.loginDesc}>
            支持抖音、小红书、小说、广告法与商业文案的 AI 合规检测与改写。
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

          <input
            placeholder="邀请码（选填）"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
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
          <p>用户：{user.username}</p>
          <p>免费次数：{user.freeUses}</p>
          <p>会员状态：{user.isVip ? `有效至 ${user.vipUntil.slice(0, 10)}` : '未开通'}</p>
          <button onClick={() => setUser(null)} style={styles.logoutBtn}>退出</button>
        </div>
      </header>

      <section style={styles.inviteBox}>
        <h2>邀请奖励</h2>
        <p>你的邀请码：<b>{user.inviteCode}</b></p>
        <p>好友注册时填写你的邀请码，你将获得 <b>3天会员</b> 奖励。</p>
      </section>

      <section style={styles.payGrid}>
        <div style={styles.priceCard}>
          <h3>周会员</h3>
          <p style={styles.price}>¥9.9</p>
          <p>解锁 7 天 AI 改写</p>
          <button onClick={() => buyVip('week')} style={styles.payBtn}>模拟开通</button>
        </div>

        <div style={styles.priceCardHot}>
          <h3>月会员</h3>
          <p style={styles.price}>¥29.9</p>
          <p>解锁 30 天 AI 改写</p>
          <button onClick={() => buyVip('month')} style={styles.payBtn}>模拟开通</button>
        </div>

        <div style={styles.priceCard}>
          <h3>年会员</h3>
          <p style={styles.price}>¥199</p>
          <p>解锁 365 天 AI 改写</p>
          <button onClick={() => buyVip('year')} style={styles.payBtn}>模拟开通</button>
        </div>
      </section>

      <section style={styles.manualPayBox}>
        <div>
          <h2>人工开通会员</h2>
          <p>扫码付款后添加客服，备注你的用户名，人工开通会员。</p>
          <p style={styles.warnText}>当前支付为人工开通版本，后续可升级自动支付。</p>
        </div>

        <div style={styles.qrBox}>
          <div style={styles.fakeQr}>收款码</div>
          <p>微信 / 支付宝收款码</p>
          <p>客服微信：这里改成你的微信号</p>
        </div>
      </section>

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
              border: selectedTool.key === tool.key
                ? '1px solid rgba(255,255,255,0.9)'
                : '1px solid rgba(255,255,255,0.12)',
              background: selectedTool.key === tool.key
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
  loginTitle: { fontSize: '34px', margin: '0 0 14px' },
  loginDesc: { color: '#cbd5e1', lineHeight: 1.7, marginBottom: '28px' },
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
  title: { fontSize: '38px', margin: '0 0 12px' },
  subtitle: { color: '#94a3b8', fontSize: '16px' },
  userBox: {
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  logoutBtn: { border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer' },
  inviteBox: {
    maxWidth: '1200px',
    margin: '24px auto',
    padding: '22px',
    borderRadius: '22px',
    background: 'rgba(96,165,250,0.12)',
    border: '1px solid rgba(96,165,250,0.25)',
  },
  payGrid: {
    maxWidth: '1200px',
    margin: '24px auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
  },
  priceCard: {
    padding: '24px',
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  priceCardHot: {
    padding: '24px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(249,115,22,0.14))',
    border: '1px solid rgba(250,204,21,0.35)',
  },
  price: { fontSize: '34px', fontWeight: 800, margin: '10px 0' },
  payBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    background: '#fff',
    color: '#111827',
    fontWeight: 700,
    cursor: 'pointer',
  },
  manualPayBox: {
    maxWidth: '1200px',
    margin: '24px auto',
    padding: '26px',
    borderRadius: '26px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(56,189,248,0.14), rgba(139,92,246,0.14))',
    border: '1px solid rgba(255,255,255,0.14)',
  },
  warnText: {
    color: '#facc15',
  },
  qrBox: {
    minWidth: '210px',
    textAlign: 'center',
  },
  fakeQr: {
    width: '150px',
    height: '150px',
    margin: '0 auto 12px',
    borderRadius: '18px',
    background: '#fff',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
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
  toolName: { margin: '0 0 10px', fontSize: '18px' },
  toolDesc: { margin: 0, color: '#cbd5e1', lineHeight: 1.6, fontSize: '14px' },
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
  },
  panelTitle: { margin: '0 0 8px', fontSize: '24px' },
  panelDesc: { margin: '0 0 18px', color: '#94a3b8' },
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
}