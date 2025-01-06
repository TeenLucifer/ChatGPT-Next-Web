import styles from "./pricing.module.scss";
import { IconButton } from "./button";
import LeftIcon from "@/app/icons/left.svg";
import Locale from "../locales";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { Button, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles["pricing-page"]}>
      <div className={styles["pricing-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.Login.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
      </div>

      <div className={styles["pricing-title"]}>获取完整的服务</div>

      <div className={styles["pricing-group"]}>
        <div className={styles["pricing-container"]}>
          <Tag style={{ visibility: "hidden" }}>最多人选择</Tag>
          <div style={{ fontSize: "36px", marginBottom: "2vh" }}>￥10/月</div>
          <Button style={{ minWidth: "100%" }}>订阅</Button>
          <div>
            <CheckOutlined
              style={{ color: "green", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点1
          </div>
          <div>
            <CheckOutlined
              style={{ color: "green", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点2
          </div>
          <div>
            <CloseOutlined
              style={{ color: "red", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点3
          </div>
          <div>
            <CloseOutlined
              style={{ color: "red", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点4
          </div>
        </div>

        <div
          className={styles["pricing-container"]}
          style={{
            backgroundColor: "#f6f8fa",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Tag>最多人选择</Tag>
          <div style={{ fontSize: "36px", marginBottom: "2vh" }}>￥100/月</div>
          <Button style={{ minWidth: "100%" }}>订阅</Button>
          <div>
            <CheckOutlined
              style={{ color: "green", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点1
          </div>
          <div>
            <CheckOutlined
              style={{ color: "green", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点2
          </div>
          <div>
            <CloseOutlined
              style={{ color: "red", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点3
          </div>
          <div>
            <CloseOutlined
              style={{ color: "red", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点4
          </div>
        </div>

        <div className={styles["pricing-container"]}>
          <Tag style={{ visibility: "hidden" }}>最多人选择</Tag>
          <div style={{ fontSize: "36px", marginBottom: "2vh" }}>￥1000/月</div>
          <Button style={{ minWidth: "100%" }}>订阅</Button>
          <div>
            <CheckOutlined
              style={{ color: "green", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点1
          </div>
          <div>
            <CheckOutlined
              style={{ color: "green", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点2
          </div>
          <div>
            <CloseOutlined
              style={{ color: "red", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点3
          </div>
          <div>
            <CloseOutlined
              style={{ color: "red", marginTop: "2vh", marginBottom: "2vh" }}
            />{" "}
            特点4
          </div>
        </div>
      </div>
    </div>
  );
}
