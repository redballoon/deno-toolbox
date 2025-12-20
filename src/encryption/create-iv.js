import crypto from 'node:crypto'


export const createIV = (options = {}) => {
  // defaults - enforce for now
  options.bits = 96
  options.encoding = 'base64'

  const { bits, encoding } = options
  
  const bytes = bits / 8

  const iv = crypto.randomBytes(bytes).toString(encoding); // 96 bits

  return iv
}