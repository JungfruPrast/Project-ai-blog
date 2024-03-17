import ThemesSwitch from "./ThemesSwitch";
import LinkedInIcon, { BuyMeACoffeeIcon } from "./Icons";
import { InstagramIcon } from "./Icons";
import Link from "next/link";

const Footer = () => (
  <footer className='bottom-0 z-50 bg-inherit shadow dark:shadow-gray-600 w-full mt-10'>
    <div className='border-t border-gray-300 dark:border-gray-700 flex flex-col items-center h-auto px-6 py-6 mx-auto max-w-6xl w-full my-5'>
      {/* Container for paragraph + ThemesSwitch, ensuring they are next to each other */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center sm:items-center">
        <p className="text-sm mb-4 md:mb-0">
          Hey I am Ezra Leong, an SEO enthusiast exploring the future development of AI and its impact on content creation. I am also developing
          <Link href={'/seodocuments'} className="text-gray-500 hover:underline font-semibold"> SEO documentation </Link>on best practices through trial & error while following direct documentation from Google Search Central.
        </p>
        <ThemesSwitch />
      </div>
      {/* Icons with descriptions below them */}
      <div className="flex justify-center items-start space-x-8 mt-4">
        <div className="text-center">
          <a href="https://www.linkedin.com/public-profile/settings" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
            <LinkedInIcon />
            <p className="text-xs mt-2">LinkedIn</p>
          </a>
        </div>
        <div className="text-center">
          <a href="https://www.instagram.com/not_ezra?igshid=NHp4NW12eWYwd2Zq" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
            <InstagramIcon />
            <p className="text-xs mt-2">Instagram</p>
          </a>
        </div>
        <div className="text-center">
          <a href="https://www.buymeacoffee.com/ezrawork20h" target="_blank" rel="noopener noreferrer" aria-label="Buy Me a Coffee">
            <BuyMeACoffeeIcon/>
            <p className="text-xs mt-2">Support</p>
          </a>
        </div>
      </div>              
    </div>
  </footer>
);

export default Footer;
