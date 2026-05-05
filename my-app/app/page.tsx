'use client'

import { useState } from 'react'

const API_URL = '/api'
const WECHAT_ID = 'A15069916247'

const tools = [
  { key: 'douyin', name: '抖音违禁词检测', desc: '短视频、口播、带货文案合规改写' },
  { key: 'xiaohongshu', name: '小红书违禁词检测', desc: '种草、探店、品牌软广优化' },
  { key: 'novel', name: '小说违禁词检测', desc: '网文、章节、剧情内容降敏' },
  { key: 'adlaw', name: '广告法极限词检测', desc: '企业宣传、产品卖点合规' },
  { key: 'copywriting', name: 'AI文案优化', desc: '标题、口播、成交文案优化' },
]

const plans = [
  {
    key: 'week',
    name: '体验卡',
    price: '¥9.9',
    days: '7天',
    tag: '新用户试用',
    desc: '适合临时检测文案',
    features: ['每天30次', '基础速度', '适合体验功能'],
    highlight: false,
    button: '开通体验卡',
  },
  {
    key: 'month',
    name: '月卡会员',
    price: '¥39',
    days: '30天',
    tag: '按月付费',
    desc: '适合短期高频使用',
    features: ['不限次数', '正常响应', '适合短期项目'],
    highlight: false,
    button: '开通月卡',
  },
  {
    key: 'year',
    name: '年卡会员',
    price: '¥159',
    days: '365天',
    tag: '🔥 超值推荐',
    desc: '每天仅需约0.4元，比月卡更划算',
    features: ['不限次数', '优先体验', '专属客服支持', '比月卡节省约70%'],
    highlight: true,
    button: '立即开通年卡',
  },
  {
    key: 'half',
    name: '半年卡',
    price: '¥99',
    days: '180天',
    tag: '高性价比',
    desc: '适合稳定使用一段时间',
    features: ['不限次数', '稳定使用', '约16元/月'],
    highlight: false,
    button: '开通半年卡',
  },
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

  const [showAdmin, setShowAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminUsername, setAdminUsername] = useState('')
  const [adminDays, setAdminDays] = useState('30')
  const [adminResult, setAdminResult] = useState('')

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

    try {
      const res = await fetch(`${API_URL}/ai-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, type: selectedTool.key, text }),
      })

      const data = await res.json()
      if (data.user) setUser(data.user)
      setResult(data.result || data.msg || '没有返回结果')
    } catch {
      setResult('请求失败，请检查服务器接口是否正常')
    }

    setLoading(false)
  }

  const buyVip = (planName: string, price: string) => {
    alert(`请先扫码支付 ${price}，然后添加客服微信：${WECHAT_ID}，备注你的用户名：${user.username} 和套餐：${planName}`)
  }

  const adminOpenVip = async () => {
    if (!adminPassword || !adminUsername || !adminDays) {
      alert('请填写管理员密码、用户名和天数')
      return
    }

    const res = await fetch(`${API_URL}/admin-open-vip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPassword, username: adminUsername, days: Number(adminDays) }),
    })

    const data = await res.json()
    setAdminResult(data.msg)

    if (user && data.user && data.user.username === user.username) {
      setUser(data.user)
    }
  }

  const adminQueryUser = async () => {
    if (!adminPassword || !adminUsername) {
      alert('请填写管理员密码和用户名')
      return
    }

    const res = await fetch(`${API_URL}/admin-user-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPassword, username: adminUsername }),
    })

    const data = await res.json()

    if (data.user) {
      setAdminResult(
        `用户：${data.user.username}\n免费次数：${data.user.freeUses}\n会员状态：${data.user.isVip ? '会员' : '非会员'}\n到期时间：${data.user.vipUntil || '无'}\n邀请码：${data.user.inviteCode}`
      )
    } else {
      setAdminResult(data.msg)
    }
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <section style={styles.loginCard}>
          <div style={styles.badge}>AI Content Compliance</div>
          <h1 style={styles.loginTitle}>智能违禁词检测系统</h1>
          <p style={styles.loginDesc}>支持抖音、小红书、小说、广告法与商业文案的 AI 合规检测与改写。</p>

          <input placeholder="用户名" value={inputUser} onChange={(e) => setInputUser(e.target.value)} style={styles.input} />
          <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
          <input placeholder="邀请码（选填）" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} style={styles.input} />

          <button onClick={handleLogin} style={styles.primaryBtn}>登录系统</button>
          <button onClick={handleRegister} style={styles.secondaryBtn}>注册账号</button>
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

        <div style={styles.topRight}>
          <button onClick={() => setShowAdmin(!showAdmin)} style={styles.adminTopBtn}>管理员后台</button>
          <div style={styles.userBox}>
            <p>用户：{user.username}</p>
            <p>免费次数：{user.freeUses}</p>
            <p>会员状态：{user.isVip ? `有效至 ${user.vipUntil.slice(0, 10)}` : '未开通'}</p>
            <button onClick={() => setUser(null)} style={styles.logoutBtn}>退出</button>
          </div>
        </div>
      </header>

      {showAdmin && (
        <section style={styles.adminPanel}>
          <h2>管理员后台</h2>
          <p>用于用户付款后，手动给指定用户开通会员。</p>

          <input type="password" placeholder="管理员密码" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={styles.adminInput} />
          <input placeholder="用户名称" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} style={styles.adminInput} />

          <select value={adminDays} onChange={(e) => setAdminDays(e.target.value)} style={styles.adminInput}>
            <option value="7">7天会员</option>
            <option value="30">30天会员</option>
            <option value="180">180天会员</option>
            <option value="365">365天会员</option>
          </select>

          <div style={styles.adminBtnRow}>
            <button onClick={adminOpenVip} style={styles.adminBtn}>开通会员</button>
            <button onClick={adminQueryUser} style={styles.adminBtnSecondary}>查询用户</button>
          </div>

          <pre style={styles.adminResult}>{adminResult || '操作结果会显示在这里'}</pre>
        </section>
      )}

      <section style={styles.inviteBox}>
        <h2>邀请奖励</h2>
        <p>你的邀请码：<b>{user.inviteCode}</b></p>
        <p>好友注册时填写你的邀请码，你将获得 <b>3天会员</b> 奖励。</p>
      </section>

      <section style={styles.payHeader}>
        <div>
          <h2>选择适合你的会员方案</h2>
          <p>新用户可先体验，长期使用建议直接开通年卡，性价比最高。</p>
        </div>
        <div style={styles.yearTip}>年卡每天约 0.4 元</div>
      </section>

      <section style={styles.payGrid}>
        {plans.map((plan) => (
          <div key={plan.key} style={plan.highlight ? styles.priceCardHot : styles.priceCard}>
            <div style={plan.highlight ? styles.hotTag : styles.normalTag}>{plan.tag}</div>
            <h3>{plan.name}</h3>
            <p style={styles.price}>{plan.price}</p>
            <p style={styles.days}>{plan.days}</p>
            <p style={styles.planDesc}>{plan.desc}</p>

            <ul style={styles.featureList}>
              {plan.features.map((item) => (
                <li key={item}>✔ {item}</li>
              ))}
            </ul>

            <button onClick={() => buyVip(plan.name, plan.price)} style={plan.highlight ? styles.hotPayBtn : styles.payBtn}>
              {plan.button}
            </button>
          </div>
        ))}
      </section>

      <section style={styles.manualPayBox}>
        <div>
          <h2>支付宝扫码付款</h2>
          <p>支付完成后添加客服微信，备注你的用户名和套餐，人工开通会员。</p>
          <p style={styles.warnText}>客服微信：{WECHAT_ID}</p>
          <p style={styles.warnText}>付款备注建议填写用户名：{user.username}</p>
        </div>

        <div style={styles.qrBox}>
          <img src="/pay.png" alt="支付宝收款码" style={styles.payImage} />
          <p>支付宝收款码</p>
          <p>客服微信：{WECHAT_ID}</p>
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
              border: selectedTool.key === tool.key ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.12)',
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
  topRight: { display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' },
  adminTopBtn: {
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  userBox: {
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  logoutBtn: { border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer' },
  adminPanel: {
    maxWidth: '1200px',
    margin: '24px auto',
    padding: '24px',
    borderRadius: '24px',
    background: 'rgba(15,23,42,0.95)',
    border: '1px solid rgba(255,255,255,0.14)',
  },
  adminInput: {
    width: '100%',
    padding: '13px',
    marginTop: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
  },
  adminBtnRow: { display: 'flex', gap: '12px', marginTop: '14px' },
  adminBtn: {
    padding: '12px 18px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  adminBtnSecondary: {
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  adminResult: {
    marginTop: '16px',
    padding: '16px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.06)',
    color: '#e5e7eb',
    whiteSpace: 'pre-wrap',
  },
  inviteBox: {
    maxWidth: '1200px',
    margin: '24px auto',
    padding: '22px',
    borderRadius: '22px',
    background: 'rgba(96,165,250,0.12)',
    border: '1px solid rgba(96,165,250,0.25)',
  },
  payHeader: {
    maxWidth: '1200px',
    margin: '24px auto 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  yearTip: {
    padding: '14px 18px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #facc15, #fb923c)',
    color: '#111827',
    fontWeight: 900,
    whiteSpace: 'nowrap',
  },
  payGrid: {
    maxWidth: '1200px',
    margin: '24px auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '18px',
  },
  priceCard: {
    padding: '24px',
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  priceCardHot: {
    padding: '28px',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, rgba(250,204,21,0.28), rgba(249,115,22,0.18))',
    border: '2px solid rgba(250,204,21,0.75)',
    boxShadow: '0 24px 70px rgba(250,204,21,0.16)',
    transform: 'scale(1.03)',
  },
  normalTag: {
    display: 'inline-block',
    padding: '7px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.1)',
    color: '#cbd5e1',
    fontSize: '13px',
  },
  hotTag: {
    display: 'inline-block',
    padding: '7px 12px',
    borderRadius: '999px',
    background: '#facc15',
    color: '#111827',
    fontSize: '13px',
    fontWeight: 900,
  },
  price: { fontSize: '38px', fontWeight: 900, margin: '12px 0 4px' },
  days: { color: '#facc15', fontWeight: 700 },
  planDesc: { color: '#cbd5e1', lineHeight: 1.6 },
  featureList: {
    paddingLeft: '0',
    listStyle: 'none',
    color: '#e5e7eb',
    lineHeight: 1.9,
    minHeight: '120px',
  },
  payBtn: {
    width: '100%',
    padding: '13px',
    borderRadius: '14px',
    border: 'none',
    background: '#fff',
    color: '#111827',
    fontWeight: 800,
    cursor: 'pointer',
  },
  hotPayBtn: {
    width: '100%',
    padding: '15px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #facc15, #fb923c)',
    color: '#111827',
    fontWeight: 900,
    cursor: 'pointer',
    fontSize: '16px',
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
  warnText: { color: '#facc15' },
  qrBox: { minWidth: '230px', textAlign: 'center' },
  payImage: {
    width: '180px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '18px',
    background: '#fff',
    padding: '8px',
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