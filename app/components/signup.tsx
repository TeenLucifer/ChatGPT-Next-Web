import styles from "./signup.module.scss";
import { IconButton } from "./button";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";
import BotIcon from "../icons/bot.svg";
import { getClientConfig } from "../config/client";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";
import { LeanCloudUserSignup } from "../utils/cloud/leancloud";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button, message } from "antd";
import { generateDefaultAppState } from "../utils/sync";

const storage = safeLocalStorage();

// 调后台注册接口
async function signUp(account: any, password: any, navigate: any) {
  // 注册时生成默认的应用配置
  const default_app_state = generateDefaultAppState();
  let ret = await LeanCloudUserSignup(
    account,
    password,
    JSON.stringify(default_app_state),
  );

  if (ret.status === "success") {
    // 注册成功就跳转到登录页面
    message.success(ret.message);
    setTimeout(() => {
      navigate(Path.Login);
    }, 1500);
  } else {
    // 注册失败就提示错误信息
    message.error(ret.message);
  }
}

// 注册逻辑
const onSignupFinish = (values: any, navigate: any) => {
  const account = values.account;
  const password = values.password;

  signUp(account, password, navigate);
};

// 校验账号
const validateAccount = (_: any, value: any) => {
  const phoneRegex = /^1[3-9]\d{9}$/; // 11位手机号正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱正则表达式

  if (!value) {
    return Promise.reject(new Error("输入手机号或邮箱注册!"));
  } else if (!phoneRegex.test(value) && !emailRegex.test(value)) {
    return Promise.reject(new Error("请输入有效的手机号或邮箱!"));
  } else {
    return Promise.resolve();
  }
};

// 校验密码
const validatePassword = (_: any, value: any) => {
  if (!value) {
    return Promise.reject(new Error("请输入密码!"));
  } else if (value.length < 6) {
    return Promise.reject(new Error("密码长度至少为6位!"));
  } else {
    return Promise.resolve();
  }
};

// 确认密码
const validateConfirmPassword = ({ getFieldValue }: any) => ({
  validator(_: any, value: any) {
    if (!value) {
      return Promise.reject();
    } else if (getFieldValue("password") != value) {
      return Promise.reject(new Error("两次输入的密码不一致!"));
    } else {
      return Promise.resolve();
    }
  },
});

export function SignupPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
  }, []);

  return (
    <div className={styles["signup-page"]}>
      <div className={styles["signup-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.Signup.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>

      <div className={styles["signup-logo"]}>
        <BotIcon />
      </div>

      <div className={styles["signup-title"]}>{Locale.Signup.Title}</div>

      <div className={styles["signup-formborder"]}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={(values) => onSignupFinish(values, navigate)}
          labelAlign="left"
          className={styles["signup-form"]}
        >
          <Form.Item
            name="account"
            rules={[{ required: true, validator: validateAccount }]}
          >
            <Input prefix={<UserOutlined />} placeholder="手机号/邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, validator: validatePassword }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="输入密码" />
          </Form.Item>

          <Form.Item
            name="password-confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "需要再次输入密码确认!" },
              validateConfirmPassword,
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码 " />
          </Form.Item>

          <Form.Item className={styles["signup-gologin"]}>
            <Link to={Path.Login}>已有账号, 去登录</Link>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              确认注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
