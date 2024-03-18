"use client";
import React from "react";
import { getTopics } from "../UI/apiClient";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const getTransaksi = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/transaksi", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("error loading topics: ", error);
  }
};

const formatToRupiah = (number) => {
  if (number === "") return ""; // Return empty string if no input

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  return formatter.format(number);
};

const Laba = () => {
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      setTopics(data.topics || []);
    };
    fetchTopics();
  }, []);

  const [trans, setTrans] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransaksi();
        setTrans(response.transaksis);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [searchKey, setSearchKey] = useState("");

  const filterProduk = topics.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return t?.namaobat?.name.toLowerCase().includes(lowerCase);
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateTrans, setStartDateTrans] = useState(null);
  const [endDateTrans, setEndDateTrans] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  const handleDateChangeTrans = (dates) => {
    const [start, end] = dates;
    setStartDateTrans(start);
    setEndDateTrans(end);
  };

  const today = new Date(); // Dapatkan tanggal hari ini
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Dapatkan tanggal awal bulan ini

  const totalValues = filterProduk.reduce(
    (accumulator, currentItem) => {
      const buy = parseFloat(currentItem.buy);
      const ecer = parseFloat(currentItem.ecer);

      const itemDate = new Date(currentItem.createdAt);

      // Check if buy and ecer are valid numbers
      if (!isNaN(buy)) {
        accumulator.totalBuy += buy;
      }

      if (!isNaN(ecer)) {
        accumulator.totalEcer += ecer;
      }

      if (itemDate >= firstDayOfMonth) {
        // Check if buy and ecer are valid numbers
        if (!isNaN(buy)) {
          accumulator.totalBuyMonth += buy;
        }
      }

      if (
        startDate &&
        endDate &&
        itemDate >= startDate &&
        itemDate <= endDate
      ) {
        if (!isNaN(buy)) {
          accumulator.totalSelectDate += buy;
        }
      }

      return accumulator;
    },
    { totalBuy: 0, totalEcer: 0, totalBuyMonth: 0, totalSelectDate: 0 }
  );

  const totalTrans = trans.reduce(
    (accumulator, currentItem) => {
      const price = parseFloat(currentItem.price);
      const itemDate = new Date(currentItem.createdAt);

      // Check if buy and ecer are valid numbers
      if (!isNaN(price)) {
        accumulator.totalPrice += price;
      }
      if (itemDate >= firstDayOfMonth) {
        // Check if buy and ecer are valid numbers
        if (!isNaN(price)) {
          accumulator.totalPriceBulanIni += price;
        }
      }
      if (
        startDateTrans &&
        endDateTrans &&
        itemDate >= startDateTrans &&
        itemDate <= endDateTrans
      ) {
        if (!isNaN(price)) {
          accumulator.totalSelectDateTrans += price;
        }
      }

      return accumulator;
    },
    { totalPrice: 0, totalPriceBulanIni: 0, totalSelectDateTrans: 0 }
  );

  const totalProfit = totalTrans.totalPrice - totalValues.totalBuy;
  const totalProfitBulanIni =
    totalTrans.totalPriceBulanIni - totalValues.totalBuyMonth;

  const totalProfitTanggalTertentu =
    totalTrans.totalSelectDateTrans - totalValues.totalSelectDate;

  return (
    <div className="stack">
      <div className="w-auto text-center shadow-md card bg-base-200">
        <div className="card-body text-start">
          <tr>
            Total GrossProfit Keseluruhan:{" "}
            <strong> {formatToRupiah(totalProfit)}</strong>
            <p className="text-sm italic">
              (GrossProfit = Penjualan - Pembelian)
            </p>
          </tr>
          <tr>Penjualan: {formatToRupiah(totalTrans.totalPrice)}</tr>
          <tr>Pembelian: {formatToRupiah(totalValues.totalBuy)}</tr>
          <hr />
          <div className="bg-gray-300 rounded card-body ">
            <tr>
              GrossProfit this Month:{" "}
              <strong> {formatToRupiah(totalProfitBulanIni)}</strong>
              <p className="text-sm italic">
                (penjualan bulan ini - pembelian bulan ini)
              </p>
            </tr>
            <tr>
              {" "}
              <p className="text-sm italic">
                Penjualan Bulan ini:{" "}
                {formatToRupiah(totalTrans.totalPriceBulanIni)}
              </p>
              <p className="text-sm italic">
                Pembelian Bulan ini: {formatToRupiah(totalValues.totalBuyMonth)}
              </p>
            </tr>
          </div>
        </div>
        <div className="mx-2 rounded shadow-lg text-start card-body bg-zinc-300">
          {" "}
          <h1 className="font-bold"> PERHITUNGAN SELISIH BELI & JUAL </h1>
          <div>
            {" "}
            Waktu Penjualan: &nbsp;
            <DatePicker
              selectsRange
              startDate={startDateTrans}
              endDate={endDateTrans}
              onChange={handleDateChangeTrans}
              placeholderText="Select date range"
            />{" "}
            <p>Penjualan: {formatToRupiah(totalTrans.totalSelectDateTrans)}</p>
          </div>
          <hr className="py-1 bg-slate-100" />
          <div>
            Waktu Pembelian: &nbsp;
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              placeholderText="Select date range"
            />{" "}
            <p>
              Pembelian: &nbsp;
              {formatToRupiah(totalValues.totalSelectDate)}
            </p>
          </div>
          <div>
            Hasil: {formatToRupiah(totalProfitTanggalTertentu)}
            <p className="text-sm italic">(penjualan - pembelian)</p>
          </div>
        </div>

        <div className="card-body">
          {/* {(() => {
            let totalPer = 0; // Inisialisasi di luar loop
            return filterProduk.map((t) => {
              if (t.stokecer === 0) {
                return null;
              }
              const perkalian = t.stokecer * t.ecer;

              totalPer += perkalian;

              // Hapus fragment yang tidak perlu
              return <div key={t._id}></div>;
            });
          })()} */}

          <div>
            <tr className="text-end">
              Asset in Cashier: &nbsp;&nbsp;{" "}
              <strong>
                {formatToRupiah(
                  filterProduk.reduce(
                    (total, t) =>
                      t.stokecer !== 0 ? total + t.stokecer * t.ecer : total,
                    0
                  )
                )}
              </strong>
            </tr>
            <tr className="text-end">
              Revenue: <strong>{formatToRupiah(totalTrans.totalPrice)}</strong>
            </tr>
            <tr className="text-end">
              Purchase: <strong>{formatToRupiah(totalValues.totalBuy)}</strong>
            </tr>
            <tr className="text-end">
              Asset in Cashier minus 15%:{" "}
              <strong>
                {" "}
                {formatToRupiah(
                  filterProduk
                    .filter((t) => t.stokecer !== 0)
                    .reduce((total, t) => total + t.stokecer * t.ecer, 0) / 1.15
                )}
              </strong>
            </tr>
            <tr className="text-end">
              Purchase - Asset in Cashier minus 15%:{" "}
              <strong>
                {formatToRupiah(
                  totalValues.totalBuy -
                    filterProduk
                      .filter((t) => t.stokecer !== 0)
                      .reduce((total, t) => total + t.stokecer * t.ecer, 0) /
                      1.15
                )}
              </strong>
            </tr>

            <tr className="text-end">
              Konsinyasi:{" "}
              <strong>
                {" "}
                {formatToRupiah(
                  filterProduk
                    .filter(
                      (t) =>
                        t.stokecer !== 0 &&
                        // t.buy <= 1 &&
                        t?.pbf?.name === "Konsinyasi"
                    )
                    .reduce((total, t) => total + t.stokecer * t.ecer, 0) / 1.15
                )}
              </strong>
            </tr>

            <tr className="text-end">
              Asset in Cashier minus 15% - kongsi:{" "}
              <strong>
                {" "}
                {formatToRupiah(
                  filterProduk
                    .filter(
                      (t) =>
                        t.stokecer !== 0 &&
                        t.buy > 1 &&
                        t?.pbf?.name !== "Konsinyasi"
                    )
                    .reduce((total, t) => total + t.stokecer * t.ecer, 0) / 1.15
                )}
              </strong>
            </tr>
            <tr className="text-end">
              Profit:{" "}
              <strong>
                {formatToRupiah(
                  totalTrans.totalPrice -
                    (totalValues.totalBuy -
                      filterProduk
                        .filter((t) => t.stokecer !== 0)
                        .reduce((total, t) => total + t.stokecer * t.ecer, 0) /
                        1.15)
                )}
              </strong>{" "}
            </tr>
            {/* <tr className="text-end">
              merk:{" "}
              <strong>
                {" "}
                {filterProduk
                  .filter(
                    (t) =>
                      t.stokecer !== 0 &&
                      t.buy > 1 &&
                      t?.pbf?.name !== "Konsinyasi"
                  )
                  .reduce((total, t) => total + t.merk, 0)}
              </strong>
            </tr> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laba;
