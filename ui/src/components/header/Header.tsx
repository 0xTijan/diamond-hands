import { Heading } from "@chakra-ui/react";
import React from "react";
import { ConnectButton } from "web3uikit";

const Header = () => {
  return(
    <div className="header">
      <Heading as="h4" size='4xl'>💎✋</Heading>
      <Heading as="h2" size="4xl">DIAMOD HANDS</Heading>
      <p>Lock your funds to be come part of Diamond Hands Gang and receive free NFT!</p>

      <ConnectButton />
    </div>
  )
}

export default Header;