import { sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetStateReqParams, GetStateResData, SaveStateReqParams, SaveStateResData } from '@nicepkg/gpt-runner-shared/common'
import { GetStateReqParamsSchema, SaveStateReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import { kvsLocalStorage } from '@kvs/node-localstorage'
import { getGlobalCacheDir } from '../helpers/get-cache-dir'
import type { ControllerConfig } from '../types'

async function getStorage() {
  const cacheFolder = await getGlobalCacheDir('gpt-runner-server')
  return await kvsLocalStorage<Record<string, Record<string, any> | null>>({
    name: 'frontend-state',
    storeFilePath: cacheFolder,
    version: 1,
  })
}

export const stateControllers: ControllerConfig = {
  namespacePath: '/state',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as GetStateReqParams

        verifyParamsByZod(query, GetStateReqParamsSchema)

        const { key } = query

        const storage = await getStorage()
        const state = await storage.get(key)

        sendSuccessResponse(res, {
          data: {
            state,
          } satisfies GetStateResData,
        })
      },
    },
    {
      url: '/',
      method: 'post',
      handler: async (req, res) => {
        const body = req.body as SaveStateReqParams

        verifyParamsByZod(body, SaveStateReqParamsSchema)

        const { key, state } = body

        const storage = await getStorage()

        switch (state) {
          case undefined:
            // remove
            await storage.delete(key)
            break
          default:
            // set
            await storage.set(key, state)
            break
        }

        sendSuccessResponse(res, {
          data: null satisfies SaveStateResData,
        })
      },
    },
  ],
}
