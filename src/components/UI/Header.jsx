import React from "react";

const Header = ({ title, subtitle, imageUrl }) => {
  return (
    <div className="h-32 bg-primary-200/50 m-4 p-10 flex items-center justify-between rounded-xl">
      <div>
        <h3 className="m-0 text-3xl leading-6 font-medium text-slate-800">
          {title}
        </h3>
        <span>{subtitle}</span>
      </div>
      <div className="hidden sm:block overflow-hidden w-72 h-32">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: "top" }}
        />
      </div>
    </div>
  );
};

export default Header;

