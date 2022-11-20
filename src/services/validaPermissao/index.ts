import jwt_decode from 'jwt-decode';

export const validaPermissao = (
    token: string | undefined,
    permissao: Array<string>
): boolean => {

    if (token) {
        const user = jwt_decode<{
            email: string,
            // id: number,
            unique_name: string,
            role: string
        }>(token);

        const temPermissao = permissao.includes(
            user.role
        );

        if (temPermissao) {
            return true;
        }

        return false;
    }

    return false
}
