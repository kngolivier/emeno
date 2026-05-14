// src/components/OtpInput.jsx
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [activeId, setActiveId] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    // On n'accepte que les chiffres
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // On ne prend que le dernier caractère saisi
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    // On notifie le parent à chaque changement, 
    // ou seulement quand c'est complet selon ta logique d'API
    onComplete(combinedOtp);

    // Focus automatique sur le suivant
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
      setActiveId(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    // Retour arrière : on efface et on recule
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        setActiveId(index - 1);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim().slice(0, length).split("");
    
    if (data.every(char => /^\d$/.test(char))) {
      const newOtp = [...otp];
      data.forEach((char, index) => {
        newOtp[index] = char;
      });
      setOtp(newOtp);
      onComplete(newOtp.join(""));
      
      // Focus sur la dernière case remplie ou la dernière tout court
      const targetIndex = data.length < length ? data.length : length - 1;
      inputRefs.current[targetIndex].focus();
      setActiveId(targetIndex);
    }
  };

  return (
    <div className="flex justify-between items-center gap-2 py-6 w-full max-w-sm mx-auto">
      {otp.map((digit, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="flex-1"
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code" // Important pour iOS/Android qui suggèrent le code SMS
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onFocus={() => {
              setActiveId(index);
              inputRefs.current[index].select(); // Sélectionne le texte pour écraser facilement
            }}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`
              w-full aspect-square text-center text-xl sm:text-2xl font-black italic
              rounded-2xl transition-all duration-300 outline-none border-2
              ${activeId === index 
                ? "bg-white dark:bg-slate-800 border-secondary ring-4 ring-secondary/10 shadow-lg shadow-secondary/5 text-primary dark:text-white scale-110 z-10" 
                : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-600"
              }
              ${digit ? "border-primary/20 dark:border-secondary/40" : ""}
            `}
          />
        </motion.div>
      ))}
    </div>
  );
}