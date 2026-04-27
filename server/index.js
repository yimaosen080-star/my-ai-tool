const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: [
    'https://my-ai-tool-three.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

let users = []

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.post('/register', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ msg: '请输入用户名和密码' })
  }

  const exist = users.find(u => u.username === username)

  if (exist) {
    return res.json({ msg: '用户已存在' })
  }

  users.push({ username, password })

  res.json({ msg: '注册成功' })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    return res.json({ msg: '用户名或密码错误' })
  }

  res.json({
    msg: '登录成功',
    user: { username: user.username }
  })
})

app.post('/ai-rewrite', async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.json({ msg: '请输入要改写的内容' })
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return res.json({ msg: 'DeepSeek API Key 未配置' })
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个中文短视频文案合规改写助手。请把用户输入的文案改写得更合规、更自然，避免夸大宣传、诱导词、极限词、违规营销表达，但保留原意。只输出改写后的文案，不要解释。'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()

    const result = data.choices?.[0]?.message?.content || ''

    res.json({
      msg: 'AI改写成功',
      result
    })
  } catch (error) {
    res.json({
      msg: 'AI改写失败',
      error: String(error)
    })
  }
})

const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0', () => {
  console.log('服务器运行在 ' + PORT + ' 端口')
})