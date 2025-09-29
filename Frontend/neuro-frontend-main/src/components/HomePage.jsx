const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-bg relative flex min-h-[60vh] items-center justify-center bg-cover bg-center bg-no-repeat text-center text-white md:min-h-[75vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl">
              Democratizing Neuroscience Research Data
            </h1>
            <p className="max-w-3xl text-base font-normal text-gray-200 md:text-lg">
              Explore, visualize, and interact with cutting-edge neuroscience data. NeuroData provides tools for researchers, educators, and enthusiasts to unlock insights from complex datasets.
            </p>
            <button className="min-w-[150px] cursor-pointer flex items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 text-base font-bold text-white transition-transform hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-gray-50 dark:bg-background-dark py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Key Features</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              NeuroData offers a suite of powerful tools designed to make neuroscience data accessible and actionable.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/20 p-6">
              <div className="text-primary">
                <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Interactive Exploration</h3>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                Dive deep into datasets with interactive visualizations that allow you to explore data from multiple perspectives.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/20 p-6">
              <div className="text-primary">
                <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advanced Visualization</h3>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                Utilize advanced visualization techniques to uncover patterns and insights that are not apparent in raw data.
              </p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/20 p-6">
              <div className="text-primary">
                <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Collaborative Research</h3>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                Share your findings and collaborate with other researchers through our integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white dark:bg-background-dark py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Ready to Explore?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            Start your journey into the world of neuroscience data. Browse our extensive collection of datasets and begin your analysis today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button className="min-w-[180px] cursor-pointer flex items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 text-base font-bold text-white transition-transform hover:scale-105 active:scale-95">
              Explore Datasets
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;