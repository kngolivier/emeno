// FILE: src/components/OtpInput.jsx
import { useRef, useState, useEffect } from "react";

export default function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    onComplete(combinedOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, length).split("");
    if (data.every(char => /^\d$/.test(char))) {
      const newOtp = [...otp];
      data.forEach((char, index) => {
        newOtp[index] = char;
      });
      setOtp(newOtp);
      onComplete(newOtp.join(""));
      const nextIndex = data.length < length ? data.length : length - 1;
      inputRefs.current[nextIndex].focus();
    }
  };

  return (
    /* Changement : Utilisation de gap-2 au lieu de gap-3 et w-full */
    <div className="flex justify-between items-center gap-2 py-4 w-full">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          /* 
             Correction CSS : 
             - w-full avec aspect-square pour que les cases soient carrées mais flexibles
             - max-w-[45px] pour ne pas qu'elles soient trop grandes sur tablette
          */
          className="w-full aspect-square max-w-[46px] bg-slate-50 border-2 border-slate-100 rounded-xl text-center text-lg font-black text-primary focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all shadow-sm sm:text-xl sm:rounded-2xl"
        />
      ))}
    </div>
  );
}