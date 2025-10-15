// 腾讯云COS配置
const cosConfig = {//
    bucket: 'lovel-nana-1259397844', // 替换为您的存储桶名称
    region: 'ap-guangzhou',     // 替换为您的存储桶所在地域
    secretId: localStorage.getItem('local_cosId'), // 从后端获取，不要写死在前端
    secretKey: localStorage.getItem('local_cosToken') // 从后端获取，不要写死在前端
};
// 初始化COS SDK
let cos = new COS({
    SecretId: cosConfig.secretId,
    SecretKey: cosConfig.secretKey
});

async function getCosUrl(filePath, useCache = true) {
    if (filePath.length > 1000) {
        alert('路径错误:' + filePath);
        return null;
    }
    if (useCache) {
        let validCache = getPicFromCache(filePath)
        if (validCache) {
            return validCache;
        }
    }
    const resultUrl = await cos.getObjectUrl({
        Bucket: cosConfig.bucket,
        Region: cosConfig.region,
        Key: filePath,
        Sign: true,
        Protocol: 'https:'
    });
    console.log('filePath', filePath);
    console.log('resultUrl', resultUrl);
    if (useCache) {
        savePicToCache(filePath, resultUrl);
    }
    return resultUrl;
}

async function getCosUrlList(filePathList) {
    const queryPromises = filePathList.map((item, index) => {
        return new Promise((resolve, reject) => {
            getCosUrl(item).then(fileUrl => {
                resolve({"url": fileUrl, "index": index});
            });
        });
    });
    let url_list = new Array(filePathList.length);
    await Promise.all(queryPromises)
        .then(results => {
            results.forEach(cos => {
                url_list[cos.index] = cos.url;
            });
        });
    return url_list;
}


// 上传文件到腾讯云COS
async function uploadFiles(selectedFiles) {
    const uploadPromises = selectedFiles.map((file, index) => {
        return new Promise((resolve, reject) => {
            // 生成文件名（时间戳+随机数）
            const fileExtension = file.name.split('.').pop();
            const fileName = `nana/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
            cos.putObject({
                Bucket: cosConfig.bucket,
                Region: cosConfig.region,
                Key: fileName,
                Body: file
            }).then(res => {
                resolve({"index": index, "fileName": fileName});
            });
        });
    });

    // 等待所有文件上传完成
    let imageNameList = new Array(selectedFiles.length);
    await Promise.all(uploadPromises)
        .then(results => {
            results.forEach(cos => {
                imageNameList[cos.index] = cos.fileName;
            });
            return imageNameList;
        });
    return imageNameList;
}

async function uploadStrFile(fileName, content) {
    return await cos.putObject({
        Bucket: cosConfig.bucket,
        Region: cosConfig.region,
        Key: fileName,
        Body: content
    }, (err, res) => {

    });
}

function savePicToCache(imageName, imgUrl) {
    let curStamp = Date.now()
    localStorage.setItem(imageName, `${imgUrl},${curStamp}`)
    console.log('savePicToCache', imageName, `${imgUrl},${curStamp}`);
}

function getPicFromCache(imageName) {
    let curStamp = Date.now()
    let cacheInfo = localStorage.getItem(imageName)
    if (!cacheInfo) {
        return null;
    }
    let cacheParts = cacheInfo.split(',')
    let bornMin = getMinutesDifference(parseInt(cacheParts[1]), curStamp);
    if (bornMin >= 14) {
        localStorage.removeItem(imageName);
    } else {
        return cacheParts[0]
    }
}


function getMinutesDifference(timestamp1, timestamp2) {
    // 计算时间差的绝对值（毫秒）
    const diffInMs = Math.abs(timestamp2 - timestamp1);
    // 转换为分钟（1分钟 = 60秒 = 60000毫秒）
    const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));
    return diffInMinutes;
}