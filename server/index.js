const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: [
    'https://my-ai-tool-three.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}))

app.options('*', cors())

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

  const user = users.find(u => u.username === username)

  if (!user) {
    return res.json({ msg: '用户不存在' })
  }

  if (user.password !== password) {
    return res.json({ msg: '密码错误' })
  }

  res.json({
    msg: '登录成功',
    user: { username: user.username }
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('服务器启动：http://localhost:' + PORT)
})