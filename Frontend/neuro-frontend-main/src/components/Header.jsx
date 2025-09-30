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
        <nav className="hidden items-center gap-6 md:flex">
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
          <a className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary" href="#">About me</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="h-9 w-9 overflow-hidden rounded-full border-2 border-light-blue/50">
            <img alt="User avatar" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-uzuTM8goJfBrrdNDybirI2EVN86zf3KmZwCJou_WArwq2uH-NUgyaqGdD1KnnixtX55nu24syk3ojbYUhoUWeEfos6oJ1n0qNGkp7MnWBMc-HxjRodfGeZNGcNP8O1tPxVNkvgx2NNMe2vtmKYUYCXTYJl21SvqPmUAJJu27XVURVJ50J40uzgUOm4hMpdh7-PP4I1gnhp4oVety7eu5F5R-pqGVZ9UkSpwW56TR4lfN3KOZV6hUaMndM444HJXuowBpCW_HvsU"/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
