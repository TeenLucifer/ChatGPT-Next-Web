//导入微信支付对象
const WxPay = require("yungouos-pay-sdk");

const YUNGOU = {
  mch_id: "xx", // 商户ID
  YUNGOUOS_KEY: "xx", // yungouos开发key
  notify_url: "xx", // 回调通知地址
  api_url: "https://api.pay.yungouos.com/api/pay/wxpay/nativePay",
  default_name: "论文答疑会员",
};

// 用yungou接口请求微信支付二维码, 返回中包含二维码地址需要展示到前端
// 待用户扫描二维码支付后, yungouos会回调notify_url通知支付结果, 需要将项目的外网地址和端口暴露给yungouos, 测试环境可以用花生壳来做内网穿透
async function YungouRequestWxPayQrcode(fee: string) {
  const out_trade_no = "lunwen" + new Date().getTime();
  const total_fee = fee;
  const mch_id = YUNGOU.mch_id;
  const body = YUNGOU.default_name;
  const type = "1";
  const app_id = "";
  const attach = "";
  const notify_url = YUNGOU.notify_url;
  const auto = "0";
  const auto_node = "";
  const config_no = "";
  const biz_params = "";
  const payKey = YUNGOU.YUNGOUOS_KEY;

  await WxPay.nativePay(
    out_trade_no,
    total_fee,
    mch_id,
    body,
    type,
    app_id,
    attach,
    notify_url,
    auto,
    auto_node,
    config_no,
    biz_params,
    payKey,
  ).then((response: any) => {
    //接口返回结果
    console.log(response);
  });
}

//async function yungouSign(transParams) {
//    const paramsArr = Object.keys(transParams);
//    paramsArr.sort();
//    const stringArr = []
//    const key = YUNGOU.YUNGOUOS_KEY;
//    paramsArr.map(key => {
//        stringArr.push(key + '=' + transParams[key]);
//    })
//    stringArr.push("key=" + key)
//    const str = stringArr.join('&');
//    let signStr = md5(str).toString().toUpperCase();
//    return signStr
//}
//
//async function wxPayQrcode(body) {
//    console.log("body:", body)
//    const name = body.name || YUNGOU.default_name
//    const fee = body.fee
//    const attach = body.attach
//    // 签名的参数准备
//    const dateTime = new Date().getTime()
//    let transParams = {
//        "out_trade_no": "ddmt" + dateTime,
//        "total_fee": fee,
//        "mch_id": YUNGOU.mch_id,
//        "body": name
//    }
//    // 最后加上 商户Key
//    const signValue = await yungouSign(transParams);
//    transParams["sign"] = signValue
//    transParams["notify_url"] = YUNGOU.notify_url
//    transParams["attach"] = attach
//
//    // 获取yungouos的返回二维码信息
//    const url = YUNGOU.api_url
//
//    console.log("请求前参数：", url, transParams)
//    let mdResult = await http.post({url, params: transParams})
//    console.log("返回二维码:" ,mdResult.data)
//    return mdResult;
//}
