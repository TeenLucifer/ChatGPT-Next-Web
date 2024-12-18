import styles from "./login.module.scss";
import { IconButton } from "./button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export function LoginPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();
  const goHome = () => navigate(Path.Home);
  const goChat = () => navigate(Path.Chat);
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
    <div className={styles["login-page"]}>
      <TopBanner></TopBanner>
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

      <div className={styles["login-container"]}>
        <input
          type={"text"}
          className={styles["login-input"]}
          placeholder={Locale.Login.Account}
          style={{ marginBottom: "10px" }}
        />

        <div
          className={styles["login-passwd"]}
          style={{ marginBottom: "10px" }}
        >
          <input
            type={passwd_visible ? "text" : "password"}
            className={styles["login-input"]}
            placeholder={Locale.Login.Password}
          />
          <IconButton
            icon={passwd_visible ? <EyeIcon /> : <EyeOffIcon />}
            onClick={changePasswdVisibility}
          />
        </div>

        <IconButton
          text={Locale.Login.Confirm}
          type="primary"
          onClick={goChat}
          className={styles["login-button"]}
        />
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
