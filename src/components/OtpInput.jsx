// FILE: src/components/OtpInput.jsx

import { useRef, useState, useEffect } from "react";

export default function OtpInput({ length = 6, onComplete }) {
  // On initialise un tableau de 6 chaînes vides
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  // On s'assure que le premier input prend le focus au montage
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
    // On ne prend que le dernier caractère tapé (pour éviter les bugs de saisie)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Notifier le parent du changement
    const combinedOtp = newOtp.join("");
    onComplete(combinedOtp);

    // Focus automatique sur la cellule suivante si on a tapé un chiffre
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Si on appuie sur "Retour arrière" et que la case est vide, on va à la précédente
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
        if (inputRefs.current[index]) inputRefs.current[index].value = char;
      });
      setOtp(newOtp);
      onComplete(newOtp.join(""));
      // Focus le dernier input rempli ou le suivant
      const nextIndex = data.length < length ? data.length : length - 1;
      inputRefs.current[nextIndex].focus();
    }
  };

  return (
    <div className="flex justify-center gap-3 py-4">
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
          className="w-12 h-14 sm:w-14 sm:h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-xl font-black text-primary focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all shadow-sm"
        />
      ))}
    </div>
  );
}