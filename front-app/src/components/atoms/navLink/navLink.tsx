import { NavLinkProps } from "../types/types";
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
                "relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",

                "text-grey-500 hover:text-gray-700 hover:border-gray-300",

                isActive && "text-blue-600 border-b-2 border-blue-600",

                isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",

                className
            )}
            {...props}
        >
        {children}
        <span
            className={cn(
                "absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transition-transform duration-200 ease-out",
                isActive ? "scale-x-100" : "scale-x-0"
            )}
            />
        </a>
    );
}


export default NavLink;


