import styles from "./signup.module.scss";
import { IconButton } from "./button";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Path, SAAS_CHAT_URL } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";
import Delete from "../icons/close.svg";
import Arrow from "../icons/arrow.svg";
import Logo from "../icons/logo.svg";
import EyeIcon from "../icons/eye.svg";
import EyeOffIcon from "../icons/eye-off.svg";
import { useMobileScreen } from "@/app/utils";
import BotIcon from "../icons/bot.svg";
import { getClientConfig } from "../config/client";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";
import {
  trackSettingsPageGuideToCPaymentClick,
  trackAuthorizationPageButtonToCPaymentClick,
} from "../utils/auth-settings-events";
import clsx from "clsx";

const storage = safeLocalStorage();

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
          onClick={goLogin}
          className={styles["signup-button"]}
        />

        <div className={styles["login-jump"]}>
          <Link to={Path.Login}>已有账号, 去登录</Link>
        </div>
      </div>
    </div>
  );
}

function TopBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useMobileScreen();
  useEffect(() => {
    // 检查 localStorage 中是否有标记
    const bannerDismissed = storage.getItem("bannerDismissed");
    // 如果标记不存在，存储默认值并显示横幅
    if (!bannerDismissed) {
      storage.setItem("bannerDismissed", "false");
      setIsVisible(true); // 显示横幅
    } else if (bannerDismissed === "true") {
      // 如果标记为 "true"，则隐藏横幅
      setIsVisible(false);
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    storage.setItem("bannerDismissed", "true");
  };

  if (!isVisible) {
    return null;
  }
  return (
    <div
      className={styles["top-banner"]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx(styles["top-banner-inner"], "no-dark")}>
        <Logo className={styles["top-banner-logo"]}></Logo>
        <span>
          {Locale.Login.TopTips}
          <a
            href={SAAS_CHAT_URL}
            rel="stylesheet"
            onClick={() => {
              trackSettingsPageGuideToCPaymentClick();
            }}
          >
            {Locale.Settings.Access.SaasStart.ChatNow}
            <Arrow style={{ marginLeft: "4px" }} />
          </a>
        </span>
      </div>
      {(isHovered || isMobile) && (
        <Delete className={styles["top-banner-close"]} onClick={handleClose} />
      )}
    </div>
  );
}
