"use client";
import React, { useEffect, useState } from "react";
import { getTopics } from "../UI/apiClient";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Selling = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      setTopics(data.topics || []);
    };
    fetchTopics();
  }, []);

  const [searchKey, setSearchKey] = useState("");

  const filterProduk = topics.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return t?.namaobat?.name.toLowerCase().includes(lowerCase);
  });

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const total = filterProduk
    .filter((item) => item.stokecer > 0)
    .map((item) => item.buy)
    .reduce((acc, value) => acc + value, 0);

  const totalSeluruh = filterProduk
    .map((item) => item.buy)
    .reduce((acc, value) => acc + value, 0);

  const [selectedMonth, setSelectedMonth] = useState("");
  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };
  // const handleMonthChange = (event) => {
  //   setSelectedMonth(event.target.value);
  // };

  // const generateDateRange = (selectedMonth) => {
  //   if (selectedMonth === "") {
  //     return null; // Tidak ada bulan yang dipilih, mungkin tampilkan pesan kesalahan atau tangani dengan cara lain
  //   }

  //   if (selectedMonth === new Date().getMonth().toString()) {
  //     // Bulan saat ini, gunakan tanggal sekarang sebagai awal dan akhir
  //     const startDate = new Date();
  //     const endDate = new Date();
  //     return { startDate, endDate };
  //   }

  //   // Tambahkan logika untuk bulan-bulan lain
  //   switch (selectedMonth) {
  //     case "12": //desember
  //       return {
  //         startDate: new Date("2023-12-01"),
  //         endDate: new Date("2023-12-31"),
  //       };
  //     case "11":
  //       return {
  //         startDate: new Date("2023-11-01"),
  //         endDate: new Date("2023-11-30"),
  //       };
  //     case "10":
  //       return {
  //         startDate: new Date("2023-10-01"),
  //         endDate: new Date("2023-10-31"),
  //       };
  //     case "9":
  //       return {
  //         startDate: new Date("2023-9-01"),
  //         endDate: new Date("2023-9-30"),
  //       };
  //     case "8":
  //       return {
  //         startDate: new Date("2023-8-01"),
  //         endDate: new Date("2023-8-31"),
  //       };
  //     case "7":
  //       return {
  //         startDate: new Date("2023-7-01"),
  //         endDate: new Date("2023-7-31"),
  //       };
  //     case "6":
  //       return {
  //         startDate: new Date("2023-12-01"),
  //         endDate: new Date("2023-12-30"),
  //       };
  //     case "5":
  //       return {
  //         startDate: new Date("2023-5-01"),
  //         endDate: new Date("2023-5-31"),
  //       };
  //     case "4":
  //       return {
  //         startDate: new Date("2023-4-01"),
  //         endDate: new Date("2023-4-30"),
  //       };
  //     case "3":
  //       return {
  //         startDate: new Date("2023-3-01"),
  //         endDate: new Date("2023-3-31"),
  //       };
  //     case "2":
  //       return {
  //         startDate: new Date("2023-2-01"),
  //         endDate: new Date("2023-2-29"),
  //       };
  //     case "1":
  //       return {
  //         startDate: new Date("2023-1-01"),
  //         endDate: new Date("2023-1-31"),
  //       };
  //     // Tambahkan case lain sesuai dengan bulan yang diinginkan
  //     default:
  //       return null; // Bulan tidak dikenali, mungkin tampilkan pesan kesalahan
  //   }
  // };

  const generateDateRange = (selectedMonth) => {
    const startDate = startOfMonth(selectedMonth);
    const endDate = endOfMonth(selectedMonth);
    return { startDate, endDate };
  };
  const dateRange = generateDateRange(selectedMonth);

  // Gunakan dateRange dalam filterProduk atau di tempat yang sesuai
  const filteredProduk = dateRange
    ? filterProduk
        .filter(
          (item) =>
            item.stokecer > 0 &&
            new Date(item.createdAt) >= dateRange.startDate &&
            new Date(item.createdAt) <= dateRange.endDate
        )
        .map((item) => item.buy)
    : [];

  const totalBulan = filteredProduk.reduce((acc, value) => acc + value, 0);

  return (
    <div>
      <div className="shadow stats bg-emerald-400">
        <div className="stat ">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <div className="font-bold stat-title">Total Pembelian</div>
          <div className="text-gray-600 stat-value">
            {formatToRupiah(total)}
          </div>
          <div className="stat-desc"> stok lebih dari 0</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="font-bold stat-title">Total Pembelian</div>
          <div className="text-gray-600 stat-value">
            {formatToRupiah(totalSeluruh)}
          </div>
          <div className="stat-desc">keseluruhan stok dari awal</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="avatar online">
              <div className="w-16 rounded-full"></div>
            </div>
          </div>
          <div className="stat-value">{formatToRupiah(totalBulan)}</div>
          <div className="stat-title">
            <div className="mt-5">
              {/* <select
                className="w-full max-w-xs select select-accent"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                <option disabled selected>
                  Select Month!
                </option>
                <option value="12">Desember 2023</option>
                <option value="11">November 2023</option>
                <option value="10">October 2023</option>
                <option value="9">September 2023</option>
                <option value="8">Agustus</option>
                <option value="7">Juli</option>
                <option value="6">Juni</option>
                <option value="5">Mei</option>
                <option value="4">April</option>
                <option value="3">Maret</option>
                <option value="2">Februari</option>
                <option value="1">Januari</option>
              </select> */}

              <DatePicker
                selected={selectedMonth}
                onChange={handleMonthChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="w-full max-w-xs select select-accent"
              />
            </div>
          </div>
          <div className="stat-desc text-secondary">Jumlah barang di order</div>
        </div>
      </div>
    </div>
  );
};

export default Selling;
