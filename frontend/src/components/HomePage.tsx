import React from 'react';

type HomePageProps = {
  onEnter: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center text-white">
      <h1
        className="text-6xl font-bold mb-8 cursor-pointer"
        onClick={onEnter}
      >
        The Zone
      </h1>
    </div>
  );
};

export default HomePage;
