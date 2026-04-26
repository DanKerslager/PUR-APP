export default function RegisterModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Register</h2>
        <form className="form" onSubmit={e => e.preventDefault()}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
          <label htmlFor="cardNumber">Card Number</label>
          <input type="text" id="cardNumber" name="cardNumber" required />
          <label htmlFor="expiry">Expiry Date</label>
          <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required />
          <label htmlFor="cvs">CVV</label>
          <input type="text" id="cvs" name="cvs" required />
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Finish Payment</button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
