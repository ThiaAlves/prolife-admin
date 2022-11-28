import Head from 'next/head';
import { Menu } from "../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../services/validaPermissao';
import { useContext, useEffect, useState } from 'react';
import { UsuariosContext } from '../../contexts/ListaUsuarioContext';
import { useRouter } from 'next/router';
import api from '../../services/request';
import Swal from "sweetalert2";
import { Options } from '../../components/Config';
import MUIDataTable from "mui-datatables";
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsShieldX, BsShieldFill, BsShieldCheck, BsPeopleFill, BsQuestionSquare, BsCheckLg, BsArrowLeft } from 'react-icons/bs';

interface interfProps {
    token?: string;
}

interface interfUsuario {
    id: number;
    nome: string;
    email: string;
    tipo_Usuario: string;
    status?: string;
}


export default function Usuario(props: interfProps) {
    const router = useRouter();

    //Recebe options do compoentes\Config\index.tsx
    const options = Options;

    const [usuarios, setUsuarios] = useState<Array<interfUsuario>>([]);

    function deleteUser(id: number) {
        api.delete(`/Usuarios/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                findUser();
                Swal.fire(
                    'Deletado com Sucesso!',
                    'Click em OK!',
                    'success')
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function findUser() {
        api.get("/Usuarios", {
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
                  setUsuarios(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

    function getTipo(tipo){
        if (tipo === 'administrador') {
            return <span className="badge bg-success"><BsShieldCheck/> Administrador</span>
        } else if (tipo === 'atendente') {
            return <span className="badge bg-warning"><BsShieldX/> Atendente</span>
        } else if (tipo === 'enfermeiro') {
            return <span className="badge bg-primary"><BsPeopleFill/> Enfermeiro</span>
        }
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
        "Email",
        "Tipo",
        "Status",
        "Ações",
    ];

    const data = usuarios.map((usuario) => {
        return [
            usuario.id,
            usuario.nome,
            usuario.email,
            getTipo(usuario.tipo_Usuario),
            getStatus(usuario.status),
            <div className="d-flex">
                <button className="btn btn-primary btn-sm me-1" onClick={() => router.push(`/usuario/${usuario.id}`)}><BsPencil/></button>
                <button className="btn btn-danger btn-sm" onClick={() => {
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
                                                        deleteUser(usuario.id);
                                                    }
                                                })
                                            }}><BsTrash/></button>
            </div>
        ];
    });


    useEffect(() => {
        findUser();
    }, []);
    return(
        <>
            <Head>
                <title>Usuários</title>
            </Head>

            <Menu
                active='usuario'
                token={props.token}
            >
                                <div className="p-2">
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h2><BsFillPersonFill/> Usuários Cadastrados</h2>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/usuario/novo')}
                            className="btn btn-success"><BsPlusLg/> Adicionar</button>
                        </div>
                    </div>
                </>
                <MUIDataTable
                    title={"Usuários"}
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
