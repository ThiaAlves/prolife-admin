import { useRouter } from "next/router"

export default function Dashboard() {

    const router = useRouter()
    const {id} = router.query;
    return(
        <>
            <h1>Dashboard - {id}</h1>
        </>
    )
}
