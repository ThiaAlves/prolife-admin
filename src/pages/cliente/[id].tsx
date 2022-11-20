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

export default function Cliente(props: interfProps) {

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


            api.put(`/Clientes/${id}`, obj, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            })
            .then(() => {
                router.push('/clinica');
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

            api.get('/Clientes/'+idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {
                //Aqui dá pra fazer uma mensagem se res.data.status === "Token is Expired"
                if(res.data) {
                    refForm.current['nome'].value = res.data.nome;
                    refForm.current['cpf'].value = res.data.cpf;
                    refForm.current['logradouro'].value = res.data?.logradouro || '';
                    refForm.current['bairro'].value = res.data?.bairro || '';
                    refForm.current['numero'].value = res.data?.numero || '';
                    refForm.current['cidade'].value = res.data?.cidade || '';
                    refForm.current['estado'].value = res.data?.estado || '';
                    refForm.current['cep'].value = res.data?.cep || '';
                    refForm.current['telefone'].value = res.data?.telefone || '';
                    refForm.current['religiao'].value = res.data?.religiao || '';
                    refForm.current['tipo_Sanguineo'].value = res.data?.tipo_Sanguineo || '';
                    refForm.current['status'].selectedIndex = res.data?.status === '1' ? 0 : 1;

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
                api.post('/Clientes/', obj, {
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
                    router.push('/cliente');
    
                }).catch((erro) => {
                    console.log(erro);
                });
            } else {
                obj.id = Number(obj.id);
                api.put('/Clientes/'+obj.id, obj, {
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
                    router.push('/cliente');

                }).catch((erro) => {
                    console.log(erro);
                });
            }


        } else {
            refForm.current.classList.add('was-validated');
        }
    }, [])

    function setLocalidade(bairro: string, cidade: string, estado: string, endereco: string) {
        refForm.current['bairro'].value = bairro;
        refForm.current['cidade'].value = cidade;
        refForm.current['estado'].value = estado;
        refForm.current['logradouro'].value = endereco;
        refForm.current['numero'].focus();
    }

    return (
        <>
        <Head>
            <title>{estaEditando ? 'Editar' : 'Cadastrar'} Cliente</title>
        </Head>
            <Menu
                active='cliente'
                token={props.token}
            >
                <div className="bg-light mt-4 p-3 shadow-lg rounded">
                <h3 className="pt-4 text-center">{estaEditando ? 'Editar' : 'Cadastrar'} Cliente</h3>

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
                                placeholder='Digite o nome do cliente'
                                id="nome"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, digite o nome do cliente.
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
                            CPF:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o CPF'
                                id="cpf"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o CPF.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-2'
                    >
                        <label
                            htmlFor='cep'
                            className='form-label'
                        >
                            CEP:
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
                                onKeyUp={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    if(target.value.length === 8){
                                        cep(target.value).then(res => {
                                            setLocalidade(res.neighborhood, res.city, res.state, res.street);
                                    }).catch(err => {
                                        //Colocar alerta para mensagem de erro
                                        Swal.fire(
                                            'Erro',
                                            'CEP não encontrado',
                                            'error'
                                        )
                                    });
                                }
                                }
                            }
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o cep.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='bairro'
                            className='form-label'
                        >
                            Bairro:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o bairro'
                                id="bairro"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o bairro.
                            </div>
                        </div>
                    </div>

                    <div
                        className='col-md-3'
                    >
                        <label
                            htmlFor='cidade'
                            className='form-label'
                        >
                            Cidade:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe a cidade'
                                id="cidade"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe a cidade.
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
                            Estado:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                             <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o Estado'
                                id="estado"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o estado.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-8'
                    >
                        <label
                            htmlFor='logradouro'
                            className='form-label'
                        >
                            Logradouro:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                             <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o Logradouro'
                                id="logradouro"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o Logradouro.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='numero'
                            className='form-label'
                        >
                            Número:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                             <input
                                type='text'
                                className='form-control'
                                placeholder='Ex: 0000'
                                id="numero"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o Logradouro.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-3'
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
                                type='text'
                                className='form-control'
                                placeholder='Informe o Telefone'
                                id="telefone"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe o Telefone.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='religiao'
                            className='form-label'
                        >
                            Religião:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                             <input
                                type='text'
                                className='form-control'
                                placeholder='Informe a Religião'
                                id="religiao"
                                // required
                            />
                            <div className='invalid-feedback'>
                                Por favor, informe a Religião.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-3'
                    >
                        <label
                            htmlFor='tipo_Sanguineo'
                            className='form-label'
                        >
                            Tipo Sanguíneo:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                             <select
                                className='form-select'
                                id='tipo_Sanguineo'
                                required
                            >
                                <option value=''>Selecione</option>
                                <option value='A+'>A+</option>
                                <option value='A-'>A-</option>
                                <option value='B+'>B+</option>
                                <option value='B-'>B-</option>  
                                <option value='AB+'>AB+</option>
                                <option value='AB-'>AB-</option>
                                <option value='O+'>O+</option>
                                <option value='O-'>O-</option>
                            </select>
                            <div className='invalid-feedback'>
                                Por favor, selecione o Tipo Sanguíneo.
                            </div>
                        </div>
                    </div>
                    <div className='col-md-2'>
                        <label
                        htmlFor='status' className="form-label">Status:</label>
                        <select className="form-select" defaultValue="1" id='status' required>
                            <option value="">Selecione o status</option>
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
                            router.push('/cliente')
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
