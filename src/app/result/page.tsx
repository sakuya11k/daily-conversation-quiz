// ✔️ サーバーコンポーネントなので "use client" は不要

import { Suspense } from "react";
import ClientResult from "./client-result";  // 後述の子コンポーネント

// Next.js が渡してくる props 型はこんなかんじ (searchParams: Promise)
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 🚩 Promise を await して中身のオブジェクトを取り出す
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          検索パラメータを読み込んでいます...
        </div>
      }
    >
      {/* クライアント専用ロジックはここに委譲 */}
      <ClientResult searchParams={params} />
    </Suspense>
  );
}
