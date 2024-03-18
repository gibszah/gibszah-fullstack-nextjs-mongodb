"use client";
import React, { useEffect, useState } from "react";
import { isToday, isYesterday, format } from "date-fns";
import MyChart from "@/components/UI/Chart";
import DailyResultsChart from "@/components/UI/ChartPrice";

import Laba from "@/components/revenue/laba";

import Selling from "@/components/revenue/selling";

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

const StatsNav = () => {
  //   const formatToRupiah = (number) => {
  //     if (number === "") return ""; // Return empty string if no input

  //     const formatter = new Intl.NumberFormat("id-ID", {
  //       style: "currency",
  //       currency: "IDR",
  //     });

  //     return formatter.format(number);
  //   };

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Set this to 0 to remove decimal digits
      maximumFractionDigits: 0, // Set this to 0 to remove decimal digits
    }).format(number);

    // Format the number and remove trailing zeros after the comma
    // let formattedString = formatter.format(number);
    // formattedString = formattedString.replace(/\.?0+$/, "");

    return formatter || "0";
  };

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

  const totalHarga = trans.reduce((total, t) => total + t.price, 0);

  const calculateTotalHarga = (transactions) => {
    return transactions.reduce(
      (total, t) => parseFloat(total) + parseFloat(t.price),
      0
    );
  };

  const today = new Date();
  const transaksiHariIni = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return transDate.toDateString() === today.toDateString();
  });

  // CHAT GPT
  const todayDay = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return isToday(transDate);
  });

  const yesterdayDay = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return isYesterday(transDate);
  });

  const calculateProgress = (current, previous) => {
    const currentTotal = calculateTotalHarga(current);
    const previousTotal = calculateTotalHarga(previous);

    if (previousTotal === 0) {
      return 0;
    }

    return ((currentTotal - previousTotal) / previousTotal) * 100;
  };
  const progressToday = calculateProgress(todayDay, yesterdayDay);

  // const yesterday = new Date();

  // yesterday.setDate(yesterday.getDate() - 1);
  // const yesterdayDay = trans.filter((t) => {
  //   const transDate = new Date(t.createdAt);
  //   return transDate >= yesterday;
  // });

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const transaksiSebulan = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return transDate >= lastMonth;
  });

  //GOOGLE BLACKBOX.AI

  const month = today.getMonth();
  const year = today.getFullYear();
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  // Define the first day of the current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstNovember = new Date(today.getFullYear(), 10, 1);
  const endNovember = new Date(today.getFullYear(), 11, 0); // 11 represents December

  const totalRevenue = trans.reduce((sum, transaksi) => {
    const transactionDate = new Date(transaksi.createdAt);
    if (transactionDate >= firstNovember && transactionDate <= endNovember) {
      return sum + parseFloat(transaksi.price);
    }
    return sum;
  }, 0);

  const currentYear = today.getFullYear();
  const twoFor = 2024;
  const twoTwo = 2022;

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber - 1];
  };

  const targetYear = 2023;

  //select tahun

  const monthlyRevenues = Array.from({ length: 12 }, (_, index) => {
    const firstDayOfMonth = new Date(currentYear, index, 1);
    const lastDayOfMonth = new Date(currentYear, index + 1, 0);

    return trans.reduce((sum, transaksi) => {
      const transactionDate = new Date(transaksi.createdAt);
      if (
        transactionDate >= firstDayOfMonth &&
        transactionDate <= lastDayOfMonth
      ) {
        return sum + parseFloat(transaksi.price);
      }
      return sum;
    }, 0);
  });

  const [selectedYear, setSelectedYear] = useState("");
  const [showing, setShowing] = useState(false);
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setShowing(true);
  };
  const [pastYear, setPastYear] = useState([]);

  useEffect(() => {
    const calculateMonthlyRevenues = () => {
      if (!selectedYear) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const monthlyRevenues = Array.from({ length: 12 }, (_, index) => {
          const firstDayOfMonth = new Date(currentYear, index, 1);
          const lastDayOfMonth = new Date(currentYear, index + 1, 0);

          return trans.reduce((sum, transaksi) => {
            const transactionDate = new Date(transaksi.createdAt);
            if (
              transactionDate >= firstDayOfMonth &&
              transactionDate <= lastDayOfMonth
            ) {
              return sum + parseFloat(transaksi.price);
            }
            return sum;
          }, 0);
        });

        setPastYear(monthlyRevenues);
        return;
      }

      const selectTahun = parseInt(selectedYear);

      const calculatedRevenues = Array.from({ length: 12 }, (_, index) => {
        const firstDayOfMonth = new Date(selectTahun, index, 1);
        const lastDayOfMonth = new Date(selectTahun, index + 1, 0);

        return trans.reduce((sum, transaksi) => {
          const transactionDate = new Date(transaksi.createdAt);
          if (
            transactionDate >= firstDayOfMonth &&
            transactionDate <= lastDayOfMonth
          ) {
            return sum + parseFloat(transaksi.price);
          }
          return sum;
        }, 0);
      });

      setPastYear(calculatedRevenues);
    };

    calculateMonthlyRevenues();
  }, [selectedYear, trans]);

  const totalMonthlyRevenue = monthlyRevenues.reduce(
    (total, monthlyRevenue) => total + monthlyRevenue,
    0
  );

  const monthTwoFour = Array.from({ length: 12 }, (_, index) => {
    const firstDayOfMonth = new Date(twoFor, index, 1);
    const lastDayOfMonth = new Date(twoFor, index + 1, 0);

    return trans.reduce((sum, transaksi) => {
      const transactionDate = new Date(transaksi.createdAt);
      if (
        transactionDate >= firstDayOfMonth &&
        transactionDate <= lastDayOfMonth
      ) {
        return sum + parseFloat(transaksi.price);
      }
      return sum;
    }, 0);
  });

  const totalTwoFour = monthTwoFour.reduce(
    (total, monthlyRevenue) => total + monthlyRevenue,
    0
  );
  console.log(monthlyRevenues);
  console.log(totalMonthlyRevenue);

  // Define the last day of the current month
  //   const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Get the date range as a string
  const dateRange = `From ${format(firstDayOfMonth, "dd/MM/yyyy")} to ${format(
    today,
    "MMMM dd, yyyy"
  )}`;

  const transaksiPerMonth = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return transDate >= startOfMonth && transDate <= endOfMonth;
  });
  const totalPerMonth = calculateTotalHarga(transaksiPerMonth);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const transaksiSeminggu = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return transDate >= lastWeek;
  });
  const lastTwoWeek = new Date();
  lastTwoWeek.setDate(lastTwoWeek.getDate() - 14);
  const transaksiTwoWeeks = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return transDate >= lastTwoWeek;
  });

  const kemarin = calculateTotalHarga(yesterdayDay);
  const totalTwo = calculateTotalHarga(transaksiTwoWeeks);
  const totalSebulan = calculateTotalHarga(transaksiSebulan);
  const totalSeminggu = calculateTotalHarga(transaksiSeminggu);
  const totalHariIni = calculateTotalHarga(transaksiHariIni);
  const progress = (parseFloat(totalSeminggu) / parseFloat(totalTwo)) * 100;
  // const progressToday = (parseFloat(totalHariIni) / parseFloat(kemarin)) * 100;
  console.log(totalHariIni, "today");

  //TIAP HARI
  ////////////////////////////

  // Fungsi untuk mengelompokkan transaksi berdasarkan tanggal
  const groupBy = (list, keyGetter) => {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  };

  // Fungsi untuk menghitung total harga dari transaksi

  // Fungsi untuk mengonversi nilai menjadi format Rupiah

  // ...

  // Mengelompokkan transaksi berdasarkan tanggal
  const transByDate = groupBy(trans, (t) =>
    new Date(t.createdAt).toDateString()
  );

  // Iterasi untuk setiap tanggal dan menampilkan total pendapatan
  const [resultData, setResultData] = useState([]);
  const [labaperhari, setLabaPerHari] = useState([]);
  useEffect(() => {
    // Mengelompokkan transaksi saat komponen di-mount
    const transByDate = groupBy(trans, (t) =>
      new Date(t.createdAt).toDateString()
    );

    // Iterasi untuk setiap tanggal dan menyimpan hasil ke state
    const results = [];
    for (const [date, transactions] of transByDate.entries()) {
      const totalHariIni = calculateTotalHarga(transactions);
      results.push({
        date,
        result: `${date}: hasil ${formatToRupiah(totalHariIni)}`,
      });
    }
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
    setLabaPerHari(totalHariIni);
    setResultData(results);
  }, [trans, totalHariIni]);

  // console.log(formatToRupiah(labaperhari));

  const sortedTrans = trans
    .slice()
    .sort((a, b) => new Date(b.jam) - new Date(a.jam))
    .reverse();

  // Fungsi untuk mengelompokkan transaksi berdasarkan nama dan tanggal

  const uniqueTransactions = [];

  sortedTrans.forEach((transaction) => {
    const date = transaction.jam;
    const name = transaction.name;

    const existingTransaction = uniqueTransactions.find(
      (trans) => trans.name === name && trans.date === date
    );

    if (existingTransaction) {
      existingTransaction.jumlah += transaction.jumlah;
    } else {
      uniqueTransactions.push({ name, date, jumlah: transaction.jumlah });
    }
  });

  const groupedTransactions = {};

  sortedTrans.forEach((transaction) => {
    const date = transaction.jam;
    const name = transaction.name;

    if (!groupedTransactions[name]) {
      groupedTransactions[name] = {};
    }

    if (!groupedTransactions[name][date]) {
      groupedTransactions[name][date] = 0;
    }

    groupedTransactions[name][date] += parseInt(transaction.jumlah, 10);
  });

  // groupedTransactions sekarang berisi data yang diinginkan

  // Menampilkan data ke dalam console
  console.log(groupedTransactions);

  // const targetDate =
  //   trans.length > 0
  //     ? new Date(trans[0].createdAt).toLocaleDateString("id-ID") // 'id-ID' represents the Indonesian locale
  //     : null;

  const targetDate = "Curcuma+ Sharpy straw syr";
  console.log("Target Date:", targetDate);

  const groupAndSumTransactionsByDate = (transactions) => {
    const groupedData = {};

    transactions.forEach((transaction) => {
      const createdAt = new Date(transaction.createdAt).toLocaleDateString(
        "id-ID"
      ); // Ubah ke format tanggal lokal
      const name = transaction.name;

      if (!groupedData[createdAt]) {
        groupedData[createdAt] = {};
      }

      if (!groupedData[createdAt][name]) {
        groupedData[createdAt][name] = 0;
      }

      groupedData[createdAt][name] += parseInt(transaction.jumlah, 10);
    });

    return groupedData;
  };

  // Gunakan fungsi untuk mengelompokkan dan menjumlahkan
  const groupedAndSummedTransactions =
    groupAndSumTransactionsByDate(sortedTrans);

  // Tampilkan hasilnya
  // console.log(groupedAndSummedTransactions);

  const chartData = [];

  Object.entries(groupedAndSummedTransactions).forEach(
    ([createdAt, dataPerName]) => {
      // Hitung totalQuantity per hari
      const totalQuantity = Object.values(dataPerName).reduce(
        (acc, totalJumlah) => acc + totalJumlah,
        0
      );

      // Tambahkan data ke array chartData
      chartData.push({
        totalQuantity: totalQuantity,
        createdAt: createdAt,
      });
    }
  );

  const grouptedAndSummedPrice = trans.reduce((acc, item) => {
    // Ensure item.createdAt is a Date object
    const date =
      item.createdAt instanceof Date
        ? item.createdAt.toLocaleDateString()
        : null;

    if (!date) {
      console.error("Invalid date:", item.createdAt);
      return acc;
    }

    if (!acc[date]) {
      acc[date] = {
        createdAt: date,
        totalQuantity: 0,
      };
    }

    acc[date].totalQuantity += item.price;

    return acc;
  }, {});

  const chartDataPrice = Object.values(resultData);

  const tanggalRange = [];
  let currentDate = new Date(firstDayOfMonth);

  while (currentDate <= today) {
    tanggalRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const jumlahTanggal = tanggalRange.length;
  const ratarata = totalPerMonth / jumlahTanggal;

  // console.log("hasil rata rata:", ratarata);

  return (
    <div>
      <div className="card-body">
        <h1 className="font-bold">
          Average revenue: {formatToRupiah(ratarata)}{" "}
        </h1>
      </div>
      <div className="mx-10 ">
        <div className="mt-5">
          <select
            className="w-full max-w-xs select select-accent"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option disabled selected>
              Select Year!
            </option>
            <option
              defaultValue={new Date().getFullYear().toString()}
              value="2024"
            >
              Tahun sekarang: {new Date().getFullYear()}
            </option>
            {(() => {
              const options = [];
              let year = 2200;
              while (year >= 2023) {
                options.push(
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
                year--;
              }
              return options;
            })()}
          </select>
        </div>
        <div>
          {showing && (
            <h1 className="mt-10 font-bold bg-slate-500 w-14 text-zinc-200">
              {selectedYear}
            </h1>
          )}

          <ul className=" timeline steps-horizontal">
            {pastYear.map((monthlyRevenue, index) => (
              <li key={index} className="overflow-x-hidden">
                <div className="timeline-start">{getMonthName(index + 1)}</div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className=" timeline-end timeline-box">
                  <p className="mt-2 mb-5 font-mono text-sm -rotate-12">
                    {formatToRupiah(monthlyRevenue)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-10 ">
        <div>
          <h1 className="mt-10 font-bold bg-slate-500 w-14 text-zinc-200">
            2024
          </h1>
          <ul className="gap-2 timeline steps-horizontal ">
            {monthTwoFour.map((monthlyRevenue, index) => (
              <li key={index} className="overflow-x-hidden">
                <div className="timeline-start">{getMonthName(index + 1)}</div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className=" timeline-end timeline-box">
                  <p className="mt-2 mb-5 font-mono text-sm -rotate-12">
                    {formatToRupiah(monthlyRevenue)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container w-auto text-center">
        <Laba />
      </div>
      <div className="mt-5 text-center">
        <Selling />
      </div>
      <div className="overflow-x-auto h-96 w-fit">
        <table className="table table-pin-rows">
          {resultData.map((result, index) => (
            <tbody key={index}>
              <tr>
                <td>{result.result}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>{" "}
      <div>
        <MyChart data={chartData} />
      </div>
      <div>
        <DailyResultsChart data={chartDataPrice} />
      </div>
      <div>
        <div className="flex">
          <div>
            <table className="table table-pin-rows">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Terjual</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedAndSummedTransactions).map(
                  ([createdAt, dataPerName]) => {
                    // Hitung totalQuantity per hari
                    const totalQuantity = Object.values(dataPerName).reduce(
                      (acc, totalJumlah) => acc + totalJumlah,
                      0
                    );

                    return (
                      <tr key={createdAt}>
                        {/* Kolom untuk Tanggal */}
                        <td>
                          <div className="grid flex-grow h-20 font-bold bg-green-300 card rounded-box place-items-center">
                            {createdAt}
                          </div>
                        </td>
                        {/* Kolom untuk Nama Obat dan Jumlah */}
                        <td>
                          <details className="collapse bg-base-200">
                            <summary className="text-xl font-medium collapse-title">
                              Detail Obat Terjual (klik)
                            </summary>
                            <div className="collapse-content">
                              <div className="mb-2 overflow-x-auto border shadow-lg h-96 w-fit">
                                <table className="table table-pin-rows">
                                  {Object.entries(dataPerName).map(
                                    ([name, totalJumlah]) => (
                                      <tbody key={`${createdAt}-${name}`}>
                                        <tr>
                                          <td>
                                            {name}: &nbsp; {totalJumlah}
                                          </td>
                                        </tr>
                                      </tbody>
                                    )
                                  )}
                                </table>
                              </div>{" "}
                            </div>
                          </details>

                          {/* Tampilkan totalQuantity per hari */}
                        </td>
                        <td>
                          {" "}
                          <div className="chat chat-start">
                            <div className="chat-bubble">
                              Total Keseluruhan per hari ini: &nbsp;
                              <kbd className="text-lg font-bold">
                                {totalQuantity}
                              </kbd>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2 text-sm w-fit">
        <div className="bg-green-300 shadow stats">
          <div className="stat">
            <div className="stat-title">Today</div>
            <div className="text-base stat-value">
              {formatToRupiah(totalHariIni)}
            </div>
            <div className="stat-desc">
              {isNaN(progressToday) ? 0 : progressToday.toFixed(1)} %
              {progressToday === 0 || progressToday <= 0 || isNaN(progressToday)
                ? "MENURUN"
                : "Alhamdulillah Meningkat"}
            </div>
            <div className="stat-desc"></div>
          </div>
        </div>

        <div className="shadow bg-slate-300 stats">
          <div className="stat">
            <div className="stat-title">Weekly</div>
            <div className="text-base stat-value">
              {formatToRupiah(totalSeminggu)}
            </div>
            <div className="stat-desc">
              {isNaN(progress) ? 0 : progress.toFixed(1)} %
              {progress === 0 || progress <= 0 || isNaN(progress)
                ? "MENURUN"
                : "Alhamdulilah Meningkat"}
            </div>
          </div>
        </div>

        <div className="text-white bg-green-700 shadow stats">
          <div className="stat">
            <div className="text-yellow-100 stat-title">Monthly</div>
            <div className="text-base stat-value">
              {formatToRupiah(totalPerMonth)}
            </div>
            <div className="text-yellow-100 stat-desc">{dateRange}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsNav;
