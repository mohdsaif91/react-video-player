import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrReader from "react-web-qr-reader";

import ModalPopup from "../util/ModalPopup";

const initialModalData = {
  flag: false,
  data: "",
};

const initialLocationData = {
  longitude: "",
  lattitude: "",
};

function Scanner() {
  const [showModal, setShowModal] = useState(initialModalData);
  const [locationData, setLocationData] = useState(initialLocationData);
  const navigate = useNavigate();

  useEffect(() => {
    console.log();
    navigator.geolocation.getCurrentPosition((locationData) => {
      setLocationData({
        longitude: locationData.coords.longitude,
        lattitude: locationData.coords.latitude,
      });
    });
    return () => {
      setShowModal(false);
    };
  }, []);

  const submitData = (modaldata) => {
    const sendData = {
      mobile: modaldata.mobile,
      location: locationData,
    };

    navigate("/videoSearch", {
      state: { qrData: showModal.data, userData: sendData },
    });
  };

  const shoWResult = (qrData) => {
    console.log(locationData);
    if (qrData.data) {
      setShowModal({ flag: true, data: qrData });
    }
    console.log(qrData);
  };
  const showError = (err) => {
    console.log(err);
  };

  return (
    <div className="qr-container">
      <QrReader
        className="qr-image-wrapper"
        showViewFinder={true}
        delay={100}
        style={{ height: 260, width: 320 }}
        onError={(data) => showError(data)}
        onScan={(data) => shoWResult(data)}
        facingMode="user"
      />
      {showModal && (
        <ModalPopup
          onClose={() => setShowModal(false)}
          onSubmit={(modaldata) => submitData(modaldata)}
        />
      )}
    </div>
  );
}

export default Scanner;
