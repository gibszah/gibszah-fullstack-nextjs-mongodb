"use client";
import React, { useEffect, useState } from "react";
import { Pagination } from "daisyui";

const getTransaksi = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/transaksi", {
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

const RiwayatTransaksi = () => {
  const [topics, setTopics] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTransaksi();
      setTopics(data.transaksis || []);
    };
    fetchTopics();
  }, [topics]);

  // console.log(transaksis);

  if (!Array.isArray(topics) || topics.length === 0) {
    return (
      <>
        <div className="flex justify-center mt-10">Data tidak ditemukan</div>
      </>
    );
  }
  function parseDate(dateString) {
    const parts = dateString.split(" pukul ");
    const datePart = parts[0].replace(",", "");
    const timePart = parts[1];
    return `${datePart} ${timePart}`;
  }

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };
  const filterProduk = topics?.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return t?.name.toLowerCase().includes(lowerCase);
  });

  const itemsPerPage = 50; // Jumlah item yang ingin ditampilkan per halaman

  const totalItems = filterProduk.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Hitung indeks awal dan akhir data yang akan ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterProduk
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk berpindah ke halaman sebelumnya
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Fungsi untuk berpindah ke halaman berikutnya
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div className="text-black">
        <div className="flex items-center justify-center mt-5">
          <div className="kbd kbd-lg" style={{ maxWidth: "fit-content" }}>
            RIWAYAT TRANSAKSI
          </div>
        </div>
        <div className="flex items-center justify-center mt-5">
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
        <div className="">
          <div className="mx-5 mt-5">
            {currentItems.map((t, index) => {
              return (
                <>
                  <div className="flex columns-3 hover:bg-green-300">
                    <div>{index + 1}.&nbsp;&nbsp;</div>
                    <div key={`${t.index}-${t.name}`} className="w-full">
                      <div> {t.name}</div>
                      <span className="text-xs font-light">{t.faktur}</span>
                    </div>
                    <div className="flex w-full">
                      <div key={`${t.index}-${t.jumlah}`} className="flex">
                        {t.jumlah}{" "}
                        <p className="mx-1 text-xs italic font-light">(item)</p>{" "}
                      </div>
                      <div key={`${t.index}-${t.price}`}>
                        {formatToRupiah(t.price)}
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div
                        className="text-xs italic font-light"
                        key={`${t.index}-${t.jam}`}
                      >
                        {" "}
                        {t.jam}
                      </div>
                      <span
                        key={`${t.index}-${t.user}`}
                        className="mx-2 italic badge badge-ghost"
                      >
                        {t.user}
                      </span>
                    </div>
                  </div>
                  <hr key={t._id} />
                </>
              );
            })}
          </div>
          <div className="join">
            <button className="join-item btn" onClick={goToPreviousPage}>
              «
            </button>
            <button className="join-item btn">Page {currentPage}</button>
            <button className="join-item btn" onClick={goToNextPage}>
              »
            </button>
          </div>
          <p>Total Halaman: {totalPages}</p>
        </div>
      </div>
    </>
  );
};

export default RiwayatTransaksi;
