import Head from 'next/head';
import { Menu } from "../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../services/validaPermissao';
import { useContext, useEffect, useState } from 'react';
import { PesquisasContext } from '../../contexts/ListaPesquisaContext';
import { useRouter } from 'next/router';
import api from '../../services/request';
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsEye, BsCheck, BsXLg } from 'react-icons/bs';
import Swal from "sweetalert2";

interface interfProps {
    token?: string;
}

interface interfpesquisa {
    id: number;
    tema: string;
    descricao: string;
    total_respostas: number;
    status?: boolean;
}


export default function pesquisa(props: interfProps) {
    const router = useRouter();

    const [pesquisas, setpesquisas] = useState<Array<interfpesquisa>>([]);

    function deleteResearch(id: number, total_respostas: number) {
        if (total_respostas > 0) {
            Swal.fire({
                title: 'Erro!',
                text: 'Não é possível deletar uma pesquisa com respostas!',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            router.push("/pesquisa");
        } else {
            Swal.fire({
                title: 'Deletar Pesquisa?',
                text: "Você não poderá reverter isso!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, deletar!'
            }).then((result) => {
                if (result.value) {

                    api.delete(`/pesquisas/${id}`, {
                        headers: {
                            Authorization: "Bearer " + props.token,
                        },
                    })
                        .then((res) => {
                            findPesquisa();
                            Swal.fire(
                                'Deletado com Sucesso!',
                                'Click em OK!',
                                'error'
                            )
                        })
                        .catch((erro) => {
                            console.log(erro);
                        });
                }
            });
        }

    }

    function findPesquisa() {
        api.get("/pesquisas", {
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
                    setpesquisas(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function getStatus(status: string) {
        console.log(status);
        if (status === '1') {
            return <small className="badge bg-success rounded-pill"><BsCheck /></small>
        } else {
            return <small className="badge bg-secondary rounded-pill"><BsXLg /></small>
        }
    }

    useEffect(() => {
        findPesquisa();
    }, []);
    return (
        <>
            <Head>
                <title>Pesquisa</title>
            </Head>

            <Menu
                active='pesquisa'
                token={props.token}
            >
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h2><BsFillPersonFill /> Pesquisas</h2>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/pesquisa/novo')}
                                className="btn btn-success rounded-pill"><BsPlusLg /> Adicionar</button>
                        </div>
                    </div>
                </>
                <div className="row">
                    {pesquisas.map((pesquisa: interfpesquisa) => (
                        <div className="col-sm-4 p-2" key={pesquisa.id}>
                            <div className="card border border-primary shadow-lg w-100 h-100">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <div className="row">
                                            <div className="col-12 col-md-8 col-sm-12 col-lg-10">
                                                {pesquisa.tema}
                                            </div>
                                            <div className="col-12 col-md-3 col-sm-12 col-lg-2">
                                                {getStatus(pesquisa.status.toString())}
                                            </div>
                                        </div>
                                    </h5>
                                    <p className="card-text">{pesquisa.descricao}</p>
                                    <div className="text-center">
                                        <button type="button" onClick={() => router.push(`/pesquisa/respostas/${pesquisa.id}`)}
                                            className="btn btn-primary btn-sm m-1">{pesquisa.total_respostas} Respostas</button>

                                        <button type="button" className="btn btn-success btn-sm m-1"
                                            onClick={() => {
                                                router.push(`/pesquisa/${pesquisa.id}`)
                                            }
                                            }
                                        ><BsPencil /> Editar</button>

                                        <button
                                            className="btn btn-danger btn-sm m-1"
                                            onClick={() => {
                                                deleteResearch(pesquisa.id, pesquisa.total_respostas);
                                            }}
                                        >
                                            <BsTrash /> Apagar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
