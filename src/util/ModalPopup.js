import React, { useRef, useState } from "react";

import closeIcon from "../assests/multiply.png";

function ModalPopup({ onClose, onSubmit }) {
  const [error, setError] = useState(false);
  const mobileRef = useRef();

  const submitBtnClick = () => {
    if (mobileRef.current.value != "") {
      onSubmit({
        mobile: mobileRef.current.value,
      });
    } else {
      setError(true);
    }
  };
  return (
    <div className="modal-popup">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">User Detials</div>
          <div className="close-icon">
            <img
              className="icon"
              src={closeIcon}
              alt="close-icon"
              onClick={() => onClose()}
            />
          </div>
        </div>
        <div className="modal-body">
          <div className="input-container">
            <input
              placeholder="Mobile Number"
              className="input mobile-input"
              maxLength={10}
              ref={mobileRef}
            />
          </div>
          {error && <div className="error-text">All feild are required</div>}
        </div>
        <div className="modal-footer">
          <button className="btn close-btn" onClick={() => onClose()}>
            Cancel
          </button>
          <button className="btn submit-btn" onClick={() => submitBtnClick()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPopup;
