// /verifyEmail/page.tsx
"use client";
import { Suspense } from "react";
import VerifyEmailInner from "@/components/VerifyEmailInner";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
