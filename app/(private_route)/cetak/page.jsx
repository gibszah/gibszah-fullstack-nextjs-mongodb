"use client";
import CartItem from "@/components/Header/CartItem";
import CartContext from "@/store/CartContext";
import React, { useContext } from "react";

const CetakStruk = () => {
  const cartCtx = useContext(CartContext);

  return (
    <div>
      <div>
        {cartCtx.items.map((t) => {
          return (
            <CartItem
              key={t.id}
              brand={t.brand}
              amount={t.amount}
              price={t.price}
              stokecer={t.stokecer}
              stok={t.stok}
              onRemove={cartItemRemoveHandler.bind(null, t.id)}
              onAdd={cartItemAddHandler.bind(null, t)}
              totalAmount={formatToRupiah(t.amount * t.price)}
            />
          );
        })}
      </div>
      <button className="btn" onClick={() => window.print()}>
        Cetak Struk
      </button>
    </div>
  );
};

export default CetakStruk;
