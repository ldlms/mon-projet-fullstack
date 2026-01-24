import { NavLinkProps } from "../types/props";
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

function cn(...inputs:ClassValue[]){
    return twMerge(clsx(inputs));
}

function NavLink({
    children,
    isActive,
    isDisabled,
    className,
    ...props
}: NavLinkProps){
    
    return(
        <a
            aria-current={isActive? 'page' : undefined}
            aria-disabled={isDisabled}
            className={cn(
            "relative inline-flex items-center px-1 pt-1 text-lg font-medium transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 cursor-pointer",

            "text-white hover:text-gray-200 hover:border-gray-300",

            isActive && "text-white border-b-2 border-white hover:none",

            isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",

            className
            )}
            {...props}
        >
        {children}
        <span
            className={cn(
            "absolute inset-x-0 bottom-0 h-0.5 bg-white",
            isActive ? "scale-x-100" : "scale-x-0"
            )}
            />
        </a>
    );
}


export default NavLink;


