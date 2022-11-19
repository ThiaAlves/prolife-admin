import { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if(req.method === 'GET') {
        return res.status(200).json({id: req.query.id})
    }

    return res.status(404)
}
