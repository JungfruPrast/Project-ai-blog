import ThemesSwitch from "./ThemesSwitch";
import LinkedInIcon from "./Icons";

const Footer = () => (
  <footer className='bottom-0 z-50 bg-inherit shadow dark:shadow-gray-600 w-full mt-10'>
    {/* Use flex-col for small screens and flex-row for medium screens and up */}
    <div className='border-t border-gray-300 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center h-auto md:h-16 px-4 py-4 md:px-6 mx-auto max-w-6xl w-full'>
      {/* Adjust paragraph margin on small screens */}
      <p className="text-sm text-left mb-4 md:mb-0">
        Hey I am Ezra Leong, an SEO specialist exploring the future development of AI and its impact on content creation. I am currently developing documentation on AI content creation best practices through trial and error. Stay tuned.
      </p>
      <div className="flex items-center space-x-4">
        
        <a href="https://www.linkedin.com/public-profile/settings" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon />
        </a>
        <ThemesSwitch />
      </div>        
    </div>
  </footer>
);

export default Footer;
