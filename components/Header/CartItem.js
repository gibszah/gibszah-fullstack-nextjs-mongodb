import React from "react";

const CartItem = (props) => {
  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };
  const price = formatToRupiah(props.price);
  const displayPrice =
    props.priceType === "ecer"
      ? formatToRupiah(props.price)
      : formatToRupiah(props.grosir);

  const grosir = formatToRupiah(props.grosir);
  const stoke = parseFloat(props.stokecer) * parseFloat(props.stok);

  return (
    <li>
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <div className="justify-center text-center ">
                    <span className="flex">
                      <strong>{props.brand}</strong>
                    </span>
                    {/* <span>{stoke}</span> */}
                    <span className="flex">{price}</span>

                    <span> &nbsp; x {props.amount}</span>
                  </div>
                </td>
                <td>{props.totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button
          type="button"
          className="mx-2 btn btn-primary btn-sm hide-on-print"
          onClick={props.onRemove}
        >
          -
        </button>
        {/* <button
          type="button"
          className="btn btn-neutral btn-sm hide-on-print"
          onClick={props.onAdd}
        >
          +
        </button> */}
      </div>
    </li>
  );
};

export default CartItem;
