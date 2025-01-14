import { useState, useEffect, useRef, useCallback } from "react";
import { ErrorBoundary } from "./error";
import styles from "./mask.module.scss";
import { useNavigate } from "react-router-dom";
import { IconButton } from "./button";
import CloseIcon from "../icons/close.svg";
import EyeIcon from "../icons/eye.svg";
import Locale from "../locales";
import { Path } from "../constant";

import { useChatStore } from "../store";
import { message } from "antd";
import { getUserId, updateUserRemoteState } from "../utils/user-management";

type Item = {
  id: number;
  name: string;
  content: string;
};
export function SearchChatPage() {
  const navigate = useNavigate();

  const chatStore = useChatStore();

  const sessions = chatStore.sessions;
  const selectSession = chatStore.selectSession;

  const [searchResults, setSearchResults] = useState<Item[]>([]);

  const previousValueRef = useRef<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const doSearch = useCallback((text: string) => {
    const lowerCaseText = text.toLowerCase();
    const results: Item[] = [];

    sessions.forEach((session, index) => {
      const fullTextContents: string[] = [];

      session.messages.forEach((message) => {
        const content = message.content as string;
        if (!content.toLowerCase || content === "") return;
        const lowerCaseContent = content.toLowerCase();

        // full text search
        let pos = lowerCaseContent.indexOf(lowerCaseText);
        while (pos !== -1) {
          const start = Math.max(0, pos - 35);
          const end = Math.min(content.length, pos + lowerCaseText.length + 35);
          fullTextContents.push(content.substring(start, end));
          pos = lowerCaseContent.indexOf(
            lowerCaseText,
            pos + lowerCaseText.length,
          );
        }
      });

      if (fullTextContents.length > 0) {
        results.push({
          id: index,
          name: session.topic,
          content: fullTextContents.join("... "), // concat content with...
        });
      }
    });

    // sort by length of matching content
    results.sort((a, b) => b.content.length - a.content.length);

    return results;
  }, []);

  useEffect(() => {
    // 每个功能页面都需要检查用户是否登录
    const checkUser = async () => {
      // 查询本地存储的用户id是否有效
      const user_id = await getUserId();
      // 查询到该id有效用户
      if (!user_id) {
        // 未查询到有效用户就跳转到登录页面
        message.warning("未登录");
        navigate(Path.Login);
      }
    };

    const intervalId = setInterval(() => {
      if (searchInputRef.current) {
        const currentValue = searchInputRef.current.value;
        if (currentValue !== previousValueRef.current) {
          if (currentValue.length > 0) {
            const result = doSearch(currentValue);
            setSearchResults(result);
          }
          previousValueRef.current = currentValue;
        }
      }
    }, 1000);

    checkUser();

    // 窗口刷新或关闭时更新用户状态
    // Cleanup the interval on component unmount
    window.addEventListener("beforeunload", updateUserRemoteState);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", updateUserRemoteState);
    };
  }, [doSearch]);

  return (
    <ErrorBoundary>
      <div className={styles["mask-page"]}>
        {/* header */}
        <div className="window-header">
          <div className="window-header-title">
            <div className="window-header-main-title">
              {Locale.SearchChat.Page.Title}
            </div>
            <div className="window-header-submai-title">
              {Locale.SearchChat.Page.SubTitle(searchResults.length)}
            </div>
          </div>

          <div className="window-actions">
            <div className="window-action-button">
              <IconButton
                icon={<CloseIcon />}
                bordered
                onClick={() => navigate(-1)}
              />
            </div>
          </div>
        </div>

        <div className={styles["mask-page-body"]}>
          <div className={styles["mask-filter"]}>
            {/**搜索输入框 */}
            <input
              type="text"
              className={styles["search-bar"]}
              placeholder={Locale.SearchChat.Page.Search}
              autoFocus
              ref={searchInputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const searchText = e.currentTarget.value;
                  if (searchText.length > 0) {
                    const result = doSearch(searchText);
                    setSearchResults(result);
                  }
                }
              }}
            />
          </div>

          <div>
            {searchResults.map((item) => (
              <div
                className={styles["mask-item"]}
                key={item.id}
                onClick={() => {
                  navigate(Path.Chat);
                  selectSession(item.id);
                }}
                style={{ cursor: "pointer" }}
              >
                {/** 搜索匹配的文本 */}
                <div className={styles["mask-header"]}>
                  <div className={styles["mask-title"]}>
                    <div className={styles["mask-name"]}>{item.name}</div>
                    {item.content.slice(0, 70)}
                  </div>
                </div>
                {/** 操作按钮 */}
                <div className={styles["mask-actions"]}>
                  <IconButton
                    icon={<EyeIcon />}
                    text={Locale.SearchChat.Item.View}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
