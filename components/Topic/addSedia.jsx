"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddSediaan() {
  const router = useRouter();

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [user, setUser] = useState("");
  const [jam, setJam] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const res = await fetch("http://localhost:3000/api/transaksi", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          jumlah,
          user,
          jam,
        }),
      });

      if (res.ok) {
        router.refresh();
        router.push("/cashier");

        console.log("Product berhasil dibuat!");
      } else {
        console.error("Error creating product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit}></form>
      </div>
    </>
  );
}
