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
import cep from 'cep-promise';

interface interfProps {
    token?: string;
}

export default function Atendimento(props: interfProps) {

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


            api.put(`/Atendimentos/${id}`, obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            .then(() => {
                router.push('/atendimento');
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

            api.get('/Atendimentos/'+idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {
                //Aqui dá pra fazer uma mensagem se res.data.status === "Token is Expired"
                if(res.data) {
                    refForm.current['clienteId'].value = res.data.clienteId;
                    refForm.current['medicoId'].value = res.data.medicoId;
                    refForm.current['tipo_Atendimento'].value = res.data.tipo_Atendimento;
                    refForm.current['data_Atendimento'].value = res.data.data_Atendimento;
                    refForm.current['observacao'].value = res.data.observacao;
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
                //Remove id
                delete obj.id;
                api.post('/Atendimentos/', obj, {
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
                    router.push('/atendimento');
    
                }).catch((erro) => {
                    console.log(erro);
                });
            } else {
                obj.id = Number(obj.id);
                api.put('/Atendimentos/'+obj.id, obj, {
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
                    router.push('/atendimento');

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
            <title>{estaEditando ? 'Editar' : 'Novo'} Atendimento</title>
        </Head>
            <Menu
                active='atendimento'
                token={props.token}
            >
                <div className="bg-light mt-4 p-3 shadow-lg rounded">
                <h3 className="pt-4 text-center">{estaEditando ? 'Editar' : 'Novo'} Atendimento</h3>

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
                        className='col-md-6'
                    >
                        <label
                            htmlFor='clienteId'
                            className='form-label'
                        >
                            Cliente:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o Cliente'
                                id="clienteId"  list="clientes" required
                                
                            />
                            {/* <datalist id="clientes">
                                {clientes.map((cliente) => {
                                    return (
                                        <option value={cliente.id}>{cliente.nome}</option>
                                    )
                                }
                                )}
                            </datalist> */}
                            <div className='invalid-feedback'>
                                Por favor, informe o cliente.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='medicoId'
                            className='form-label'
                        >
                            Médico:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o Médico'
                                id="medicoId"  list="medicos" required
                            />
                            {/* <datalist id="medicos">
                                {medicos.map((medico) => {
                                    return (
                                        <option value={medico.id}>{medico.nome}</option>
                                    )
                                }
                                )}
                            </datalist> */}
                            <div className='invalid-feedback'>
                                Por favor, selecione o médico.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='tipo_Atendimento'
                            className='form-label'
                        >
                            Tipo de Atendimento:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <select
                                className='form-select'
                                id='tipo_Atendimento'
                                required
                            >
                                <option value=''>Selecione</option>
                                <option value='Consulta'>Consulta</option>
                                <option value='Exame'>Exame</option>
                            </select>
                            <div className='invalid-feedback'>
                                Por favor, informe o tipo de Atendimento.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='data_Atendimento'
                            className='form-label'
                        >
                            Data do Atendimento:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='date'
                                className='form-control'
                                id="data_Atendimento"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe a data do atendimento.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-12'
                    >
                        <label
                            htmlFor='observacao'
                            className='form-label'
                        >
                            Observação:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <textarea
                                className='form-control'
                                id='observacao'
                                required
                            ></textarea>
                            <div className='invalid-feedback'>
                                Por favor, informe alguma observação.
                            </div>
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
                            router.push('/atendimento')
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
                           <BsCheckLg/> Salvar
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
