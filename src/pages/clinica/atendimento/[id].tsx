import Head from 'next/head';
import { Menu } from "../../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../../services/validaPermissao';
import { useContext, useEffect, useState, useRef } from 'react';
// import { ClientesContext } from '../../contexts/ListaUsuarioContext';
import { useRouter } from 'next/router';
import api from '../../../services/request';
import Swal from "sweetalert2";
import { BsTrash, BsPencil, BsGear, BsHash, BsPlusLg, BsShieldX,  BsClipboardPlus,  BsCheckLg,  BsPhone, BsCreditCard2Front, BsArrowLeft } from 'react-icons/bs';

interface interfProps {
    token?: string;
}

interface interfAtendimento {
    id: number;
    clienteId: number;
    cliente: {
        nome: string;
    }
    medicoId: number;
    medico: {
        nome: string;
    }
    clinicaId: number;
    clinica: {
        nome: string;
    }
    tipo_Atendimento: string;
    data_Atendimento: string;
    observacao: string;

}

export default function Atendimento(props: interfProps) {
    const router = useRouter();

    const refForm = useRef<any>();

    const { id } = router.query;

    const [atendimentos, setAtendimentos] = useState<Array<interfAtendimento>>([]);

    const [clinica_nome, setClinica_nome] = useState<string>("");

    function deleteAtendimento(id: number) {
        api.delete(`/Atendimentos/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                findAtendimeto();
            Swal.fire(
                    'Deletado com Sucesso!',
                    'Click em OK!',
                    'success')
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function findAtendimeto() {
        api.get(`/Atendimentos/GetAtendimentosByClinica/${id}`, {
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
                  setAtendimentos(res.data);
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

    function formataData(data){
        var dataFormatada = new Date(data);
        return dataFormatada.toLocaleDateString();
    }

    //Busca a Clinica
    function findClinica() {
        api.get(`/Clinicas/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token,
            }
        })
            .then((res) => {
                setClinica_nome(res.data.nome);
            })
            .catch((erro) => {
                console.log(erro);
            });
    }


    useEffect(() => {
        findAtendimeto();
        findClinica();
    }, []);
    return(
        <>

            <Head>
                <title>Atendimentos</title>
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
                            <BsClipboardPlus/> Atendimentos Realizados na {clinica_nome}
                            </h3>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/atendimento/novo/' + id)}
                            className="btn btn-success"><BsPlusLg/> Novo Atendimento</button>
                        </div>
                    </div>
                </>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th><BsHash/> ID</th>
                            <th><BsClipboardPlus/> Cliente</th> 
                            <th><BsCreditCard2Front/> M??dico</th> 
                            <th><BsPhone/> Tipo</th>
                            <th><BsCheckLg/> Data</th>
                            <th><BsGear/> A????es</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atendimentos.map((atendimento: interfAtendimento) => (
                            <tr key={atendimento.id}>
                                <td width="10%" className="text-center">{atendimento.id}</td>
                                <td width="30%">{atendimento.cliente.nome}</td>
                                <td width="20%">{atendimento.medico.nome}</td>
                                <td width="10%">{atendimento.tipo_Atendimento}</td>
                                <td width="15%" className="text-center">{formataData(atendimento.data_Atendimento)}</td>
                                <td width="15%">
                                    <button type="button" className="btn btn-primary btn-sm m-1"
                                    onClick={() => {
                                        router.push(`/atendimento/${atendimento.id}`)
                                    }}
                                    ><BsPencil/></button>
                                       <button
                                            className="btn btn-danger btn-sm m-1"
                                            onClick={() => {
                                                Swal.fire({
                                                    title: 'Deseja excluir?',
                                                    text: "Voc?? n??o poder?? reverter isso!",
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#d33',
                                                    confirmButtonText: 'Sim, excluir!',
                                                    cancelButtonText: 'Cancelar'
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        deleteAtendimento(atendimento.id);
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
                <div className="d-flex justify-content-end">
                        <button type="button" onClick={() => router.back()}
                            className="btn btn-primary"><BsArrowLeft /> Voltar</button>
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
