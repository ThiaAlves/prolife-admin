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
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsShieldX, BsShieldFill, BsShieldCheck, BsPeopleFill, BsQuestionSquare, BsCheck, BsCloudSun, BsClipboardPlus, BsMap, BsMapFill, BsCheckLg, BsHouseFill, BsFillHouseFill, BsFillHouseDoorFill, BsJournalMedical, BsFillPinMapFill, BsFillPersonBadgeFill, BsArrowLeft } from 'react-icons/bs';

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
                    setClinicas(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function getStatus(status) {
        if (status === true) {
            return <span className="badge bg-success"><BsCheckLg /></span>
        } else {
            return <span className="badge bg-danger"><BsShieldX /></span>
        }
    }

    useEffect(() => {
        findClinica();
    }, []);
    return (
        <>

            <Head>
                <title>Clinicas</title>
            </Head>

            <Menu
                active='clinica'
                token={props.token}
            >
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h2><BsFillPinMapFill /> Unidades Cadastradas</h2>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/clinica/novo')}
                                className="btn btn-success"><BsPlusLg /> Adicionar</button>
                        </div>
                    </div>
                </>
                <div className="row">
                    {clinicas.map((clinica: interfClinica) => (
                        <div className="col-sm-4 p-2" key={clinica.id}>
                            <div className="card border border-primary shadow-lg w-100 h-100">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <div className="row">
                                            <div className="col-12 col-md-8 col-sm-12 col-lg-10">
                                                {clinica.nome}
                                            </div>
                                            <div className="col-12 col-md-3 col-sm-12 col-lg-2">
                                                {getStatus(clinica.status)}
                                            </div>
                                        </div>
                                    </h5>
                                    <p className="card-text">{clinica.logradouro} {clinica.numero} - {clinica.cidade}/{clinica.estado}</p>
                                    <div className="text-center">
                                        <button type="button" onClick={() => router.push(`/clinica/atendimento/${clinica.id}`)}
                                            className="btn btn-primary btn-sm m-1"><BsJournalMedical /> Atendimentos</button>
                                        <button type="button" onClick={() => router.push(`/clinica/medico/${clinica.id}`)}
                                            className="btn btn-dark btn-sm m-1"><BsFillPersonBadgeFill /> Médicos</button>

                                        <button type="button" className="btn btn-success btn-sm m-1"
                                            onClick={() => {
                                                router.push(`/clinica/${clinica.id}`)
                                            }
                                            }
                                        ><BsPencil /></button>

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
                                            }}
                                        >
                                            <BsTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
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
