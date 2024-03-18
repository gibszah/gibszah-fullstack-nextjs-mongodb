import React from "react";
import Link from "next/link";
import TopicUser from "@/components/Topic/TopicUser";

const Produk = () => {
  return (
    <div>
      {/* <div className="w-fit">
        <Link href="/addTopic">
          <button className="flex mx-10 mt-5 mb-10 btn btn-neutral">
            Buat data baru
          </button>
        </Link>
      </div> */}
      <div className="mb-10">
        <TopicUser />
      </div>
    </div>
  );
};

export default Produk;
