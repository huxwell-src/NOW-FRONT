import React from "react";

const InputText = ({
  placeholder,
  onChange,
  value,
  className,
  type,
  label,
  disabled,
}) => {
  const inputClasses =
    "py-2 !mt-2 w-full ring-gray-300 ring-1 px-4 rounded-xl sm:w-96 duration-200 focus:outline-none focus:ring focus:ring-primary-400";
  const classes = {
    disabled: "opacity-50 cursor-not-allowed"
  };
  return (
    <>
      <label className="block text-sm capitalize font-medium text-gray-900">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={`${inputClasses} ${className || ""} ${
          disabled ? classes.disabled : ""
        } `}
        {...(disabled ? { disabled: true } : {})}
      />
    </>
  );
};

export default InputText;
