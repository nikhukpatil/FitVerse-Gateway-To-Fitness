import React, { useState } from 'react';
import constant from '../../constants/ImageConstants';

const Hero = () => {
  const FITNESS = constant.HOME.FITNESS;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="w-full bg-red-600">
       {!isLoaded && (
          <div className=" w-full h-screen bg-gray-200 animate-pulse" />
        )}
      <img src={FITNESS} alt="about" className="w-full" loading="lazy" onLoad={handleImageLoad} />
    </div>
  );
};

export default Hero;
