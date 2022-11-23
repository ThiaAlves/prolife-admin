import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "../../components/Menu";
import api from "../../services/request";
import { validaPermissao } from "../../services/validaPermissao";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import Swal from "sweetalert2";
import cep from 'cep-promise'

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


            api.put(`/Usuario/${id}`, obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            .then(() => {
                router.push('/usuario');
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

            api.get('/Usuarios/'+idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {
                //Aqui dá pra fazer uma mensagem se res.data.status === "Token is Expired"
                if(res.data) {
                    refForm.current['nome'].value = res.data.nome;
                    refForm.current['email'].value = res.data.email;
                    refForm.current['tipo_Usuario'].value = res.data.tipo_Usuario;
                    refForm.current['status'].selectedIndex = res.data?.status === 'Ativo' ? 0 : 1;

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

            //Formata status
            obj.status = obj.status === '1' ? true : false;

            if(obj.id === 'novo') {
                delete obj.id;
                api.post('/Usuarios/', obj, {
                    headers: {
                        'Authorization': `Bearer ${props.token}`
                    }
                })
                .then((res) =>
                {
    
                    Swal.fire(
                        'Criado com Sucesso!',
                        res.data.message,
                        'success'
                    )
                    router.push('/usuario');
    
                }).catch((erro) => {
                    console.log(erro);
                });
            } else {
                obj.id = Number(obj.id);
                api.put('/Usuarios/'+obj.id, obj, {
                    headers: {
                        'Authorization': `Bearer ${props.token}`
                    }
                })
                .then((res) =>
                {
                    Swal.fire(
                        'Editado com Sucesso!',
                        res.data.message,
                        'success'
                    )
                    router.push('/usuario');

                }).catch((erro) => {
                    console.log(erro);
                });
            }



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
                                                <div className="bg-light mt-4 p-3 shadow-lg rounded">
                <h3 className="pt-4 text-center">{estaEditando ? 'Editar' : 'Cadastrar'} Usuário</h3>

                <form
                    className='row g-3 needs-validation pt-2 m-4'
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
                                readOnly
                                value={id}
                            />
                        </div>
                        </div>
                    <div
                        className='col-md-8'
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
                        className='col-md-4'
                    >
                        <label
                            htmlFor='tipo_Usuario'
                            className='form-label'
                        >
                            Tipo
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <select required className="form-select" defaultValue={""} id='tipo_Usuario'>
                                <option value={""} disabled>Selecione o tipo</option>
                                <option value="administrador">Administrador</option>
                                <option value="atendente">Atendente</option>
                                <option value="enfermeiro">Enfermeiro</option>
                            </select>
                            <div className='invalid-feedback'>
                                Por favor, selecione o tipo.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-5'
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
                            htmlFor='senha'
                            className='form-label'
                        >
                            Senha:
                        </label>
                        <input
                            type="password"
                            className='form-control'
                            placeholder='Digite sua senha'
                            id='senha'
                            required={!estaEditando}
                        />
                        <div className='invalid-feedback'>
                            Por favor, digite sua senha.
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <label
                        htmlFor='status' className="form-label">Status:</label>
                        <select className="form-select" defaultValue={""} id='status' required>
                            <option value={""} >Selecione o status</option>
                            <option value="1">Ativo</option>
                            <option value="0">Inativo</option>
                        </select>
                        <div className='invalid-feedback'>
                            Por favor, selecione o status.
                        </div>
                    </div>
                    <div
                        className='col-md-12 pt-4'
                    >

                <div className=' text-end'>
                    <div className='col'>
                    <button
                        type='button'
                        className='btn btn-secondary m-1'
                        onClick={() => {
                            router.push('/usuario')
                        }
                        }
                    >
                        <BsXLg/> Cancelar
                    </button>


                        <button
                            className='btn btn-success m-1'
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
