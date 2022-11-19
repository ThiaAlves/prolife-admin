import Head from 'next/head';
import { Menu } from "../../../components/Menu";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { validaPermissao } from '../../../services/validaPermissao';
import { useContext, useEffect, useRef, useState } from 'react';
import { PesquisasContext } from '../../../contexts/ListaPesquisaContext';
import { useRouter } from 'next/router';
import api from '../../../services/request';
import { BsTrash, BsPencil, BsGear, BsMailbox, BsFillPersonFill, BsHash, BsPlusLg, BsEye, BsSearch, BsStars, BsArrowBarLeft, BsArrowLeft, BsShieldCheck, BsShieldX, BsXLg } from 'react-icons/bs';
import Swal from 'sweetalert2';

interface interfProps {
    token?: string;
}

interface interfpesquisa {
    id_resposta: number;
    nome_pessoa: string;
    tema_pesquisa: string;
    perguntas: string;
    respostas: string;
    status_resposta?: string;
}



export default function pesquisa(props: interfProps) {
    const router = useRouter();

    const { id } = router.query;

    const refForm = useRef<any>();


    const [pesquisas, setpesquisas] = useState<Array<interfpesquisa>>([]);


    function findPesquisa() {
        api.get(`respostasPorPesquisa/${id}`, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
        })
            .then((res) => {
                if (res.data.status === "Token is Expired") {
                    //Adicionar Mensagem de Login Expirado
                    alert("Token is Expired");
                    // Swal.fire({
                    //     title: 'Token is Expired',
                    //     text: '',
                    //     icon: 'error',
                    //     confirmButtonText: 'OK'
                    // }).then(() => {
                    //Voltar para a página de login
                    //     router.push("/");
                    // }
                    // );
                } else {
                    setpesquisas(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }

const [pergunta1, setPergunta1] = useState('');
const [pergunta2, setPergunta2] = useState('');
const [pergunta3, setPergunta3] = useState('');

const [resposta1, setResposta1] = useState('');
const [resposta2, setResposta2] = useState('');
const [resposta3, setResposta3] = useState('');

    function getStatus(status) {
        if (status === 1) {
            return <span className="badge bg-success"><BsShieldCheck/> Normal</span>
        } else if (status === 2) {
            return <span className="badge bg-danger"><BsShieldX/> Problema</span>
        } else {
            return <span className="badge bg-warning"><BsShieldX/> Pendente</span>
        }
    }

    function openModal(id, nome, tema, perguntas, respostas, status) {
        setId_resposta(id);

        setPergunta1(perguntas.split('|')[0]);
        setPergunta2(perguntas.split('|')[1]);
        setPergunta3(perguntas.split('|')[2]);

        setResposta1(respostas.split('|')[0]);
        setResposta2(respostas.split('|')[1]);
        setResposta3(respostas.split('|')[2]);

        refForm.current['nome_pessoa'].value = nome;
        refForm.current['tema_pesquisa'].value = tema;
        refForm.current['status_resposta'].value = status;

}

const [status, setStatus] = useState('');
const [id_resposta, setId_resposta] = useState('');




    function updatePesquisa(){
        event.preventDefault();
        var obj = {
            status: status,
        }
        api.post(`atualizaResposta/${id_resposta}`, obj, {
            headers: {
                Authorization: "Bearer " + props.token,
            },
            data: {
                status: status,
            }

        }).then((res) => {
            console.log(res.data.success);
            if (res.data.success == true) {
                Swal.fire(
                    'Atualizado com Sucesso!',
                    res.data.message,
                    'success'
                ).then(() => {
                    findPesquisa();
                }
                );
            } else {
                Swal.fire(
                    'Erro!',
                    'Erro ao atualizar o registro!',
                    'error'
                ).then(() => {
                    findPesquisa();
                }
                );
            }
            console.log(res.data);
        }).catch((erro) => {
            console.log(erro);
        });
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
                        <h3><BsSearch /> Respostas da Pesquisa: {pesquisas.length > 0 ? pesquisas[0].tema_pesquisa : ''}</h3>
                        <div
                            className="btn-toolbar mb-2 mb-md-0"
                        >
                            <button type="button" onClick={() => router.push('/pesquisa')}
                                className="btn btn-secondary rounded-pill"><BsArrowLeft /> Voltar</button>
                        </div>
                    </div>
                </>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th><BsHash /> ID</th>
                            <th><BsFillPersonFill /> Usuário</th>
                            <th><BsStars /> Status</th>
                            <th><BsGear /> Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pesquisas.map((pesquisa: interfpesquisa) => (
                            <tr key={pesquisa.id_resposta}>
                                <td width="10%" className="text-center">{pesquisa.id_resposta}</td>
                                <td width="40%">{pesquisa.nome_pessoa}</td>
                                <td width="20%">{getStatus(pesquisa.status_resposta)}</td>
                                <td width="10%">
                                    <button type="button" onClick={() => openModal(pesquisa.id_resposta, pesquisa.nome_pessoa, pesquisa.tema_pesquisa, pesquisa.perguntas, pesquisa.respostas, pesquisa.status_resposta)}
                                        className="btn btn-primary btn-sm m-1 rounded-pill" title="Visualizar" data-bs-toggle="modal" data-bs-target="#modal-resposta"><BsEye /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="modal fade" id="modal-resposta" tabIndex={-1} role="dialog" aria-labelledby="modal-resposta-label" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modal-resposta-label">Resposta</h5>
                                <button type="button" className="btn btn-sm btn-secondary close" data-bs-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true"><BsXLg/></span>
                                </button>
                            </div>
                            <form ref={refForm} onSubmit={(e) => updatePesquisa()}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="nome_pessoa">Nome da Pessoa:</label>
                                            <input type="text" className="form-control" id="nome_pessoa" disabled />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="tema_pesquisa">Tema da Pesquisa:</label>
                                            <input type="text" className="form-control" id="tema_pesquisa" disabled />
                                            <div className="form-group">
                                                <label htmlFor="perguntas">{pergunta1}:</label>
                                                <input className="form-control" id="resposta1" value={resposta1} disabled></input>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="perguntas">{pergunta2}:</label>
                                                <input className="form-control" id="resposta1" value={resposta3} disabled></input>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="perguntas">{pergunta3}:</label>
                                                <input className="form-control" id="resposta1" value={resposta3} disabled></input>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="status_resposta">Status:</label>
                                                <select className="form-select" id="status_resposta" onChange={(e) => setStatus(e.target.value)} required>
                                                    <option value="1">Normal</option>
                                                    <option value="0">Pendente</option>
                                                    <option value="2">Problema</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar</button>
                            </div>
                            </form>
                        </div>
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
