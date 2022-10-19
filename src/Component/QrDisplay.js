import React from "react";
import QRCode from "react-qr-code";

function QrDisplay() {
  return (
    <QRCode
      className="qr-container"
      size={256}
      value="hey"
      viewBox={`0 0 256 256`}
    />
  );
}

export default QrDisplay;
