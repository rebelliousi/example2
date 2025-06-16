// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "../../hooks/User/useAddUser";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { Form, Input, Button, Modal } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import type { AxiosResponse } from 'axios'; // Import AxiosResponse

interface User {  // Define your user type precisely
    username: string;
    first_name: string;
    last_name: string;
    father_name: string;
    area: string | null;
    gender: string;
    nationality: string;
    date_of_birth: string | null;
    address: string;
    place_of_birth: string;
    home_phone: string | null;
    phone: string;
    email: string;
    guardians: any[]; // Or a more specific type if you have it
    documents: any[]; // Or a more specific type if you have it
}

interface RegistrationResponse {
    status: string;
    message: string;
    data: {
        user: User;
        id: number;
        access: string;
        refresh: string;
    };
}

// Define the structure of the Axios response that `useAddUser` actually returns.
interface AxiosRegistrationResponse extends AxiosResponse<RegistrationResponse> {}


interface LoginPageProps {
    closeModal: () => void;
}




const LoginPage: React.FC<LoginPageProps> = ({ closeModal }) => {
    const [form] = Form.useForm();
    const [isPending, setIsPending] = useState(false);
    const navigate = useNavigate();
    const { mutateAsync } = useAddUser();
    const { login } = useAuthStore();


    const onFinish = async (values: any) => {
        setIsPending(true);
        try {
            const response: AxiosRegistrationResponse = await mutateAsync(values);

            if (response?.data?.data?.access && response?.data?.data?.refresh) { // Access tokens from .data.data
                localStorage.setItem("accessToken", response.data.data.access);
                localStorage.setItem("refreshToken", response.data.data.refresh);

                toast.success("Registration successful!", { duration: 3000 });
                login();

                const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
                localStorage.removeItem("redirectAfterLogin");
                navigate(redirectPath);

                closeModal();
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
        } finally {
            setIsPending(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className=" p-8 rounded  w-[450px] bg-white text-[17px]">
            <Toaster position="top-right" reverseOrder={false} />
            <h2 className=" text-[#4570EA] mb-6 text-left">Login to system to start</h2>

            <Form
                form={form}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"

            >
                <Form.Item
                    label="Name"
                    name="first_name"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input prefix={<UserOutlined style={{ marginRight: 8 }} />} placeholder="First Name" />
                </Form.Item>

                <Form.Item
                    label="Surname"
                    name="last_name"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input prefix={<UserOutlined style={{ marginRight: 8 }} />} placeholder="Last Name" />
                </Form.Item>

                <Form.Item
                    label="Father's Name"
                    name="father_name"
                    rules={[{ required: true, message: 'Please input your father\'s name!' }]}
                >
                    <Input prefix={<UserOutlined style={{ marginRight: 8 }} />} placeholder="Father's Name" />
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[
                        { required: true, message: 'Please input your phone number!' },
                        {
                            pattern: /^\+[0-9]*$/,
                            message: 'Please enter a valid phone number starting with "+"'
                        }
                    ]}
                >
                    <Input prefix={<PhoneOutlined style={{ marginRight: 8 }} />} placeholder="Phone Number" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input prefix={<MailOutlined style={{ marginRight: 8 }} />} placeholder="Email" />
                </Form.Item>



                <div className="grid grid-cols-2 space-x-2">
                    <Button onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={isPending}>
                        {isPending ? "Registering..." : "Register"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default LoginPage;