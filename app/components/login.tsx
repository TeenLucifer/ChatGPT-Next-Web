import styles from "./login.module.scss";
import { IconButton } from "./button";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import BotIcon from "../icons/bot.svg";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Flex, Button, Checkbox, message } from "antd";
import { LeanCloudUserLogin } from "../utils/cloud/leancloud";
import { syncRemoteAppState } from "../utils/user-management";

const storage = safeLocalStorage();

const EXPIRATION_DAYS = 10;
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

function storeUserId(user_id: any) {
  const now = new Date().getTime();
  const expirationTime = now + EXPIRATION_DAYS * MILLISECONDS_IN_A_DAY;
  localStorage.setItem("user_id", user_id);
  localStorage.setItem("user_id_expiraion", expirationTime.toString());
}

async function logIn(account: any, password: any, navigate: any) {
  // 调用后台登录接口
  let ret = await LeanCloudUserLogin(account, password);

  if (ret.status === "success") {
    message.success(ret.message);
    // 登录成功就存储用户id到本地表示已登录
    storeUserId(ret.user_id);
    // 登录成功就跳转到功能页面
    setTimeout(() => {
      // 登录成功加载云端配置并跳转到功能页
      syncRemoteAppState(ret.user_id).then(() => {
        navigate(Path.Chat);
      });
    }, 1500);
  } else {
    // 登录失败就提示错误信息
    message.error(ret.message);
  }
}

// 登录逻辑
const onLoginFinish = (values: any, navigate: any) => {
  const account = values.account;
  const password = values.password;

  logIn(account, password, navigate);
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

function onClosePage() {
  console.log("page closed");
}
//<div className={clsx("no-dark", styles["login-logo"])}>
//  <BotIcon />
//</div>

//<div className={styles["login-title"]}>{Locale.Login.Title}</div>
export function LoginPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  useEffect(() => {}, [navigate]);

  return (
    <div className={styles["login-page"]}>
      <div className={styles["login-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={"返回主页"}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>

      <div className={styles["login-formborder"]}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10vh",
            marginBottom: "5vh",
          }}
        >
          <div style={{ transform: "scale(1.4)" }}>
            <BotIcon />
          </div>
          <div style={{ fontSize: "24px", marginLeft: "1vw" }}>账号登录</div>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={(values) => onLoginFinish(values, navigate)}
          className={styles["login-form"]}
        >
          <Form.Item
            name="account"
            rules={[{ required: true, validator: validateAccount }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="账号/手机号/邮箱"
              style={{ height: "5vh" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, validator: validatePassword }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              style={{ height: "5vh" }}
            />
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
            <Button
              block
              type="primary"
              htmlType="submit"
              style={{ height: "5vh" }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
