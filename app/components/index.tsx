import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import BotIcon from "../icons/bot.svg";
import { IconButton } from "./button";
import { Path } from "../constant";
import { getUserId, syncRemoteAppState } from "../utils/user-management";
import type { MenuProps } from "antd";
import { Divider, Layout, Menu, theme } from "antd";

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link to={Path.Pricing}>订阅</Link>,
    key: "pricing",
  },
  {
    label: <Link to={Path.Login}>登录</Link>,
    key: "login",
  },
  {
    label: <Link to={Path.Signup}>注册</Link>,
    key: "signup",
  },
  {
    label: <Link to={Path.Login}>联系我们</Link>,
    key: "contect",
  },
];

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

  const [current, setCurrent] = useState("pricing");
  const onClick = (e: any) => {
    setCurrent(e.key);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const iconGoHome = () => {
    navigate(Path.Home);
  };

  return (
    <Layout className={styles["index-page"]}>
      <Header className={styles["index-header"]}>
        <div
          onClick={iconGoHome}
          style={{
            cursor: "pointer",
            alignItems: "center",
            display: "flex",
            transform: "scale(1.4)",
          }}
        >
          <BotIcon />
        </div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[]}
          items={items}
          className={styles["index-menu"]}
        />
      </Header>

      <Divider style={{ margin: "0" }} />

      <Content className={styles["index-content"]}>
        <div className={styles["index-title"]}>让AI更懂你的论文</div>
        <div className={styles["index-description"]}>
          基于 LLM 大模型的开源 AI
          知识库构建平台。提供了开箱即用的数据处理、模型调用、RAG 检索、可视化
          AI 工作流编排等能力，帮助您轻松构建复杂的 AI 应用。
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
      </Content>
    </Layout>
  );
}
