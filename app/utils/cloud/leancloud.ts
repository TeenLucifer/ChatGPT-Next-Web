import AV from "leancloud-storage";

const APP_ID = "iPOB9VxpJ8dgbHFZocETK3cK-gzGzoHsz";
const APP_KEY = "w5hjIOJif6Z1MgdQL3k7dKE9";
const MASTER_KEY = "6youNsnDn0eiex3iQiEV3HUV";
const SERVER_URL = "https://ipob9vxp.lc-cn-n1-shared.com";

AV.init({
  appId: APP_ID,
  appKey: APP_KEY,
  masterKey: MASTER_KEY,
  serverURL: SERVER_URL,
});

async function UserLogin(account: string, passwd: string) {
  //const user = new AV.User();
  //let signin_response;
  //user.setUsername(account);
  //user.setPassword(passwd);
  //user.set("gender", "secret");
  //try {
  //  const signed_in_user = await user.logIn();
  //  signin_response = {
  //    status: "success",
  //    user_id: signed_in_user.getObjectId(),
  //    account: account
  //  };
  //  return signin_response;
  //}
  //catch (error) {
  //  signin_response = {
  //    status: "failed",
  //    code: error.code,
  //    message: error.message
  //  };
  //  return signin_response;
  //}
}

export async function LeanCloudUserSignup(account: string, passwd: string) {
  const user = new AV.User();
  user.setUsername(account);
  user.setPassword(passwd);
  user.set("gender", "secret");
  let ret_message: string = "注册失败";
  let signup_response = {
    status: "failed",
    message: ret_message,
  };

  try {
    await user.signUp();
    signup_response = {
      status: "success",
      message: "注册成功",
    };
    return signup_response;
  } catch (error: any) {
    if (error.code === 203) {
      ret_message = "账号已被注册";
    } else {
      ret_message = "注册失败";
    }
    signup_response = {
      status: "failed",
      message: ret_message,
    };
    return signup_response;
  }
}
