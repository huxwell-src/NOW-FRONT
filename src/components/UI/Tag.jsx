import React from "react";

const Tag = ({ children, color }) => {
  // Aplicar clases de Tailwind según el color proporcionado
  const getTagColorClass = () => {
    switch (color) {
      case "red":
        return "bg-red-200 text-red-700";
      case "green":
        return "bg-emerald-200 text-emerald-700";
      case "yellow":
        return "bg-yellow-200 text-amber-500 ";
      case "gray":
        return "bg-gray-200 text-gray-700";
      // Puedes agregar más casos según tus necesidades
      default:
        return "bg-primary-200 text-primary-700";
    }
  };

  return (
    <span
      className={`inline-block font-medium px-3 py-1 w-fit text-sm rounded-xl ${getTagColorClass()}`}
    >
      {children}
    </span>
  );
};

export default Tag;
