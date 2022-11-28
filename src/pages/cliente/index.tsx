import Head from 'next/head';
import { Menu } from "../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../services/validaPermissao';
import { useContext, useEffect, useState } from 'react';
// import { ClientesContext } from '../../contexts/ListaUsuarioContext';
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router';
import api from '../../services/request';
import Swal from "sweetalert2";
import { BsTrash, BsPencil, BsGear, BsHash, BsPlusLg, BsShieldX,  BsClipboardPlus,  BsCheckLg,  BsPhone, BsCreditCard2Front, BsArrowLeft } from 'react-icons/bs';
import { Options } from '../../components/Config';

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

    const options = Options;

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
                    console.log(res.data);
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

    const columns = [
        "Código",
        "Nome",
        "CPF",
        "Telefone",
        "Status",
        "Ações",
    ];

    const data = clientes.map((cliente: interfCliente) => {
        return [
            cliente.id,
            cliente.nome,
            cliente.cpf,
            cliente.telefone,
            getStatus(cliente.status),
            <div className="d-flex">
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
            </div>
        ];
    });

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
                        <div className="p-2">
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
                <MUIDataTable
                    title={"Médicos"}
                    data={data}
                    columns={columns}
                    options={options}
                />
                <div className="d-flex justify-content-end mb-5 pt-2">
                    <button type="button" onClick={() => router.back()}
                        className="btn btn-primary"><BsArrowLeft/> Voltar</button>
                </div>
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
