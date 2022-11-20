import Head from 'next/head';
import { Menu } from "../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../services/validaPermissao';
import { useContext, useEffect, useState } from 'react';
// import { ClientesContext } from '../../contexts/ListaUsuarioContext';
import { useRouter } from 'next/router';
import api from '../../services/request';
import Swal from "sweetalert2";
import { BsTrash, BsPencil, BsGear, BsHash, BsPlusLg, BsShieldX,  BsClipboardPlus,  BsCheckLg,  BsPhone, BsCreditCard2Front } from 'react-icons/bs';

interface interfProps {
    token?: string;
}

interface interfCliente {
    id: number;
    nome: string;
    cpf: string;
    cep: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    numero?: string;
    telefone?: string;
    tipo_Sanguineo?: string;
    religiao?: string;
    status?: string;
}

export default function Cliente(props: interfProps) {
    const router = useRouter();

    const [clientes, setClientes] = useState<Array<interfCliente>>([]);

    function deleteCliente(id: number) {
        api.delete(`/Clientes/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                findCliente();
            Swal.fire(
                    'Deletado com Sucesso!',
                    'Click em OK!',
                    'success')
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function findCliente() {
        api.get("/Clientes", {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
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
                  setClientes(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function getStatus(status){
        if (status === true) {
            return <span className="badge bg-success"><BsCheckLg/> Ativo</span>
        } else {
            return <span className="badge bg-danger"><BsShieldX/> Inativo</span>
        }
    }

    useEffect(() => {
        findCliente();
    }, []);
    return(
        <>

            <Head>
                <title>Clientes</title>
            </Head>

            <Menu
                active='cliente'
                token={props.token}
            >
                        <div className="bg-light mt-4 p-3 shadow-lg rounded">
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h3>
                            <BsClipboardPlus/> Clientes Cadastrados</h3>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/cliente/novo')}
                            className="btn btn-success"><BsPlusLg/> Adicionar</button>
                        </div>
                    </div>
                </>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th><BsHash/> ID</th>
                            <th><BsClipboardPlus/> Nome</th> 
                            <th><BsCreditCard2Front/> CPF</th> 
                            <th><BsPhone/> Telefone</th>
                            <th><BsCheckLg/> Status</th>
                            <th><BsGear/> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente: interfCliente) => (
                            <tr key={cliente.id}>
                                <td width="10%" className="text-center">{cliente.id}</td>
                                <td width="30%">{cliente.nome}</td>
                                <td width="20%">{cliente.cep}</td>
                                <td width="10%">{cliente.telefone}</td>
                                <td width="15%" className="text-center">{getStatus(cliente.status)}</td>
                                <td width="15%">
                                    <button type="button" className="btn btn-primary btn-sm m-1"
                                    onClick={() => {
                                        router.push(`/cliente/${cliente.id}`)
                                    }}
                                    ><BsPencil/></button>
                                       <button
                                            className="btn btn-danger btn-sm m-1"
                                            onClick={() => {
                                                Swal.fire({
                                                    title: 'Deseja excluir?',
                                                    text: "Você não poderá reverter isso!",
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#d33',
                                                    confirmButtonText: 'Sim, excluir!',
                                                    cancelButtonText: 'Cancelar'
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        deleteCliente(cliente.id);
                                                    }
                                                })
                                            }}>
                                            <BsTrash />
                                        </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
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
        token, ['administrador']
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
