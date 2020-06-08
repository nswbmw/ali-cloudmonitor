const crypto = require('crypto')
const utf8 = require('utf8')

const internalRegionMapping = {
  'cn-hangzhou': 'http://metrichub-cn-hangzhou.aliyun.com', // 华东1（杭州）
  'cn-zhangjiakou': 'http://metrichub-cn-zhangjiakou.aliyun.com', // 华北3（张家口）
  'cn-shanghai': 'http://metrichub-cn-shanghai.aliyun.com', // 华东2（上海）
  'cn-beijing': 'http://metrichub-cn-beijing.aliyun.com', // 华北2（北京）
  'cn-qingdao': 'http://metrichub-cn-qingdao.aliyun.com', // 华北1（青岛）
  'cn-shenzhen': 'http://metrichub-cn-shenzhen.aliyun.com', // 华南1（深圳）
  'cn-hongkong': 'http://metrichub-cn-hongkong.aliyun.com', // 中国香港（香港）
  'cn-huhehaote': 'http://metrichub-cn-huhehaote.aliyun.com', // 华北5（呼和浩特）
  'me-east-1': 'http://metrichub-me-east-1.aliyun.com', // 中东东部1（迪拜）
  'us-west-1': 'http://metrichub-us-west-1.aliyun.com', // 美国西部1（硅谷 ）
  'us-east-1': 'http://metrichub-us-east-1.aliyun.com', // 美国东部1（弗吉尼亚）
  'ap-northeast-1': 'http://metrichub-ap-northeast-1.aliyun.com', // 亚太东北1（日本 ）
  'eu-central-1': 'http://metrichub-eu-central-1.aliyun.com', // 欧洲中部1（法兰克福）
  'ap-southeast-1': 'http://metrichub-ap-southeast-1.aliyun.com', // 亚太东南1（新加坡）
  'ap-southeast-2': 'http://metrichub-ap-southeast-2.aliyun.com', // 亚太东南2（悉尼）
  'ap-southeast-3': 'http://metrichub-ap-southeast-3.aliyun.com', // 亚太东南3（吉隆坡）
  'ap-south-1': 'http://metrichub-ap-south-1.aliyuncs.com' // 亚太南部1（孟买）
}

exports.md5 = function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

exports._hmacSha1 = function _hmacSha1 (str, accessKeySecret) {
  return crypto.createHmac('sha1', accessKeySecret).update(str).digest('hex')
}

exports.getInternalHost = function getInternalHost (region) {
  return internalRegionMapping[region]
}

exports.calcSignature = function calcSignature (accessKeySecret,
                                                verb = 'POST',
                                                contentMD5,
                                                contentType = 'application/json',
                                                date = (new Date()).toUTCString(),
                                                canonicalizedHeaders,
                                                canonicalizedResource,
                                                queryString) {
  verb = verb.toUpperCase()
  contentMD5 = contentMD5.toUpperCase()
  const canonicalizedHeadersStr = Object.keys(canonicalizedHeaders)
    .filter(header => {
      return !!header.match(/^(x-cms-|x-acs-)/i)
    })
    .sort()
    .map(canonicalizedHeader => {
      return `${canonicalizedHeader.toLowerCase()}:${canonicalizedHeaders[canonicalizedHeader]}`
    })
    .join('\n')

  const signString = `${verb}\n${contentMD5}\n${contentType}\n${date}\n${canonicalizedHeadersStr}\n${canonicalizedResource}${queryString ? ('?' + queryString) : ''}`
  const signature = exports._hmacSha1(utf8.encode(signString), accessKeySecret)

  return signature.toUpperCase()
}
