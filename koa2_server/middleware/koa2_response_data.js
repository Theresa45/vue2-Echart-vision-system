// 读取数据的中间件
const path = require("path");
const fileUtils = require("../utils/file_utils");
module.exports = async (ctx, next) => {
  // 读取URL
  const url = ctx.request.url;
  let filePath = url.replace("/api", "");
  filePath = "../data" + filePath + ".json";
  // __dirname：当前文件所处路径
  // 获取完整的绝对路径
  filePath = path.join(__dirname, filePath);
  try {
    const ret = await fileUtils.getFileJsonData(filePath);
    ctx.response.body = ret;
  } catch (error) {
    const errorMsg = {
      message: "读取文件内容失败, 文件资源不存在",
      status: 404,
    };
    ctx.response.body = JSON.stringify(errorMsg);
  }
  await next();
};
