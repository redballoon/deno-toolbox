import crypto from 'node:crypto'

import { Buffer } from 'node:buffer';

import Debug from '../utils/debug.js'


const debug = Debug('Encrypt:')


const ALLOW_LIST = {
  ALGO: ['aes-256-gcm'],
  ENCODING: ['base64'],
  BITS: [96, 128, 256],
  CHARACTER_ENCODING: ['utf8'],
}

const DEFAULT_OPTIONS = {
  ENTROPY: {
    bits: 256, // NOTE: recommend 256 for key and 96 for iv
    encoding: 'base64'
  },
  SYM_ENCRYPTION: {
    algo: 'aes-256-gcm', 
    encoding: 'base64', 
    charType: 'utf8'
  }
}

export const createEntropy = (options = {}) => {
  debug('createEntropy(): ...')

  options = { ...DEFAULT_OPTIONS.ENTROPY, ...options }

  const { bits, encoding } = options

  let error

  if (!ALLOW_LIST.BITS.includes(bits)) {
    error = new Error('createEntropy(): Invalid Input for Bits...')
    debug(error.message)
    return [error, null]
  }

  if (!ALLOW_LIST.ENCODING.includes(encoding)) {
    error = new Error('createEntropy(): Invalid Input for Encoding...')
    debug(error.message)
    return [error, null]
  }

  const bytes = bits / 8

  const entropy = crypto.randomBytes(bytes).toString(encoding); // 96 bits


  debug('createEntropy(): log...', `${bits}/bytes`, encoding)

  return [null, entropy]
}


export const symmetricEncrypt = (key, iv, content, options = {}) => {
  debug('symmetricEncrypt(): ...')

  options = { ...DEFAULT_OPTIONS.SYM_ENCRYPTION, ...options }

  const { algo, encoding, charType } = options

  let error

  if (!ALLOW_LIST.ALGO.includes(algo)) {
    error = new Error('symmetricEncrypt(): Invalid Input for Algo...')
    debug(error.message)
    return [error, null]
  }

  if (!ALLOW_LIST.ENCODING.includes(encoding)) {
    error = new Error('symmetricEncrypt(): Invalid Input for Encoding...')
    debug(error.message)
    return [error, null]
  }

  if (!ALLOW_LIST.CHARACTER_ENCODING.includes(charType)) {
    error = new Error('symmetricEncrypt(): Invalid Input for Char Encoding...')
    debug(error.message)
    return [error, null]
  }

  debug('symmetricEncrypt(): log...', algo)

  const cipher = crypto.createCipheriv(
    options.algo, 
    Buffer.from(key, encoding), 
    Buffer.from(iv, encoding)
  );
  
  let cipherText
  
  cipherText = cipher.update(content, charType, encoding);
  cipherText += cipher.final(encoding);

  const tag = cipher.getAuthTag()
  
  return [null, { iv, tag, cipherText }]
}


export const symmetricDecrypt = (key, iv, tag, cipherText, options = {}) => {
  debug('symmetricDecrypt(): ...')

  options = { ...DEFAULT_OPTIONS.SYM_ENCRYPTION, ...options }

  const { algo, encoding, charType } = options

  let error

  if (!ALLOW_LIST.ALGO.includes(algo)) {
    error = new Error('symmetricDecrypt(): Invalid Input for Algo...')
    debug(error.message)
    return [error, null]
  }

  if (!ALLOW_LIST.ENCODING.includes(encoding)) {
    error = new Error('symmetricDecrypt(): Invalid Input for Encoding...')
    debug(error.message)
    return [error, null]
  }

  if (!ALLOW_LIST.CHARACTER_ENCODING.includes(charType)) {
    error = new Error('symmetricDecrypt(): Invalid Input for Char Encoding...')
    debug(error.message)
    return [error, null]
  }

  const decipher = crypto.createDecipheriv(
    options.algo, 
    Buffer.from(key, encoding), 
    Buffer.from(iv, encoding)
  );

  decipher.setAuthTag(Buffer.from(tag, encoding));

  let content
  
  content = decipher.update(cipherText, encoding, charType);
  content += decipher.final(charType);

  return [null, content]
}