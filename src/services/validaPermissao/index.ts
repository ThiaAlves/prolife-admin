import jwt_decode from 'jwt-decode';

export const validaPermissao = (
    token: string | undefined,
    permissao: Array<string>
): boolean => {

    if (token) {
        const user = jwt_decode<{
            email: string,
            id: number,
            nome: string,
            tipo: string
        }>(token);

        const temPermissao = permissao.includes(
            user.tipo
        );

        if (temPermissao) {
            return true;
        }

        return false;
    }

    return false
}
