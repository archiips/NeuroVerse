import { Link, useNavigate } from "react-router-dom";
import BrainCanvas from './BrainCanvas';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="relative py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 brain-animation" style={{backgroundImage: 'linear-gradient(-45deg, #00f0ff, #0a0a0f, #0f171f, #4d5b70)'}}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight text-foreground-light dark:text-foreground-dark">
                Simplifying Complex Neuroscience Data
              </h1>
              <p className="mt-6 text-lg text-subtle-light dark:text-subtle-dark max-w-xl mx-auto lg:mx-0">
                Explore, visualize, and interact with cutting-edge neuroscience data. NeuroVerse provides tools for researchers, educators, and enthusiasts to unlock insights from complex datasets.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  to="/demo"
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className="inline-block px-8 py-3 text-base font-bold rounded-lg bg-primary text-background-light hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg shadow-primary/50"
                >
                  Explore Sample Data
                </Link>
                {/* Remove or comment out the upload button section */}
                {/* 
                <a className="inline-block px-8 py-3 text-base font-bold rounded-lg bg-subtle-light/20 hover:bg-subtle-light/30 text-foreground-light dark:text-foreground-dark transition-transform transform hover:scale-105" href="#">Upload Your Data</a>
                */}
              </div>
            </div>
            <BrainCanvas />
          </div>
        </div>
      </section>
      <section className="bg-background-light dark:bg-background-dark py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Key Features</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Our platform offers a suite of features designed to transform how you interact with neuroscience data.</p>
          </div>
          {/* Key Features Grid */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-3 pb-3">
              <div className="flex h-8 items-center justify-start gap-4 rounded-xl px-4">
                <div className="text-gray-900 dark:text-white" data-icon="ChartBar" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight">Real Demographics</h2>
              </div>
              <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                View actual participant age, sex, and diagnosis distributions from 23 verified OpenNeuro research studies.
              </p>
            </div>
            <div className="flex flex-col gap-3 pb-3">
              <div className="flex h-8 items-center justify-start gap-4 rounded-xl px-4">
                <div className="text-gray-900 dark:text-white" data-icon="CubeFocus" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M188,32H68A36,36,0,0,0,32,68V188a36,36,0,0,0,36,36H188a36,36,0,0,0,36-36V68A36,36,0,0,0,188,32ZM72,208a20,20,0,0,1-20-20V171.31l33.61-26.89a8,8,0,0,1,10,.06L120,165.24V208Zm136-20a20,20,0,0,1-20,20H136V152a8,8,0,0,0-13.21-6.06L80,180.94V68A20,20,0,0,1,100,48h88a20,20,0,0,1,20,20Z"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight">Interactive 3D Charts</h2>
              </div>
              <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                Explore data through rotating 3D bar charts and donut visualizations with zoom, pan, and hover details.
              </p>
            </div>
            <div className="flex flex-col gap-3 pb-3">
              <div className="flex h-8 items-center justify-start gap-4 rounded-xl px-4">
                <div className="text-gray-900 dark:text-white" data-icon="Funnel" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M227.81,66.76l-.08-.09L192,25.91V16a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v9.91L28.27,66.67l-.08.09A16,16,0,0,0,24,78.33V208a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V78.33A16,16,0,0,0,227.81,66.76ZM40,78.33,76.69,40H179.31L216,78.33V80H40ZM216,208H40V96H216V208Z"></path>
                  </svg>
                </div>
                <h2 className="text-gray-900 dark:text-white text-base font-bold leading-tight">Smart Search & Filter</h2>
              </div>
              <p className="text-gray-600 dark:text-[#92adc9] text-sm font-normal leading-normal">
                Filter datasets by clinical populations (ADHD, depression, autism) or sort by participant count instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <div className="flex justify-center mb-16">
        <button
          onClick={() => navigate('/datasets')}
          className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-[#93c5fd] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#60a5fa] transition-colors"
        >
          <span className="truncate">Explore Datasets</span>
        </button>
      </div>
    </>
  );
};

export default HomePage;