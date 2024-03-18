"use client";
import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getTopics } from "../UI/apiClient";

const TopicList = () => {
  const [topics, setTopics] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      setTopics(data.topics || []);
    };
    fetchTopics();
  }, []);

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

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };
  const filterProduk = topics.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return (
      t?.namaobat?.name.toLowerCase().includes(lowerCase) ||
      (t?.faktur && t?.faktur.toLowerCase().includes(lowerCase))
    );
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
      <div className="mt-5 overflow-x-auto over">
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
        <table className="table mb-5 text-center shadow-xl table-xs">
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
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700"
              >
                Expired <br /> Date
              </th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Jenis <br /> Sediaan
              </th>
              <th className="font-bold text-center text-green-700 ">Qty.</th>
              {/* <th className="font-bold text-green-700 ">Hutang</th> */}
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Jatuh <br /> Tempo
              </th>
              <th className="font-bold text-green-700 ">Catatan</th>
              {/* <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700"
              >
                Harga Beli <br /> Keseluruhan <br /> (Grosir)
              </th> */}
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Harga Jual (Grosir)
              </th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Harga <br /> Eceran
              </th>
              <th
                style={{ whiteSpace: "normal" }}
                className="font-bold text-center text-green-700 "
              >
                Stok <br /> Eceran
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((t, index) => {
              // const eceran = parseFloat(t.stok) * parseFloat(t.stokecer);
              // console.log(t.stokecer);

              return (
                <tr className="hover:bg-green-300" key={t._id}>
                  <td>{index + 1}</td>
                  <td>{t?.pbf?.name}</td>
                  <td>{t.faktur}</td>
                  <td>{t?.namaobat?.name}</td>
                  <td>{t.tgldatang}</td>
                  <td>{t.description}</td>
                  <td>{t.type}</td>
                  <td>
                    {t.stok} {t.jenis}
                  </td>
                  {/* <td>{formatToRupiah(t.liability)}</td> */}
                  <td>{t.liadate}</td>
                  <td>{t.remark}</td>
                  {/* <td>{formatToRupiah(t.buy)}</td> */}
                  <td>
                    {" "}
                    {formatToRupiah(t.sell)} || {formatToRupiah(t.grosir)}
                  </td>
                  <td>{formatToRupiah(t.ecer)}</td>
                  <td>
                    {t.stokecer} {t.satuanecer}
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
