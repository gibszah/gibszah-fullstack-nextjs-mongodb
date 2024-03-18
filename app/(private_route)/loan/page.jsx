"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTopics } from "../../../components/UI/apiClient";

const Loan = () => {
  const [topics, setTopics] = useState([]);

  const [berhasil, setBerhasil] = useState(false);
  const [belum, setBelum] = useState(false);
  const [keter, setKeter] = useState("");

  const markAsPaid = async (faktur, isChecked) => {
    try {
      const encodedFaktur = encodeURIComponent(faktur);
      const res = await fetch(
        `http://localhost:3000/api/topics/faktur/${encodedFaktur}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            newRemark: isChecked ? "Lunas" : "Belum",
          }),
        }
      );

      const response = await res.json();
      if (!res.ok) {
        throw new Error("Failed to update remarks");
        setBelum(true);
      }
      const keterangan =
        response.newRemark === "Lunas" ? "Faktur Belum Lunas" : "Faktur Lunas";
      setBerhasil(true);
      setTimeout(() => {
        setBerhasil(false);
      }, 3000);
      setKeter(keterangan);

      console.log("berhasil", response.newRemark);
      // Lakukan sesuatu setelah berhasil memperbarui remarks, misalnya memuat ulang data atau memperbarui tampilan.
    } catch (error) {
      console.error("Gagal memperbarui remarks:", error);
    }
  };

  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagef, setCurrentPagef] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tanggalPilih, setTanggalPilih] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchFaktur, setSearchFaktur] = useState("");

  const [startDateTrans, setStartDateTrans] = useState(null);
  const [endDateTrans, setEndDateTrans] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      setTopics(data.topics || []);
    };
    fetchTopics();
  }, [topics]);

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };
  const filterProduk = topics.filter((t) => {
    const lowerCase = searchKey.toLowerCase();
    return t?.pbf?.name.toLowerCase().includes(lowerCase);
  });

  const handleSearchF = (e) => {
    setSearchFaktur(e.target.value);
  };

  let filterProdukF = topics;

  if (searchFaktur) {
    filterProdukF = topics.filter((t) => {
      const searchDate = new Date(searchFaktur);
      const formattedDate = `${searchDate.getFullYear()}-${(
        searchDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${searchDate.getDate().toString().padStart(2, "0")}`;

      // const lowerCase = searchFaktur.toLowerCase();
      const tanggal = formattedDate.toLowerCase();
      return t?.liadate.toLowerCase().includes(tanggal);
    });
  }

  if (startDateTrans && endDateTrans) {
    const startRange = new Date(startDateTrans);
    const endRange = new Date(endDateTrans);

    filterProdukF = topics.filter((t) => {
      const itemDate = new Date(t.liadate);
      return itemDate >= startRange && itemDate <= endRange;
    });
  }

  const handleReset = () => {
    // Reset startDateTrans menjadi null
    setStartDateTrans(null);
    // Reset endDateTrans ke null juga jika diperlukan
    setEndDateTrans(null);
    // Reset filterProdukF ke nilai awal jika diperlukan
    setSelectedMonth(null);
  };

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const itemsPerPage = 100; // Jumlah item yang ingin ditampilkan per halaman

  const currentItems = filterProduk
    .filter((item) => item.faktur !== "0")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalItems = currentItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentItemsF = filterProdukF
    .filter((item) => item.faktur !== "0")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const totalItemsF = currentItemsF.length;
  const totalPagesF = Math.ceil(totalItemsF / itemsPerPage);

  // Hitung indeks awal dan akhir data yang akan ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const indexOfLastItemF = currentPagef * itemsPerPage;
  const indexOfFirstItemF = indexOfLastItemF - itemsPerPage;

  // Fungsi untuk berpindah ke halaman sebelumnya
  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Fungsi untuk berpindah ke halaman berikutnya
  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Fungsi untuk berpindah ke halaman sebelumnya
  const goToPreviousPageF = () => {
    setCurrentPagef((prevPage) => prevPage - 1);
  };

  // Fungsi untuk berpindah ke halaman berikutnya
  const goToNextPageF = () => {
    setCurrentPagef((prevPage) => prevPage + 1);
  };

  const handleDateMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSearchFaktur(date);
  };

  const tanggalDipilih = (date) => {
    const [start, end] = date;
    setStartDateTrans(start);
    setEndDateTrans(end);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const filteredItems = selectedDate
    ? currentItems.filter((item) => {
        const itemDate = new Date(item.liadate);
        return itemDate.toDateString() === selectedDate.toDateString();
      })
    : currentItems;

  let tempoHarian = currentItems; // Inisialisasi dengan semua item

  // Pemeriksaan apakah tanggalPilih tidak null
  if (tanggalPilih) {
    const startOfMonth = new Date(
      tanggalPilih.getFullYear(),
      tanggalPilih.getMonth(),
      1
    );
    const endOfMonth = new Date(
      tanggalPilih.getFullYear(),
      tanggalPilih.getMonth() + 1,
      0
    );

    // Filter item berdasarkan rentang tanggal
    tempoHarian = currentItems
      .filter((item) => item.remark !== "Lunas")
      .filter((item) => {
        const itemDate = new Date(item.liadate);
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
      });
  }
  const filteredItemsM = selectedMonth
    ? currentItems.filter((item) => {
        const itemDate = new Date(item.liadate);
        return (
          itemDate.getMonth() === selectedMonth.getMonth() &&
          itemDate.getFullYear() === selectedMonth.getFullYear()
        );
      })
    : currentItems;

  const totalPrice = filteredItems
    .filter((item) => item.remark !== "Lunas")
    .reduce((total, item) => {
      return total + parseFloat(item.buy);
    }, 0);

  const totalPilih = tempoHarian.reduce(
    (accumulator, currentItem) => {
      const price = parseFloat(currentItem.buy);
      const itemDate = new Date(currentItem.liadate);
      const lunass = currentItem.remark !== "Lunas";

      // Check if buy and ecer are valid numbers
      if (!isNaN(price)) {
        accumulator.totalPrice += price;
      }

      if (
        startDateTrans &&
        endDateTrans &&
        itemDate >= startDateTrans &&
        itemDate <= endDateTrans
      ) {
        if (!isNaN(price) && lunass) {
          accumulator.totalSelectDateTrans += price;
        }
      }

      return accumulator;
    },
    { totalPrice: 0, totalPriceBulanIni: 0, totalSelectDateTrans: 0 }
  );

  const totalDebt = filteredItemsM
    .filter((item) => item.remark !== "Lunas")
    .reduce((total, item) => {
      return total + parseFloat(item.buy);
    }, 0);

  const filteredItemsR = currentItems.filter((item) => {
    if (startDate && endDate) {
      const itemDate = new Date(item.liadate);
      return itemDate >= startDate && itemDate <= endDate;
    }
    return true;
  });

  const totalDebtR = filteredItemsR.reduce((total, item) => {
    return total + parseFloat(item.buy);
  }, 0);

  const debtPerDay = filteredItemsR.reduce((acc, item) => {
    const itemDate = new Date(item.liadate);
    const dateKey = itemDate.toDateString();
    acc[dateKey] = (acc[dateKey] || 0) + parseFloat(item.buy);
    return acc;
  }, {});

  //   const debtPerDay = filteredItems.reduce((acc, item) => {
  //     const itemDate = new Date(item.liadate);
  //     const dateKey = itemDate.toDateString();
  //     acc[dateKey] = acc[dateKey] || [];
  //     acc[dateKey].push(item);
  //     return acc;
  //   }, {});

  return (
    <>
      {/* <div>
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
      </div> */}

      {/* <div className="flex mx-5 card py-2 bg-gray-200 ..">
        <div>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
          />
        </div>
        --
        <div>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
          />
        </div>
        <div>
          <p>Total Debt for selected range: {formatToRupiah(totalDebtR)}</p>{" "}
        </div>
        <div>
          <h1 className="mb-2 text-lg font-bold">Debt details per day:</h1>
          <ul>
            {Object.entries(debtPerDay).map(([date, debt]) => (
              <li key={date}>
                <div className="flex ...">
                  {" "}
                  <div className="flex-none w-44 h-14">{date}</div>
                  <div className="flex-initial w-44">
                    {formatToRupiah(debt)}
                  </div>
                  <div className="flex-initial w-64">
                    (
                    {
                      filteredItemsR.find(
                        (item) => new Date(item.liadate).toDateString() === date
                      )?.pbf.name
                    }
                    )
                  </div>
                  <div className="flex-initial">
                    (
                    {
                      filteredItemsR.find(
                        (item) => new Date(item.liadate).toDateString() === date
                      )?.faktur
                    }
                    )
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
      {berhasil && (
        <div role="alert" className="fixed bottom-0 z-40 alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-current shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{keter}</span>
        </div>
      )}

      {belum && (
        <div role="alert" className="fixed bottom-0 z-40 alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 stroke-current shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{keter}</span>
        </div>
      )}

      <div className="mx-4">
        <button
          className="items-center btn btn-outline btn-accent"
          onClick={handleReset}
        >
          Reset Tanggal
        </button>
      </div>
      <div className="items-center py-2 mt-2 bg-gray-200 card">
        <DatePicker
          selected={selectedMonth}
          onChange={handleDateMonthChange}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />
        <div>
          <p>Total Debt for selected month: {formatToRupiah(totalDebt)}</p>{" "}
        </div>
      </div>
      <div className="items-center py-2 bg-gray-200 card">
        <div>
          <DatePicker selected={selectedDate} onChange={handleDateChange} />
        </div>
        <div>
          <p>Total Loan per day: {formatToRupiah(totalPrice)}</p>
        </div>
      </div>
      <div className="items-center py-2 bg-gray-200 card">
        <div>
          <DatePicker
            selectsRange
            startDate={startDateTrans}
            endDate={endDateTrans}
            onChange={tanggalDipilih}
            placeholderText="Select date range"
          />
        </div>
        <div>
          <p>
            total berdasarkan range tgl.:{" "}
            {formatToRupiah(totalPilih.totalSelectDateTrans)}
          </p>
        </div>
      </div>
      <div className="justify-center mx-10 mt-4 bg-gray-200">
        <div>
          <div className="w-full max-w-xs mx-10 form-control">
            <label className="label">
              <span className="label-text">Cari Tanggal ?</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full max-w-xs text-black input input-bordered"
              value={searchFaktur}
              onChange={handleSearchF}
            />
          </div>
        </div>
        {Object.values(
          currentItemsF
            .slice(indexOfFirstItemF, indexOfLastItemF)
            .filter((item) => item.faktur !== "0")
            .filter((item) => item.liadate !== "")
            // .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .reduce((acc, t) => {
              if (!acc[t.faktur]) {
                acc[t.faktur] = {
                  faktur: t.faktur,
                  pbf: t?.pbf?.name,
                  liadate: t.liadate,
                  totalHarga: 0,
                  id: t._id, // Tambahkan id jika diperlukan untuk markAsPaid
                  isChecked: false, // Tambahkan properti isChecked untuk menandai apakah checkbox sudah dicentang
                  remarks: t.remark || "",
                };
              }
              // Memeriksa apakah t.price adalah angka sebelum menambahkannya ke total harga
              const price = parseFloat(t.buy);
              if (!isNaN(price)) {
                acc[t.faktur].totalHarga += price;
              }
              return acc;
            }, {})
        ).map((groupedItem, index) => (
          <div key={index} className="flex  shadow py-2 ...">
            <div className="flex-none w-14 h-14 bg-gray-300 text-center ...">
              {index + 1}
            </div>
            <div className="flex-1 w-64 ...">
              {groupedItem.faktur} || {groupedItem.pbf}
            </div>
            <div className="flex-1 w-32 text-center ...">
              {formatToRupiah(groupedItem.totalHarga)}
            </div>
            <div className="flex-1 w-32 ...">Tempo: {groupedItem.liadate}</div>
            {/* cek lunas / tidak */}
            <div className=" form-control">
              <label className="cursor-pointer label">
                {/* <span className="label-text">Tandai Lunas</span> */}
                <input
                  type="checkbox"
                  className="checkbox checkbox-warning"
                  checked={groupedItem.remarks === "Lunas"}
                  onChange={(e) =>
                    markAsPaid(groupedItem.faktur, e.target.checked)
                  }
                />
              </label>
            </div>
            <div className="flex-1 w-32">
              {groupedItem.remarks === "" || groupedItem.remarks === "Belum"
                ? "Belum lunas"
                : "Lunas"}
            </div>
          </div>
        ))}

        {/* {Object.values(
          currentItems
            .filter((item) => item.faktur !== 0)
            .reduce((acc, t) => {
              const liadate = t.liadate; // Tanggal jatuh tempo
              const formattedDate = liadate.slice(0, 10); // Ambil bagian tanggal (YYYY-MM-DD)
              if (!acc[formattedDate]) {
                acc[formattedDate] = {
                  date: formattedDate,
                  pbf: t?.pbf?.name,
                  totalHarga: 0,
                };
              }
              // Memeriksa apakah t.price adalah angka sebelum menambahkannya ke total harga
              const price = parseFloat(t.buy);
              if (!isNaN(price)) {
                acc[formattedDate].totalHarga += price;
              }
              return acc;
            }, {})
        ).map((groupedItem, index) => (
          <div key={index} className="flex ...">
            <div className="flex-none w-14 h-14 bg-gray-300 text-center ...">
              {index + 1}
            </div>
            <div className="flex-1 w-64 ...">{groupedItem.date}</div>
            <div className="flex-1 w-64 ...">
              {formatToRupiah(groupedItem.totalHarga)}
            </div>
            <div className="flex-1 w-64 ...">{groupedItem.pbf}</div>
          </div>
        ))} */}
        <div className="join">
          <button className="join-item btn" onClick={goToPreviousPageF}>
            «
          </button>
          <button className="join-item btn">Page {currentPagef}</button>
          <button className="join-item btn" onClick={goToNextPageF}>
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

export default Loan;
