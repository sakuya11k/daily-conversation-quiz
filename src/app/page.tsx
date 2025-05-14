// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        日常会話クイズアプリ
      </h1>
      <Link href="/quiz">
        <button className="px-8 py-4 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
          クイズを始める
        </button>
      </Link>
    </div>
  );
}