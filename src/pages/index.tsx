import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react";
import { useEffect, useState } from "react";

type HomeProps = {
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
};

export default function Home({ setUseTestAadhaar, useTestAadhaar }: HomeProps) {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      let count = 3;
      setCountdown(count);

      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          window.location.href = "https://blockpay-1.onrender.com/employee-dashboard";
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [anonAadhaar]);

  const switchAadhaar = () => {
    setUseTestAadhaar(!useTestAadhaar);
  };

  return (
    <div className="min-h-screen bg-gray-800 px-4 py-8 flex items-center justify-center">
      <main className="flex flex-col items-center justify-center gap-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800"><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-500">Anon Aadhaar </span> Verification</h1>
        <p className="text-gray-600 text-center">
          Prove your identity anonymously using your Aadhaar card.
        </p>

        <LogInWithAnonAadhaar nullifierSeed={123} />

        {useTestAadhaar ? (
          <p className="text-sm text-gray-500">
            You&apos;re using the <strong>test</strong> Aadhaar mode
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            You&apos;re using the <strong>real</strong> Aadhaar mode
          </p>
        )}
        <button
          onClick={switchAadhaar}
          type="button"
          className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors duration-200"
        >
          Switch to {useTestAadhaar ? "real" : "test"} Aadhaar
        </button>
      </main>

      {anonAadhaar.status === "logged-in" && (
        <div className="flex flex-col items-center mt-6">
          <p className="text-green-600 font-semibold">✅ Proof is valid</p>
          <p className="text-gray-600">Got your Aadhaar Identity Proof</p>
          <p className="text-gray-800 font-medium">Welcome, anon!</p>
          {latestProof && (
            <AnonAadhaarProof
              code={JSON.stringify(latestProof, null, 2)}
              className="mt-4"
            />
          )}
        </div>
      )}

      {countdown !== null && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75 z-50">
          <div className="text-white text-9xl font-bold animate-countdown">
            {countdown}
          </div>
        </div>
      )}
    </div>
  );
}
