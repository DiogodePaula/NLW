// JSX - Javascript + XML (HTML)
// TSX - Typescript + JSX
// NEXT - SERVER SIDE RENDER, O NEXT TRAZ JUNTO CONSIGO UM SERVIDOR NODE COM UMA 
// FUNÇÃO MUITO ESPECIFICA DE TRAZER INDEXAÇÃO PARA SITE CRIADO, MESMO QUE UM CROWLER
// DE BUSCA ACESSE NOSSO SITE COM O JAVASCRIPT DESATIVADO SSR VAI ENTREGAR TODO O CONTEUDO.

interface HomeProps {
  count: number
}

export default function Home(props: HomeProps) {  

  return <h1>Contagem: {props.count}</h1>
}

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3333/pools/count')
  const data = await res.json()  
  
  return {
    props:{
      count: data.count,
    }
  }
}
