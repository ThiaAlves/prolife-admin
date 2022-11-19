import 'bootstrap/dist/css/bootstrap.min.css';
import { AutenticacaoProvider, UsuariosProvider } from '../contexts';
import './../styles/styles.css';

function MyApp({ Component, pageProps }) {
    return (
        <AutenticacaoProvider>
            <UsuariosProvider>
                <Component {...pageProps} />
            </UsuariosProvider>
        </AutenticacaoProvider>
    )
}

export default MyApp
