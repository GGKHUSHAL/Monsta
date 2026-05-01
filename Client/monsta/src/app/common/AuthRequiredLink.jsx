"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function AuthRequiredLink({
  href,
  children,
  className = "",
  message = "Please login first",
  label,
  onClick,
  navigateOnClick = true,
}) {
  const router = useRouter();
  const token = useSelector((state) => state.authStore.token);

  const handleClick = (event) => {
    event.preventDefault();

    if (!token) {
      toast.warning(message);
      setTimeout(() => {
        router.push("/log-in");
      }, 700);
      return;
    }

    onClick?.(event);

    if (navigateOnClick && href) {
      router.push(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-label={label}
    >
      {children}
    </a>
  );
}
