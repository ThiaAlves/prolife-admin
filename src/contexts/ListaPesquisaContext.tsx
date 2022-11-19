import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import api from "../services/request";


export interface InterfaceEditarPesquisas {
    editar: boolean;
    pesquisa: InterDados | null;
}

interface InterDados {
    titulo: ReactNode;
    descricao1: ReactNode;
    id: number;
    tema: string;
    descricao: string;
    perguntas: string;
    status: string;
    created_at: string;
}

export type PropsPesquisasInput = Omit<InterDados, 'id'>

interface InterPesquisasContext {
    Pesquisas: Array<InterDados>;
    tema: string;
    criarPesquisas: (data: PropsPesquisasInput) => Promise<void>;
    editarPesquisas: InterfaceEditarPesquisas;
    funEditarPesquisas: (data: InterfaceEditarPesquisas) => void;
    valoresPadraoEditarPesquisas: () => void;
    atualizarPesquisas: (data: InterDados) => Promise<void>;
    deletarPesquisas: (data: InterDados) => Promise<any>;
}

export const PesquisasContext = createContext({} as InterPesquisasContext);

interface InterProviderProps {
    children: ReactNode;
}
export function PesquisasProvider({ children }: InterProviderProps) {
    const cookies = parseCookies()
    const [Pesquisas, setPesquisas] = useState<Array<InterDados>>([]);
    const [editarPesquisas, setEditarPesquisas] = useState<InterfaceEditarPesquisas>({
        editar: false, pesquisa: null
    });

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${cookies['painel-token']}`,
            },
        };

        api.get("/pesquisas", config).then((res) => {
            setPesquisas(res.data);
        });

    }, [])

    async function atualizarPesquisas(data: InterDados) {
        await api.put('/pesquisas', data)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/pesquisas').then((res) => {

            setPesquisas(res.data)

        })

    }

    async function deletarPesquisas(data: InterDados) {
        const id = data.id ? data.id : null;

        await api.delete(`/pesquisas/${id}`)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/pesquisas').then((resposta) => {

            setPesquisas(resposta.data)

        })

    }

    function valoresPadraoEditarPesquisas() {
        setEditarPesquisas({ editar: false, pesquisa: null })
    }

    function funEditarPesquisas(data: InterfaceEditarPesquisas) {
        setEditarPesquisas(data)
    }

    async function criarPesquisas(data: PropsPesquisasInput) {

        await api.post('/pesquisas', data)
            .then((res) => {

            })

        await api.get('/pesquisas').then((resposta) => {
            setPesquisas(resposta.data)

        })


    }

    return (
        <PesquisasContext.Provider value={{
        Pesquisas, criarPesquisas,
        tema: "Pesquisas",
        atualizarPesquisas,
        funEditarPesquisas, editarPesquisas,
        valoresPadraoEditarPesquisas, deletarPesquisas,
        }}>
            {children}
        </PesquisasContext.Provider>
    );
}
