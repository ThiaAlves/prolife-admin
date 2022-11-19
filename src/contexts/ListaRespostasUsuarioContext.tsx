import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import api from "../services/request";


export interface InterfaceEditarRespostasUsuario {
    editar: boolean;
    usuario: InterDados | null;
}

interface InterDados {
    id_resposta?: number;
    nome_pessoa?: string;
    id_pessoa?: number;
    tema_pesquisa?: string;
    id_pesquisa?: number;
    perguntas?: string;
    respostas?: string;
    status_resposta?: string;
}

export type PropsUsuariosInput = Omit<InterDados, 'id'>

interface InterUsuariosContext {
    respostasUsuarios: Array<InterDados>;
    criarUsuarios: (data: PropsUsuariosInput) => Promise<void>;
    editarUsuarios: InterfaceEditarRespostasUsuario;
    funEditarUsuarios: (data: InterfaceEditarRespostasUsuario) => void;
    valoresPadraoEditarUsuarios: () => void;
    atualizarUsuarios: (data: InterDados) => Promise<void>;
    deletarUsuarios: (data: InterDados) => Promise<any>;
}

export const RespostasUsuarioContext = createContext({} as InterUsuariosContext);

interface InterProviderProps {
    children: ReactNode;
}
export function UsuariosProvider({ children }: InterProviderProps) {
    const cookies = parseCookies()
    const [respostasUsuarios, setrespostasUsuarios] = useState<Array<InterDados>>([]);
    const [editarUsuarios, setEditarUsuarios] = useState<InterfaceEditarRespostasUsuario>({
        editar: false, usuario: null
    });

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${cookies['painel-token']}`,
            },
        };

        api.get("/pessoas", config).then((res) => {
            setrespostasUsuarios(res.data);
        });

    }, [])

    async function atualizarUsuarios(data: InterDados) {
        await api.put('/pessoas', data)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/pessoas').then((res) => {

            setrespostasUsuarios(res.data)

        })

    }

    async function deletarUsuarios(data: InterDados) {
        const id = data.id_resposta ? data.id_resposta : null;

        await api.delete(`/pessoas/${id}`)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/pessoas').then((resposta) => {

            setrespostasUsuarios(resposta.data)

        })

    }

    function valoresPadraoEditarUsuarios() {
        setEditarUsuarios({ editar: false, usuario: null })
    }

    function funEditarUsuarios(data: InterfaceEditarRespostasUsuario) {
        setEditarUsuarios(data)
    }

    async function criarUsuarios(data: PropsUsuariosInput) {

        await api.post('/pessoas', data)
            .then((res) => {

            })

        await api.get('/pessoas').then((resposta) => {
            setrespostasUsuarios(resposta.data)

        })


    }

    return (
        <RespostasUsuarioContext.Provider value={{
        respostasUsuarios, criarUsuarios,
        atualizarUsuarios,
        funEditarUsuarios, editarUsuarios,
        valoresPadraoEditarUsuarios, deletarUsuarios,
        }}>
            {children}
        </RespostasUsuarioContext.Provider>
    );
}
