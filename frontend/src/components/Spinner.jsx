import React from "react";

const Spinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-ping w-16 h-16 m-8 rounded-full bg-slate-600"></div>
    </div>
  );
};

export default Spinner;
