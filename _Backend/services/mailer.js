const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const Handlebars = require('handlebars')
require('dotenv').config()

const partialsDir = path.join(__dirname, '..', 'emails/partials')
fs.readdirSync(partialsDir).forEach((file) => {
  const partialName = path.basename(file, '.hbs')
  const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf8')
  Handlebars.registerPartial(partialName, partialContent)
})

const renderTemplate = (templateName, context) => {
  const layoutPath = path.join(__dirname, '..', 'emails/layouts', 'main.hbs')
  const layoutSource = fs.readFileSync(layoutPath, 'utf8')
  const layout = Handlebars.compile(layoutSource)

  const templatePath = path.join(
    __dirname,
    '..',
    'emails/templates',
    `${templateName}.hbs`
  )

  const templateSource = fs.readFileSync(templatePath, 'utf8')
  const template = Handlebars.compile(templateSource)

  const fullHtml = layout({
    body: template(context),
    ...context
  })

  return fullHtml
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendMail = async ({ to, subject, template, context }) => {
  context.year = new Date().getFullYear()
  context.appName = process.env.APP_NAME

  const html = renderTemplate(template, context)

  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html
  })
}

module.exports = { sendMail, renderTemplate }
