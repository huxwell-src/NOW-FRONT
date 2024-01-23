// ToggleButton.js
import React from "react";
import Button from "./Button";

const ToggleButton = ({
  checked,
  onChange,
  onLabel,
  offLabel,
  iconOn,
  iconOff,
  colorOn,
  colorOff,
  className,
  onClassName, // Nueva prop para las clases cuando está en estado "on"
  offClassName, // Nueva prop para las clases cuando está en estado "off"
  ...buttonProps
}) => {
  const selectedColor = checked ? colorOn : colorOff;
  const selectedClassName = checked ? onClassName : offClassName;

  return (
    <Button
      label={checked ? onLabel : offLabel}
      onClick={onChange}
      className={`relative ${className || ""} ${selectedClassName || ""}`}
      icon={checked ? iconOn : iconOff}
      iconClassName={`${
        checked ? "text-white" : `text-${selectedColor}-900`
      } absolute left-1/2 transform -translate-x-1/2`}
      color={selectedColor}
      width="100px" // Ajusta el ancho según tus necesidades
      {...buttonProps}
    />
  );
};

export default ToggleButton;
