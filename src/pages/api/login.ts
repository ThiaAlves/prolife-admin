import type {NextApiRequest, NextApiResponse} from 'next';
import jwt from 'jsonwebtoken';

// eslint-disable-next-line import/no-anonymous-default-export
export default (
    request: NextApiRequest,
    response: NextApiResponse
) => {
    const {email, senha} = request.body

    if (request.method === 'POST') {
        try {

            if (email === 'teste@gmail.com' && senha === '123') {
                const token = jwt.sign({
                    id: 1,
                    nome: 'teste',
                    email,
                    permissoes: 'admin'
                },
                'rotaapiheroku',
                {
                    expiresIn: 60 * 15
                }
                )

                return response.status(200).json({token: token});
            }

            return response.status(401).json({message: 'Usuário inválido!'});

        } catch (error: any) {
            response.status(500).json({erro: error.message});
        }
    }

    response.status(404).json({erro: 'Página não encontrada!'});
};
