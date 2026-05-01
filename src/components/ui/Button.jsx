// FILE: src/components/ui/Button.jsx

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {

  // ======================
  // VARIANTS
  // ======================
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/light",
    secondary: "bg-secondary text-primary hover:bg-secondary/light",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-danger text-white hover:bg-red-600",
    ghost: "text-slate-600 hover:bg-slate-100",
    success: "bg-success text-white hover:bg-green-600",
  };

  // ======================
  // SIZES
  // ======================
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl transition
        ${variants[variant]}
        ${sizes[size]}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
}