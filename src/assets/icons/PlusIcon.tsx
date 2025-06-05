import type { IconProps } from "../../models/models";



const PlusIcon: React.FC<IconProps> = ({ size = 20, className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="currentColor"
            viewBox="0 0 16 16"
            className={className}
        >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
    );
};
export default PlusIcon;
