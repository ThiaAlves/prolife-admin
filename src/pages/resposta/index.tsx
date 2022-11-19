import Head from 'next/head';
import { Menu } from "../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../services/validaPermissao';
import { useContext, useEffect, useState } from 'react';
import { RespostasContext } from '../../contexts/ListaRespostaContext';
import { useRouter } from 'next/router';
import api from '../../services/request';
import { BsTrash, BsPencil, BsGear, BsEye, BsFillPersonFill, BsHash, BsPlusLg, BsSearch, BsCalendarXFill, BsCalendar, BsCheck, BsXLg, BsClock } from 'react-icons/bs';
import Swal from 'sweetalert2';

interface interfProps {
    token?: string;
}

interface interfresposta {
    id: number;
    pessoa: string;
    pesquisa: string;
    status?: string;
    created_at?: Date;
}


export default function resposta(props: interfProps) {
    const router = useRouter();

    const [respostas, setrespostas] = useState<Array<interfresposta>>([]);

    function deleteUser(id: number) {
        api.delete(`/respostas/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                findResposta();
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function findResposta() {
        api.get("/respostas", {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                if (res.data.status === "Token is Expired") {
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
                    setrespostas(res.data);
                }

            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function horario(data: Date) {
        var data = new Date(data);
        var dia = ("0" + data.getDate()).slice(-2);
        var mes = ("0" + (data.getMonth() + 1)).slice(-2);
        var ano = data.getFullYear();
        var hora = ("0" + data.getHours()).slice(-2);
        var min = ("0" + data.getMinutes()).slice(-2);
        var seg = ("0" + data.getSeconds()).slice(-2);
        var horario = dia + "/" + mes + "/" + ano + " " + hora + ":" + min + ":" + seg;
        return <span className="text-muted">{horario}</span>
    }

    function getStatus(status) {
        if (status === 1) {
            return <span className="badge bg-success"><BsCheck /> Verificada</span>;
        } else if (status === 0) {
            return <span className="badge bg-warning"><BsClock /> Pendente</span>;
        }
    }

    useEffect(() => {
        findResposta();
    }, []);
    return (
        <>
            <Head>
                <title>Resposta</title>
            </Head>

            <Menu
                active='resposta'
                token={props.token}
            >
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h2><BsFillPersonFill /> Respostas</h2>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/resposta/novo')}
                                className="btn btn-success rounded-pill"><BsPlusLg /> Adicionar</button>
                        </div>
                    </div>
                </>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th><BsHash /> ID</th>
                            <th><BsFillPersonFill /> Pessoa</th>
                            <th><BsSearch /> Pesquisa</th>
                            <th><BsCalendar /> Data de criação</th>
                            <th><BsCheck /> Status</th>
                            <th><BsGear /> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {respostas.map((resposta: interfresposta) => (
                            <tr key={resposta.id}>
                                <td width="5%" className="text-center">{resposta.id}</td>
                                <td width="20%">{resposta.pessoa}</td>
                                <td width="30%">{resposta.pesquisa}</td>
                                <td width="25%">{horario(resposta.created_at)}</td>
                                <td width="10%">{getStatus(resposta.status)}</td>
                                <td width="10%">
                                    <button type="button" className="rounded-pill btn btn-info btn-sm m-1"
                                        onClick={() => {
                                            router.push(`/resposta/${resposta.id}`)
                                        }}
                                    ><BsEye /></button>
                                    <button hidden
                                        className="rounded-pill btn btn-danger btn-sm m-1"
                                        onClick={() => {
                                            deleteUser(resposta.id);
                                        }}
                                    >
                                        <BsTrash />
                                    </button>
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

    const { 'painel-token': token } = parseCookies(contexto);

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
        token, ['admin']
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
