import { GetServerSideProps } from "next";
import Head from 'next/head';
import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "../../../components/Menu";
import api from "../../../services/request";
import { validaPermissao } from "../../../services/validaPermissao";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import Swal from "sweetalert2";
import cep from 'cep-promise'

interface interfProps {
    token?: string;
}

interface interfClinica {
    id: number;
    nome: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    numero?: string;
    latitude?: string;
    longitude?: string;
    status?: string;
}

export default function Medico(props: interfProps) {

    const router = useRouter();

    const refForm = useRef<any>();

    const { clinica_id } = router.query;

    const [clinicas, setClinicas] = useState<Array<interfClinica>>([]);

    const [clinica_nome, setClinica_nome] = useState("");

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

        } else {
            refForm.current.classList.add('was-validated');
        }
    },[]);

    function findClinica() {
        api.get("/Clinicas", {
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
                  setClinicas(res.data);
                }
            })
            .catch((erro) => {
                console.log(erro);
            });
    }
    useEffect(() => {
        const idParam = Number(clinica_id);
        findClinica();


        if(Number.isInteger(idParam)) {
            setEstaEditando(false);

            api.get('/Clinicas/'+idParam, {
                headers: {
                    'Authorization': `Bearer ${props.token}`
                }
            }).then((res) => {
                //Aqui d?? pra fazer uma mensagem se res.data.status === "Token is Expired"
                if(res.data) {
                    setClinica_nome(res.data.nome);
                    // refForm.current['clinica_nome'].value = res.data.nome;
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
            obj.id = 'novo';
            obj.status = obj.status === '1' ? true : false;

            if(obj.id === 'novo') {
                //Remove id
                delete obj.id;
                api.post('/Medicos/', obj, {
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
                    router.push('/clinica/medico/'+clinica_id);
    
                }).catch((erro) => {
                    console.log(erro);
                });
            } else {
                obj.id = Number(obj.id);
                api.put('/Medicos/'+obj.id, obj, {
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
                    router.push('/clinica/medico/'+obj.clinica_id);

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
            <title>{estaEditando ? 'Editar' : 'Cadastrar'} M??dico</title>
        </Head>
            <Menu
                active='medico'
                token={props.token}
            >
                <div className="bg-light mt-4 p-3 shadow-lg rounded">
                <h3 className="pt-4 text-center">{estaEditando ? 'Editar' : 'Cadastrar'} M??dico na {clinica_nome}</h3>

                <form
                    className='row g-3 needs-validation pt-2 m-4'
                    noValidate
                ref={refForm}
                >

                    <div className="col-md-6" hidden>
                        <div className="form-group">
                            <label htmlFor="className">ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="clinicaId"
                                readOnly
                                value={clinica_id}
                            />
                        </div>
                        </div>
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
                                placeholder='Digite o nome do M??dico'
                                id="nome"
                                required
                            />
                            <div className='invalid-feedback'>
                                Por favor, digit o nome do M??dico.
                            </div>
                        </div>
                    </div>
                    <div
                        className='col-md-4'
                    >
                        <label
                            htmlFor='especialidade'
                            className='form-label'
                        >
                            Especialidade:
                        </label>
                        <div
                            className='input-group has-validation'
                        >
                            <select
                                className='form-select'
                                id='especialidade'
                                required
                            >
                                <option value=''>Selecione</option>
                                <option value='Cardiologia'>Cardiologia</option>
                                <option value='Dermatologia'>Dermatologia</option>
                                <option value='Endocrinologia'>Endocrinologia</option>
                                <option value='Gastroenterologia'>Gastroenterologia</option>
                                <option value='Ginecologia'>Ginecologia</option>
                                <option value='Neurologia'>Neurologia</option>
                                <option value='Oftalmologia'>Oftalmologia</option>
                                <option value='Ortopedia'>Ortopedia</option>
                                <option value='Pediatria'>Pediatria</option>
                                <option value='Psiquiatria'>Psiquiatria</option>
                                <option value='Urologia'>Urologia</option>
                            </select>

                            <div className='invalid-feedback'>
                                Por favor, informe a especialidade.
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
                            router.push('/clinica/medico/' + clinica_id);
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
