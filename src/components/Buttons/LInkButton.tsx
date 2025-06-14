import { cn } from '../../assets/utils';
import { buttonVariants } from './buttonVariants';
import type { VariantProps } from 'class-variance-authority';
import React from 'react';
import { Link } from 'react-router-dom';

interface LinkButtonProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof buttonVariants> {
    children?: React.ReactNode;
    to: string;
    className?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
    children,
    to,
    className,
    size,
    variant,
    ...props
}) => {
    return (
        <Link
            to={to}
            type="button"
            {...props}
            className={cn(buttonVariants({ size, variant }), className)}
        >
            {children}
        </Link>
    );
};
