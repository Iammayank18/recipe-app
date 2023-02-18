import React, { useEffect, useState } from "react";

import {
  LockOutlined,
  UserOutlined,
  SyncOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { authUser } from "../redux/action";
import { message } from "antd";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [authReset, setAuthReset] = useState("");
  const [loginRes, setLoginRes] = useState(false);
  const [resetRes, setResetRes] = useState(false);
  const onFinish = async (values) => {
    setLoginRes(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        setLoginRes(false);
        const user = userCredential.user;
        let users = {
          isLoggedin: true,
          id: user.uid,
        };
        localStorage.setItem("user", JSON.stringify({ ...values, ...users }));
        dispatch(
          authUser({
            isLoggedin: true,
            email: values.email,
          })
        );
      })
      .catch((error) => {
        setLoginRes(false);
        if (error.message === "Firebase: Error (auth/wrong-password).") {
          console.log(error.message);
          messageApi.open({
            type: "warning",
            content: "Invalid credentials",
          });
        }
      });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetPassword = () => {
    setResetRes(true);
    const auth = getAuth();
    sendPasswordResetEmail(auth, authReset)
      .then(() => {
        setResetRes(false);
        setIsModalOpen(false);
        messageApi.open({
          type: "success",
          content: "Reset email sent",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
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
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
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
          <Input
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
            icon={loginRes && <SyncOutlined spin />}
            disabled={loginRes}
          >
            Log in
          </Button>
          <div className="flex justify-between items-center">
            <p className="mt-3">
              Or{" "}
              <Link to="/register" className="text-sky-800">
                register now!
              </Link>
            </p>
            <p
              className="text-sky-800 cursor-pointer mt-3"
              onClick={() => setIsModalOpen(true)}
            >
              Reset password
            </p>
          </div>
        </Form.Item>
      </Form>

      <Modal
        title="Reset Password"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={resetPassword}
        footer={[
          <Button onClick={() => setIsModalOpen(false)} key="back">
            Cancel
          </Button>,
          <Button
            key="submit"
            className="bg-indigo-400 "
            onClick={resetPassword}
            type="primary"
            icon={resetRes && <SyncOutlined spin />}
            disabled={resetRes}
          >
            Reset
          </Button>,
        ]}
      >
        <Input
          size="large"
          value={authReset}
          prefix={<MailOutlined className="site-form-item-icon" />}
          type="email"
          placeholder="enter email"
          onChange={(e) => setAuthReset(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Login;
