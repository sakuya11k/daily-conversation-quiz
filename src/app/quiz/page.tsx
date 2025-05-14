// src/app/quiz/page.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

// クイズデータの型定義
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface AllQuizzes {
  easy: QuizQuestion[];
  medium: QuizQuestion[];
  hard: QuizQuestion[];
  surprising: QuizQuestion[];
}

// ユーティリティ関数: 配列からランダムにn個の要素を取得
function getRandomElements<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) {
    // nが配列長以上の場合、配列全体をシャッフルして返す（元の配列は変更しない）
    return [...arr].sort(() => 0.5 - Math.random());
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// 配列をシャッフルするユーティリティ関数
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]; // 元の配列を直接変更しないようにコピー
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 要素を入れ替え
  }
  return newArray;
}

export default function QuizPage() {
  // --- すべてのフックをここにまとめる ---
  const [allQuizzes, setAllQuizzes] = useState<AllQuizzes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // クイズデータ読み込みuseEffect
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch('/quizzes.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AllQuizzes = await response.json();
        setAllQuizzes(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          console.error('クイズデータの読み込みに失敗しました:', e.message);
        } else {
          setError('不明なエラーが発生しました');
          console.error('クイズデータの読み込みに失敗しました (不明なエラー)');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []); // 空の依存配列なので、コンポーネントのマウント時に一度だけ実行

  // クイズ選出useEffect: allQuizzesがセットされたら実行
  useEffect(() => {
    if (allQuizzes) {
      const easy = getRandomElements(allQuizzes.easy, 2);
      const medium = getRandomElements(allQuizzes.medium, 2);
      const hard = getRandomElements(allQuizzes.hard, 2);
      const surprising = getRandomElements(allQuizzes.surprising, 2);

      const questions = [...easy, ...medium, ...hard, ...surprising];
      setSelectedQuestions(questions.sort(() => 0.5 - Math.random())); // 全体をシャッフル
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizEnded(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [allQuizzes]); // allQuizzesが変更されたときに再実行

  // 現在の問題オブジェクトを取得
  // selectedQuestionsが空、またはindexが範囲外の場合はnullになる
  const currentQuestion = 
    selectedQuestions.length > 0 && currentQuestionIndex < selectedQuestions.length
      ? selectedQuestions[currentQuestionIndex]
      : null;

  // 選択肢をシャッフル (currentQuestionが変わるたびに再計算)
  const shuffledOptions = useMemo(() => {
    if (currentQuestion && currentQuestion.options) {
      return shuffleArray(currentQuestion.options);
    }
    return []; // currentQuestionまたはoptionsがない場合は空配列
  }, [currentQuestion]);

  // --- ここから早期returnの条件分岐 ---
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">エラー: {error}</div>;
  }

  // クイズ終了時の表示
  if (quizEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">クイズ終了！</h1>
          <p className="text-xl text-gray-700 mb-8">
            お疲れ様でした。結果を確認しましょう。
          </p>
          <div className="space-y-4">
            <Link href={`/result?score=${score}&total=${selectedQuestions.length}`}>
              <button className="w-full px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                結果を見る
              </button>
            </Link>
            <Link href="/">
              <button className="w-full px-8 py-4 bg-gray-300 text-gray-700 text-lg font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-300">
                トップに戻る
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // currentQuestionがまだ準備できていない場合 (クイズ終了前)
  if (!currentQuestion) {
    if (allQuizzes && selectedQuestions.length === 0) {
        return <div className="flex items-center justify-center min-h-screen">クイズを準備中です...</div>;
    }
    if (!allQuizzes) {
        return <div className="flex items-center justify-center min-h-screen">クイズデータを読み込んでいます...</div>;
    }
    // その他のcurrentQuestionがない状態（通常は発生しにくい）
    return <div className="flex items-center justify-center min-h-screen">問題の表示準備中にエラーが発生しました。</div>;
  }

  // --- ここからハンドラ関数 (currentQuestion が存在することを前提とする) ---
  const handleAnswer = (option: string) => {
    if (isAnswered) return; // 既に回答済みなら何もしない

    setSelectedAnswer(option);
    setIsAnswered(true);
    // currentQuestionは上でnullチェック済みなので、ここではnullでないと仮定できる
    if (option === currentQuestion.answer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizEnded(true);
    }
  };

  // --- ここから通常のクイズ表示JSX ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            問題 {currentQuestionIndex + 1} / {selectedQuestions.length}
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 break-words">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {shuffledOptions.map((option, index) => (
            <button
              key={`${currentQuestion.id}-option-${index}`}
              onClick={() => handleAnswer(option)}
              disabled={isAnswered}
              className={`
                w-full p-4 border rounded-lg text-left text-lg transition-colors duration-200
                ${isAnswered 
                  ? (option === currentQuestion.answer ? 'bg-green-500 text-white border-green-500' 
                    : (option === selectedAnswer ? 'bg-red-500 text-white border-red-500' : 'bg-gray-100 border-gray-300 text-gray-700'))
                  : 'bg-white border-blue-500 text-blue-700 hover:bg-blue-50'
                }
                ${isAnswered && option !== selectedAnswer && option !== currentQuestion.answer ? 'opacity-70' : ''}
                ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="text-center">
            <button
              onClick={handleNextQuestion}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              {currentQuestionIndex < selectedQuestions.length - 1 ? '次の問題へ' : '結果画面へ'}
            </button>
          </div>
        )}
         <div className="mt-6 text-center">
          <p className="text-xl font-bold">現在のスコア: {score} / {selectedQuestions.length}</p>
        </div>
      </div>
    </div>
  );
}