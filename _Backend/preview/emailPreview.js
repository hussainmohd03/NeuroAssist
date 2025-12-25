const express = require('express')
require('dotenv').config()
const { renderTemplate } = require('../services/mailer')

const app = express()
const PORT = 4000

const sampleData = {
  name: 'Hussain Ahmed',
  email: 'hussain@gmail.com',
  year: new Date().getFullYear(),
  appName: 'OHP',
  verificationLink: 'https://example.com/verify?token=abc123',
  resetLink: 'https://example.com/reset?token=xyz456',
  reportId: 'RPT-24-9801',
  doctor: 'Dr. Mujtaba Ahmed',
  date: '2025-01-01',
  score: '98%',
  tumorType: 'Glioblastoma (Prediction)',
  confidence: '92%',
  message: 'Thank you for using OHP'
}

app.get('/preview/:template', (req, res) => {
  try {
    const html = renderTemplate(req.params.template, sampleData)
    res.send(html)
  } catch (err) {
    res.status(500).send(`
      <h1>Error rendering template</h1>
      <p>${err.message}</p>
      <p>Template: ${req.params.template}</p>
    `)
  }
})

app.get('/', (req, res) => {
  res.send(`
    <h1>Email Template Previewer</h1>
    <p>Available preview links:</p>
    <ul>
      <li><a href="/preview/verifyEmail">Verify Email</a></li>
      <li><a href="/preview/resetPassword">Reset Password</a></li>
      <li><a href="/preview/welcome">Welcome Email</a></li>
      <li><a href="/preview/report">Report / MRI Result</a></li>
      <li><a href="/preview/resetPasswordSuccess">Reset Password Success</a></li>
    </ul>
  `)
})

app.listen(PORT, () => {
  console.log(`Email Template Previewer running at http://localhost:${PORT}`)
})
