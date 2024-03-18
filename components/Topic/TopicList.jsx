"use client";
import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getTopics } from "../UI/apiClient";

// const getTopics = async (searchQuery = "") => {
//   try {
//     // const res = await fetch("http://localhost:3000/api/topics", {
//     const res = await fetch(
//       `http://localhost:3000/api/topics?search=${encodeURIComponent(
//         searchQuery
//       )}`,
//       {
//         cache: "no-store",
//       }
//     );

//     if (!res.ok) {
//       throw new Error("failed to fetch data");
//     }

//     const data = await res.json();

//     return data;
//   } catch (error) {
//     console.log("error loading topics: ", error);
//   }
// };

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics(searchKey);
      setTopics(data.topics || []);
    };

    fetchTopics();
  }, [searchKey]);

  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };
  const filterProduk = topics.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return t?.namaobat?.name.toLowerCase().includes(lowerCase);
  });

  if (!Array.isArray(topics) || topics.length === 0) {
    return (
      <>
        <div className="flex justify-center mt-10">Data tidak ditemukan</div>

        <div>
          <Link href="/addTopic">
            <button className="flex mx-10 mt-[10rem] btn btn-neutral">
              Buat data baru
            </button>
          </Link>
        </div>
      </>
    );
  }

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const options = { year: "numeric", month: "long", day: "numeric" };
  function formatTanggal(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID");
  }

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

  const totalValues = topics
    .filter((item) => item.merk !== 0 || item.merk !== "")
    .map((item) => {
      let totalLaba = 0;
      // const pendapatan = parseFloat(item.ecer * item.merk);
      const selisih = parseFloat(item.merk - item.stokecer);
      const hasilSelisih = selisih * parseFloat(item.ecer);
      const laba = hasilSelisih - item.buy;
      totalLaba += laba;
      return totalLaba;
    })
    .filter((laba) => laba > 0);

  const total = totalValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  console.log("Total Laba: ", formatToRupiah(total));
  return (
    <>
      <div className="w-fit">
        <Link href="/addTopic">
          <button className="flex mx-10 mt-5 mb-2 btn btn-neutral">
            Buat data baru
          </button>
        </Link>
      </div>

      {/* <div className="shadow-xl stats">
        <div className="stat">
          <div className="stat-title">Laba (Grosir)</div>
          <div className="stat-value">
            {" "}
            {formatToRupiah(
              topics.reduce((acc, t) => {
                const perkiraanLaba = parseFloat(t.sell) - parseFloat(t.buy);
                return acc + perkiraanLaba;
              }, 0)
            )}
          </div>
          <div className="stat-desc">perkiraan laba</div>
        </div>
      </div>

      <div className="mb-6 shadow-xl stats">
        <div className="stat">
          <div className="stat-title">Laba (Eceran)</div>
          <div className="stat-value">
            {" "}
            {formatToRupiah(
              topics.reduce((acc, t) => {
                const labaEcer = parseFloat(t.merk) * parseFloat(t.ecer);
                const laba = parseFloat(labaEcer) - parseFloat(t.buy);
                return acc + laba;
              }, 0)
            )}
          </div>
          <div className="stat-desc">perkiraan laba</div>
        </div>
      </div> */}
      <div className="w-full max-w-xs mx-10 form-control">
        <label className="label">
          <span className="label-text">Cari Produk ?</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-xs text-black input input-bordered"
          value={searchKey}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="z-0 table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th></th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Nama <br /> PBF / Supplier
              </th>
              <th className="font-bold text-green-700 ">No. Faktur</th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700"
              >
                Nama <br /> Sediaan
              </th>
              <th className="font-bold text-green-700 ">Tgl. Diterima</th>
              {/* <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700"
              >
                Expired <br /> Date
              </th> */}
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Jenis <br /> Sediaan
              </th>
              <th className="font-bold text-center text-green-700 ">Qty.</th>
              <th className="font-bold text-green-700 ">Hutang</th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Jatuh <br /> Tempo
              </th>
              <th className="font-bold text-green-700 ">Catatan</th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700"
              >
                Harga Beli <br /> Keseluruhan <br /> (Grosir)
              </th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Harga Jual <br />2 <br /> (Grosir)
              </th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Harga <br /> 1 (Eceran)
              </th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Stok <br /> Eceran
              </th>
              <th
                style={{ whiteSpace: "normal" }}
                className="italic font-bold text-center text-green-700"
              >
                Stok <br /> Awal
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((t, index) => {
              // const eceran = parseFloat(t.stok) * parseFloat(t.stokecer);
              // console.log(t.stokecer);

              const pendapatan = parseFloat(t.ecer * t.merk);
              const laba = pendapatan - t.buy;

              return (
                <tr className="hover:bg-green-300" key={t._id}>
                  <td>{index + 1}</td>
                  <td>{t?.pbf?.name}</td>
                  <td>{t.faktur}</td>
                  <td>{t?.namaobat?.name}</td>
                  <td>{t.tgldatang}</td>
                  {/* <td>{t.description}</td> */}
                  <td>{t.type}</td>
                  <td>
                    {t.stok} {t.jenis}
                  </td>
                  <td>{formatToRupiah(t.liability)}</td>
                  <td>{t.liadate}</td>
                  <td>{t.remark}</td>
                  <td>{formatToRupiah(t.buy)}</td>
                  <td>
                    {formatToRupiah(t.sell)} || {formatToRupiah(t.grosir)}
                  </td>
                  <td>{formatToRupiah(t.ecer)}</td>
                  <td>
                    {t.stokecer} {t.satuanecer}
                  </td>
                  <td className="font-light">
                    <div>{t.merk}</div>{" "}
                    <div className=" indicator-item">{t.satuanecer}</div>
                  </td>
                  <td className="font-light">
                    <div>{formatToRupiah(pendapatan)}</div>
                  </td>
                  <td className="font-light">
                    <div>{formatToRupiah(laba)}</div>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <RemoveBtn id={t._id} />
                      <Link href={`/editTopic/${t._id}`}>
                        <HiPencilAlt size={24} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="join">
          <button className="join-item btn" onClick={goToPreviousPage}>
            «
          </button>
          <button className="join-item btn">Page {currentPage}</button>
          <button className="join-item btn" onClick={goToNextPage}>
            »
          </button>
        </div>
        <div>
          <p className="mx-2 italic text-sx">Total Halaman: {totalPages}</p>
        </div>
      </div>
    </>
  );
};

export default TopicList;
