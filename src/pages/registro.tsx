import Head from "next/head";
import { AutenticacaoContext } from "../contexts/AutenticacaoContext";
import { BsKey, BsEnvelope, BsArrowLeft, BsCheck } from "react-icons/bs";
import { useRouter } from 'next/router';
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "../components/Menu";
import api from "../services/request";
import { validaPermissao } from "../services/validaPermissao";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import Swal from "sweetalert2";
import cep from "cep-promise";
interface interfProps {
    token?: string;
}
// export default function Login() {
//     const refForm = useRef<any>();

//     const router = useRouter();

//     const { logar } = useContext(AutenticacaoContext);

//     const submitForm = useCallback((e: FormEvent) => {
//         //não renderiza a pagina quando executa o submit do formulario
//         e.preventDefault();

//         if (refForm.current.checkValidity()) {
//             let obj: any = new Object();

//             for (let index = 0; index < refForm.current.length; index++) {
//                 const id = refForm.current[index]?.id;
//                 const value = refForm.current[index]?.value;

//                 if (id === "botao") break;
//                 obj[id] = value;
//             }
//             logar(obj);
//         } else {
//             refForm.current.classList.add("was-validated");
//         }
//     }, []);



export default function Usuario(props: interfProps) {

    const router = useRouter();

    const refForm = useRef<any>();

    const { id } = router.query;

    const [estaEditando, setEstaEditando] = useState(false);



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
                    refForm.current['cpf'].value = res.data?.cpf || '';
                    refForm.current['bairro'].value = res.data?.bairro || '';
                    refForm.current['endereco'].value = res.data?.endereco || '';
                    refForm.current['numero'].value = res.data?.numero || '';
                    refForm.current['cep'].value = res.data?.cep || '';
                    refForm.current['estado'].value = res.data?.estado || '';
                    refForm.current['cidade'].value = res.data?.cidade || '';
                    refForm.current['password'].value = res.data?.password || '';
                }

            }).catch((erro) => {
                console.log(erro);
            })
        }
    }, [])

    const submitForm = useCallback((e: FormEvent) => {
        <script src="sweetalert2.all.min.js"></script>
        e.preventDefault();

        if (refForm.current.checkValidity()) {

            let obj: any = new Object;

            for (let index = 0; index < refForm.current.length; index++) {
                const id = refForm.current[index]?.id;
                const value = refForm.current[index]?.value;

                if(id === 'botao') break;
                obj[id] = value;

            }

            api.post('/registro/', obj, {

            })
            .then((res) =>
            {
                router.push('/login');

                Swal.fire(
                    'Cadastrado com Sucesso!',
                    'Click em OK, e faça o Login!',
                    'success'
                  )
                // alert("Usuario Cadastrado com Sucesso!");

            }).catch((erro) => {
                console.log(erro);
            });

        } else {
            refForm.current.classList.add('was-validated');
        }
    }, [])

    function setLocalidade(bairro: string, cidade: string, estado: string, endereco: string) {
        refForm.current['bairro'].value = bairro;
        refForm.current['cidade'].value = cidade;
        refForm.current['estado'].value = estado;
        refForm.current['endereco'].value = endereco;
        refForm.current['numero'].focus();
    }

    return (
        <>
            <script src="sweetalert2.min.js"></script>
            <link rel="stylesheet" href="sweetalert2.min.css"></link>

            <Head>
                <title>Registro</title>
            </Head>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100vw",
                    height: "100vh",
                }}
                className="back-login"
            >
                <div
                    style={{
                        border: 2,
                        borderColor: "#ccc",
                        borderStyle: "solid",
                        borderRadius: 8,
                        padding: 20,
                        maxWidth: 800,
                    }}
                    className="back-painel-login"
                >
                    <div
                        style={{
                            alignItems: "center",
                        }}
                        className="log-login"
                    >
                        <img src="img/log-login.png" alt="" />
                        {/* <h1 style={{ color: "#0d6efd" }}>Login</h1> */}
                        <p  style={{
                                color: "#0d6efd",
                                fontSize: "18px",
                                fontWeight: "bolder"
                            }}>Cadastre seus dados para entrar no sistema, e conseguir votar!</p>
                    </div>
                    <hr />
                    <form
                        className="row g-3 needs-validation"
                        noValidate
                        ref={refForm}
                    >
                        <div className=" d-flex col-md-12">
                            <div className="p-1 col-md-6">
                                <label htmlFor="nome" className="form-label">
                                    Nome
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="nome"
                                        className="form-control"
                                        placeholder="Digite o nome"
                                        id="nome"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite seu nome.
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 col-md-3">
                                <label htmlFor="telefone" className="form-label">
                                    Telefone
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Digite o telefone"
                                        id="telefone"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite seu Telefone.
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 col-md-3">
                                <label htmlFor="cpf" className="form-label">
                                    CPF
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Digite o cpf"
                                        id="cpf"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite seu CPF.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex col-md-12">
                            <div className="p-1 col-md-3">
                                <label htmlFor="cep" className="form-label">
                                    CEP
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="cep"
                                        className="form-control"
                                        placeholder="Digite o cep"
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
                                    <div className="invalid-feedback">
                                        Por favor, digite seu CEP.
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 col-md-3">
                                <label htmlFor="estado" className="form-label">
                                    Estado
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Digite o estado"
                                        id="estado"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite seu Estado.
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 col-md-3">
                                <label htmlFor="cidade" className="form-label">
                                    Cidade
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="cidade"
                                        className="form-control"
                                        placeholder="Digite a cidade"
                                        id="cidade"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite sua Cidade.
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 col-md-3">
                                <label htmlFor="bairro" className="form-label">
                                    Bairro
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="bairro"
                                        className="form-control"
                                        placeholder="Digite o bairro"
                                        id="bairro"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite seu Bairro.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex col-md-12">
                            <div className="p-1 col-md-9">
                                <label htmlFor="endereco" className="form-label">
                                    Endereço
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Digite o endereço"
                                        id="endereco"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite seu Endereço.
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 col-md-3">
                                <label htmlFor="numero" className="form-label">
                                    Numero
                                </label>
                                <div className="input-group has-validation">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Digite o numero"
                                        id="numero"
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Por favor, digite seu Numero.
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="d-flex col-md-12">
                        <div className="p-1 col-md-6">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <div className="input-group has-validation">
                                <span className="input-group-text">
                                    <BsEnvelope />
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Digite seu email"
                                    id="email"
                                    required
                                />
                                <div className="invalid-feedback">
                                    Por favor, digite seu email.
                                </div>
                            </div>
                        </div>
                        <div className="p-1 col-md-6">
                            <label htmlFor="password" className="form-label">
                                Senha
                            </label>
                            <div className="input-group has-validation">
                                <span className="input-group-text">
                                    <BsKey />
                                </span>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Digite sua senha"
                                    id="password"
                                    required
                                />
                                <div className="invalid-feedback">
                                    Por favor, digite sua senha.
                                </div>
                            </div>
                        </div>
                        </div>

                        <div className="d-flex col-md-12">
                            <div className="col-md-6 col-button">
                                <button
                                    className="btn btn-success mt-3 form-control rounded-pill"
                                    type="button"
                                    id="botao"
                                    onClick={(e) => submitForm(e)}
                                >
                                    Registrar <BsCheckLg />
                                </button>
                            </div>
                            <div className="col-md-6 col-button">
                                <button
                                    className="btn btn-secondary mt-3 form-control rounded-pill"
                                    type="button"
                                    id="botao"
                                    onClick={() => router.push('/login')}
                                >
                                    Voltar <BsArrowLeft />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
