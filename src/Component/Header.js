import React from "react";

import Logo from "../assests/logo.png";

function Header() {
  return (
    <div className="header">
      <div className="header-container">
        <div className="logo-container">
          <img className="logo-img ml-2" src={Logo} alt="logo" />
          <span className="title ml-1">Corteva</span>
        </div>
        <div className="search-container"></div>
      </div>
    </div>
  );
}

export default Header;
