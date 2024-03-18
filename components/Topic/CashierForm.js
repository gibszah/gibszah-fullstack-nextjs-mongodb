import { useRef, useState } from "react";

import Input from "../UI/input";

const CashierForm = (props) => {
  const [amountIsValid, setAmountIsValid] = useState(true);
  const amountInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredAmount = amountInputRef.current.value;
    const enteredAmountNumber = +enteredAmount;

    let isValid = true;

    if (props.priceType === "ecer") {
      // Validasi untuk harga ecer
      isValid =
        enteredAmount.trim().length !== 0 &&
        enteredAmountNumber >= 1 &&
        enteredAmountNumber <= 20;
    } else if (props.priceType === "grosir") {
      // Validasi untuk harga grosir
      isValid =
        enteredAmount.trim().length !== 0 &&
        enteredAmountNumber > 1 &&
        enteredAmountNumber <= 100;
    }

    if (!isValid) {
      setAmountIsValid(false);
      return;
    }

    // if (
    //   enteredAmount.trim().length === 0 ||
    //   enteredAmountNumber < 1 ||
    //   enteredAmountNumber > 20
    // )
    //  {
    //   setAmountIsValid(false);
    //   return;
    // }
    // Mengidentifikasi jenis harga berdasarkan priceType
    if (props.priceType === "ecer") {
      // Menambahkan harga ecer ke keranjang
      props.onAddToCart(enteredAmountNumber, "ecer");
    }
    if (props.priceType === "grosir") {
      // Menambahkan harga ecer ke keranjang
      props.onAddToCart(enteredAmountNumber, "grosir");
    }
    // else {
    //   // Menambahkan harga grosir ke keranjang
    //   props.onAddToCart(enteredAmountNumber, "grosir");
    // }
  };

  return (
    <form className="flex" onSubmit={submitHandler}>
      <Input
        ref={amountInputRef}
        label="jml."
        input={{
          id: "amount_" + props.id,
          type: "number",
          min: props.priceType === "grosir" ? "2" : "1", // Menyesuaikan nilai minimal berdasarkan priceType
          max: props.priceType === "grosir" ? "100" : "20", // Menyesuaikan nilai maksimal berdasarkan priceType
          step: "1",
          defaultValue: "1",
        }}
      />
      <button className="mx-5 btn btn-outline btn-secondary btn-sm">
        {" "}
        Add
      </button>
      {!amountIsValid && <p>Please enter a valid amount (1-5)</p>}
    </form>
  );
};

export default CashierForm;
