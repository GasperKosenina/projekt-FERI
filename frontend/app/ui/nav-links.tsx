"use client";

import { HomeIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { BellIcon, HistoryIcon } from "lucide-react";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Datasets",
    href: "/dashboard/datasets",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "History",
    href: "/dashboard/history",
    icon: HistoryIcon,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: BellIcon,
  },
];

interface NavLinksProps {
  unseenCount: number;
}

export default function NavLinks({ unseenCount }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              { "bg-sky-100 text-blue-600": pathname === link.href }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
            {link.name === "Notifications" && unseenCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-bold leading-none text-white">
                {unseenCount}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}
