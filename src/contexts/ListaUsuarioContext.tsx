import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import api from "../services/request";


export interface InterfaceEditarUsuarios {
    editar: boolean;
    usuario: InterDados | null;
}

interface InterDados {
    titulo: ReactNode;
    descricao: ReactNode;
    id: number;
    nome: string;
    tipo: string;
    email: string;
    telefone: string;
    cpf: string;
    endereco: string;
    bairro: string;
    numero: string;
}

export type PropsUsuariosInput = Omit<InterDados, 'id'>

interface InterUsuariosContext {
    usuarios: Array<InterDados>;
    criarUsuarios: (data: PropsUsuariosInput) => Promise<void>;
    editarUsuarios: InterfaceEditarUsuarios;
    funEditarUsuarios: (data: InterfaceEditarUsuarios) => void;
    valoresPadraoEditarUsuarios: () => void;
    atualizarUsuarios: (data: InterDados) => Promise<void>;
    deletarUsuarios: (data: InterDados) => Promise<any>;
}

export const UsuariosContext = createContext({} as InterUsuariosContext);

interface InterProviderProps {
    children: ReactNode;
}
export function UsuariosProvider({ children }: InterProviderProps) {
    const cookies = parseCookies()
    const [usuarios, setUsuarios] = useState<Array<InterDados>>([]);
    const [editarUsuarios, setEditarUsuarios] = useState<InterfaceEditarUsuarios>({
        editar: false, usuario: null
    });

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${cookies['painel-token']}`,
            },
        };

        api.get("/pessoas", config).then((res) => {
            setUsuarios(res.data);
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

            setUsuarios(res.data)

        })

    }

    async function deletarUsuarios(data: InterDados) {
        const id = data.id ? data.id : null;

        await api.delete(`/pessoas/${id}`)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })

        await api.get('/pessoas').then((resposta) => {

            setUsuarios(resposta.data)

        })

    }

    function valoresPadraoEditarUsuarios() {
        setEditarUsuarios({ editar: false, usuario: null })
    }

    function funEditarUsuarios(data: InterfaceEditarUsuarios) {
        setEditarUsuarios(data)
    }

    async function criarUsuarios(data: PropsUsuariosInput) {

        await api.post('/pessoas', data)
            .then((res) => {

            })

        await api.get('/pessoas').then((resposta) => {
            setUsuarios(resposta.data)

        })


    }

    return (
        <UsuariosContext.Provider value={{
        usuarios, criarUsuarios,
        atualizarUsuarios,
        funEditarUsuarios, editarUsuarios,
        valoresPadraoEditarUsuarios, deletarUsuarios,
        }}>
            {children}
        </UsuariosContext.Provider>
    );
}
