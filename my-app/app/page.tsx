'use client'

import { useState } from 'react'

const API = 'https://my-ai-tool-production-a91f.up.railway.app'

export default function Home() {
  const [user, setUser] = useState('')
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password })
    })
    const data = await res.json()
    if (data.msg === '登录成功') setUser(data.user.username)
    else alert(data.msg)
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

  const ai = async () => {
    const res = await fetch(`${API}/ai-rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, username: user })
    })

    const data = await res.json()

    if (data.needPay) {
      alert('免费次数用完，请扫码支付开会员')
      return
    }

    setResult(data.result)
  }

  if (!user) {
    return (
      <div style={{ padding: 50 }}>
        <h2>登录 / 注册</h2>
        <input placeholder="用户名" onChange={e => setInputUser(e.target.value)} />
        <br /><br />
        <input placeholder="密码" onChange={e => setPassword(e.target.value)} />
        <br /><br />
        <button onClick={login}>登录</button>
        <button onClick={register}>注册</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 50 }}>
      <h2>AI文案改写</h2>

      <textarea
        rows={5}
        style={{ width: '100%' }}
        onChange={e => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={ai}>AI改写</button>

      <p>{result}</p>

      <hr />

      <h3>开通会员（9.9/月）</h3>
      <p>👉 扫码支付后联系我开通</p>

      <img
        src="你的收款码图片链接"
        style={{ width: 200 }}
      />
    </div>
  )
}