const { md5, getInternalHost, calcSignature } = require('./lib/util')
const pkg = require('./package')
const request = require('request-promise')
const internalIp = require('internal-ip')

class AliCloudmonitor {
  constructor (opts = {}) {
    this.accessKeyId = opts.accessKeyId
    this.accessKeySecret = opts.accessKeySecret
    this.internal = opts.internal || false
    this.region = opts.region
    this.host = 'https://metrichub-cms-cn-hangzhou.aliyuncs.com'
    if (!this.accessKeyId || !this.accessKeySecret) {
      throw new Error('Missing `accessKeyId` or `accessKeySecret`')
    }
    if (this.internal) {
      this.host = getInternalHost(this.region)
      if (!this.host) {
        throw new Error(`Wrong region: ${this.region}`)
      }
    }
  }

  async sendMetric (body, _queryString) {
    const bodyStr = JSON.stringify(body)
    const bodyMD5 = md5(bodyStr).toUpperCase()
    const date = (new Date()).toUTCString()
    const ip = await internalIp.v4()
    const url = '/metric/custom/upload'
    const headers = {
      'Content-Length': bodyStr.length,
      'Content-MD5': bodyMD5,
      'Content-Type': 'application/json',
      Date: date,
      Host: this.host.replace(/^https?:\/\//, ''),
      'x-cms-signature': 'hmac-sha1',
      'x-cms-api-version': '1.0',
      'x-cms-ip': ip,
      'User-Agent': `nodejs_${pkg.name}_v${pkg.version}`
    }
    headers.Authorization = this.accessKeyId + ':' + calcSignature(
      this.accessKeySecret,
      'POST',
      bodyMD5,
      'application/json',
      date,
      headers,
      url
    )

    return request({
      method: 'POST',
      baseUrl: this.host,
      url,
      json: true,
      headers,
      body
    })
  }

  async sendEvent (body, _queryString) {
    const bodyStr = JSON.stringify(body)
    const bodyMD5 = md5(bodyStr).toUpperCase()
    const date = (new Date()).toUTCString()
    const ip = await internalIp.v4()
    const url = '/event/custom/upload'
    const headers = {
      'Content-Length': bodyStr.length,
      'Content-MD5': bodyMD5,
      'Content-Type': 'application/json',
      Date: date,
      Host: this.host.replace(/^https?:\/\//, ''),
      'x-cms-signature': 'hmac-sha1',
      'x-cms-api-version': '1.0',
      'x-cms-ip': ip,
      'User-Agent': `nodejs_${pkg.name}_v${pkg.version}`
    }
    headers.Authorization = this.accessKeyId + ':' + calcSignature(
      this.accessKeySecret,
      'POST',
      bodyMD5,
      'application/json',
      date,
      headers,
      url
    )

    return request({
      method: 'POST',
      baseUrl: this.host,
      url,
      json: true,
      headers,
      body
    })
  }
}

module.exports = AliCloudmonitor
