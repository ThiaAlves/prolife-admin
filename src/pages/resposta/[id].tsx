import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "../../components/Menu";
import api from "../../services/request";
import { validaPermissao } from "../../services/validaPermissao";
import { BsXLg, BsCheckLg } from "react-icons/bs";

interface interfProps {
    token?: string;
}

export default function Usuario(props: interfProps) {

    const router = useRouter();

    const refForm = useRef<any>();

    const { id } = router.query;

    const [estaEditando, setEstaEditando] = useState(false);

    const editForm = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (refForm.current.checkValidity()) {
            let obj: any = new Object;

            for (let i = 0; i < refForm.current.elements.length; i++) {
                const id = refForm.current.elements[i].id;
                const value = refForm.current.elements[i].value;

                if (id === 'botao' || (id === 'status_resposta' && value === '')) break;
                obj[id] = value;
            }

            api.put(`/respostas/${id}`, obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
                .then(() => {
                    router.push('/resposta');
                })
                .catch((erro) => {
                    console.log(erro);
                })

        } else {
            refForm.current.classList.add('was-validated');
        }
    }, []);

    useEffect(() => {
        const idParam = Number(id);

        if (Number.isInteger(idParam)) {
            setEstaEditando(true);

            api.get('/respostas/' + idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {

                if (res.data) {
                //Aqui dá pra fazer uma mensagem se res.data.status === "Token is Expired"


                    var respostas = res.data.resposta.respostas;
                    var perguntas = res.data.perguntas;
                    // var respostas = res.data[0].respostas;
                    // console.log(respostas);
                    var resposta1 = respostas.split('|')[0];
                    var resposta2 = respostas.split('|')[1];
                    var resposta3 = respostas.split('|')[2];

                    refForm.current['nome_pessoa'].value = res.data.resposta.nome_pessoa;
                    refForm.current['tema_pesquisa'].value = res.data.resposta.tema_pesquisa;
                    // refForm.current['descricao'].value = res.data[0].descricao;
                    // refForm.current['perguntas'].value = res.data[0].perguntas;
                    // refForm.current['status_resposta'].value = res.data[0].status_resposta;
                    refForm.current['pergunta1'].value = perguntas[0];
                    refForm.current['pergunta2'].value = perguntas[1];
                    refForm.current['pergunta3'].value = perguntas[2];
                }

            }).catch((erro) => {
                console.log(erro);
            })
        }
    }, [])

    const submitForm = useCallback((e: FormEvent) => {
        e.preventDefault();

        if (refForm.current.checkValidity()) {

            let obj: any = new Object;

            for (let index = 0; index < refForm.current.length; index++) {
                const id = refForm.current[index]?.id;
                const value = refForm.current[index]?.value;

                if (id === 'botao') break;
                obj[id] = value;

            }

            api.post('/respostas/', obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
                .then((res) => {
                    router.push('/usuario');

                }).catch((erro) => {
                    console.log(erro);
                });

        } else {
            refForm.current.classList.add('was-validated');
        }
    }, [])

    return (
        <>

            <Head>
                <title>{estaEditando ? 'Ver' : 'Cadastrar'} Resposta</title>
            </Head>
            <Menu
                active='resposta'
                token={props.token}
            >
                <h2 className="pt-4">{estaEditando ? 'Ver' : 'Cadastrar'} Resposta</h2>

                <form
                    className='row g-3 needs-validation pt-4'
                    noValidate
                    ref={refForm}
                >
                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='nome_pessoa'
                            className='form-label'
                        >
                            Nome da Pessoa:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o nome da pessoa'
                                id="nome_pessoa"
                                required
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='pesquisa_id'
                            className='form-label'
                        >
                            Tema da Pesquisa:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                id="tema_pesquisa"
                                required
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='pergunta1'
                            className='form-label'
                        >
                            <span>Pergunta:</span>
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input readOnly={true}
                                className='form-control bg-dark text-white'
                                id="pergunta1"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe a primeira Pesquisa.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='resposta1'
                            className='form-label'
                        >
                            Resposta 1:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input readOnly={true}
                                className='form-control bg-success text-white'
                                id="resposta1"
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='pergunta2'
                            className='form-label'
                        >
                            Pergunta 2:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input readOnly={true}
                                className='form-control bg-dark text-white'
                                id="pergunta2"
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='resposta2'
                            className='form-label'
                        >
                            Resposta 2:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input readOnly={true}
                                className='form-control bg-success text-white'
                                id="resposta2"
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='pergunta2'
                            className='form-label'
                        >
                            Pergunta 3:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input readOnly={true}
                                className='form-control bg-dark text-white'
                                id="pergunta3"
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='resposta2'
                            className='form-label'
                        >
                            Resposta 3:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input readOnly={true}
                                className='form-control bg-success text-white'
                                id="resposta3"
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='status_resposta'
                            className='form-label'
                        >
                            Status
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <select required className="form-select" defaultValue={""} id='status_resposta'>
                                <option value={""} disabled>Selecione o status</option>
                                <option value="1">Ativo</option>
                                <option value="0">Inativo</option>
                            </select>
                            <div className='invalid-feedback'>
                                Por favor, selecione o tipo.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-12'
                    >

                        <div className=' text-end'>
                            <div className='col'>
                                <button
                                    type='button'
                                    className='btn btn-danger m-1 rounded-pill'
                                    onClick={() => {
                                        router.push('/resposta')
                                    }
                                    }
                                >
                                    <BsXLg /> Cancelar
                                </button>


                                <button
                                    className='btn btn-success m-1 rounded-pill'
                                    type='submit'
                                    id='botao'
                                    onClick={(e) => {
                                        submitForm(e)
                                        //Adicionar ou editar
                                        estaEditando ? setEstaEditando(false) : setEstaEditando(true)
                                    }
                                    }
                                >
                                    <BsCheckLg /> Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </form>


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
