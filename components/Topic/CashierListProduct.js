"use client";
import React, { useEffect, useState } from "react";
import { useContext } from "react";

import CartContext from "../../store/CartContext";
import CashierForm from "./CashierForm";
import axios from "axios";

export const reduceStock = async (props, amount, setAvailableQuantity) => {
  const updatedStokecer = props.stokecer - amount;
  await axios.put(`http://localhost:3001/api/topics/${props.id}`, {
    newStokEcer: updatedStokecer,
  });

  setAvailableQuantity(updatedStokecer);
};

const CashierListProduct = (props) => {
  const cartCtx = useContext(CartContext);

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };
  const price = formatToRupiah(props.price);
  const grosir = formatToRupiah(props.grosir);

  const [availableQuantity, setAvailableQuantity] = useState(props.stokecer);

  useEffect(() => {
    setAvailableQuantity(props.stokecer);
  }, [props.stokecer]);

  const addToCartHandler = async (amount, priceType) => {
    if (availableQuantity >= amount) {
      const confirmed = window.confirm("Menambahkan item ke keranjang?");

      if (confirmed) {
        // const updatedStokecer = availableQuantity - amount;
        // await axios.put(`http://localhost:3000/api/topics/${props.id}`, {
        //   newStokEcer: updatedStokecer,
        // });

        // setAvailableQuantity(updatedStokecer);
        cartCtx.addItem({
          id: props.id,
          brand: props.brand,
          type: props.type,
          amount: amount,
          price: priceType === "ecer" ? props.price : props.grosir,
          sell: props.sell,
          stokecer: props.stokecer,
          stok: props.stok,
          grosir: props.grosir,
          faktur: props.faktur,
          priceType: priceType,
        });
      }
    } else alert("Jumlah yang diminta melebihi stok yang tersedia");
  };

  const [hargadua, setHargadua] = useState(false);

  const handleClickHargadua = () => {
    setHargadua(true);
  };

  if (props.stokecer === 0) {
    return null;
  }

  return (
    <>
      <div className="flex w-full mt-2 mb-1 border row">
        <div
          className="w-full col-span-3 text-lg font-bold cursor-pointer"
          onClick={handleClickHargadua}
        >
          {props.brand}
          <p className="font-light">Stok Ecer: {props.stokecer}</p>
        </div>
        <div className="w-full col-span-3 text-start">{props.faktur}</div>
        <div className="w-full col-span-3">
          <div className="text-xl font-semibold">
            Hrg. 1: {price} /{props.satuanecer}
          </div>
          <div className="end-0">
            {" "}
            <CashierForm
              id={props.id}
              onAddToCart={(amount, priceType) =>
                addToCartHandler(amount, priceType)
              }
              priceType="ecer"
            />
          </div>
        </div>

        <div className="w-full col-span-3">
          {hargadua && (
            <div>
              {" "}
              <div className="font-semibold">Hrg. 2: {grosir}</div>
              <div>
                {" "}
                <CashierForm
                  id={props.id}
                  onAddToCart={(amount, priceType) =>
                    addToCartHandler(amount, priceType)
                  }
                  priceType="grosir"
                />
              </div>{" "}
            </div>
          )}
        </div>
      </div>

      {/*  <div className="flex justify-center mt-3">
        <div className="mb-2 shadow-xl card card-compact w-96 bg-base-100">
          <div className="card-body">
            <h2 className="card-title">{props.brand}</h2>

            <h3 className="font-bold">Harga 1: {price}</h3>

            <h3 className="font-bold">Harga 2: {grosir}</h3>
            <p>Stok Ecer: {props.stokecer}</p>
            
            <div className="justify-start card-actions">
              <div className="flex">
                <CashierForm
                  id={props.id}
                  onAddToCart={(amount, priceType) =>
                    addToCartHandler(amount, priceType)
                  }
                  priceType="ecer"
                />
                <p>* Harga 1</p>
              </div>

              <div className="flex">
                <CashierForm
                  id={props.id}
                  onAddToCart={(amount, priceType) =>
                    addToCartHandler(amount, priceType)
                  }
                  priceType="grosir"
                />
                <p>* Harga 2</p>
                </div> */}
      {/* <div className="flex justify-start mt-3">
                <CashierForm
                  id={props.id}
                  onAddToCart={(amount, priceType) =>
                    addToCartHandler(amount, priceType)
                  }
                  priceType="grosir"
                />
                <p>* Grosir</p>
              </div> */}
      {/* <CashierForm id={props.id} onAddToCart={addToCartHandler} /> */}
      {/* </div>
          </div>
          <span className="mx-5 text-xs">No. Faktur : {props.faktur}</span>
        </div>
            </div>*/}
    </>
  );
};

export default CashierListProduct;
