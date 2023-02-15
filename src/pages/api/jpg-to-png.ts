import { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

const JpgToPngApi = async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    if (req.method === 'POST') {
        const fileBuffer = await sharp(req.body.file).png().toBuffer()
        const fileName = `converted-${Date.now()}.png`

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
        res.status(200).json({ url: `/static/${fileName}` })
    } else {
        res.status(405).end()
    }
}

export default JpgToPngApi
