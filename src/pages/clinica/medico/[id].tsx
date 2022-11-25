import Head from 'next/head';
import { Menu } from "../../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../../services/validaPermissao';
import { useContext, useEffect, useState, useRef } from 'react';
// import { ClinicasContext } from '../../contexts/ListaUsuarioContext';
import { useRouter } from 'next/router';
import api from '../../../services/request';
import Swal from "sweetalert2";
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsShieldX, BsShieldFill, BsShieldCheck, BsPeopleFill, BsQuestionSquare, BsCheck, BsCloudSun, BsClipboardPlus, BsMap, BsMapFill, BsCheckLg, BsFillStarFill } from 'react-icons/bs';

interface interfProps {
    token?: string;
}

interface interfMedico {
    id: number;
    nome: string;
    especialidade: string;
    clinicaId: number;
    clinica: {
        id: number;
        nome: string;
    }
    status?: string;
}

export default function Medico(props: interfProps) {
    const router = useRouter();

    const refForm = useRef<any>();

    const { id } = router.query;

    const [medicos, setMedicos] = useState<Array<interfMedico>>([]);

    function deleteMedico(id: number) {
        api.delete(`/Medicos/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                findMedico();
            Swal.fire(
                    'Deletado com Sucesso!',
                    'Click em OK!',
                    'success')
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function findMedico() {
        api.get(`/Medicos/GetMedicosByClinica/${id}`, {
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
                  setMedicos(res.data);
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
        findMedico();
    }, []);
    return(
        <>

            <Head>
                <title>Médicos</title>
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
                            <BsClipboardPlus/> Médicos Cadastrados na Unidade {'medicos[0]?.clinica.nome'} 
                            </h3>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push(`/medico/novo/${id}`)}
                            className="btn btn-success"><BsPlusLg/> Adicionar</button>
                        </div>
                    </div>
                </>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th><BsHash/> ID</th>
                            <th><BsClipboardPlus/> Nome</th> 
                            <th><BsFillStarFill/> Especialidade</th> 
                            <th><BsCheckLg/> Status</th>
                            <th><BsGear/> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicos.map((medico: interfMedico) => (
                            <tr key={medico.id}>
                                <td width="10%" className="text-center">{medico.id}</td>
                                <td width="30%">{medico.nome}</td>
                                <td width="20%">{medico.especialidade}</td>
                                <td width="15%" className="text-center">{getStatus(medico.status)}</td>
                                <td width="15%">
                                    <button type="button" className="btn btn-primary btn-sm m-1"
                                    onClick={() => {
                                        router.push(`/medico/${medico.id}`)
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
                                                        deleteMedico(medico.id);
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
