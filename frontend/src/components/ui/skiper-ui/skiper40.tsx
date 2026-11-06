import React from "react";
import { cn } from "@/lib/utils";

/**
 * Skiper 40 Animated Link & Action Component — React / Tailwind
 * Inspired by and adapted from https://cursor.com/?from=home & Skiper UI (@skiper-ui/skiper40)
 * Provides luxury micro-interactions, directional underlines, and smooth hover reveals.
 */

interface SkiperLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Link000: Underline reveals from right to left smoothly on hover
 */
export const Link000: React.FC<SkiperLinkProps> = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center transition-colors cursor-pointer",
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.08em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

/**
 * Link001: Underline reveals from left to right with an animated diagonal arrow reveal
 */
export const Link001: React.FC<SkiperLinkProps> = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center transition-colors cursor-pointer",
        "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.08em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.35em] size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

/**
 * Link002: Underline reveals from right to left with diagonal arrow
 */
export const Link002: React.FC<SkiperLinkProps> = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center transition-colors cursor-pointer",
        "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.08em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left hover:before:origin-right hover:before:scale-x-100",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.35em] size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

/**
 * Link003: Center-expanding underline reveal with arrow
 */
export const Link003: React.FC<SkiperLinkProps> = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center transition-colors cursor-pointer",
        "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.08em] before:w-full before:bg-current before:content-['']",
        "before:origin-center before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:scale-x-100",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.35em] size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

/**
 * Link004: Mix-blend difference height expansion hover effect with rotating arrow
 */
export const Link004: React.FC<SkiperLinkProps> = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center px-3 py-1.5 rounded-lg transition-all cursor-pointer overflow-hidden",
        "before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:h-0 before:bg-current before:content-['']",
        "before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:h-full before:opacity-15",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center">
        {children}
        <svg
          className="ml-1.5 size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100"
          fill="none"
          viewBox="0 0 10 10"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
};

/**
 * Link005: Luxury Pill Badge with scale reveal and directional arrow
 */
export const Link005: React.FC<SkiperLinkProps> = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center px-4 py-2 rounded-full transition-all cursor-pointer border border-current/25 hover:border-current shadow-sm hover:shadow-md",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-current before:content-['']",
        "before:scale-x-0 before:origin-left before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:scale-x-100 before:opacity-10",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center font-medium">
        {children}
        <svg
          className="ml-1.5 size-[0.65em] -translate-x-1 rotate-45 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          fill="none"
          viewBox="0 0 10 10"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
};

export const Skiper40Demo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <Link001 href="#ceremonies">View Celebrations</Link001>
      <Link002 href="#venue">Royal Venue</Link002>
      <Link003 href="#rsvp">RSVP Online</Link003>
      <Link004 href="#story">Our Love Story</Link004>
      <Link005 href="mailto:rsvp@chandrikawedsxudong.com">Contact Host</Link005>
    </div>
  );
};

export default Link001;
