import Head from 'next/head';
import { Menu } from "../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../services/validaPermissao';
import { useContext, useEffect, useState } from 'react';
// import { ClinicasContext } from '../../contexts/ListaUsuarioContext';
import { useRouter } from 'next/router';
import api from '../../services/request';
import Swal from "sweetalert2";
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsShieldX, BsShieldFill, BsShieldCheck, BsPeopleFill, BsQuestionSquare, BsCheck, BsCloudSun, BsClipboardPlus, BsMap, BsMapFill, BsCheckLg } from 'react-icons/bs';

interface interfProps {
    token?: string;
}

interface interfClinica {
    id: number;
    nome: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    numero?: string;
    latitude?: string;
    longitude?: string;
    status?: string;
}

export default function Clinica(props: interfProps) {
    const router = useRouter();

    const [clinicas, setClinicas] = useState<Array<interfClinica>>([]);

    function deleteClinica(id: number) {
        api.delete(`/Clinicas/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                findClinica();
            Swal.fire(
                    'Deletado com Sucesso!',
                    'Click em OK!',
                    'success')
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function findClinica() {
        api.get("/Clinicas", {
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
                  setClinicas(res.data);
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
        findClinica();
    }, []);
    return(
        <>

            <Head>
                <title>Clinicas</title>
            </Head>

            <Menu
                active='clinica'
                token={props.token}
            >
                        <div className="bg-light mt-4 p-3 shadow-lg rounded">
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h3>
                            <BsClipboardPlus/> Unidades Cadastradas</h3>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/clinica/novo')}
                            className="btn btn-success"><BsPlusLg/> Adicionar</button>
                        </div>
                    </div>
                </>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th><BsHash/> ID</th>
                            <th><BsClipboardPlus/> Nome</th> 
                            <th><BsMap/> Endereço</th> 
                            <th><BsMapFill/> Cidade</th>
                            <th><BsCheckLg/> Status</th>
                            <th><BsGear/> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clinicas.map((clinica: interfClinica) => (
                            <tr key={clinica.id}>
                                <td width="10%" className="text-center">{clinica.id}</td>
                                <td width="30%">{clinica.nome}</td>
                                <td width="20%">{clinica.logradouro} - {clinica.numero}</td>
                                <td width="10%">{clinica.cidade}</td>
                                <td width="15%" className="text-center">{getStatus(clinica.status)}</td>
                                <td width="15%">
                                    <button type="button" className="btn btn-primary btn-sm m-1"
                                    onClick={() => {
                                        router.push(`/clinica/${clinica.id}`)
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
                                                        deleteClinica(clinica.id);
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
