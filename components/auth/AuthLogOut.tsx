"use client";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const AuthLogOut = () => {
  const router = useRouter();

  const { data, status } = useSession();

  const isAuth = status === "authenticated";
  const [logoutInitiated, setLogoutInitiated] = useState(false);

  const performLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    await signOut(); // Lakukan logout

    // Tampilkan notifikasi
    setShowToast(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000); // Contoh: alihkan setelah 3 detik
  };

  useEffect(() => {
    let logoutTimeout: NodeJS.Timeout;

    if (isAuth) {
      // window.location.reload();
      logoutTimeout = setTimeout(performLogout, 40600000); // 10000 milidetik (10 detik)
    }

    return () => clearTimeout(logoutTimeout); // Membersihkan timeout
  }, [isAuth]);

  // useEffect(() => {
  //   let logoutTimeout: NodeJS.Timeout;

  //   if (logoutInitiated) {
  //     // Set a timeout before performing logout
  //     logoutTimeout = setTimeout(async () => {
  //       // Perform the logout action
  //       await performLogout();
  //       // Redirect to login page
  //       router.push("/login");
  //     }, 100000); // 10000 milliseconds (10 seconds)
  //   }

  //   return () => {
  //     clearTimeout(logoutTimeout);
  //   };
  // }, [logoutInitiated, router]);

  // useEffect(() => {
  //   if (!isAuth) {
  //     router.push("/login");
  //   }
  // }, [isAuth, router]);

  // if (!isAuth) {
  //   // Optionally, you can return a loading state or redirect immediately if the user is not authenticated
  //   return <p>Loading...</p>;
  // }

  if (isAuth)
    return (
      <div className="bg-white rounded dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Image src="/small.svg" alt="Profl" width={50} height={50} />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu text-black menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 overflow-y-auto"
        >
          {/* <li>
            <a className="justify-between">{data?.user?.name}</a>
          </li> */}
          {/* <li>
            <Link href="/cashier">Kasir</Link>
          </li> */}
          {/* <li>
            <Link href="/produk">Produk</Link>
          </li> */}
          {/* <li>
            <Link href="/riwayatTransaksi">History</Link>
          </li> */}
          {/* <li>
            <Link href="/stok">Stok Tersedia</Link>
          </li> */}
          <li>
            <Link href="/stokkosong" as="/stokkosong">
              Stok Kurang dari 3
            </Link>
          </li>
          <li>
            <Link href="/pengeluaran" as="/pengeluaran">
              Pengeluaran
            </Link>
          </li>
          <li></li>
          <li>
            {/* {data?.user?.name === "obi" && (
              <Link href="/dashboard">Dashboard</Link>
            )} */}
            {data?.user?.name === "nurpita" && (
              <Link href="/dashboard">Dashboard</Link>
            )}
          </li>
          <li>
            {/* {data?.user?.name === "obi" && (
              <Link href="/dashboard">Dashboard</Link>
            )} */}
            {data?.user?.name === "nurpita" && (
              <Link href="/revenue">Revenue</Link>
            )}
          </li>
          <li>
            <p>
              {" "}
              <button onClick={handleLogout}>logout</button>
            </p>
          </li>
        </ul>
      </div>
    );

  return (
    <div>
      {showToast && (
        <div className="toast">
          <div className="alert alert-info">
            <span>Anda Berhasil logout</span>
          </div>
        </div>
      )}
      <button type="button" onClick={() => router.push("/auth")}>
        Login
      </button>
    </div>
  );
};

export default AuthLogOut;
