import styles from "./index.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import BotIcon from "../icons/bot.svg";
import { IconButton } from "./button";
import { Path } from "../constant";
import { getUserId, syncRemoteAppState } from "../utils/user-management";

async function goFunctionalPage(navigate: any) {
  // 查询本地存储的用户id是否有效
  const user_id = await getUserId();
  if (user_id) {
    // 查询到该id有效用户, 加载云端配置并跳转到功能页
    syncRemoteAppState(user_id).then(() => {
      navigate(Path.Chat);
    });
  } else {
    // 未查询到有效用户, 跳转到登录页面
    navigate(Path.Login);
  }
}

export function IndexPage() {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div className={styles["index-page"]}>
      <div className={styles["index-navbar"]}>
        <BotIcon />
        <IconButton
          text={"开始使用"}
          className={styles["index-navbar-button"]}
          onClick={() => goFunctionalPage(navigate)}
        />
      </div>

      <div className={styles["index-header"]}>用AI构建的论文专属知识库</div>

      <div className={styles["index-title"]}>让AI更懂你的论文</div>

      <div className={styles["index-description"]}>
        基于 LLM 大模型的开源 AI
        知识库构建平台。提供了开箱即用的数据处理、模型调用、RAG 检索、可视化 AI
        工作流编排等能力，帮助您轻松构建复杂的 AI 应用。
      </div>

      <IconButton
        icon={<ArrowRightOutlined />}
        text={"开始使用"}
        className={styles["index-start-button"]}
        onClick={() => goFunctionalPage(navigate)}
      />

      <img
        src="/cover.png"
        alt="Cover"
        className={styles["index-image-cover"]}
      />
    </div>
  );
}
