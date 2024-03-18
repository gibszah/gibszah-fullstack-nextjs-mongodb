import React from "react";
import { useContext } from "react";

import CartContext from "../../store/CartContext";

const HeaderCartButton = (props) => {
  const cartCtx = useContext(CartContext);

  const { items } = cartCtx;

  const numberOfCartItems = items.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);

  return <span>{numberOfCartItems}</span>;
};

export default HeaderCartButton;
