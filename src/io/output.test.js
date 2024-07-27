import { assertEquals } from '@std/assert'

import { createFile } from './output.js'

Deno.test('io/output [functional]', async (parent) => {
  //////////////////////////////////
  // createFile():
  //////////////////////////////////
  await parent.step('createFile():', async (parent) => {
    await parent.step('when called correctly', async () => {
      const data = { hello: 'world' }

      const json = JSON.stringify(data, null, 2)

      const [error, ok] = await createFile('./_test-output/io', 'output-test.json', json)

      assertEquals(error, null)
      assertEquals(ok, true)
    })
  })
})
