// import React from "react";
// import type { IconProps } from "../../models/models";

// const DeleteIcon: React.FC<IconProps> = ({ size = 20, color = "currentColor", className, ...props }) => {
//   const svgSize = size.toString(); // Convert size to string for SVG attributes

//   return (
//     <svg
//       width={svgSize}
//       height={svgSize}
//       viewBox="0 0 24 24"  // Adjusted viewBox for better scaling
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className}
//       {...props}
//       style={{
//         width: size,      // Apply size via style for more flexible control
//         height: size,
//         color: color, //Allows you to pass a color prop
//       }}
//     >
//       <path
//         d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"  // A more visually representative download icon path
//         fill={color}
//       />
//     </svg>
//   );
// };

// export default DeleteIcon;