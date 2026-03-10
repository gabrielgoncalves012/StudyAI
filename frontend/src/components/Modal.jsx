export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  const BACKGROUND_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
    //deve ter scroll
    overflowY: 'auto',
    padding: '20px',
  }

  const MODAL_STYLE = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    width: '600px',
    maxWidth: '90%',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }

  const HEADER_STYLE = {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={BACKGROUND_STYLE}>
        {/* deve ter scroll */}

      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={MODAL_STYLE}>
        <div className="header" style={HEADER_STYLE}>
            <button className="modal-close" onClick={onClose}>
            &times;
            </button>
        </div>
        <div className="modal-body">
            {children}
        </div>
      </div>
    </div>
  )
}