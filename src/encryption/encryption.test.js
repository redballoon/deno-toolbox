import { assertEquals } from '@std/assert'

import { createEntropy, symmetricEncrypt, symmetricDecrypt } from './encryption.js'


Deno.test('encryption: [smoke] encryption/decryption', async (parent) => {

  const content = 'hello world'

  ///////////////////////////

  const [keyError, key] = createEntropy({ bits: 256 })

  assertEquals(keyError, null)


  const [entropyIVError, entropyIV] = createEntropy({ bits: 96 })

  assertEquals(entropyIVError, null)

  ///////////////////////////

  const [encryptError, encryptOk] = symmetricEncrypt(key, entropyIV, content);

  assertEquals(encryptError, null)

  const { cipherText, iv, tag }  = encryptOk


  ///////////////////////////
  
  const [decryptError, plaintext] = symmetricDecrypt(key, iv, tag, cipherText);

  assertEquals(content, plaintext)
})
