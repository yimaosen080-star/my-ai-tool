'use client'

import { useState } from 'react'
import words from './words.json'

const API_URL = 'https://my-ai-tool-production-a91f.up.railway.app'

export default function Home() {
  const [text, setText] = useState('')
  const [highlighted, setHighlighted] = useState('')
  const [replaced, setReplaced] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [user, setUser] = useState('')
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
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

  const handleRegister = async () => {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password })
    })

    const data = await res.json()
    alert(data.msg)
  }

  const handleProcess = () => {
    if (!user) {
      alert('请先登录')
      return
    }

    let highlightText = text
    let replaceText = text

    words.forEach((item: any) => {
      const reg = new RegExp(item.bad, 'g')

      highlightText = highlightText.replace(
        reg,
        `<span style="color:red;font-weight:bold;">${item.bad}</span>`
      )

      replaceText = replaceText.split(item.bad).join(item.good)
    })

    setHighlighted(highlightText)
    setReplaced(replaceText)
  }

  const handleAI = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    if (!text) {
      alert('请输入内容')
      return
    }

    setLoading(true)
    setAiResult('AI处理中，请稍等...')

    try {
      const res = await fetch(`${API_URL}/ai-rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const data = await res.json()

      if (data.result) {
        setAiResult(data.result)
      } else {
        setAiResult(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      setAiResult('AI请求失败：' + String(err))
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <div style={{ padding: '50px' }}>
        <h1>登录 / 注册</h1>

        <input
          placeholder="用户名"
          value={inputUser}
          onChange={(e) => setInputUser(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>登录</button>
        <button onClick={handleRegister} style={{ marginLeft: '10px' }}>
          注册
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>违禁词检测系统</h1>

      <p>当前用户：{user}</p>

      <button onClick={() => setUser('')}>退出登录</button>

      <br /><br />

      <textarea
        rows={6}
        style={{ width: '100%', marginTop: '20px' }}
        placeholder="请输入文案"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={handleProcess}>违禁词检测</button>

      <button onClick={handleAI} style={{ marginLeft: '10px' }}>
        {loading ? 'AI处理中...' : 'AI智能改写'}
      </button>

      <p>检测结果：</p>
      <div dangerouslySetInnerHTML={{ __html: highlighted }} />

      <p>规则改写：</p>
      <div>{replaced}</div>

      <p>AI改写：</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{aiResult}</pre>
    </div>
  )
}