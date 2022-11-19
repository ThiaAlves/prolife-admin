import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import api from "../services/request";


export interface InterfaceEditarRespostas {
    editar: boolean;
    pesquisa: InterDados | null;
}

interface InterDados {
    titulo: ReactNode;
    descricao1: ReactNode;
    id: number;
    pessoa: string;
    pesquisa: string;
    respostas: string;
    status_resposta: string;
}

export type PropsRespostasInput = Omit<InterDados, 'id'>

interface InterRespostasContext {
    Respostas: Array<InterDados>;
    criarRespostas: (data: PropsRespostasInput) => Promise<void>;
    editarRespostas: InterfaceEditarRespostas;
    funEditarRespostas: (data: InterfaceEditarRespostas) => void;
    valoresPadraoEditarRespostas: () => void;
    atualizarRespostas: (data: InterDados) => Promise<void>;
    deletarRespostas: (data: InterDados) => Promise<any>;
}

export const RespostasContext = createContext({} as InterRespostasContext);

interface InterProviderProps {
    children: ReactNode;
}
export function RespostasProvider({ children }: InterProviderProps) {
    const cookies = parseCookies()
    const [Respostas, setRespostas] = useState<Array<InterDados>>([]);
    const [editarRespostas, setEditarRespostas] = useState<InterfaceEditarRespostas>({
        editar: false, pesquisa: null
    });

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${cookies['painel-token']}`,
            },
        };

        api.get("/respostas", config).then((res) => {
            setRespostas(res.data);
        });

    }, [])

    async function atualizarRespostas(data: InterDados) {
        await api.put('/respostas', data)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/respostas').then((res) => {

            setRespostas(res.data)

        })

    }

    async function deletarRespostas(data: InterDados) {
        const id = data.id ? data.id : null;

        await api.delete(`/respostas/${id}`)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/respostas').then((resposta) => {

            setRespostas(resposta.data)

        })

    }

    function valoresPadraoEditarRespostas() {
        setEditarRespostas({ editar: false, pesquisa: null })
    }

    function funEditarRespostas(data: InterfaceEditarRespostas) {
        setEditarRespostas(data)
    }

    async function criarRespostas(data: PropsRespostasInput) {

        await api.post('/respostas', data)
            .then((res) => {

            })

        await api.get('/respostas').then((resposta) => {
            setRespostas(resposta.data)

        })


    }

    return (
        <RespostasContext.Provider value={{
        Respostas, criarRespostas,
        atualizarRespostas,
        funEditarRespostas, editarRespostas,
        valoresPadraoEditarRespostas, deletarRespostas,
        }}>
            {children}
        </RespostasContext.Provider>
    );
}
