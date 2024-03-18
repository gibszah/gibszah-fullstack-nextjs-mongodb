"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const getPengeluaran = async () => {
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

const Pengeluaran = () => {
  const { data, status } = useSession();

  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getPengeluaran();
      setTopics(data.pengeluaran || []);
    };
    fetchTopics();
    const intervalId = setInterval(() => {
      fetchTopics();
    }, 2000); // Refresh every 60 seconds, adjust as needed

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  // console.log("pengeluaran: ", topics);

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };
  const [name, setName] = useState("");

  const initialExpenseData = {
    name: "",
    price: null,
    description: "",
    user: "",
    jam: "",
    faktur: "",
  };

  useEffect(() => {
    setExpenseData((prevExpenseData) => ({
      ...prevExpenseData,
      name: name,
    }));
  }, [name]);

  const [expenseData, setExpenseData] = useState(initialExpenseData);
  const [createdExpense, setCreatedExpense] = useState(null);
  // const [expenseData, setExpenseData] = useState({
  //   name: "",
  //   price: 0,
  //   description: "",
  //   user: "",
  //   jam: "",
  //   faktur: "",
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setExpenseData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      createExpense();
    }
  };

  const createExpense = async () => {
    const apiUrl = "http://localhost:3000/api/pengeluaran";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const result = await response.json();
        // console.log(result.message); // Display success message
        setCreatedExpense(expenseData);
        setExpenseData(initialExpenseData);
        setName("");
      } else {
        const errorResult = await response.json();
        console.error(errorResult.error); // Display error message
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const totalExpense = topics.reduce(
    (accumulator, currentItem) => {
      const price = parseFloat(currentItem.price);

      if (!isNaN(price)) {
        accumulator.totalPrice += price;
      }
      return accumulator;
    },
    {
      totalPrice: 0,
    }
  );
  return (
    <>
      <div>
        <div className="w-auto card-body">
          <div>
            <select
              className="w-full max-w-xs select-bordered select-sm select"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
              <option>Kategori</option>
              <option value="PBF">PBF</option>
              <option value="Grosir">Grosir</option>
              <option value="Apotek">Apotek</option>
              <option value="Toko">Toko</option>
              <option value="Konsinyasi">Konsinyasi</option>
              <option value="Fotocopy">Fotocopy</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <label className="w-full max-w-xs form-control">
            <div className="label">
              <span className="label-text">Nominal: </span>
            </div>
            <input
              required
              type="text"
              name="price"
              placeholder="Expense Price"
              value={expenseData.price}
              onChange={handleInputChange}
              onKeyDown={handleEnterKey}
              className="w-full max-w-xs input input-bordered"
            />
          </label>

          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Deskripsi: </span>
            </div>
            <textarea
              required
              type="text"
              name="description"
              placeholder="Expense Description"
              value={expenseData.description}
              onChange={handleInputChange}
              onKeyDown={handleEnterKey}
              className="w-full textarea textarea-bordered"
            ></textarea>
          </label>
          <button
            className="w-auto btn btn-outline btn-warning"
            onClick={createExpense}
          >
            Rekam Expense
          </button>
        </div>

        {/* Display the created expense */}
        {data?.user?.name === "nurpita" && (
          <div className="card-body">
            All Expense: {formatToRupiah(totalExpense.totalPrice)}
          </div>
        )}

        <div className="mx-10 overflow-x-auto">
          <table className="table w-auto">
            {/* head */}
            <thead className="border">
              <tr>
                <th></th>
                <th className="text-lg text-center ">Description</th>
                <th className="text-lg text-center ">Nominal</th>
                <th className="text-lg text-center">Kategori</th>
                <th className="text-lg text-center">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {topics?.reverse().map((t, index) => {
                const updatedAtDate = new Date(t.updatedAt);

                // Membuat tanggal format Indonesia
                const tanggalFormatIndonesia = updatedAtDate.toLocaleString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZoneName: "short",
                  }
                );

                return (
                  <tr key={t.index}>
                    <th>{index + 1}</th>
                    <td>{t.description}</td>
                    <td>{t.price}</td>
                    <td>{t.name}</td>
                    <td>{tanggalFormatIndonesia}</td>
                  </tr>
                );
              })}

              {/* row 2 */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Pengeluaran;
