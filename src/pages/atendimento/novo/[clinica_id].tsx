import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "../../../components/Menu";
import api from "../../../services/request";
import { validaPermissao } from "../../../services/validaPermissao";
import { BsCheckLg, BsPlusCircleFill, BsShieldX, BsXLg } from "react-icons/bs";
import Swal from "sweetalert2";
import cep from 'cep-promise';
import MUIDataTable from "mui-datatables";
import { Options } from "../../../components/Config";

interface interfProps {
    token?: string;
}

interface interfCliente {
    id: number;
    nome: string;
    cpf: string;
    cep: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    numero?: string;
    telefone?: string;
    tipo_Sanguineo?: string;
    religiao?: string;
    status?: string;
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

export default function Atendimento(props: interfProps) {

    const router = useRouter();

    const refForm = useRef<any>();

    const { clinica_id } = router.query;

    const options = Options;

    const [estaEditando, setEstaEditando] = useState(false);

    const [clientes, setClientes] = useState<Array<interfCliente>>([]);

    const [clinica_nome, setClinica_nome] = useState("");

    const [medicos, setMedicos] = useState<Array<interfMedico>>([]);

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

            // api.put(`/Atendimentos/${id}`, obj, {
            //     headers: {
            //         'Authorization': `Bearer ${props.token}`
            //     }
            // })
            // .then(() => {
            //     router.push('/atendimento');
            // })
            // .catch((erro) => {
            //     console.log(erro);
            // })

        } else {
            refForm.current.classList.add('was-validated');
        }
    },[]);

    useEffect(() => {
        const idParam = Number(clinica_id);

        if(Number.isInteger(idParam)) {
            setEstaEditando(false);

            api.get('/Clinicas/'+idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {
                //Aqui dá pra fazer uma mensagem se res.data.status === "Token is Expired"
                if(res.data) {
                    setClinica_nome(res.data.nome);
                    // refForm.current['clinica_nome'].value = res.data.nome;
                }

            }).catch((erro) => {
                console.log(erro);
            })
        }
    }, [])

    useEffect(() => {
        findCliente();
        findMedico();
    }
    , [])


    function findCliente() {
        api.get("/Clientes", {
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
                    console.log(res.data);
                  setClientes(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }
    
    function findMedico() {
        api.get(`/Medicos/GetMedicosByClinica/${clinica_id}`, {
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
                  console.log(res.data);
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

    function setCliente(id, nome) {
        refForm.current['clienteId'].value = id;
        refForm.current['cliente'].value = nome;
    }

    function setMedico(id, nome) {
        refForm.current['medicoId'].value = id;
        refForm.current['medico'].value = nome;
    }


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
            obj.id = 'novo';
            obj.status = obj.status === '1' ? true : false;
            delete obj.cliente;
            delete obj.medico;

            console.log(obj);

            if(obj.id === 'novo') {
                //Remove id
                delete obj.id;
                obj.clinicaId = clinica_id;

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
                    router.push(`/clinica/atendimento/${clinica_id}`);
    
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
            <title>{estaEditando ? 'Editar' : 'Novo'} Atendimento na {clinica_nome}</title> 
        </Head>
            <Menu
                active='atendimento'
                token={props.token}
            >
                <div className="bg-light mt-4 p-3 shadow-lg rounded">
                <h3 className="pt-4 text-center">{estaEditando ? 'Editar' : 'Novo'} Atendimento na {clinica_nome}</h3>

                <form
                    className='row g-3 needs-validation pt-2 m-4'
                    noValidate
                ref={refForm}
                >

                    
                    <div
                        className='col-md-6'
                    >
                        <label
                            htmlFor='cliente'
                            className='form-label'
                        >
                            Cliente:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <input
                                type='number'
                                className='form-control'
                                id="clienteId" readOnly required
                                
                            />
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Informe o Cliente'
                                id="cliente" disabled
                                
                            />
                            <div className="input-group-append">
                                <button
                                    className='btn btn-primary rounded-left'
                                    type='button'
                                    data-bs-toggle='modal'
                                    data-bs-target='#modalCliente'
                                >
                                    <BsPlusCircleFill /> Clientes
                                </button>
                            </div>

                            <div className='invalid-feedback'>
                                Por favor, informe o cliente.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-12 col-md-6'
                    >
                        <label
                            htmlFor='medico'
                            className='form-label'
                        >
                            Médico:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                                <input
                                    type='number'
                                    className='form-control'
                                    id="medicoId" readOnly required
                                    
                                />
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Informe o Médico'
                                    id="medico" disabled
                                />
                                <div className="input-group-append">
                                    <button
                                        className='btn btn-dark rounded-left'
                                        type='button'
                                        data-bs-toggle='modal'
                                        data-bs-target='#modalMedico'
                                    >
                                        <BsPlusCircleFill /> Médicos
                                    </button>
                            </div>
                            <div className='invalid-feedback'>
                                Por favor, informe o médico.
                            </div>
                        </div>
                    </div>
                   
                    <div
                        className='col-12 col-md-6'
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
                                <option value='Retorno'>Retorno</option>
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
                                //Valor padrão para data atual
                                defaultValue={new Date().toISOString().split('T')[0]}
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
                                placeholder='Informe a observação'
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
                            router.push(`/clinica/atendimento/${clinica_id}`)
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

                {/* Modal */}
                <div className='modal fade' id='modalCliente' tabIndex={-1} aria-labelledby='modalClienteLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered modal-lg'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title' id='modalClienteLabel'>Buscar Cliente</h5>
                                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
                            </div>
                            <div className='modal-body'>
                            <div className="table-responsive">
                                <table className='table table-striped table-hover'>
                                    <thead className='table-dark'>
                                        <tr>
                                            <th scope='col'>Nome</th>
                                            <th scope='col'>CPF</th>
                                            <th scope='col'>Telefone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes.map((cliente) => {
                                            return (
                                                <tr 
                                                data-bs-dismiss='modal'
                                                //Style hover
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => { setCliente(cliente.id, cliente.nome) }}
                                                >
                                                    <td>{cliente.nome}</td>
                                                    <td>{cliente.cpf}</td>
                                                    <td>{cliente.telefone}</td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Fechar</button>
                                <button type='button' className='btn btn-primary'>Buscar</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <div className='modal fade' id='modalMedico' tabIndex={-1} aria-labelledby='modalMedicoLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-dialog-centered modal-lg'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title' id='modalMedicoLabel'>Buscar Médico</h5>
                                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
                            </div>
                            <div className='modal-body'>
                            <div className="table-responsive">
                                <table className='table table-striped table-hover'>
                                    <thead className='table-dark'>
                                        <tr>
                                            <th scope='col'>Nome</th>
                                            <th scope='col'>Especialidade</th>
                                            <th scope='col'>Clínica</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicos.map((medico) => {
                                            return (
                                                <tr
                                                data-bs-dismiss='modal'
                                                //Style hover
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => { setMedico(medico.id, medico.nome) }}
                                                >
                                                    <td>{medico.nome}</td>
                                                    <td>{medico.especialidade}</td>
                                                    <td>{clinica_nome}</td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Fechar</button>
                                <button type='button' className='btn btn-primary'>Buscar</button>
                            </div>
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
