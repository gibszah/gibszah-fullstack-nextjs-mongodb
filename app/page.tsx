"use client";
import Image from "next/image";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-black hero bg-base-200">
      <div className="flex-col hero-content lg:flex-row">
        <Image
          src="/dashb.svg"
          alt="Dashboard"
          width={300}
          height={400}
          priority
        />
        <div>
          <h1 className="text-5xl font-bold">Welcome to Apotek Kairo!</h1>
          <p className="py-6">
            Your Health, Our Priority. We take pride in being your reliable
            partner for all your health and wellness needs. As a trusted apotek
            in Indonesia, we are committed to providing top-quality
            pharmaceutical products and excellent customer service to ensure
            your well-being.
          </p>
          <button
            type="button"
            onClick={() => router.push("/auth")}
            className="btn btn-primary"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
