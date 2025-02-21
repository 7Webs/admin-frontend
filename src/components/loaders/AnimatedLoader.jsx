import React from "react";
import Lottie from "react-lottie";
import loadingData from "../../assets/lottie/loader.json";
const AnimatedLoader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        // backgroundColor: "#fff",
      }}
    >
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
};

export default AnimatedLoader;
