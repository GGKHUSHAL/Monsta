"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function AuthRequiredPage({
  children,
  message = "Please login first",
}) {
  const router = useRouter();
  const token = useSelector((state) => state.authStore.token);

  useEffect(() => {
    if (!token) {
      toast.warning(message);
      const timer = setTimeout(() => {
        router.push("/log-in");
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [message, router, token]);

  if (!token) {
    return null;
  }

  return children;
}
