"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function HomePage() {
  const { token } = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [token, router]);

  return null;
}
