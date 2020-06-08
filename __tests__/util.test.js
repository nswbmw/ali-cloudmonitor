const util = require('../lib/util')

test('util.calcSignature', () => {
  expect(util.calcSignature(
    'testsecret',
    'POST',
    '0B9BE351E56C90FED853B32524253E8B',
    'application/json',
    'Tue, 11 Dec 2018 21:05:51 +0800',
    {
      'x-cms-api-version': '1.0',
      'x-cms-ip': '127.0.0.1',
      'x-cms-signature': 'hmac-sha1'
    },
    '/metric/custom/upload'
  )).toBe('1DC19ED63F755ACDE203614C8A1157EB1097E922')
})
