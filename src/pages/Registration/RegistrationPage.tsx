// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "../../hooks/User/useAddUser";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

interface UserInfo {
  first_name: string;
  last_name: string;
  father_name: string;
  phone: string;
  email: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<UserInfo>({
    first_name: "",
    last_name: "",
    father_name: "",
    email: "",
    phone: "",
  });
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useAddUser();
  const { login } = useAuthStore(); // use login function from zustand

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: UserInfo = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      father_name: formData.father_name,
      email: formData.email,
      phone: formData.phone,
      password: password // Include the password
    };

    try {
      const response = await mutateAsync(newUser); // remove unnecessary second argument
      console.log(response);

      if (response?.data?.data?.access && response?.data?.data?.refresh) {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", response.data.data.access);
        localStorage.setItem("refreshToken", response.data.data.refresh);

        toast.success("Registration successful!", { duration: 3000 });
        login();
        // Retrieve redirect path and navigate
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        toast.error("Registration successful but couldn't retrieve tokens. Please login manually.", { duration: 5000 });
      }


    } catch (error: any) {
      console.error("Registration error:", error); // Log the error for debugging
      toast.error(
        `Registration failed: ${error?.message || "Please try again."}`,
        {
          duration: 5000,
        }
      );
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 text-[#4570EA]">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="first_name"
              className="block text-gray-700 text-sm mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="last_name"
              className="block text-gray-700 text-sm mb-2"
            >
              Surname:
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="father_name"
              className="block text-gray-700 text-sm mb-2"
            >
              Father Name:
            </label>
            <input
              type="text"
              id="father_name"
              name="father_name"
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.father_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm mb-2">
              Phone:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm mb-2">
              Gmail:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 items-center gap-2">
            <button
              className="border hover:text-white hover:bg-blue-500 text-gray-400 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;