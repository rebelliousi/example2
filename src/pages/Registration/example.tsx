// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "../../hooks/User/useAddUser";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { Form, Input, Button, Modal } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";


interface UserInfo {
    first_name: string;
    last_name: string;
    father_name: string;
    phone: string;
    email: string;
}

interface LoginPageProps {
    closeModal: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ closeModal }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useAddUser();
    const { login } = useAuthStore();

    const onFinish = async (values: any) => {
        const newUser: UserInfo = {
            first_name: values.first_name,
            last_name: values.last_name,
            father_name: values.father_name,
            email: values.email,
            phone: values.phone,
        };

        try {
            const response = await mutateAsync(newUser);

            if (response?.data?.data?.access && response?.data?.data?.refresh) {
                localStorage.setItem("accessToken", response.data.data.access);
                localStorage.setItem("refreshToken", response.data.data.refresh);

                toast.success("Registration successful!", { duration: 3000 });
                login();

                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectPath);

                closeModal(); // Close the modal after successful registration
            } else {
                toast.error("Registration successful but couldn't retrieve tokens. Please login manually.", { duration: 5000 });
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error(
                `Registration failed: ${error?.message || "Please try again."}`,
                {
                    duration: 5000,
                }
            );
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div className=" p-8 rounded  w-[450px] bg-white text-[17px]">
            <Toaster position="top-right" reverseOrder={false} />
            <h2 className=" text-[#4570EA] mb-6 text-left">Login to system to start</h2>

            <Form
                form={form}
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="first_name"
                    rules={[{ required: true, message: "Please input your name!" }]}
                >
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    label="Surname"
                    name="last_name"
                    rules={[{ required: true, message: "Please input your surname!" }]}
                >
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    label="Father Name"
                    name="father_name"
                    rules={[{ required: true, message: "Please input your father's name!" }]}
                >
                    <Input prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: "Please input your phone number!" }]}
                >
                    <Input prefix={<PhoneOutlined />} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please enter a valid email address!" },
                    ]}
                >
                    <Input prefix={<MailOutlined />} />
                </Form.Item>


                <div className="grid grid-cols-2 space-x-2">
                    <Button onClick={closeModal} className=" text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                        Cancel
                    </Button>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPending}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {isPending ? "Registering..." : "Register"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;