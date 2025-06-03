import { cn } from '../../assets/utils';

import type { VariantProps } from 'class-variance-authority'; // Changed import
import type { ButtonHTMLAttributes} from 'react';
import { buttonVariants } from './buttonVariants';


interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button: React.FC<ButtonProps> = ({ className, size, variant, ...props }) => {
    return (
        <button
            {...props}
            className={cn(
                buttonVariants({
                    size,
                    variant,
                    className,
                })
            )}
        ></button>
    );
};

export default Button;