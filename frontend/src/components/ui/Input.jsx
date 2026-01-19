import { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./css/Input.css";

const Input = forwardRef(function Input(
  {
    className = "",
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    isPassword = false,
    icon = null, // 👈 NEW
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div
      className={`input-wrapper 
        ${icon ? "has-icon" : ""} 
        ${isPassword ? "has-password" : ""} 
        ${className}`}
    >
      {icon && <span className="input-icon">{icon}</span>}

      <input
        ref={ref}
        className="input"
        name={name}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((p) => !p)}
          aria-label="Toggle password visibility"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
});

export default Input;
