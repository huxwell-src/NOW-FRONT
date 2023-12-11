import React from 'react';

const Button = ({ label, onClick, className, type, disabled, color = 'primary', size = 'md', full, pill }) => {
  const classes = {
    base: 'focus:outline-none rounded-xl w-fit	 transition ease-in-out duration-200 hover:shadow focus:shadow-sm ',
    disabled: 'opacity-50 cursor-not-allowed',
    full: 'w-full',
    pill: 'rounded-full',
    size: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2',
      lg: 'px-8 py-3 text-lg'
    },
    variant: {
      primary: 'bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 text-white',
      success: 'bg-emerald-500 hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 text-gray-900 text-white',
      danger: 'bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-white'
    }
  };

  const selectedColor = classes.variant[color] || classes.variant['primary'];
  const selectedSize = classes.size[size] || classes.size['normal'];
  const fullWidthClass = full ? classes.full : '';
  const pillClass = pill ? '!rounded-full' : '';


  const buttonClasses = `${classes.base} ${selectedColor} ${selectedSize} } ${pillClass} ${fullWidthClass} ${className || ''} ${disabled ? classes.disabled : ''}`;

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
