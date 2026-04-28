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
  const { text, type } = req.body

  if (!text) {
    return res.json({ msg: '请输入内容' })
  }

  res.json({
    msg: 'AI改写成功',
    result: `【${type || '默认'}】改写结果：\n${text}`
  })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0', () => {
  console.log('服务器运行在 ' + PORT + ' 端口')
})