"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ClientResultProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ClientResult({ searchParams }: ClientResultProps) {
  const [score, setScore] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [percent, setPercent] = useState<number | null>(null);

  useEffect(() => {
    const s = searchParams.score;
    const t = searchParams.total;
    if (typeof s === "string" && typeof t === "string") {
      const si = parseInt(s, 10);
      const ti = parseInt(t, 10);
      if (!isNaN(si) && !isNaN(ti) && ti > 0) {
        setScore(si);
        setTotal(ti);
        setPercent((si / ti) * 100);
      }
    }
  }, [searchParams]);

  if (score == null || total == null || percent == null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">結果を読み込み中…</h1>
        <Link href="/">
          <button className="px-8 py-3 bg-blue-500 text-white rounded">トップへ戻る</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-xl text-center">
        <h1 className="text-5xl font-extrabold mb-6">クイズ結果</h1>
        <p className="text-7xl font-bold mb-2">
          {score} <span className="text-4xl opacity-80">/ {total}</span>
        </p>
        <p className="text-6xl font-bold text-yellow-300">
          {percent.toFixed(1)}<span className="text-3xl opacity-80">%</span>
        </p>
        <div className="mt-8 flex space-x-4">
          <Link href="/quiz">
            <button className="px-6 py-3 bg-yellow-400 text-gray-800 rounded">
              もう一度挑戦
            </button>
          </Link>
          <Link href="/">
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded">
              トップへ戻る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
