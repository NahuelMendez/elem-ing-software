const Modal = ({title, body, handleClose}) =>
  <div className="pizzap-modal">
    <div className="pizzap-modal-content">
      <header>
        <h3>{title} <span onClick={handleClose} className="pizzap-modal-close-btn">&times;</span></h3>
      </header>
      <main>{body}</main>
    </div>
  </div>

export default Modal