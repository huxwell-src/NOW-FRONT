import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({
  label,
  onClick,
  className,
  type,
  disabled,
  color = "primary",
  size = "md",
  full,
  pill,
  icon, // Nueva prop para el icono
  iconClassName, // Nueva prop para las clases del icono
}) => {
  const classes = {
    base: "focus:outline-none rounded-xl w-fit transition ease-in-out duration-200 hover:shadow focus:shadow-sm",
    disabled: "opacity-50 cursor-not-allowed",
    full: "w-full",
    pill: "rounded-full",
    size: {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2",
      lg: "px-8 py-3 text-lg",
    },
    variant: {
      primary:
        "bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 text-white",
      success:
        "bg-emerald-700 hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-700 focus:ring-opacity-50 text-gray-900 text-white",
      danger:
        "bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white",
      text:
        "rounded-lg  text-primary-900 hover:bg-gray-100 !shadow-none ",
    },
  };

  const selectedColor = classes.variant[color] || classes.variant["primary"];
  const selectedSize = classes.size[size] || classes.size["normal"];
  const fullWidthClass = full ? classes.full : "";
  const pillClass = pill ? "!rounded-full" : "";

  const buttonClasses = `${
    classes.base
  } ${selectedColor} ${selectedSize} ${pillClass} ${fullWidthClass} ${
    className || ""
  } ${disabled ? classes.disabled : ""}`;

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      type={type}
      disabled={disabled}
    >
      {icon && (
        <FontAwesomeIcon
          className={iconClassName} // Usar las clases del icono proporcionadas
          icon={icon}
        />
      )}
      {label} 
    </button>
  );
};

export default Button;
