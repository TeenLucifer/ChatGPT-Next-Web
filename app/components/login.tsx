import styles from "./login.module.scss";
import { IconButton } from "./button";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Path, SAAS_CHAT_URL } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";
import BotIcon from "../icons/bot.svg";
import { getClientConfig } from "../config/client";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";
import { trackAuthorizationPageButtonToCPaymentClick } from "../utils/auth-settings-events";
import clsx from "clsx";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Flex, Button, Checkbox } from "antd";

const storage = safeLocalStorage();

// 登录逻辑
const onLoginFinish = (values: any) => {
  console.log("Received values of form: ", values);
  console.log(values.account);
  console.log(values.password);
};

// 校验账号
const validateAccount = (_: any, value: any) => {
  const phoneRegex = /^1[3-9]\d{9}$/; // 11位手机号正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱正则表达式

  if (!value) {
    return Promise.reject(new Error("输入手机号或邮箱登录!"));
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

export function LoginPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const goHome = () => navigate(Path.Home);
  const goChat = () => navigate(Path.Chat);
  const goSignup = () => navigate(Path.Signup);
  const goSaas = () => {
    trackAuthorizationPageButtonToCPaymentClick();
    window.location.href = SAAS_CHAT_URL;
  };

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.Login.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>

      <div className={clsx("no-dark", styles["login-logo"])}>
        <BotIcon />
      </div>

      <div className={styles["login-title"]}>{Locale.Login.Title}</div>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onLoginFinish}
        className={styles["login-form"]}
      >
        <Form.Item
          name="account"
          rules={[{ required: true, validator: validateAccount }]}
        >
          <Input prefix={<UserOutlined />} placeholder="账号/手机号/邮箱" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, validator: validatePassword }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <div>
              <Link to={Path.Signup}>忘记密码?</Link>
              <span className={styles["login-separator"]}>|</span>
              <Link to={Path.Signup}>注册账号</Link>
            </div>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  //return (
  //  <div className={styles["login-page"]}>
  //    <div className={styles["login-header"]}>
  //      <IconButton
  //        icon={<LeftIcon />}
  //        text={Locale.Login.Return}
  //        onClick={() => navigate(Path.Home)}
  //      ></IconButton>
  //    </div>

  //    <div className={clsx("no-dark", styles["login-logo"])}>
  //      <BotIcon />
  //    </div>

  //    <div className={styles["login-title"]}>{Locale.Login.Title}</div>

  //    <div className={styles["login-container"]}>
  //      <input
  //        type={"text"}
  //        className={styles["login-input"]}
  //        placeholder={Locale.Login.Account}
  //        style={{ marginBottom: "10px" }}
  //      />

  //      <div
  //        className={styles["login-passwd"]}
  //        style={{ marginBottom: "10px" }}
  //      >
  //        <input
  //          type={passwd_visible ? "text" : "password"}
  //          className={styles["login-input"]}
  //          placeholder={Locale.Login.Password}
  //        />
  //        <IconButton
  //          icon={passwd_visible ? <EyeIcon /> : <EyeOffIcon />}
  //          onClick={changePasswdVisibility}
  //        />
  //      </div>

  //      <IconButton
  //        text={Locale.Login.Confirm}
  //        type="primary"
  //        //onClick={goChat}
  //        className={styles["login-button"]}
  //      />

  //      <div className={styles["login-jump"]}>
  //        <Link to={Path.Signup}>忘记密码?</Link>
  //        <span className={styles["separator"]}>|</span>
  //        <Link to={Path.Signup}>注册账号</Link>
  //      </div>
  //    </div>
  //  </div>
  //);
}
