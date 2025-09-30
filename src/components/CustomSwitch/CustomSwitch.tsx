import React from "react";
import type { CustomSwitchProps } from "./CustomSwitch.types";

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-[39px] h-6 rounded-[27.38px] relative cursor-pointer transition-colors duration-300 ${
        checked ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-[21px] h-[21px] rounded-full absolute top-[1.5px] transition-all duration-300 ${
          checked ? "left-[16.5px]" : "left-[1.5px]"
        }`}
      ></div>
    </div>
  );
};

export default CustomSwitch;
