import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "../components/Menu";
import api from "../services/request";
import { validaPermissao } from "../services/validaPermissao";
import { BsCheckLg, BsXLg } from "react-icons/bs";

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

        if(refForm.current.checkValidity()) {
            let obj: any = new Object;

            for(let i = 0; i < refForm.current.elements.length; i++) {
                const id = refForm.current.elements[i].id;
                const value = refForm.current.elements[i].value;

                if(id === 'botao' || (id === 'senha' && value === '')) break;
                obj[id] = value;
            }

            api.put(`/pessoas/${id}`, obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            .then(() => {
                router.push('/registro');
            })
            .catch((erro) => {
                console.log(erro);
            })

        } else {
            refForm.current.classList.add('was-validated');
        }
    },[]);

    useEffect(() => {
        const idParam = Number(id);

        if(Number.isInteger(idParam)) {
            setEstaEditando(true);

            api.get('/pessoas/'+idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {

                if(res.data) {
                    refForm.current['nome'].value = res.data.nome;
                    refForm.current['email'].value = res.data.email;
                    refForm.current['telefone'].value = res.data.telefone;
                    refForm.current['tipo'].value = res.data.tipo;
                    refForm.current['cpf'].value = res.data?.cpf || '';
                    refForm.current['bairro'].value = res.data?.bairro || '';
                    refForm.current['endereco'].value = res.data?.endereco || '';
                    refForm.current['numero'].value = res.data?.numero || '';
                    refForm.current['cep'].value = res.data?.cep || '';
                    refForm.current['estado'].value = res.data?.estado || '';
                    refForm.current['cidade'].value = res.data?.cidade || '';

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

                if(id === 'botao') break;
                obj[id] = value;

            }

            api.post('/pessoas/', obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            .then((res) =>
            {
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
            <title>{estaEditando ? 'Editar' : 'Cadastrar'} Usuário</title>
        </Head>
            <Menu
                active='usuario'
                token={props.token}
            >
                <h2 className="pt-4">{estaEditando ? 'Editar' : 'Cadastrar'} Usuário</h2>

                <form
                    className='row g-3 needs-validation pt-2 m-4'
                    noValidate
                ref={refForm}
                >
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='nome'
                            className='form-label'
                        >
                            Nome:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Digite o nome'
                                id="nome"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, digite seu nome.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='email'
                            className='form-label'
                        >
                            Email:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <span
                                className='input-group-text'
                            >@</span>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Informe o email'
                                id="email"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe seu email.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='telefone'
                            className='form-label'
                        >
                            Telefone:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Digite o telefone'
                                id="telefone"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe seu número.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='cpf'
                            className='form-label'
                        >
                            CPF
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Digite o cpf'
                                id="cpf"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, digite seu cpf.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='tipo'
                            className='form-label'
                        >
                            Tipo
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <select required className="form-select" defaultValue={""} id='tipo'>
                                <option value={""} disabled>Selecione o tipo</option>
                                <option value="admin">Admin</option>
                                <option value="colaborador">Colaborador</option>
                                <option value="cliente">Cliente</option>
                            </select>
                            <div className='invalid-feedback'>
                                Por favor, selecione o tipo.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='endereco'
                            className='form-label'
                        >
                            Endereço
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Digite o endereco'
                                id="endereco"
                                // required
                            />
                        </div>
                    </div>

                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='bairro'
                            className='form-label'
                        >
                            Bairro
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Digite o seu bairro'
                                id="bairro"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, digite seu bairro.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-2'
                    >
                        <label
                            htmlFor='numero'
                            className='form-label'
                        >
                            Número
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Digite o número'
                                id="numero"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, digite o número.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-3'
                    >
                        <label
                            htmlFor='cep'
                            className='form-label'
                        >
                            CEP
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o cep'
                                id="cep"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o cep.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-3'
                    >
                        <label
                            htmlFor='estado'
                            className='form-label'
                        >
                            Estado
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Escreva o estado'
                                id="estado"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o estado.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='cidade'
                            className='form-label'
                        >
                            Cidade
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Digite a cidade'
                                id="cidade"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe a cidade.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='password'
                            className='form-label'
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            className='form-control'
                            placeholder='Digite sua senha'
                            id='password'
                            required={!estaEditando}
                        />
                        <div className='invalid-feedback'>
                            Por favor, digite sua senha.
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
                            router.push('/usuario')
                        }
                        }
                    >
                        <BsXLg/> Cancelar
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
                           <BsCheckLg/> Enviar
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
