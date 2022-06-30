import { Heading } from "@chakra-ui/react";
import React from "react";
import { ConnectButton } from "web3uikit";

import "./Header.css";

const Header = () => {
  return(
    <>
      <div className="header">
        <span className="a">💎✋</span><br />
        <span className="b">DIAMOD HANDS</span>
        <p className="p">Lock your funds to hodl easily through crypto pumps and dumps!</p>
      </div>
      <div className="connect-btn">
        <ConnectButton moralisAuth />
      </div>
    </>
  )
}

export default Header;