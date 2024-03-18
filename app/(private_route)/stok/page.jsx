"use client";
import React from "react";
import { getTopics } from "../../../components/UI/apiClient";

import { useState, useEffect } from "react";

const StokTersedia = () => {
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

  return (
    <div className="row">
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
      <div className="mx-10 card-body">
        <div>STOK TERSEDIA */</div>
        <h2 className="text-lg badge">
          Tanggal Hari ini: {today.toLocaleString()}
        </h2>
      </div>
      <div className="mx-10">
        {filterProduk
          .filter((t) => t.stokecer !== 0) // Filter produk dengan stok bukan 0
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
              <div key={t._id} className="flex w-full hover:bg-slate-300">
                <div className="grid flex-grow w-4 place-items-start">
                  {" "}
                  <h4 className="inline-flex text-start">
                    <p>{index + 1}</p>
                    &nbsp; &nbsp; {t.namaobat?.name}
                  </h4>
                </div>
                <div className="divider divider-horizontal"></div>

                <div className="grid flex-grow w-4 place-items-start">
                  Stok: {t.stokecer}
                </div>
                <div className="grid flex-grow w-4 place-items-start">
                  Stok Dasar / Awalan : {t.merk}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StokTersedia;
