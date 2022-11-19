import Head from 'next/head';
import { Menu } from "../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../services/validaPermissao';
import { useContext, useEffect, useState } from 'react';
import { RespostasUsuarioContext } from '../../contexts/ListaRespostasUsuarioContext';
import { useRouter } from 'next/router';
import api from '../../services/request';
import Swal from "sweetalert2";
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsShieldX, BsShieldFill, BsShieldCheck, BsPeopleFill, BsQuestionSquare, BsCheck2Circle, BsSearch, BsEye, BsClock } from 'react-icons/bs';
import jwtDecode from 'jwt-decode';

interface interfProps {
    token?: string;
}

interface interfrespostaUsuario {
    id_resposta?: number;
    nome_pessoa?: string;
    id_pessoa?: number;
    tema_pesquisa?: string;
    id_pesquisa?: number;
    perguntas?: string;
    respostas?: string;
    status_resposta?: string;

}


export default function Usuario(props: interfProps) {
    const router = useRouter();

    const [respostasUsuarios, setrespostasUsuarios] = useState<Array<interfrespostaUsuario>>([]);

    function deleteUser(id: number) {
        api.delete(`/pessoas/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                findUser();
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    const idPessoa = jwtDecode<{
        id: number;
    }>(props.token).id;

    function findUser() {
        api.get(`/respostasPorPessoa/${idPessoa}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                console.log(res);
                if(res.data.status === "Token is Expired"){
                    //Adicionar Mensagem de Login Expirado
                    Swal.fire({
                        title: 'Token Expirado!',
                        text: '',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        router.push("/");
                    }
                    );
                } else {
                    setrespostasUsuarios(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function getStatus(status) {
        if (status == '1') {
            return <BsCheck2Circle size={20} color="#00ff00" />;
        } else {
            return <BsClock size={20} color="#746f2e" />;
        }
    }

    useEffect(() => {
        findUser();
    }, []);
    return(
        <>
            <Head>
                <title>Minhas Respostas</title>
            </Head>

            <Menu
                active='minhas-respostas'
                token={props.token}
            >
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h2><BsCheck2Circle/> Minhas Respostas</h2>

                    </div>
                </>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th><BsHash/> ID</th>
                            <th><BsFillPersonFill/> Nome</th>
                            <th><BsSearch/> Tema Pesquisa</th>
                            <th><BsQuestionSquare/> Status</th>
                            <th><BsGear/> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {respostasUsuarios.map((respostasUsuario: interfrespostaUsuario) => (
                            <tr key={respostasUsuario.id_resposta}>
                                <td width="10%" className="text-center">{respostasUsuario.id_resposta}</td>
                                <td width="35%">{respostasUsuario.nome_pessoa}</td>
                                <td width="35%">{respostasUsuario.tema_pesquisa}</td>
                                <td width="10%" className="text-center">{getStatus(respostasUsuario.status_resposta)}</td>
                                <td width="10%" className="text-center">
                                    <button type="button" className="rounded-pill btn btn-success btn-sm m-1"
                                    onClick={() => {

                                    }}
                                    ><BsEye/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Menu>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (contexto) => {

    const {'painel-token': token} = parseCookies(contexto);

    // console.log(token)

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    const temPermissaoPage = validaPermissao(
        token, ['admin', 'colaborador' ,'cliente']
    )

    if (!temPermissaoPage) {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        }
    }

    return {
        props: {
            token
        }
    }
}
