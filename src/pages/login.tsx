import Head from "next/head";
import { FormEvent, useCallback, useContext, useRef } from "react";
import { AutenticacaoContext } from "../contexts/AutenticacaoContext";
import { BsArrowRight, BsCardImage, BsCardText, BsKey } from "react-icons/bs";
import { useRouter } from 'next/router';
import Swal from "sweetalert2";

export default function Login() {
    const refForm = useRef<any>();

    const router = useRouter();

    const { logar } = useContext(AutenticacaoContext);

    const submitForm = useCallback((e: FormEvent) => {
        //não renderiza a pagina quando executa o submit do formulario
        e.preventDefault();

        if (refForm.current.checkValidity()) {
            let obj: any = new Object();


            for (let index = 0; index < refForm.current.length; index++) {
                const id = refForm.current[index]?.id;
                const value = refForm.current[index]?.value;

                if (id === "botao") break;
                obj[id] = value;

            }
            logar(obj);

        } else {
            refForm.current.classList.add("was-validated");
        }
    }, []);

    return (
        <>
            <Head>
                <title>Login</title>
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
                        borderRadius: 15,
                        padding: 20,
                        maxWidth: 400,
                        boxShadow: "40px rgba(0,0,0,0.5)",
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
                        {/* <p>Digite seus dados para entrar no sistema!</p> */}
                    </div>
                    <form
                        className="row g-3 needs-validation"
                        noValidate
                        ref={refForm}
                    >
                        <div className="col-md-12">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <div className="input-group has-validation">
                                <span className="input-group-text">@</span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Digite o email"
                                    id="email"
                                    required
                                />
                                <div className="invalid-feedback">
                                    Por favor, digite seu email.
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="senha" className="form-label">
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
                                    id="senha"
                                    required
                                />
                                <div className="invalid-feedback">
                                    Por favor, digite sua senha.
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 d-flex">
                            <div className="col-md-12 col-button">
                                <button
                                    className="btn btn-success mt-3 form-control"
                                    type="submit"
                                    id="botao"
                                    onClick={(e) => submitForm(e)}
                                >
                                    Entrar <BsArrowRight />
                                </button>
                            </div>
                            {/* <div className="col-md-6 col-button">
                                <button
                                    className="btn btn-warning mt-3 form-control rounded-pill"
                                    type="button"
                                    id="botao"
                                    onClick={() => router.push('/registro')}
                                >
                                    Registrar <BsCardText />
                                </button>
                            </div> */}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
