const multer = require('multer')
const { MulterAzureStorage } = require('multer-azure-blob-storage')

const storage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  containerAccessLevel: 'blob',
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  blobName: (req, file) => {
    const timestamp = Date.now()
    const originalName = file.originalname.replace(/\s+/g, '_')
    return `mriscan/${timestamp}-${originalName}`
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
})

module.exports = upload
