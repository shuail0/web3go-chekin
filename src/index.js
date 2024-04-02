const Web3Go = require('./web3go/web3go.js');
const ethers = require('ethers');
const { sleep, convertCSVToObjectSync, appendObjectToCSV } = require('./utils.js');


;(async () => {
    // 从环境变量中获取私钥
    
    const rpc = 'https://rpc.ankr.com/bsc'
    const proxy = 'http://127.0.0.1:7890' // 代理，到
    const walletDataPath = '/Users/lishuai/Documents/crypto/bockchainbot/web3go-chekin/walletData.csv'; // 钱包文件路径

    const walletDatas = convertCSVToObjectSync(walletDataPath);
    // 遍历钱包数据
    for (let i = 0; i < walletDatas.length; i++) {
        const walletData = walletDatas[i];
        const pky = walletData.privateKey;
        try {
        const wallet = new ethers.Wallet(pky, new ethers.getDefaultProvider(rpc));
        const web3go = new Web3Go(wallet, proxy);
        // 登陆
        console.log('账户地址：', wallet.address, '开始登陆');
        await web3go.login();
        console.log('登陆成功，开始签到....');
        // 暂停6秒
        await sleep(0.1);
        // // // 每日签到
        console.log('开始签到');
        const claimResult = await web3go.claim();
        console.log('签到结果：', claimResult);
        const time = new Date().toLocaleString();
        await appendObjectToCSV({time, "address":walletData.address, "info": '成功'}, '../签到成功.csv')
      } catch (error) {
        const time = new Date().toLocaleString();
        await appendObjectToCSV({time, "address":walletData.address, "info": error}, '../签到失败.csv')
          
      }
    }
    
})();
