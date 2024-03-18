"use client";
import React, { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTopics } from "../../../components/UI/apiClient";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <DotLoader color="#36d7b7" />
    </div>
  );
}

const getTrans = async () => {
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

const FastMove = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  const [topics, setTopics] = useState([]);
  const [stokAda, setStokAda] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTrans();

      setTopics(data.transaksis || []);
    };
    fetchTopics();
  }, []);

  // useEffect(() => {
  //   const fetchTopics = async () => {
  //     const stokA = await getTopics();

  //     setStokAda(stokA.topics || []);
  //   };
  //   fetchTopics();
  // }, []);

  // const startDate = new Date();
  // startDate.setMonth(startDate.getMonth() - 1); // Tanggal awal satu bulan yang lalu
  // const endDate = new Date();

  const [searchKey, setSearchKey] = useState("");

  const filterProduk = topics.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return t?.name.toLowerCase().includes(lowerCase);
  });

  const handleLihat = () => {
    const fetchTopics = async () => {
      const stokA = await getTopics();

      setStokAda(stokA.topics || []);
    };
    fetchTopics();
  };

  const [searchKeyb, setSearchKeyb] = useState("");
  const compareStok = stokAda.filter((t) => {
    const lowerCase = searchKeyb.toLowerCase();
    return t?.namaobat?.name.toLowerCase().includes(lowerCase);
  });

  const handleSearch = (e) => {
    setSearchKeyb(e.target.value);
  };

  // const filterTransaksi = filterProduk.filter((item) => {
  //   const transactionDate = new Date(item.createdAt);
  //   return transactionDate >= startDate && transactionDate <= endDate;
  // });
  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [filterTransaksi, setFilterTransaksi] = useState([]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;

    setStartDate(start);

    setEndDate(end);

    // Filter data transaksi berdasarkan tanggal yang dipilih

    const filteredTransaksi = topics.filter((item) => {
      const transactionDate = new Date(item.createdAt);

      return (
        (!start || transactionDate >= start) && (!end || transactionDate <= end)
      );
    });

    setFilterTransaksi(filteredTransaksi);
  };

  const [jum, setJum] = useState([]);

  const handleJum = () => {
    const updatedJum = [];
    filterTransaksi.forEach((item) => {
      const itemName = item.name;
      updatedJum[itemName] =
        (updatedJum[itemName] || 0) + parseInt(item.jumlah);
    });
    setJum(updatedJum);
  };
  // console.log("fast moving", jum);

  // useEffect(() => {
  //   const updatedJum = [];
  //   filterTransaksi.forEach((item) => {
  //     const itemName = item.name;
  //     updatedJum[itemName] =
  //       (updatedJum[itemName] || 0) + parseInt(item.jumlah);
  //   });
  //   setJum(updatedJum);
  // }, [filterTransaksi]);

  const stockMap = {};

  compareStok
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
    .forEach((t) => {
      const name = t.namaobat?.name;
      if (name) {
        if (stockMap[name]) {
          stockMap[name] += t.stokecer;
        } else {
          stockMap[name] = t.stokecer;
        }
      }
    });

  const [perbandingan, setPerbandingan] = useState({});
  const updatePerbandingan = (itemName) => {
    // Pastikan itemName ada di dalam stockMap
    if (stockMap.hasOwnProperty(itemName) && jum.hasOwnProperty(itemName)) {
      const selisih = stockMap[itemName] - jum[itemName];

      // Pastikan itemName belum ada di dalam state sebelumnya
      if (!perbandingan.hasOwnProperty(itemName)) {
        setPerbandingan((prevPerbandingan) => ({
          ...prevPerbandingan,
          // [itemName]: stockMap[itemName], // Simpan nilai dari stockMap[itemName]
          [itemName]: selisih,
        }));
      }
    } else {
      alert(`${itemName} tidak ditemukan dalam stock`);
    }
  };

  const resetPerbandingan = () => {
    setPerbandingan({});
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="w-auto mt-10">
          <div className="flex flex-col w-auto mx-5 lg:flex-row">
            <div className="grid flex-grow card bg-base-300 rounded-box">
              <div className="flex-row">
                <div className="container w-auto text-center">
                  <div className="stack">
                    <div className="w-auto p-5 mb-10 text-center shadow-md card bg-base-200">
                      <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        placeholderText="Pilih rentang tanggal"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <button
                    className="btn-outline btn success"
                    onClick={handleJum}
                  >
                    klik data
                  </button>
                  <h2 className="font-bold">Data Jumlah: </h2>
                  <ul>
                    {Object.keys(jum)
                      .sort((a, b) => jum[b] - jum[a])
                      .map((itemName, index) => (
                        <li className="mx-2" key={index}>
                          <button
                            className=" btn-ghost"
                            onClick={() => updatePerbandingan(itemName)}
                          >
                            {itemName}: {jum[itemName]}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="divider lg:divider-horizontal"></div>
            <div className="grid flex-grow card bg-base-300 rounded-box ">
              <div>
                <div>
                  <button className="btn btn-success" onClick={handleLihat}>
                    data stok
                  </button>
                </div>

                <div className="w-full max-w-xs mx-10 mb-3 text-black top-3 form-control">
                  <label className="label">
                    <span className="label-text">Cari Produk ?</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="w-full max-w-xs input input-bordered"
                    value={searchKeyb}
                    onChange={handleSearch}
                  />
                </div>
                {Object.keys(stockMap).map((t, index) => {
                  return (
                    <div key={t._id} className="flex w-full">
                      <div className="grid flex-grow w-52 place-items-start">
                        {" "}
                        <h4 className="inline-flex text-start">
                          <p>{index + 1}</p>
                          &nbsp; &nbsp; {t}
                        </h4>
                      </div>
                      <div className="divider divider-horizontal"></div>

                      <div className="grid flex-grow w-4 place-items-start">
                        Stok: {stockMap[t]}
                      </div>
                      {/* <div className="grid flex-grow w-4 place-items-start">
                          Stok Dasar / Awalan : {t.merk}
                        </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="divider lg:divider-horizontal"></div>

            <div className="fixed right-0 z-50 grid flex-grow top-14 card bg-base-300 rounded-box">
              <div>
                <div className="h-10">
                  <input
                    type="reset"
                    value="Reset Data"
                    className="btn"
                    onClick={resetPerbandingan}
                  />
                </div>
                <ul className="card-body">
                  <div className="card-title">Selisih:</div>
                  {Object.keys(perbandingan).map((itemName, index) => (
                    <li key={index}>
                      {itemName}: {perbandingan[itemName]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FastMove;
