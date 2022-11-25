// Configuração do Datatable 

import { ReactNode } from "react";

// Path: src\components\Menu\Config\index.tsx

interface InterfProps {
    children: ReactNode;
    active: string;
    token?: string;
}

export const Options = {
    filterType: "dropdown",
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30],
    selectableRows: "none",
    textLabels: {
        body: {
            noMatch: "Desculpe, não há registros para exibir",
            toolTip: "Ordenar",
            columnHeaderTooltip: (column) => `Ordenar por ${column.label}`,
        },
        pagination: {
            next: "Próxima Página",
            previous: "Página Anterior",
            rowsPerPage: "Linhas por Página:",
            displayRows: "de",
        },
        toolbar: {
            search: "Pesquisar",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Ver Colunas",
            filterTable: "Filtrar Tabela",
        },
        filter: {
            all: "Todos",
            title: "FILTROS",
            reset: "RESETAR",
        },
        viewColumns: {
            title: "Mostrar Colunas",
            titleAria: "Mostrar/Ocultar Colunas da Tabela",
        },
        selectedRows: {
            text: "linha(s) selecionada(s)",
            delete: "Excluir",
            deleteAria: "Excluir Linhas Selecionadas",
        },
    },
};