import { ButtonProps } from "../types/props";

function Button({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-primary text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
