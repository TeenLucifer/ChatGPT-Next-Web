import styles from "./signup.module.scss";
import { IconButton } from "./button";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Path, SAAS_CHAT_URL } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";
import BotIcon from "../icons/bot.svg";
import { getClientConfig } from "../config/client";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";
import { trackAuthorizationPageButtonToCPaymentClick } from "../utils/auth-settings-events";
import clsx from "clsx";
import { UserSignup } from "../utils/cloud/leancloud";
import { message } from "antd";

const storage = safeLocalStorage();

async function signUp() {
  const account = "wangjintao1999@gmail.com";
  const passwd = "12345678";
  let ret = await UserSignup(account, passwd);

  if (ret.status === "success") {
    message.success(ret.message);
  } else {
    message.error(ret.message);
  }
}

export function SignupPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const goHome = () => navigate(Path.Home);
  const goChat = () => navigate(Path.Chat);
  const goLogin = () => navigate(Path.Login);
  const goSaas = () => {
    trackAuthorizationPageButtonToCPaymentClick();
    window.location.href = SAAS_CHAT_URL;
  };

  const resetAccessCode = () => {
    accessStore.update((access) => {
      access.openaiApiKey = "";
      access.accessCode = "";
    });
  }; // Reset access code to empty string

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [passwd_visible, setPasswdVisible] = useState(false);
  function changePasswdVisibility() {
    setPasswdVisible(!passwd_visible);
  }

  return (
    <div className={styles["signup-page"]}>
      <div className={styles["signup-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.Signup.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>

      <div className={clsx("no-dark", styles["signup-logo"])}>
        <BotIcon />
      </div>

      <div className={styles["signup-title"]}>{Locale.Signup.Title}</div>

      <div className={styles["signup-container"]}>
        <input
          type={"text"}
          className={styles["signup-input"]}
          placeholder={Locale.Signup.Account}
          style={{ marginBottom: "10px" }}
        />

        <div
          className={styles["signup-passwd"]}
          style={{ marginBottom: "10px" }}
        >
          <input
            type={passwd_visible ? "text" : "password"}
            className={styles["signup-input"]}
            placeholder={Locale.Signup.Password}
          />
          <IconButton
            icon={passwd_visible ? <EyeIcon /> : <EyeOffIcon />}
            onClick={changePasswdVisibility}
          />
        </div>

        <div
          className={styles["signup-passwd"]}
          style={{ marginBottom: "10px" }}
        >
          <input
            type={passwd_visible ? "text" : "password"}
            className={styles["signup-input"]}
            placeholder={Locale.Signup.PasswordConfirm}
          />
          <IconButton
            icon={passwd_visible ? <EyeIcon /> : <EyeOffIcon />}
            onClick={changePasswdVisibility}
          />
        </div>

        <IconButton
          text={Locale.Signup.Confirm}
          type="primary"
          onClick={signUp}
          className={styles["signup-button"]}
        />

        <div className={styles["login-jump"]}>
          <Link to={Path.Login}>已有账号, 去登录</Link>
        </div>
      </div>
    </div>
  );
}
