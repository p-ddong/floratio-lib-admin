// src/hook/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthRedirect(token: string | null) {
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [token,router]);
}
