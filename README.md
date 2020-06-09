## ali-cloudmonitor

[Aliyun cloudmonitor](https://cloudmonitor.console.aliyun.com/) sdk for node.js

### Install

```sh
$ npm i ali-cloudmonitor --save
```

### Usage

```js
const AliCloudmonitor = require('ali-cloudmonitor')

const aliCloudmonitor = new AliCloudmonitor({
  accessKeyId: 'xxx',
  accessKeySecret: 'xxx',
  // internal: false, // 默认false，如果是true，走阿里云内网服务地址。参考：https://help.aliyun.com/document_detail/60196.html
  // region: 'cn-hangzhou', // 如果internal是true，需要设置此项。region列表参考：https://help.aliyun.com/document_detail/60196.html
})

// https://help.aliyun.com/document_detail/63275.html
aliCloudmonitor.sendMetric([{
  groupId: 1,
  metricName: 'metricName',
  dimensions: {
    dimensionA: 'xxx',
    dimensionB: 'xxx'
  },
  time: Date.now(),
  type: 0,
  period: 60,
  values: {
    value: Math.random()
  }
}]).then(console.log).catch(console.error)

// https://help.aliyun.com/document_detail/60196.html
aliCloudmonitor.sendEvent([{
  name: 'eventName',
  groupId: 2,
  time: Date.now(),
  content: 'This is a event'
}]).then(console.log).catch(console.error)
```

### Test

```sh
$ npm test
```
