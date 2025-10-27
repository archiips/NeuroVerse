import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-dark-border bg-background-light dark:bg-[#0D0D0D] backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-3xl text-secondary-blue dark:text-light-blue"> grain </span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            NeuroVerse
          </h1>
        </div>
        <nav className="hidden items-center gap-6 md:flex absolute left-1/2 transform -translate-x-1/2">
          <Link
            className={`text-sm font-medium ${location.pathname === '/' ? 'font-bold text-secondary-blue dark:text-light-blue' : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'}`}
            to="/"
          >
            Home
          </Link>
          <Link
            className={`text-sm font-medium ${location.pathname === '/datasets' ? 'font-bold text-secondary-blue dark:text-light-blue' : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'}`}
            to="/datasets"
          >
            Datasets & Visualizations
          </Link>
          <Link
            className={`text-sm font-medium ${location.pathname === '/about' ? 'font-bold text-secondary-blue dark:text-light-blue' : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary'}`}
            to="/about"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
