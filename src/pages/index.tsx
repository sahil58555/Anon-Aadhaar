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
    <div className="min-h-screen bg-gray-900 px-4 py-8 flex items-center justify-center">
      <div className="mih-h-[50vh] min-w-[40vw] flex flex-col justify-center items-center bg-gray-200 rounded-lg gap-10 md:p-10 p-6">
        <div className="typewriter-text">
          <h1 className="text-5xl font-bold text-gray-800 text-center"><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-500 ">Anon Aadhaar </span> Verification</h1>
          <p className="text-gray-600 text-center overflow-hidden text-xl">
            Prove your identity anonymously using your Aadhaar card.
          </p>
        </div>

        <LogInWithAnonAadhaar nullifierSeed={123} />

        {useTestAadhaar ? (
          <p className="text-md text-gray-500">
            You&apos;re using the <strong>test</strong> Aadhaar mode
          </p>
        ) : (
          <p className="text-md text-gray-500">
            You&apos;re using the <strong>real</strong> Aadhaar mode
          </p>
        )}
        <button
          onClick={switchAadhaar}
          type="button"
          className="rounded-md bg-gradient-to-r from-orange-400 via-gray-100 to-green-400 text-black px-4 py-2 text-md font-semibold shadow-sm transition-colors duration-200"
        >
          Switch to {useTestAadhaar ? "real" : "test"} Aadhaar
        </button>

      </div>
      {anonAadhaar.status === "logged-in" && (
        <div className="flex flex-col items-center mt-6">
          <p className="text-green-600 font-semibold">✅ Proof is valid</p>
          <p className="text-gray-600">Got your Aadhaar Identity Proof</p>
          <p className="text-gray-800 font-medium">Welcome, anon!</p>
          {latestProof && (
            <AnonAadhaarProof
              code={JSON.stringify(latestProof, null, 2)}
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
