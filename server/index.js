const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

// ===== 连接数据库 =====
mongoose.connect('mongodb://127.0.0.1:27017/myapp')
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.log('数据库连接失败', err))

// ===== 用户模型（带密码）=====
const User = mongoose.model('User', {
  username: String,
  password: String
})

// ===== 注册 =====
app.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ msg: '请输入用户名和密码' })
  }

  const exist = await User.findOne({ username })
  if (exist) {
    return res.json({ msg: '用户已存在' })
  }

  await User.create({ username, password })
  res.json({ msg: '注册成功' })
})

// ===== 登录 =====
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  if (!user) {
    return res.json({ msg: '用户不存在' })
  }

  if (user.password !== password) {
    return res.json({ msg: '密码错误' })
  }

  res.json({ msg: '登录成功', user })
})

// ===== 启动服务 =====
app.listen(3001, () => {
  console.log('服务器启动：http://localhost:3001')
})