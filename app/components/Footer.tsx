import ThemesSwitch from "./ThemesSwitch";
import LinkedInIcon, { BuyMeACoffeeIcon } from "./Icons";
import { InstagramIcon } from "./Icons";
import Link from "next/link";

const Footer = () => (
  <footer className='bottom-0 z-50 bg-inherit shadow dark:shadow-gray-600 w-full mt-10'>
    {/* Use flex-col for small screens and flex-row for medium screens and up */}
    <div className='border-t border-gray-300 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center h-auto md:h-16 px-4 py-4 md:px-6 mx-auto max-w-6xl w-full my-5'>
      {/* Adjust paragraph margin on small screens */}
      <p className="text-sm text-left mb-4 md:mb-0">
        Hey I am Ezra Leong, an SEO enthusiast exploring the future development of AI and its impact on content creation. I am also developing 
        <Link href={'/seodocuments'} className="text-gray-500 hover:underline font-semibold"> SEO documentation</Link> on best practices through trial & error while following direct documentation from Google Search Central 
      </p>
      <div className="flex items-center space-x-4">
        <a href="https://www.linkedin.com/public-profile/settings" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
          <LinkedInIcon />
        </a>
        <a href="https://www.instagram.com/not_ezra?igshid=NHp4NW12eWYwd2Zq" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
          <InstagramIcon />
        </a>
        <a href="https://www.buymeacoffee.com/ezrawork20h" target="_blank" rel="noopener noreferrer" aria-label="Buy Me a Coffee">
          <BuyMeACoffeeIcon/>
        </a>
        <ThemesSwitch />
      </div>
              
    </div>
  </footer>
);

export default Footer;