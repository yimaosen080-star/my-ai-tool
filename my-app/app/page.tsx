'use client'

import { useState } from 'react'

const API = 'https://my-ai-tool-production-a91f.up.railway.app'

export default function Home() {
  const [user, setUser] = useState('')
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password })
    })

    const data = await res.json()

    if (data.msg === '登录成功') {
      setUser(data.user.username)
    } else {
      alert(data.msg)
    }
  }

  const register = async () => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password })
    })

    const data = await res.json()
    alert(data.msg)
  }

  const aiRewrite = async () => {
    if (!text) {
      alert('请输入文案')
      return
    }

    setLoading(true)
    setResult('AI正在改写中，请稍等...')

    try {
      const res = await fetch(`${API}/ai-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, username: user })
      })

      const data = await res.json()

      if (data.needPay) {
        setResult('今日免费次数已用完，请开通会员后继续使用。')
        alert('今日免费次数已用完，请扫码开通会员')
        return
      }

      setResult(data.result || data.msg || '暂无返回结果')
    } catch (e) {
      setResult('AI请求失败，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <main style={styles.page}>
        <section style={styles.loginCard}>
          <div style={styles.badge}>AI 文案合规工具</div>
          <h1 style={styles.title}>登录 / 注册</h1>
          <p style={styles.desc}>登录后可使用 AI 文案改写，每天免费体验 3 次。</p>

          <input
            style={styles.input}
            placeholder="用户名"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={styles.row}>
            <button style={styles.primaryBtn} onClick={login}>登录</button>
            <button style={styles.secondaryBtn} onClick={register}>注册</button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.badge}>AI 文案合规工具</div>
            <h1 style={styles.title}>AI文案合规改写系统</h1>
            <p style={styles.desc}>当前用户：{user}｜普通用户每天免费 3 次</p>
          </div>

          <button style={styles.logoutBtn} onClick={() => setUser('')}>
            退出登录
          </button>
        </header>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>输入原文案</h2>

            <textarea
              rows={10}
              style={styles.textarea}
              placeholder="请输入需要检测或改写的文案..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button style={styles.aiBtn} onClick={aiRewrite}>
              {loading ? 'AI改写中...' : 'AI智能改写'}
            </button>

            <div style={styles.payBox}>
              <h3 style={styles.payTitle}>开通会员</h3>
              <p style={styles.payText}>9.9 元 / 月，会员可解除每日次数限制。</p>
              <p style={styles.payText}>扫码支付后，联系我开通会员。</p>

              <img
                src="/pay.jpg"
                alt="收款二维码"
                style={styles.qr}
              />

              <p style={styles.payTip}>如果二维码不显示，请确认图片已放入 public/pay.jpg</p>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>AI改写结果</h2>

            <pre style={styles.resultBox}>
              {result || '暂无结果，请先输入文案并点击 AI智能改写。'}
            </pre>
          </div>
        </div>
      </section>
    </main>
  )
}

const styles: any = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)',
    color: '#e5e7eb',
    padding: '40px',
    fontFamily: 'Arial, sans-serif'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loginCard: {
    maxWidth: '430px',
    margin: '100px auto',
    background: 'rgba(15, 23, 42, 0.92)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: '24px',
    padding: '36px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px'
  },
  badge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    background: 'rgba(37, 99, 235, 0.18)',
    color: '#93c5fd',
    fontSize: '14px',
    marginBottom: '12px'
  },
  title: {
    fontSize: '36px',
    margin: '0 0 10px',
    color: '#ffffff'
  },
  desc: {
    color: '#cbd5e1',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  card: {
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.28)'
  },
  cardTitle: {
    fontSize: '20px',
    color: '#ffffff',
    margin: '0 0 14px'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    marginBottom: '14px',
    borderRadius: '14px',
    border: '1px solid #334155',
    background: '#020617',
    color: '#ffffff',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    borderRadius: '18px',
    border: '1px solid #334155',
    background: '#020617',
    color: '#ffffff',
    resize: 'vertical',
    outline: 'none',
    fontSize: '15px',
    lineHeight: '1.7'
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  primaryBtn: {
    border: 'none',
    borderRadius: '14px',
    padding: '12px 18px',
    background: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 700
  },
  secondaryBtn: {
    border: '1px solid #475569',
    borderRadius: '14px',
    padding: '12px 18px',
    background: 'transparent',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontWeight: 700
  },
  aiBtn: {
    width: '100%',
    marginTop: '16px',
    border: 'none',
    borderRadius: '16px',
    padding: '14px 18px',
    background: 'linear-gradient(135deg, #7c3aed, #db2777)',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: '16px'
  },
  logoutBtn: {
    border: '1px solid #475569',
    borderRadius: '14px',
    padding: '10px 16px',
    background: 'transparent',
    color: '#e5e7eb',
    cursor: 'pointer'
  },
  resultBox: {
    minHeight: '430px',
    whiteSpace: 'pre-wrap',
    background: '#020617',
    border: '1px solid #334155',
    borderRadius: '18px',
    padding: '18px',
    color: '#d1fae5',
    lineHeight: '1.8',
    fontSize: '15px'
  },
  payBox: {
    marginTop: '24px',
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(2, 6, 23, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.22)'
  },
  payTitle: {
    margin: '0 0 8px',
    color: '#ffffff'
  },
  payText: {
    margin: '6px 0',
    color: '#cbd5e1'
  },
  qr: {
    width: '200px',
    height: '200px',
    objectFit: 'cover',
    marginTop: '12px',
    borderRadius: '12px',
    background: '#ffffff'
  },
  payTip: {
    color: '#94a3b8',
    fontSize: '13px',
    marginTop: '10px'
  }
}