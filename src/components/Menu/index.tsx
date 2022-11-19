import Link from "next/link";
import { ReactNode } from "react"
import { validaPermissao } from "../../services/validaPermissao";
import { destroyCookie } from 'nookies'
import { BsPieChartFill, BsFillPersonFill, BsDoorOpen, BsSearch, BsFillQuestionCircleFill, BsCheck2Circle } from 'react-icons/bs';

interface InterfProps {
    children: ReactNode;
    active: string;
    token?: string;
}

export const Menu = ({
    children,
    active,
    token
}: InterfProps) => {


    return (
        <>
            <header
                className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow"
            >
                <a
                    className="navbar-brand col-md-3 col-lg-2 me-0 px-3"
                >
                    Angle - Admin
                </a>

                <div
                    className="navbar-nav"
                >
                    <div
                        className="nav-item text-nowrap"
                    >
                        <a
                            className="nav-link px-3"
                            href=""
                            onClick={() => { destroyCookie(null, 'painel-token') }}
                        ><BsDoorOpen /> Sair</a>
                    </div>
                </div>
            </header>

            <div
                className="container-fluid"
            >
                <div
                    className="row"
                >
                    <nav
                        id="sidebarMenu"
                        className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
                    >
                        <ul
                            className="nav flex-column"
                        >
                            {
                                validaPermissao(token, ['admin', 'colaborador']) &&
                                <li
                                    className="nav-item pt-4"
                                >
                                    <Link href={'/dashboard'}>
                                        <a
                                            className={`nav-link ${active === 'dashboard' && 'active'}`}
                                        >
                                            <BsPieChartFill /> Dashboard
                                        </a>
                                    </Link>
                                </li>
                            }

                            {validaPermissao(token, ['admin', 'colaborador']) &&
                                <li
                                    className="nav-item"
                                >
                                    <Link href={'/pesquisa'}>
                                        <a
                                            className={`nav-link ${active === 'pesquisa' && 'active'}`}
                                        >
                                            <BsSearch /> Pesquisas
                                        </a>
                                    </Link>
                                </li>
                            }

                            {validaPermissao(token, ['admin', 'colaborador']) &&
                                <li
                                    className="nav-item"
                                >
                                    <Link href={'/resposta'}>
                                        <a
                                            className={`nav-link ${active === 'resposta' && 'active'}`}
                                        >
                                            <BsFillQuestionCircleFill /> Respostas
                                        </a>
                                    </Link>
                                </li>
                            }
                            {validaPermissao(token, ['admin', 'colaborador', 'cliente']) &&
                                <li
                                    className="nav-item"
                                >
                                    <Link href={'/respondidas'}>
                                        <a
                                            className={`nav-link ${active === 'minhas-respostas' && 'active'}`}
                                        >
                                            <BsCheck2Circle /> Respondidas
                                        </a>
                                    </Link>
                                </li>
                            }

                            {validaPermissao(token, ['admin']) &&
                                <li
                                    className="nav-item"
                                >
                                    <Link href={'/usuario'}>
                                        <a
                                            className={`nav-link ${active === 'usuario' && 'active'}`}
                                        >
                                            <BsFillPersonFill /> Usuário
                                        </a>
                                    </Link>
                                </li>
                            }
                        </ul>
                    </nav>
                    <main
                        className="col-md-9 ms-sm-auto col-lg-10 px-md-4"
                    >
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}
