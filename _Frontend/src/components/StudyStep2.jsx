import { useState } from 'react'

const StudyStep2 = ({ scans, setScans }) => {
  const saveFile = (e) => {
    const newFiles = Array.from(e.target.files)
    setScans((prevFiles) => {
      const updated = [...prevFiles, ...newFiles]
      return updated
    })
  }

  const handleDrag = (e) => {
    e.preventDefault()
    const newFiles = Array.from(e.dataTransfer.files)

    setScans((prev) => {
      const updated = [...prev, ...newFiles]
      return updated
    })
  }

  return (
    <>
      <h3 className="create-study-subtitle">Upload your scan</h3>
      <div
        className="upload-scan-container"
        onDrop={handleDrag}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-input').click()}
      >
        <img src="/icons/upload-icon.svg" alt="Upload Icon" />
        <p className="upload-title">Choose a file or drag & drop it here</p>
        <p className="upload-subtitle">
          JPEG, PNG, and AVIF formats, up to 50 MB
        </p>
        <label
          htmlFor="file-input"
          className="upload-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Browse File
        </label>
        <input
          type="file"
          id="file-input"
          hidden
          onChange={saveFile}
          accept="image/*"
        />
      </div>
    </>
  )
}

export default StudyStep2
