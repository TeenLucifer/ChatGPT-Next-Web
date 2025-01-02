import { setLocalAppStateFromeString, getLocalAppState } from "../utils/sync";
import {
  LeanCloudCheckUser,
  LeanCloudQueryUserStateFieldData,
  LeanCloudSetUserStateFieldData,
} from "../utils/cloud/leancloud";
import { user_field } from "../constant";

export function userLogout() {
  const now = new Date().getTime();
  localStorage.removeItem(user_field.local_auth.id);
  localStorage.removeItem(user_field.local_auth.expiration);
}

// 从本地存储获取user_id并校验当前用户是否过期, 过期或没有返回null, 否则返回user_id
export async function getUserId() {
  const id = localStorage.getItem(user_field.local_auth.id);
  const expirationTimeStr = localStorage.getItem(
    user_field.local_auth.expiration,
  );
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
    localStorage.removeItem(user_field.local_auth.id);
    localStorage.removeItem(user_field.local_auth.expiration);
    return null;
  }

  return user_id;
}

export async function syncRemoteAppState(user_id: string): Promise<void> {
  const query_ret = await LeanCloudQueryUserStateFieldData(
    user_id,
    user_field.lean_cloud.user_state_table.state,
  );
  if (query_ret && typeof query_ret === "string") {
    setLocalAppStateFromeString(query_ret);
  }
}

// 更新当前用户本地的app状态至云端
export async function updateRemoteAppState(user_id: string) {
  // TODO(wangjintao): 在每个组件添加beforeunload事件监听器, 在页面关闭前执行同步操作
  // TODO(wangjintao): 设计登出按键, 在登出时调用状态同步
  const local_state = getLocalAppState();
  const local_state_str = JSON.stringify(local_state);
  await LeanCloudSetUserStateFieldData(
    user_id,
    user_field.lean_cloud.user_state_table.id,
    local_state_str,
  );
}
