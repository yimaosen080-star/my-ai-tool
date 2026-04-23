'use client'

import { useState } from 'react'
import words from './words.json'

export default function Home() {
  const [text, setText] = useState('')
  const [highlighted, setHighlighted] = useState('')
  const [replaced, setReplaced] = useState('')
  const [user, setUser] = useState('')
  const [inputUser, setInputUser] = useState('')
  const [password, setPassword] = useState('')

  // 登录
  const handleLogin = async () => {
    const res = await fetch('http://localhost:3001/login', {
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

  // 注册
  const handleRegister = async () => {
    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: inputUser, password })
    })

    const data = await res.json()
    alert(data.msg)
  }

  // 功能
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

  // 未登录
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

  // 登录后
  return (
    <div style={{ padding: '50px' }}>
      <h1>违禁词检测系统</h1>

      <p>当前用户：{user}</p>

      <textarea
        rows={5}
        style={{ width: '100%', marginTop: '20px' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={handleProcess}>一键处理</button>

      <p>检测结果：</p>
      <div dangerouslySetInnerHTML={{ __html: highlighted }} />

      <p>改写结果：</p>
      <div>{replaced}</div>
    </div>
  )
}