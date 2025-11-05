// protected/dashboard/components/sidebar/SidebarItem.tsx
"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  item: {
    title: string
    href: string
    icon: LucideIcon
    subItems?: { title: string; href: string }[]
  }
  pathname: string
  isOpen: boolean
  isExpanded: boolean
  toggleExpanded: () => void
}

export function SidebarItem({
  item,
  pathname,
  isOpen,
  isExpanded,
}: SidebarItemProps) {
  const Icon = item.icon
  const isActive = pathname === item.href

  return (
    <div>
      <Link
        href={item.href}
        onClick={item.subItems ? (e) => e.preventDefault() : undefined}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          isActive
            ? "bg-royal-blue-700 text-white"
            : "text-royal-blue-200 hover:bg-royal-blue-800 hover:text-white"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {isOpen && (
          <>
            <span className="ml-3 flex-1">{item.title}</span>
            {item.subItems && (
              <svg
                className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-90" : ""
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </>
        )}
      </Link>
    </div>
  )
}