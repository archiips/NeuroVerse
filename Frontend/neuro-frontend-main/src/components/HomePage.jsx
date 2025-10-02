import { Link } from "react-router-dom";
import BrainCanvas from './BrainCanvas';

const HomePage = () => {
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
                <a className="inline-block px-8 py-3 text-base font-bold rounded-lg bg-subtle-light/20 hover:bg-subtle-light/30 text-foreground-light dark:text-foreground-dark transition-transform transform hover:scale-105" href="#">Upload Your Data</a>
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
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="transform rounded-xl border border-subtle-light/30 bg-subtle-light/20 p-8 shadow-lg transition-transform hover:-translate-y-2 dark:bg-subtle-dark/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-subtle-light text-primary">
                <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M169.64,134.33l44.77-19.46A16,16,0,0,0,213,85.07L52.92,32.8A16,16,0,0,0,32.8,52.92L85.07,213a15.83,15.83,0,0,0,14.41,11l.79,0a15.83,15.83,0,0,0,14.6-9.59h0l19.46-44.77L184,219.31a16,16,0,0,0,22.63,0l12.68-12.68a16,16,0,0,0,0-22.63Zm-69.48,73.76.06-.05Zm95.15-.09-49.66-49.67a16,16,0,0,0-26,4.94l-19.42,44.65L48,48l159.87,52.21-44.64,19.41a16,16,0,0,0-4.94,26L208,195.31ZM88,24V16a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0ZM8,96a8,8,0,0,1,8-8h8a8,8,0,0,1,0,16H16A8,8,0,0,1,8,96Zm112.85-67.58l8-16a8,8,0,0,1,14.31,7.16l-8,16a8,8,0,1,1-14.31-7.16Zm-81.69,96a8,8,0,0,1-3.58,10.74l-16,8a8,8,0,0,1-7.16-14.31l16-8A8,8,0,0,1,39.16,124.42Z"></path>
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Interactive Exploration</h3>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                Engage with neuroscience data through dynamic, interactive visualizations that allow you to explore and manipulate complex datasets in real-time.
              </p>
            </div>
            <div className="transform rounded-xl border border-subtle-light/30 bg-subtle-light/20 p-8 shadow-lg transition-transform hover:-translate-y-2 dark:bg-subtle-dark/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-subtle-light text-primary">
                <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Advanced Visualization</h3>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                Utilize state-of-the-art visualization techniques to uncover patterns and insights within neuroscience data, enhancing your understanding of neural processes.
              </p>
            </div>
            <div className="transform rounded-xl border border-subtle-light/30 bg-subtle-light/20 p-8 shadow-lg transition-transform hover:-translate-y-2 dark:bg-subtle-dark/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-subtle-light text-primary">
                <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M160,40a32,32,0,1,0-32,32A32,32,0,0,0,160,40ZM128,56a16,16,0,1,1,16-16A16,16,0,0,1,128,56ZM231.5,87.71A19.62,19.62,0,0,0,212,72H44a20,20,0,0,0-8.38,38.16l.13,0,50.75,22.35-21,79.72A20,20,0,0,0,102,228.8l26-44.87,26,44.87a20,20,0,0,0,36.4-16.52l-21-79.72,50.75-22.35.13,0A19.64,19.64,0,0,0,231.5,87.71Zm-17.8,7.9-56.93,25.06a8,8,0,0,0-4.51,9.36L175.13,217a7,7,0,0,0,.49,1.35,4,4,0,0,1-5,5.45,4,4,0,0,1-2.25-2.07,6.31,6.31,0,0,0-.34-.63L134.92,164a8,8,0,0,0-13.84,0L88,221.05a6.31,6.31,0,0,0-.34.63,4,4,0,0,1-2.25,2.07,4,4,0,0,1-5-5.45,7,7,0,0,0,.49-1.35L103.74,130a8,8,0,0,0-4.51-9.36L42.3,95.61A4,4,0,0,1,44,88H212a4,4,0,0,1,1.73,7.61Z"></path>
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Accessibility</h3>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                NeuroVerse is designed with accessibility in mind, ensuring that users of all backgrounds and abilities can access and interact with neuroscience data.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-subtle-light/20 dark:bg-subtle-dark/50 py-20 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Ready to Explore?</h2>
          <Link
            to="/datasets"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-background-dark shadow-lg transition-all hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
          >
            Explore Datasets
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;