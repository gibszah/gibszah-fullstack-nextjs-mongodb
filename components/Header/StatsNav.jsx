import React, { useEffect, useState } from "react";
import { isToday, isYesterday, format } from "date-fns";
import { differenceInDays } from "date-fns";
import { getTopics } from "../UI/apiClient";

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

const getExpense = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/pengeluaran", {
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
  const [topics, setTopics] = useState([]);

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
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

  const [expense, setExpense] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExpense();
        setExpense(response.pengeluaran || []);
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

  // Define the last day of the current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

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
  const currentDayOfWeek = lastWeek.getDay(); // Hari dalam minggu (0-6), 0 adalah Minggu, 1 adalah Senin, dst.
  const daysToAdd = 1 - currentDayOfWeek; // Jumlah hari yang harus ditambahkan untuk mencapai Senin
  const lastMonday = new Date(lastWeek);
  lastMonday.setDate(lastWeek.getDate() + daysToAdd); // Mendapatkan Senin terakhir

  const lastSunday = new Date(lastMonday);
  const daysToSubtract = currentDayOfWeek; // Jumlah hari yang harus dikurangi untuk mencapai Minggu
  lastSunday.setDate(lastMonday.getDate() + (7 - currentDayOfWeek)); // Mendapatkan Minggu terakhir

  const transaksiSeminggu = trans.filter((t) => {
    const transDate = new Date(t.createdAt);
    return transDate >= lastMonday && transDate <= lastSunday;
  });

  console.log("transaksi seminggu", lastMonday, lastSunday);
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

  const tanggalRange = [];
  let currentDate = new Date(firstDayOfMonth);

  while (currentDate <= today) {
    tanggalRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const jumlahTanggal = tanggalRange.length;
  const ratarata = totalPerMonth / jumlahTanggal;

  console.log("hasil rata rata:", ratarata);

  const totalExpense = expense.reduce(
    (accumulator, currentItem) => {
      const price = parseFloat(currentItem.price);
      const itemDate = new Date(currentItem.createdAt);

      if (!isNaN(price)) {
        accumulator.totalPrice += price;
      }
      if (itemDate >= firstDayOfMonth) {
        // Check if buy and ecer are valid numbers
        if (!isNaN(price)) {
          accumulator.totalBuyMonth += price;
        }
      }

      return accumulator;
    },
    {
      totalPrice: 0,
      totalBuyMonth: 0,
    }
  );

  //HUTANG
  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics();
      setTopics(data.topics || []);
    };
    fetchTopics();
  }, [topics]);

  const currentItems = topics
    .filter((item) => item.faktur !== "0")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const filteredItemsM = currentItems;
  const totalDebt = filteredItemsM
    .filter((item) => item.remark !== "Lunas")
    .reduce((total, item) => {
      return total + parseFloat(item.buy);
    }, 0);

  ///////////////////

  return (
    <div className="flex justify-center gap-3 mt-2 text-sm w-fit">
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <div className="text-white">Today</div>
        <div className="text-base stat-value">
          {formatToRupiah(totalHariIni)}
        </div>
        <div className="text-white stat-desc">
          {isNaN(progressToday) ? 0 : progressToday.toFixed(1)} %
          {progressToday === 0 || progressToday <= 0 || isNaN(progressToday)
            ? "MENURUN"
            : "Alhamdulillah Meningkat"}
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

      <div className="text-white bg-gray-600 shadow stats">
        <div className="stat">
          <div className="text-yellow-100 stat-title">Monthly</div>
          <div className="text-base stat-value">
            {formatToRupiah(totalPerMonth)}
          </div>
          <div className="text-yellow-100 stat-desc">{dateRange}</div>
        </div>
      </div>

      <div className="text-black shadow bg-gray-500-200 stats">
        <div className="stat">
          <div className="text-black stat-title">Pengeluaran</div>
          <div className="text-base stat-value">
            {formatToRupiah(totalExpense.totalBuyMonth)}
          </div>
          <div className="text-black stat-desc">{dateRange}</div>
        </div>
      </div>
      {/* <div className="text-black bg-red-300 shadow stats">
        <div className="stat">
          <div className="font-bold text-red-700 stat-title">
            Hutang Supplier Tersisa:
          </div>
          <div className="text-base stat-value">
            {formatToRupiah(totalDebt)}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default StatsNav;
