import Link from "next/link";
import { SITE } from "@/lib/constants";
import { FooterContact } from "@/components/layout/FooterContact";
import { ConsentPreferencesButton } from "@/components/analytics/ConsentManager";
import {
  metasilicateCategoryLink,
  metasilicateGradeLinks,
  sodiumSilicateLink,
  applicationLinks,
  guideLinks,
} from "@/lib/internal-links";

export function Footer() {
  return (
    <footer className="border-t border-[#E2E6EA] bg-[#071F3F] text-blue-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="text-lg font-bold text-white">{SITE.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-blue-200/80">
              {SITE.company}
            </p>
            <p className="mt-2 text-sm text-blue-200/60">
              Factory-direct sodium metasilicate manufacturer in Shandong, China.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Products
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={metasilicateCategoryLink.href}
                  className="text-sm text-white font-medium hover:text-blue-100"
                >
                  Sodium Metasilicate ★
                </Link>
              </li>
              {metasilicateGradeLinks.map((link) => (
                <li key={link.href} className="pl-3">
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200/80 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href={sodiumSilicateLink.href}
                  className="text-sm text-blue-200/80 hover:text-white"
                >
                  {sodiumSilicateLink.label}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Applications
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/applications" className="text-sm text-white font-medium hover:text-blue-100">
                  All Applications
                </Link>
              </li>
              {applicationLinks.map((link) => (
                <li key={link.href} className="pl-3">
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200/80 hover:text-white"
                  >
                    {link.label.replace("Sodium Metasilicate for the ", "").replace("Sodium Metasilicate for ", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Guides
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/guides" className="text-sm text-white font-medium hover:text-blue-100">
                  All Guides
                </Link>
              </li>
              {guideLinks.map((link) => (
                <li key={link.href} className="pl-3">
                  <Link
                    href={link.href}
                    className="text-sm text-blue-200/80 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-blue-200/80 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-blue-200/80 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-blue-200/80 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="text-sm text-blue-200/80 hover:text-white">
                  Downloads &amp; Documents
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-blue-200/80 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-blue-200/80 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-blue-200/80">
              <FooterContact />
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-blue-800/50 pt-6 text-xs text-blue-200/50">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {SITE.company}. All rights reserved.</p>
            <ConsentPreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
