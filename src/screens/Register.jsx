import React, { useState } from "react";
import {
  LockOutlined,
  UserOutlined,
  SyncOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [signupRes, setSignupRes] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setSignupRes(true);
    createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password,
      values.username
    )
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("email sent");
          updateProfile(auth.currentUser, {
            displayName: values.username,
          })
            .then(() => {
              setSignupRes(false);
              messageApi.open({
                type: "success",
                content: "User registered successfully",
              });
              navigate("/");
            })
            .catch((error) => {
              console.log(error.message);
            });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          setSignupRes(false);
          messageApi.open({
            type: "warning",
            content: "Email already in use",
          });
        }
      });
  };
  return (
    <div className="flex justify-center items-center h-screen">
      {contextHolder}

      <Form
        name="normal_login"
        className="login-form shadow-2xl w-90 p-5 rounded w-10/12 sm:w-3/12"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-indigo-400 flex justify-center items-center"
            icon={signupRes && <SyncOutlined spin />}
            disabled={signupRes}
          >
            Sign up
          </Button>
          <p className="mt-3">
            Or{" "}
            <Link to="/" className="text-sky-800">
              Login now!
            </Link>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
