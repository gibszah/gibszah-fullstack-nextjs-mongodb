"use client";
import { useState, useEffect } from "react";
// import axios from "axios";
import { getTopics } from "@/components/UI/apiClient";

import CashierListProduct from "@/components/Topic/CashierListProduct";
import CashierForm from "@/components/Topic/CashierForm";
import { DotLoader, PropagateLoader } from "react-spinners";

function LoadingScreen() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <DotLoader color="#36d7b7" />
      </div>
    </>
  );
}

const TopicList = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);

  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTopics = async () => {
    try {
      if (searchQuery.trim() !== "") {
        const data = await getTopics(searchQuery);
        setTopics(data.topics || []);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };
  const handleSearching = () => {
    fetchTopics();
    console.log(topics);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const produk = topics.map((t) => {
    return (
      <CashierListProduct
        key={t._id}
        id={t._id}
        brand={t.namaobat?.name}
        type={t.type}
        price={t.ecer}
        grosir={t.grosir}
        sell={t.sell}
        stokecer={t.stokecer}
        stok={t.stok}
        faktur={t.faktur}
        satuanecer={t.satuanecer}
      />
    );
  });

  // console.log(searchKey);

  // if (!Array.isArray(topics) || topics.length === 0) {
  //   return (
  //     <>
  //       <div className="flex justify-center mt-10">KOSONG</div>
  //     </>
  //   );
  // }

  return (
    <>
      <section>
        <div className="flex mx-10">
          <label className="label">
            <span className="label-text">Cari Produk ?</span>
          </label>
          <div className="mx-10 mt-3 text-black form-control">
            <div>
              <input
                type="text"
                placeholder="Type here"
                className="w-full max-w-xs input input-bordered"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div>
            <button
              className="mt-3 btn btn-primary"
              type="button"
              onClick={handleSearching}
            >
              enter
            </button>
          </div>
        </div>
        <div className="max-h-screen mx-10 ">{produk}</div>
      </section>
    </>
  );
};

export default TopicList;
