import type { NextApiRequest, NextApiResponse } from 'next'
import * as StreamProviders from 'models/streamProvider'
import { STREAM_PROVIDER } from 'utils/constants'
import { Stream, Recording } from 'types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const providerName: keyof typeof StreamProviders = STREAM_PROVIDER
    const provider = new StreamProviders[providerName]()

    const streams: Array<Stream> = await provider.getStreams()
    const recordings: Array<Array<Recording>> = await Promise.all(
      streams.map(stream => {
        return provider.getRecordings(stream.id)
      })
    )

    // merge recordings with their respective stream
    streams.forEach((stream, index) => {
      stream.recordings = recordings[index]
    })

    return res.status(200).json(streams)
  }

  res.status(404).json({})
}
