// // src/context/LoginContext.tsx
// import React, { createContext, useState, ReactNode, useContext } from 'react';

// interface LoginContextProps {
//   isLoggedIn: boolean;
//   login: () => void;
//   logout: () => void;
// }

// const LoginContext = createContext<LoginContextProps | undefined>(undefined);

// interface LoginProviderProps {
//   children: ReactNode;
// }

// export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const login = () => {
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//   };

//   const value: LoginContextProps = {
//     isLoggedIn,
//     login,
//     logout,
//   };

//   return (
//     <LoginContext.Provider value={value}>
//       {children}
//     </LoginContext.Provider>
//   );
// };

// export const useLogin = (): LoginContextProps => {
//   const context = useContext(LoginContext);
//   if (!context) {
//     throw new Error("useLogin must be used within a LoginProvider");
//   }
//   return context;
// };