import { setLocalAppStateFromeString } from "../utils/sync";
import {
  LeanCloudCheckUser,
  LeanCloudQueryUserStateFieldData,
} from "../utils/cloud/leancloud";

// 从本地存储获取user_id并校验当前用户是否过期, 过期或没有返回null, 否则返回user_id
export async function getUserId() {
  const id = localStorage.getItem("user_id");
  const expirationTimeStr = localStorage.getItem("user_id_expiration");
  const expirationTime = expirationTimeStr
    ? parseInt(expirationTimeStr, 10)
    : null;
  const now = new Date().getTime();
  let user_id = "";
  let user_vlaid = false;
  if (!id) {
    return null;
  } else {
    user_id = id;
  }
  // 云端查询该用户是否有效
  user_vlaid = await LeanCloudCheckUser(user_id);
  if (false === user_vlaid) {
    return null;
  }

  if (expirationTime && now > expirationTime) {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_id_expiration");
    return null;
  }

  return user_id;
}

export async function syncRemoteAppState(user_id: string): Promise<void> {
  const query_ret = await LeanCloudQueryUserStateFieldData(
    user_id,
    "app_state",
  );
  if (query_ret && typeof query_ret === "string") {
    setLocalAppStateFromeString(query_ret);
  }
}

// TODO(wangjintao): 更新云端的配置
export async function updateRemoteAppState(user_id: string) {}
