import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import api from "../services/request";


export interface InterfaceEditarClinicas {
    editar: boolean;
    clinica: InterDados | null;
}

interface InterDados { 
    id: number;
    nome: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    latitude: string;
    longitude: string;
    status: string;
}

export type PropsClinicasInput = Omit<InterDados, 'id'>

interface InterClinicasContext {
    clinicas: Array<InterDados>;
    criarClinicas: (data: PropsClinicasInput) => Promise<void>;
    editarClinicas: InterfaceEditarClinicas;
    funEditarClinicas: (data: InterfaceEditarClinicas) => void;
    valoresPadraoEditarClinicas: () => void;
    atualizarClinicas: (data: InterDados) => Promise<void>;
    deletarClinicas: (data: InterDados) => Promise<any>;
}

export const ClinicasContext = createContext({} as InterClinicasContext);

interface InterProviderProps {
    children: ReactNode;
}
export function ClinicasProvider({ children }: InterProviderProps) {
    const cookies = parseCookies()
    const [clinicas, setClinicas] = useState<Array<InterDados>>([]);
    const [editarClinicas, setEditarClinicas] = useState<InterfaceEditarClinicas>({
        editar: false, clinica: null
    });

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${cookies['painel-token']}`,
            },
        };

        api.get("/Clinicas", config).then((res) => {
            setClinicas(res.data);
        });

    }, [])

    async function atualizarClinicas(data: InterDados) {
        await api.put('/Clinicas', data)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/Clinicas').then((res) => {

            setClinicas(res.data)

        })

    }

    async function deletarClinicas(data: InterDados) {
        const id = data.id ? data.id : null;

        await api.delete(`/Clinicas/${id}`)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/Clinicas').then((resposta) => {

            setClinicas(resposta.data)

        })

    }

    function valoresPadraoEditarClinicas() {
        setEditarClinicas({ editar: false, clinica: null })
    }

    function funEditarClinicas(data: InterfaceEditarClinicas) {
        setEditarClinicas(data)
    }

    async function criarClinicas(data: PropsClinicasInput) {

        await api.post('/Clinicas', data)
            .then((res) => {

            })

        await api.get('/Clinicas').then((resposta) => {
            setClinicas(resposta.data)

        })


    }

    return (
        <ClinicasContext.Provider value={{
        clinicas, criarClinicas,
        atualizarClinicas,
        funEditarClinicas, editarClinicas,
        valoresPadraoEditarClinicas, deletarClinicas,
        }}>
            {children}
        </ClinicasContext.Provider>
    );
}
