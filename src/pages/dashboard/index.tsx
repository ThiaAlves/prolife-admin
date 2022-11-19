import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { Menu } from "../../components/Menu";
import { validaPermissao } from "../../services/validaPermissao";

interface interfProps {
    token?: string;
}

export default function Dashboard(props: interfProps) {

    return(
        <>
            <Head>
                <title>Dashboard</title>
            </Head>

            <Menu
                active="dashboard"
                token={props.token}
            >
                <>
                    <div
                        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4 pb-2 mb-3 border-bottom"
                    >
                        <h2>Dashboard</h2>
                    </div>
                    <div className="row">
                        <div className="col-md-3 rounded shadow-lg">
                        <iframe src="http://187.87.223.235:3000/d-solo/B-Wjqp3nk/dashboard-angle?orgId=1&from=1656351616091&to=1656373216091&panelId=2" width="100%" height="100%"></iframe>
                        </div>
                        <div className="col-md-3 rounded shadow-lg">
                        <iframe src="http://187.87.223.235:3000/d-solo/B-Wjqp3nk/dashboard-angle?orgId=1&from=1656352010147&to=1656373610147&panelId=5" width="100%" height="100%"></iframe>
                        </div>
                        <div className="col-md-3 rounded shadow-lg">
                        <iframe src="http://187.87.223.235:3000/d-solo/B-Wjqp3nk/dashboard-angle?orgId=1&from=1656352116675&to=1656373716675&panelId=4" width="100%" height="100%"></iframe>
                        </div>
                        <div className="col-md-3 rounded shadow-lg">
                        <iframe src="http://187.87.223.235:3000/d-solo/B-Wjqp3nk/dashboard-angle?orgId=1&from=1656352165658&to=1656373765658&panelId=3" width="100%" height="100%"></iframe>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <div className="col-md-8 rounded shadow-lg">
                        <iframe src="http://187.87.223.235:3000/d-solo/B-Wjqp3nk/dashboard-angle?orgId=1&from=1656352325841&to=1656373925841&panelId=7" width="100%" height="400px"></iframe>
                        </div>
                        <div className="col-md-4 rounded shadow-lg">
                        <iframe src="http://187.87.223.235:3000/d-solo/B-Wjqp3nk/dashboard-angle?orgId=1&from=1656352362882&to=1656373962882&panelId=9" width="100%" height="400px"></iframe>
                            </div>
                    </div>
                    <div className="row pt-3">
                        <div className="col-md-12 rounded shadow-lg">
                        <iframe src="http://187.87.223.235:3000/d-solo/B-Wjqp3nk/dashboard-angle?orgId=1&from=1656354198122&to=1656375798122&panelId=11" width="100%" height="1000px"></iframe>
                        </div>
                    </div>
                </>
            </Menu>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (contexto) => {

    const {'painel-token': token} = parseCookies(contexto);

    console.log(token)

    if (!token) {
        return {
            redirect: {
                destination: '/login',
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
