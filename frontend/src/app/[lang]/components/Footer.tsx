"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { RenderSocialIcon } from "../utils/social-icon";

interface FooterLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  social?: string;
  className?: string;
}

interface CategoryLink {
  id: string;
  attributes: {
    name: string;
    slug: string;
  };
}

function FooterLink({ url, text, className }: FooterLink) {
  const path = usePathname();
  return (
    <li className={className}>
      <Link
        href={url}
        className={`text-crema-500 hover:text-secondary ${path === url && "text-secondary border-secondary-500"
          }`}
      >
        {text}
      </Link>
    </li>
  );
}

function CategoryLink({ attributes }: CategoryLink) {
  const path = usePathname();
  const lang = path.split('/')[1] || 'en';
  return (
    <li>
      <Link
        href={`/${lang}/blog/${attributes.slug}`}
        className="hover:text-secondary"
      >
        {attributes.name}
      </Link>
    </li>
  );
}

export default function Footer({
  logoUrl,
  logoText,
  description,
  menuLinks,
  categoryLinks,
  legalLinks,
  socialLinks,
}: {
  logoUrl: string | null;
  logoText: string | null;
  description: string | null;
  menuLinks: Array<FooterLink>;
  categoryLinks: Array<CategoryLink>;
  legalLinks: Array<FooterLink>;
  socialLinks: Array<FooterLink>;
}) {

  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-crema text-crema-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center space-x-3">
              <div className="bg-crema-200 rounded-full w-auto"><Logo src={logoUrl}></Logo></div>
              <span className="text-xl text-white">{logoText}</span>
            </div>
            <p className="text-crema-500 mb-6 max-w-xs">{description}</p>
            <div className="flex space-x-4">

              {/* Social links*/}
              {socialLinks.map((link: FooterLink) => {
                return (
                  <a
                    key={link.id}
                    rel="noopener noreferrer"
                    href={link.url}
                    title={link.text}
                    target={link.newTab ? "_blank" : "_self"}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-crema-800 hover:bg-secondary hover:text-black text-secondary transition-colors"
                  >
                    <RenderSocialIcon social={link.social} />
                  </a>
                );
              })}

            </div>
          </div>

          <div>
            <h6 className="text-white mb-4">Menu</h6>
            <ul className="space-y-3">
              {menuLinks.map((link: FooterLink) => (
                <FooterLink key={link.id} {...link} />
              ))}
            </ul>
          </div>

          {/* Bottom Bar */}
        </div>
        <div className="pt-8 border-t border-crema-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-crema-500">
              © {currentYear} Notadiet™ All rights reserved.
            </p>
            <div className="flex flex-row flex-end space-x-4">
              <ul>
                {legalLinks.map((link: FooterLink) => (
                  <FooterLink className=" lg:inline lg:ml-9" key={link.id} {...link} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
