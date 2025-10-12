<<<<<<< HEAD
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/landing");
  return (
    null
  );
=======
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/landing");
  }, [router]);

  return null; // ou un loader si tu veux
>>>>>>> develop
}
