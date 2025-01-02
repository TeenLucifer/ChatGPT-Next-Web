import AV from "leancloud-storage";
import { user_field } from "@/app/constant";

AV.init({
  appId: user_field.lean_cloud.APP_ID,
  appKey: user_field.lean_cloud.APP_KEY,
  masterKey: user_field.lean_cloud.MASTER_KEY,
  serverURL: user_field.lean_cloud.SERVER_URL,
});

// 在user_id用户的table表下设置field对应字段的数据
export async function LeanCloudSetTable(
  user_id: string,
  table: string,
  field: string,
  data: string,
) {
  const user_state_table = new AV.Query(table);
  user_state_table.equalTo(user_field.lean_cloud.user_state_table.id, user_id);
  return user_state_table.first().then(function (cur_user_state) {
    if (cur_user_state) {
      return cur_user_state.set(field, data);
    }
  });
  return null;
}

// 在user_id用户的table表下查field对应字段的数据
export async function LeanCloudQueryTable(
  user_id: string,
  table: string,
  field: string,
) {
  // 在table表下查field对应字段的数据
  const user_state_table = new AV.Query(table);
  user_state_table.equalTo(user_field.lean_cloud.user_state_table.id, user_id);
  return user_state_table.first().then(function (cur_user_state) {
    if (cur_user_state) {
      return cur_user_state.get(field);
    }
  });
  return null;
}

export async function LeanCloudSetUserStateFieldData(
  user_id: string,
  field: string,
  data: string,
) {
  const user_state_table = new AV.Query("UserState");
  user_state_table.equalTo(user_field.lean_cloud.user_state_table.id, user_id);
  return user_state_table.first().then(function (cur_user_state) {
    if (cur_user_state) {
      cur_user_state.set(field, data);
      cur_user_state.save();
    }
  });
}

// 根据user_id查询用户是否存在
export async function LeanCloudCheckUser(user_id: string) {
  const query = new AV.Query("_User");
  try {
    const user = await query.get(user_id);
    return true;
  } catch (error: any) {
    return false;
  }
  return false;
}

// 根据user_id查询用户某个字段的数据
export async function LeanCloudQueryUserStateFieldData(
  user_id: string,
  field: string,
) {
  // 在UserState这张表下查field对应字段的数据
  const user_state_table = new AV.Query("UserState");
  user_state_table.equalTo("user_id", user_id);
  return user_state_table.first().then(function (cur_user_state) {
    if (cur_user_state) {
      return cur_user_state.get(field);
    }
  });
  return null;
}

// 用户登录
export async function LeanCloudUserLogin(account: string, passwd: string) {
  const user = new AV.User();
  let ret_message: string = "登录失败";
  let signin_response = {
    status: "failed",
    user_id: "",
    message: ret_message,
  };
  user.setUsername(account);
  user.setPassword(passwd);
  user.set("gender", "secret");
  try {
    const signed_in_user = await user.logIn();
    signin_response = {
      status: "success",
      user_id: signed_in_user.getObjectId(),
      message: "登录成功",
    };
    return signin_response;
  } catch (error: any) {
    if (211 === error.code) {
      ret_message = "用户不存在";
    } else if (210 === error.code) {
      ret_message = "密码错误";
    } else {
      ret_message = "登录失败";
    }

    signin_response = {
      status: "failed",
      user_id: "",
      message: ret_message,
    };
    return signin_response;
  }
  return signin_response;
}

// 用户注册
export async function LeanCloudUserSignup(
  account: string,
  passwd: string,
  default_app_state: string,
) {
  const user = new AV.User();
  // 这里在LeanCloud的数据库新建了一张名为UserState的表
  const UserStateObj = AV.Object.extend(
    user_field.lean_cloud.user_state_table.table_name,
  );
  let ret_message: string = "注册失败";
  let signup_response = {
    status: "failed",
    user_id: "",
    message: ret_message,
  };
  user.setUsername(account);
  user.setPassword(passwd);
  user.set("gender", "secret");

  try {
    await user.signUp();

    // 注册成功的用户初始配置
    const user_init_state = new UserStateObj();
    user_init_state.set(
      user_field.lean_cloud.user_state_table.account,
      account,
    );
    user_init_state.set(
      user_field.lean_cloud.user_state_table.id,
      user.getObjectId(),
    );
    user_init_state.set(
      user_field.lean_cloud.user_state_table.state,
      default_app_state,
    );
    user_init_state.set(
      user_field.lean_cloud.user_state_table.member,
      user_field.member_level.normal,
    );
    try {
      // 用户的初始配置保存成功才算注册成功
      await user_init_state.save();
      signup_response = {
        status: "success",
        user_id: user.getObjectId(),
        message: "注册成功",
      };
    } catch (error: any) {
      // 初始配置保存失败
      signup_response = {
        status: "failed",
        user_id: "",
        message: "注册失败",
      };
    }
    return signup_response;
  } catch (error: any) {
    // 注册失败
    if (error.code === 203) {
      ret_message = "账号已被注册";
    } else {
      ret_message = "注册失败";
    }
    signup_response = {
      status: "failed",
      user_id: "",
      message: ret_message,
    };
    return signup_response;
  }
}

export async function LeanCloudCheckUserConfig(user_id: string) {
  const user_config = new AV.Query("user_config");
  user_config.equalTo("user_id", user_id);
}

export async function LeanCloudStoreUserConfig(
  user_id: string,
  config: string,
) {
  const user_config = AV.Object.extend("user_config");
}
