import { createContext, useContext, useState } from 'react'
import ReactDOM from 'react-dom'

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    open: false,
    message: '',
    resolve: null,
    loading: false
  })

  const confirm = (message) => {
    return new Promise((resolve) => {
      setModalState({
        open: true,
        message,
        resolve,
        loading: false
      })
    })
  }

  const handleConfirm = async () => {
    setModalState((prev) => ({ ...prev, loading: true }))

    modalState.resolve(true)

    setModalState({
      open: false,
      message: '',
      resolve: null,
      loading: false
    })
  }

  const handleCancel = () => {
    modalState.resolve(false)

    setModalState({
      open: false,
      message: '',
      resolve: null,
      loading: false
    })
  }

  return (
    <ModalContext.Provider value={{ confirm }}>
      {children}

      {modalState.open &&
        ReactDOM.createPortal(
          <div className="modal-overlay">
            <div className="modal-box">
              <p className="modal-message">{modalState.message}</p>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>

                <button
                  className="confirm-btn"
                  onClick={handleConfirm}
                  disabled={modalState.loading}
                >
                  {modalState.loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
