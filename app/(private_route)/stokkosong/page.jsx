"use client";
import React from "react";
import { getTopics } from "../../../components/UI/apiClient";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

const StokKosong = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      setTopics(data.topics || []);
    };
    fetchTopics();
  }, []);

  const [searchKey, setSearchKey] = useState("");

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };
  const filterProduk = topics.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return t?.namaobat?.name.toLowerCase().includes(lowerCase);
  });

  const today = new Date();
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <div className="w-auto text-center ">
        <div className="w-full max-w-xs mx-10 text-black form-control">
          <label className="label">
            <span className="label-text">Cari Produk ?</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="w-full max-w-xs input input-bordered"
            value={searchKey}
            onChange={handleSearch}
          />
        </div>

        <div className="mx-10 ">
          <div>STOK KOSONG */</div>
          <h2 className="text-lg badge">
            Tanggal Hari ini: {today.toLocaleString()}
          </h2>
        </div>

        <div className="w-auto mx-2 text-center rounded shadow-lg card-body bg-zinc-300">
          {" "}
          <div className="w-auto mx-2 text-center rounded shadow-lg card-body bg-zinc-300">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              placeholderText="Select date range"
            />{" "}
          </div>
        </div>
        <div className="card-body">
          {filterProduk
            .filter((t) => t.stokecer < 3)
            .filter((t) => {
              const createdAtDate = new Date(t.updatedAt);

              return (
                startDate &&
                endDate &&
                createdAtDate >= startDate &&
                createdAtDate <= endDate
              );
            }) // Filter produk dengan stok bukan 0
            .sort((a, b) => {
              const nameA = a.namaobat?.name?.toUpperCase() || ""; // Handle null values
              const nameB = b.namaobat?.name?.toUpperCase() || "";

              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0; // Names are equal
            })
            .map((t, index) => {
              return (
                <div key={t._id} className="flex justify-between w-[450px]">
                  <div className="flex justify-between">
                    {" "}
                    <div className="">{index + 1}. &nbsp;</div>
                    <div className="w-auto text-start">{t.namaobat?.name}</div>
                  </div>
                  <p className="mx-5 text-end">Stok: {t.stokecer}</p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default StokKosong;
