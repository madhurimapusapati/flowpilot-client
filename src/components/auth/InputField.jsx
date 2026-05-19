import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <Icon size={16} />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-slate-900/60 border ${
            error ? "border-red-500/70" : "border-slate-700/60"
          } rounded-xl px-4 py-3 ${Icon ? "pl-10" : ""} ${
            isPassword ? "pr-11" : ""
          } text-slate-100 placeholder-slate-600 text-sm
          focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20
          transition-all duration-200 hover:border-slate-600`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
