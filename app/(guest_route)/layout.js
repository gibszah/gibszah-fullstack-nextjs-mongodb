// import React, { ReactNode } from "react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

// interface Props {
//   children: ReactNode;
// }

// export default async function PrivateLayout({ children }: Props) {
//   const session = await getServerSession(authOptions);

//   if (session?.user) redirect("/cashier");

//   return <>{children}</>;
// }

"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const PrivateLayout = ({ children }) => {
  const { data, status } = useSession();
  const isAuth = status === "authenticated";

  if (isAuth) {
    redirect("/cashier");
  }

  return <>{children}</>;
};

export default PrivateLayout;
