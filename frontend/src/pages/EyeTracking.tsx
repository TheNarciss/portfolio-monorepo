import ParallaxScene from "../EyeTracking/web/ParallaxScene";

const EyeTracking: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ParallaxScene />
    </div>
  );
};

export default EyeTracking;
