import React from "react";
import ApprovalWidget from "./ApprovalWidget";
import DatesWidget from "./DatesWidget";

export default function BotWidget() {
  return (
    <div className="flex flex-wrap justify-between w-full p-5 gap-10">
      <div className="w-full lg:w-[48%]">
        <DatesWidget />
      </div>
      <div className="w-full lg:w-[48%]">
        <ApprovalWidget />
      </div>
    </div>
  );
}
