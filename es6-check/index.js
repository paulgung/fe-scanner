const { spawn } = require("child_process");

// 执行 es-check 命令
const command = "es-check";
const args = ["es5", "dist/*.js"];
const childProcess = spawn(command, args);

// ES6检测问题数取自：error: ES-Check: there were 7 ES version matching errors.
let errorCount = 0; // 初始化错误计数为0
let result = ""; // 初始化结果字符串为空
let resultDetail = ""; // 初始化详细结果字符串为空
let isFirstDataReceived = true; // 标记变量，用于判断是否是第一次收到数据

// 监听子进程的输出
childProcess.stdout.on("data", (data) => {
  if (isFirstDataReceived) {
    result += data.toString(); // 将收到的数据添加到结果字符串中

    // 获取检测结果中的数字
    const regex = /\d+/; // 匹配连续的数字
    const match = result.match(regex); // 在结果字符串中匹配数字

    if (match) {
      errorCount = parseInt(match[0], 10);
    } else {
      console.log("ES6检测没有检测到数字");
    }

    isFirstDataReceived = false; // 将标记变量设置为false，表示已经处理了第一次数据
  } else {
    resultDetail += data.toString(); // 将收到的数据添加到结果字符串中
  }
});

childProcess.stderr.on("data", (data) => {
  console.error(`错误信息：${data}`);
});

childProcess.on("close", (code) => {
  console.log(`ES6检测进程退出，检测内容详情：${resultDetail}`);
  console.log(`ES6检测进程退出，检测到不符js文件数量：${errorCount}`);
  console.log(`ES6检测进程退出，检测内容：${result}`);
});
