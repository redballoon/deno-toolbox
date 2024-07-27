/*
 * Output.js
 *
 * Example:
 * deno run --allow-env=DEBUG --allow-read=./ --allow-write=./
 */

import { mkdirp } from 'mkdirp'

import Debug from '../utils/debug.js'


const debug = Debug('IO:Output:')

const encoder = new TextEncoder()


const createDir = async (path) => {
  debug('createDir: will create...', path)

  let error

  await mkdirp(path).catch((err) => (error = err))

  if (error) {
    debug('createDir: FAILED to create directory...', error)
    return [error, null]
  }

  return [null, true]
}

const createFile = async (path, filename, data, options = {}) => {
  debug('createFile: will save...', path, filename)

  // validation
  let argError

  if (typeof path !== 'string' || typeof filename !== 'string') {
    argError = new Error('createFile: Invalid Arguments - path and filename must be strings')
    debug(argError.message)
    return [argError, null]
  }

  if (!data) {
    argError = new Error('createFile: Invalid Arguments - data can not be empty')
    debug(argError.message)
    return [argError, null]
  }

  // create directory path
  const [createDirError] = await createDir(path)

  if (createDirError) {
    debug('createFile: FAILED...')
    return [createDirError, null]
  }

  // configure writer
  const args = {}

  if (options.writer) {
    ;['create', 'mode', 'append'].forEach((key) => {
      if (typeof options.writer[key] !== 'undefined') args[key] = options.writer[key]
    })
  }

  // create content
  let content

  try {
    content = encoder.encode(data)
  } catch (e) {
    debug('createFile: FAILED to encode data...', e)
    return [e, null]
  }

  // create file
  let error

  const outputPath = `${path}/${filename}`

  await Deno.writeFile(outputPath, content).catch((err) => (error = err))

  if (error) {
    debug('createFile: FAILED to write...', error)
    return [error, null]
  }

  return [null, true]
}

export { createDir, createFile }
