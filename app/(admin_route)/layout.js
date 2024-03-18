import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const PrivateLayout = ({ children }) => {
  // const session = await getServerSession(authOptions);
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    redirect("/auth");
    return <div>Anda tidak memiliki izin untuk mengakses halaman ini.</div>;
  }

  return <>{children}</>;
};

export default PrivateLayout;
