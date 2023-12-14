import React, { useState } from "react";

const Dropdown = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOptionSelect = (option) => {
    if (!option.disabled) {
      setSelectedOption(option);
      setDropdownVisible(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownVisible(!dropdownVisible)}
        className="py-2 px-4 w-full text-left bg-white border border-gray-200 focus:ring-2 focus:ring-primary-400 rounded-md"
      >
        {selectedOption ? selectedOption.label : "Select an option"}
      </button>

      {dropdownVisible && (
        <div className="absolute w-full z-50 top-full left-0 mt-2 bg-white border rounded-md shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer duration-200 ${
                option.disabled
                  ? "text-gray-500 cursor-not-allowed"
                  : selectedOption === option
                  ? "bg-primary-500/20"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
