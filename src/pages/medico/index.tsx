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
import MUIDataTable from "mui-datatables";
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsShieldX, BsShieldFill, BsShieldCheck, BsPeopleFill, BsQuestionSquare, BsCheck, BsCloudSun, BsClipboardPlus, BsMap, BsMapFill, BsCheckLg, BsArrowLeft } from 'react-icons/bs';
import { Options } from '../../components/Config';

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

    const options = Options;

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
        api.get("/Medicos", {
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

    const columns = [
        "Código",
        "Nome",
        "Especialidade",
        "Unidade",
        "Status",
        "Ações",
    ];


    const data = medicos.map((medico: interfMedico) => {
        return [
            medico.id,
            medico.nome,
            medico.especialidade,
            medico.clinica.nome,
            getStatus(medico.status),
            <div className="d-flex">
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
            </div>
        ];
    });

    useEffect(() => {
        findMedico();
    }, []);
    return(
        <>

            <Head>
                <title>Médicos</title>
            </Head>

            <Menu
                active='medico'
                token={props.token}
            >
                        <div className="p-2">
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h3>
                            <BsClipboardPlus/> Médicos Cadastrados</h3>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/medico/novo')}
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

                </div>
                <div className="d-flex justify-content-end mb-5 pt-2">
                    <button type="button" onClick={() => router.back()}
                        className="btn btn-primary"><BsArrowLeft/> Voltar</button>
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
