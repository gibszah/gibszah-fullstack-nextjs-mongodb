"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
// import AuthLogOut from "../auth/AuthLogOut";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import html2pdf from "html2pdf.js";

import { reduceStock } from "@/components/Topic/CashierListProduct";
import StatsNav from "./StatsNav";

import "./Cart.css";

import HeaderCartButton from "./HeaderCartButton";
import CartContext from "@/store/CartContext";
import CartItem from "./CartItem";

const Navbar = () => {
  const cartCtx = useContext(CartContext);

  const { data: session } = useSession();
  const { data, status } = useSession();

  const router = useRouter();
  const isAuth = status === "authenticated";

  // const [logoutTimeoutId, setLogoutTimeoutId] = useState(null);
  const performLogout = () => {
    console.log("Melakukan logout...");
    signOut({ callbackUrl: "/login" });
  };

  // if (isAuth) {
  //   const timeoutId = setTimeout(performLogout, 10000); // 30000000 milidetik (30000 detik)
  //   setLogoutTimeoutId(timeoutId);
  // }

  // const [logoutTimeoutId, setLogoutTimeoutId] = useState(null);

  // useEffect(() => {
  //   if (isAuth) {
  //     const timeoutId = setTimeout(performLogout, 30000); // 30000 milidetik (30 detik)
  //     setLogoutTimeoutId(timeoutId);
  //   } else {
  //     clearTimeout(logoutTimeoutId); // Membersihkan timeout jika tidak lagi terotentikasi
  //   }

  //   return () => {
  //     if (logoutTimeoutId) {
  //       clearTimeout(logoutTimeoutId); // Membersihkan timeout sebelum komponen di-unmount
  //     }
  //   };
  // }, [isAuth, logoutTimeoutId]);

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const [swapOn, setSwapOn] = useState(false);

  const handleSwap = () => {
    setSwapOn(true);
  };
  const handleOff = () => {
    setSwapOn(false);
  };

  const formatToRp = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const totalAmount = formatToRupiah(cartCtx.totalAmount);
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const cartItems = (
    <ul>
      {cartCtx.items.map((t) => {
        return (
          <CartItem
            key={t.id}
            brand={t.brand}
            amount={t.amount}
            price={t.price}
            grosir={t.grosir}
            stokecer={t.stokecer}
            stok={t.stok}
            faktur={t.faktur}
            onRemove={cartItemRemoveHandler.bind(null, t.id)}
            // onAdd={cartItemAddHandler.bind(null, t)}
            totalAmount={formatToRupiah(t.amount * t.price)}
          />
        );
      })}
    </ul>
  );

  const [notif, setNotif] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // await new Promise((resolve) => setTimeout(resolve, 500));

    const confirmed = window.confirm("Jenengan sampun yakin?");

    if (confirmed) {
      const transaksiItem = cartCtx.items.map((item) => ({
        name: item.brand,
        price: item.amount * item.price,
        jumlah: item.amount,
        faktur: item.faktur,
        user: data?.user?.name,
      }));

      try {
        const currentTime = new Date();
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        const dateFormatter = new Intl.DateTimeFormat("id-ID", options);

        // //mengurangi
        // // Mengumpulkan semua operasi pengurangan stok dalam sebuah array promise
        // const reduceStockPromises = cartCtx.items.map(async (item) => {
        //   if (item.amount > 0) {
        //     await reduceStock(item.brand, item.amount);
        //   }
        // });

        // // Menjalankan semua operasi pengurangan stok secara parallel
        // await Promise.all(reduceStockPromises);

        // await new Promise((resolve) => setTimeout(resolve, 100));
        const res = await fetch("http://localhost:3001/api/transaksi", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            transaksiItems: transaksiItem,
            jam: dateFormatter.format(currentTime),
            customerBayars: customerBayar,
          }),
        });

        if (res.ok) {
          // window.location.reload();
          // console.log(transaksiItem, dateFormatter.format(currentTime));
          // window.print();
          setNotif(true);
          handleOrder();
          // setTimeout(() => {
          //   setNotif(false);
          //   window.location.reload();
          // }, 1200);
          setShowButton(false);
          console.log("Product berhasil dibuat!");
        } else {
          console.error("Error creating product");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return null;
    }
  };

  const [showButton, setShowButton] = useState(true);

  const [availableQuantity, setAvailableQuantity] = useState(
    cartCtx.items.stokecer
  );

  const handleOrder = async () => {
    // const confirmed = window.confirm("Anda yakin sudah benar?");

    const reduceStockPromises = cartCtx.items.map(async (item) => {
      if (item.amount > 0) {
        await reduceStock(item, item.amount, setAvailableQuantity);
      }
    });
    await Promise.all(reduceStockPromises);
    handlePrint();
    setTimeout(() => {
      setNotif(false);
      window.location.reload();
    }, 1200);
  };

  const handlePrint = () => {
    const currentTime = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const dateFormatter = new Intl.DateTimeFormat("id-ID", options);

    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print</title>");

    // Menambahkan media query CSS
    printWindow.document.write(`
    <style>
      @media print {
        body * {
          display: none;
  
        }
        .printable-content {
          display: flex !important;
          color: black;
          font-size: 12px;
          flex: 1;
          margin-bottom: 1px;

        }
        .stamp {
          display: block !important;
          font-size: 9px;
        }
     
        .title-print {
          display: block !important;
          text-align: center;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 17px;
          font-weight: bold;
          letter-spacing: 7px;
          margin-bottom: 2px;
        
          }
        .logo-content {
          display: block;
          width: 50px;
          height: auto;
        }
        .pembeli {
          display: grid;
          font-size: 10px;
          grid-row-gap: 1px;          
        }
      }
    </style>
  `);

    printWindow.document.write("</head><body>");

    // Konten yang ingin dicetak (dengan kelas printable-content)
    printWindow.document.write(
      `<div class="title-print"> <p class="title-print">APOTEK KAIRO</p> </div>`
    );
    let total = 0;

    cartCtx.items.forEach((item) => {
      total += item.amount * item.price;

      printWindow.document.write(
        `<div class="printable-content">
        <p class="printable-content"> ${item.brand} </p>
        <p class="printable-content"> ${formatToRp(item.price)} x${
          item.amount
        } &nbsp ${formatToRp(item.amount * item.price)} </p>
  
       

        </div>`
      );
    });

    printWindow.document.write(
      `
      <div class="pembeli">
      <p class="pembeli">Total: ${formatToRp(total)} 
      </p>
      <p class="pembeli"> Bayar:  ${formatToRp(customerBayar)}</p>
      <p class="pembeli">Kembalian:  ${formatToRp(customerBayar - total)}</p>
      </div>
      `
    );

    printWindow.document.write(
      `<p class="stamp">Time: ${dateFormatter.format(currentTime)}</p>`
    );

    printWindow.document.write(
      `<p class="stamp">Kasir: ${data?.user?.name}</p>
      <p class="stamp">"Terimakasih setulus-tulusnya telah berbelanja di kami."</p>

      <p class="stamp">Barang yang sudah dibeli tidak bisa dikembalikan.</p>
      
       <p class="stamp">...</p>`
    );

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    setTimeout(() => {
      if (printWindow) {
        printWindow.print();
        // Simpan sebagai file PDF
        html2pdf(printWindow.document.body, {
          margin: 10,
          filename: "struk.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 }, // Sesuaikan skala sesuai kebutuhan
          jsPDF: { unit: "mm", format: "a7", orientation: "portrait" }, // Gunakan format kertas yang sesuai
        });
      } else {
        console.error("Jendela cetak tidak berhasil dibuka.");
      }
    }, 300); // Delay 1000 milidetik (1 detik)
    // printWindow.print();

    // Simpan sebagai file PDF
  };

  const [customerBayar, setCustomerBayar] = useState(0);
  const handleInputChange = (event) => {
    // Memastikan bahwa nilai yang dimasukkan adalah angka positif atau 0
    const inputValue = parseFloat(event.target.value) || 0;

    setCustomerBayar(inputValue);
  };

  // console.log(customerBayar);

  let totalBayar = 0;

  // Iterasi melalui setiap item dalam cartCtx.items
  cartCtx.items.forEach((item) => {
    totalBayar += item.price * item.amount;
  });

  const kembalian = customerBayar - totalBayar;

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAktif = () => {
    // Mengatur tombol menjadi dinonaktifkan ketika di klik
    setIsButtonDisabled(true);

    // Setelah 2 detik, mengatur tombol menjadi aktif kembali
    setTimeout(() => {
      setIsButtonDisabled(true);
    }, 1000);
  };

  return (
    <>
      <div className="mx-2">
        {notif && (
          <div className="toast">
            <div className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 stroke-current shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>{" "}
              <span>TRANSAKSI BERHASIL ^_ !</span>{" "}
            </div>
          </div>
        )}

        <div className=" navbar bg-base">
          <div className="navbar-start">
            <Link
              href="/"
              className="flex text-xl text-green-500 normal-case btn btn-ghost"
            >
              <div className="mt-2 indicator">
                <span className="mb-1 indicator-item badge badge-success">
                  KAIRO
                </span>
                <div>APOTEK</div>
              </div>
              {/* <div>APOTEK</div>
              <div>KAIRO</div> */}
            </Link>
          </div>

          <div className="gap-2 mx-5 navbar-center">
            <Link href="/fastmoving">
              <button className="btn btn-sm">Fast Moving</button>
            </Link>
            <div>
              <Link href="/cashier">
                <button className="btn btn-sm">CASHIER</button>
              </Link>
            </div>
            <div>
              <Link href="/riwayatTransaksi">
                <button className="btn btn-sm">HISTORY</button>
              </Link>
            </div>
            <div>
              <Link href="/stok">
                <button className="btn btn-sm">STOK</button>
              </Link>
            </div>
            <div>
              <Link href="/pengeluaran">
                <button className="btn btn-sm">PENGELUARAN</button>
              </Link>
            </div>
            <div>
              <Link href="/produk">
                <button className="btn btn-sm">Produk</button>
              </Link>
            </div>
            <div>
              <Link href="/loan">
                <button className="btn btn-sm active:to-blue-600">
                  Hutang
                </button>
              </Link>
            </div>
            <div>
              {session?.user?.role === "admin" && (
                <Link href="/revenue">
                  <button className="btn btn-sm">Revenue</button>
                </Link>
              )}
            </div>
            <div>
              {session?.user?.role === "admin" && (
                <Link href="/dashboard">
                  <button className="btn btn-sm">Dashboard</button>
                </Link>
              )}
            </div>
          </div>
          <div className="navbar-end">
            <button
              className="btn-sm"
              onClick={() => window.my_modal_5.showModal()}
            >
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="bg-white indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-black bg-white badge badge-sm indicator-item">
                    <HeaderCartButton />
                  </span>
                </div>
              </label>
            </button>
            {/* <div>
              <AuthLogOut />
            </div> */}
            <div className="mx-2 ">
              <div className="badge badge-secondary">
                {isAuth ? (
                  <strong>{data?.user?.name}</strong>
                ) : (
                  <button type="button" onClick={() => router.push("/auth")}>
                    <strong>Login</strong>
                  </button>
                )}
              </div>
              <div className="mx-1 badge-outline badge badge-secondary">
                {isAuth ? (
                  <button onClick={() => signOut()}>logout</button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* Open the modal using ID.showModal() method */}

          <dialog
            id="my_modal_5"
            className="text-black modal modal-top sm:modal-middle"
          >
            <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
              {hasItems ? cartItems : <div>Tidak ada Order-an</div>}

              <div className="flex justify-end mt-5 text-end">
                <span>Total bayar: </span>
                <span className="mx-2"> {totalAmount}</span>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bayar:
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="mx-1 text-gray-500 sm:text-sm">
                      Rp. &nbsp;&nbsp;{" "}
                    </span>{" "}
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 mx-3 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder=" 0.00"
                    value={customerBayar}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <span className="mx-1 text-gray-500 sm:text-sm">
                    Kembalian: &nbsp; {formatToRupiah(kembalian)}
                  </span>
                </div>
              </div>

              <div className="card-actions hide-on-print">
                {hasItems && (
                  <button
                    className="btn btn-primary btn-block hide-on-print"
                    type="submit"
                    disabled={isButtonDisabled}
                    // onClick={handleOrder}
                  >
                    Order
                  </button>
                )}
              </div>

              <div className="modal-action">
                {/* if there is a button in form, it will close the modal */}
                <button
                  type="button"
                  onClick={() => window.my_modal_5.close()}
                  className="btn"
                >
                  Close
                </button>
              </div>
            </form>
          </dialog>

          <div className="flex-none">
            {/* <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">
                  <HeaderCartButton />
                </span>
              </div>
            </label>
            <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                {cartItems}

                <div>
                  <span className="flex">Total Amount</span>
                  <span>{totalAmount}</span>
                </div>

                <div className="card-actions">
                  {hasItems && (
                    <button className="btn btn-primary btn-block">Order</button>
                  )}
                </div>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto bg-gray-700 rounded">
        <div className="flex justify-end row">
          <div className="mt-2 mb-2 text-center">{swapOn && <StatsNav />}</div>
          <div className="mt-2 mb-2 text-center ">
            <label className="swap swap-flip text-9xl">
              {/* this hidden checkbox controls the state */}
              <input type="checkbox" />
              <div onClick={handleOff} className="swap-on">
                👀
              </div>
              <div onClick={handleSwap} className="swap-off">
                😍
              </div>
            </label>
          </div>
        </div>
        {/* The button to open modal */}
        {/* <label htmlFor="my_modal_6" className="btn btn-outline btn-accent">
          Revenue
        </label> */}

        {/* Put this part before </body> tag */}
        {/* <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="w-full modal" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Hello!</h3>
            <div className="w-fit">
              <StatsNav />
            </div>
            <div className="modal-action">
              <label htmlFor="my_modal_6" className="btn">
                Close!
              </label>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Navbar;
