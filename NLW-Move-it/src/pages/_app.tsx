import "../styles/global.css";

import { ChallengesProvider } from "../contexts/ChallengesContexts";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

//como o app fica envolta de toda a aplicação todos os componentes
//terão acesso ao contexto
