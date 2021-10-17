const Modal = ({title, body, handleClose}) =>
  <div className="pizzap-modal">
    <div className="rounded bg-white p-3">
      <header>
        <h3>{title} <span onClick={handleClose} name="modal-close-btn" className="float-right cursor-pointer text-3xl text-gray-400 hover:text-black">&times;</span></h3>
      </header>
      <main>{body}</main>
    </div>
  </div>

export default Modal