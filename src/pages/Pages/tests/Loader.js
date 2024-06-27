import React from "react";

export default function AppLoader() {
  return (
    <div className="loading">
      <LoaderBalls />
    </div>
  );
}

export const LoaderBalls = () => (
  <div className="loader">
    <li className="ball"></li>
    <li className="ball"></li>
    <li className="ball"></li>
  </div>
);
