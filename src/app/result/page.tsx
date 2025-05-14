// src/app/result/page.tsx
"use client"; // useSearchParams を使うため

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // クエリパラメータを取得するフック
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const searchParams = useSearchParams(); // クエリパラメータを取得
  const [score, setScore] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [percentageScore, setPercentageScore] = useState<number | null>(null);

  useEffect(() => {
    const scoreParam = searchParams.get('score');
    const totalParam = searchParams.get('total');

    if (scoreParam && totalParam) {
      const parsedScore = parseInt(scoreParam, 10);
      const parsedTotal = parseInt(totalParam, 10);

      if (!isNaN(parsedScore) && !isNaN(parsedTotal) && parsedTotal > 0) {
        setScore(parsedScore);
        setTotalQuestions(parsedTotal);
        setPercentageScore((parsedScore / parsedTotal) * 100);
      }
    }
  }, [searchParams]); // searchParamsが変更されたら再実行

  if (score === null || totalQuestions === null || percentageScore === null) {
    // パラメータが不正または取得中の場合の表示
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">結果を読み込み中...</h1>
        <p className="text-gray-600 mb-8">
          スコア情報が正しく渡されませんでした。
        </p>
        <Link href="/">
          <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            トップに戻る
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-10 rounded-xl shadow-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-6">クイズ結果</h1>
        
        <div className="mb-8">
          <p className="text-2xl mb-2">あなたのスコア</p>
          <p className="text-7xl font-bold tracking-tight">
            {score} <span className="text-4xl opacity-80">/ {totalQuestions}</span>
          </p>
        </div>

        <div className="mb-10">
          <p className="text-3xl mb-2">正解率</p>
          <p className="text-6xl font-bold text-yellow-300">
            {percentageScore.toFixed(1)}<span className="text-3xl opacity-80">%</span>
          </p>
          <p className="text-xl mt-1">({(percentageScore * totalQuestions / 100 * 12.5).toFixed(1)} 点 / 100点)</p>
        </div>
        
        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
          <Link href="/quiz">
            <button className="w-full md:w-auto px-8 py-4 bg-yellow-400 text-gray-800 text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-300">
              もう一度挑戦する
            </button>
          </Link>
          <Link href="/">
            <button className="w-full md:w-auto px-8 py-4 bg-gray-200 text-gray-700 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300">
              トップに戻る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}