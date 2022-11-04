// JSX - Javascript + XML (HTML)
// TSX - Typescript + JSX
// NEXT - SERVER SIDE RENDER, O NEXT TRAZ JUNTO CONSIGO UM SERVIDOR NODE COM UMA 
// FUNÇÃO MUITO ESPECIFICA DE TRAZER INDEXAÇÃO PARA SITE CRIADO, MESMO QUE UM CROWLER
// DE BUSCA ACESSE NOSSO SITE COM O JAVASCRIPT DESATIVADO SSR VAI ENTREGAR TODO O CONTEUDO.
import Image from 'next/image'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

import logo from '../assets/logo.svg'
import imageBanner from '../assets/phones.png'
import avatarImage from '../assets/avatares.png'
import iconChecked from '../assets/icon-checked.svg'

interface HomeProps {
    pollCount: number;
    guessCount: number;
    usersCount: number;
}

export default function Home(props: HomeProps) {  
    const [poolTitle, setPoolTitle] = useState('')

    async function createPool(event: FormEvent){
        event.preventDefault();

        try {
            const res = await api.post('/pools', {
                title: poolTitle,
            })
            
            const { code } = res.data
            navigator.clipboard.writeText(code) // JA DEIXA O CÓDIGO DO BOLÃO SALVA NO AREA DE TRANSFERÊNCIA 
            alert('Bolão foi criado com sucesso, o código foi copiado para área de transferência!')
            setPoolTitle('')
        } catch (error) {
            alert('Falha ao criar o bolão, tente novamente!')
            console.log(error)
        }
    }

    return (
        <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
            <main>
                <Image src={logo} alt="NLW Copa" />
                <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
                    Crie seu próprio botão da copa e compartilhe entre amigos!
                </h1>
                {/* no TW tudo é multiplicado por 4 mt-10 == margin-top:40px */}
                <div className="mt-10 flex items-center gap-2">
                    <Image src={avatarImage} alt="Imagem de usuários" />
                    <strong className="text-gray-100 text-xl">
                        <span className="text-ignite-500">
                            +{props.usersCount}
                        </span>  pessoas ja estão usando
                    </strong>
                </div> 
                
                <form className="mt-10 flex gap-2" onSubmit={createPool}>
                    <input 
                        className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
                        type="text" 
                        placeholder="Qual o nome do seu bolão?" 
                        required 
                        onChange={event => setPoolTitle(event.target.value)}
                        value={poolTitle}
                    />
                    <button type="submit" className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold 
                    text-sm uppercase hover:bg-yellow-700">
                        Criar meu bolão
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                    Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
                </p>

                <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
                    <div className="flex items-center gap-6">
                        <Image src={iconChecked} alt="ícone de confirmação" />
                        <div className="flex flex-col ">
                            <span className="font-bold text-2xl">+{props.pollCount}</span>
                            <span>Bolões criados</span>            
                        </div>
                    </div>

                    <div className="w-px h-14 bg-gray-600"></div>

                    <div className="flex items-center gap-6">
                        <Image src={iconChecked} alt="ícone de confirmação" />
                        <div className="flex flex-col ">
                            <span className="font-bold text-2xl">+{props.guessCount}</span>
                            <span>Palpites enviados</span>            
                        </div>
                    </div>
                </div>
            </main>

            {/* o next busca otimizar as imagens baixando a qualidade */}
            <Image src={imageBanner} alt="Dois celulares" quality={100} />
        </div>
    )
}

export const getServerSideProps = async () => {
    // não é performático ja que uma chamada vai ter que esperar ser concluída para chamar a proxima
    // const poolCountResponse = await api.get('pools/count')
    // const guessCountResponse = await api.get('guesses/count')
    // const usersCountResponse = await api.get('users/count')
    
    const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
        api.get('pools/count'),
        api.get('guesses/count'),
        api.get('users/count')
    ])
  
    return {
        props:{
            pollCount: poolCountResponse.data.count,
            guessCount: guessCountResponse.data.count,
            usersCount: usersCountResponse.data.count,
        }
    }
}
// configurar o TW para SSR
// getStaticProps documentação do NEXT  