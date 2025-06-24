import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
    const { pathname } = location;
    
  return (
  <footer className={`max-w-screen-lg ${pathname === '/' && '2xl:max-w-screen-xl'} mx-auto border-t pt-6 pb-8 mt-12 text-sm text-gray-600 dark:text-gray-400 text-center space-y-2`}>
    <p>Powered by React · Node.js · SQLite</p>

    <div className="flex justify-center gap-4 text-xl">
      <a href="https://github.com/guiconci" aria-label="GitHub" className="hover:text-highlight2-light dark:hover:text-highlight2-dark">
        <FaGithub />
      </a>
      {/* <a href="https://linkedin.com/in/yourusername" aria-label="LinkedIn" className="hover:text-highlight2-light dark:hover:text-highlight2-dark">
        <FaLinkedin />
      </a> */}
      <a href="mailto:guiconci@hotmail.com" aria-label="Email" className="hover:text-highlight2-light dark:hover:text-highlight2-dark">
        <FaEnvelope />
      </a>
    </div>

    <p className="text-xs text-gray-500 dark:text-gray-600">
      © {new Date().getFullYear()} Guilherme Conci. All rights reserved.
    </p>
  </footer>
)};

export default Footer;
