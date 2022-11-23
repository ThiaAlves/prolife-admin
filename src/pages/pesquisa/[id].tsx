import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "../../components/Menu";
import api from "../../services/request";
import { validaPermissao } from "../../services/validaPermissao";
import { BsXLg, BsCheckLg } from "react-icons/bs";
import Swal from "sweetalert2";

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

                if (id === 'botao' || (id === 'status' && value === '')) break;
                obj[id] = value;
            }

            api.put(`/pesquisas/${id}`, obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
                .then(() => {
                    Swal.fire(
                        'Salvo com Sucesso!',
                        'Click em OK!',
                        'warning'
                      )
                    router.push('/pesquisa');
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

            api.get('/pesquisas/' + idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {

                if (res.data) {
                //Aqui dá pra fazer uma mensagem se res.data.status === "Token is Expired"

                    var perguntas = res.data.perguntas;
                    perguntas = perguntas.split('|');
                    var pergunta1 = perguntas[0];
                    var pergunta2 = perguntas[1];
                    var pergunta3 = perguntas[2];


                    refForm.current['tema'].value = res.data.tema;
                    refForm.current['descricao'].value = res.data.descricao;
                    refForm.current['pergunta1'].value = pergunta1;
                    refForm.current['pergunta2'].value = pergunta2;
                    refForm.current['pergunta3'].value = pergunta3;
                    refForm.current['status'].value = res.data.status;
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
                console.log(obj);
            }
            if(obj.id === 'novo') {
                obj.id = "";
            }

            api.post('/pesquisas/', obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
                .then((res) => {
                    Swal.fire(
                        'Salvo com Sucesso!',
                        res.data.message,
                        'success',
                    );
                    router.push('/pesquisa');
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
                <title>{estaEditando ? 'Editar' : 'Cadastrar'} Pesquisa</title>
            </Head>
            <Menu
                active='pesquisa'
                token={props.token}
            >
                <h2 className="pt-4">{estaEditando ? 'Editar' : 'Cadastrar'} Pesquisa</h2>

                <form
                    className='row g-3 needs-validation pt-4'
                    noValidate
                    ref={refForm}
                >
                    <div className="col-md-6" hidden>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="id"
                                value={id}
                                readOnly
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='tema'
                            className='form-label'
                        >
                            Tema:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o tema'
                                id="tema"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o tema.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='descricao'
                            className='form-label'
                        >
                            Descrição:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <textarea
                                className='form-control'
                                placeholder='Informe a descrição da pesquisa'
                                id="descricao"
                                required
                                rows={3}
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe a descrição da Pesquisa.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='pergunta1'
                            className='form-label'
                        >
                            Pergunta 1:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                className='form-control'
                                placeholder='Informe a primeira pergunta'
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
                            htmlFor='pergunta2'
                            className='form-label'
                        >
                            Pergunta 2:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                className='form-control'
                                placeholder='Informe a segunda pergunta'
                                id="pergunta2"
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='pergunta3'
                            className='form-label'
                        >
                            Pergunta 3:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                className='form-control'
                                placeholder='Informe a terceira pergunta'
                                id="pergunta3"
                            />
                        </div>
                    </div>


                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='status'
                            className='form-label'
                        >
                            Status
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <select required className="form-select" defaultValue={""} id='status'>
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
                                        router.push('/pesquisa')
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
