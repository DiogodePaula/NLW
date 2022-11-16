import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session"; // import com * pega tudo da importação
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api" 

WebBrowser.maybeCompleteAuthSession(); // garantir redirecionamento

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps{
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps){
    const [ user, setUser ] = useState<UserProps>({} as UserProps);
    const [ isUserLoading, setIsUserLoading ] = useState(false);

    // promptAsync permite que se inicie o fluxo de autenticação
    const [ req, res, promptAsync ] = Google.useAuthRequest({
        clientId: '807639756725-68ohb7slafsj1filrmomimqot6knkr76.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    })

    
    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();
        } catch (error) {
            console.log(error)
            throw error;
        } finally {            
            setIsUserLoading(false);
        }
    }
    
    async function signInWithGoogle(access_token: string) {
        // console.log("tOKEN DE AUTENTICAÇÃO =>", access_token)
        try {
            setIsUserLoading(true);
            
            const tokenResponse = await api.post('/users', {access_token});
            // todas as requisições que esse usuário for fazer ele está identificado
            api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

            const userInfoResponse = await api.get("/me");
            setUser(userInfoResponse.data.user);
            
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    useEffect(() => {
        if(res?.type === 'success' && res.authentication?.accessToken){
            signInWithGoogle(res.authentication.accessToken)
        }

    }, [res])

    return (
        <AuthContext.Provider value={{ signIn, isUserLoading, user }}>
            { children }    
        </AuthContext.Provider>
    )
}

// passos para logar com o google
// 1 - cadastrar a aplicação no google IDP (identity Provider) acessar: https://console.cloud.google.com
// 2 - usuário é redirecionado para a pagina do google onde ele é 
// validado e se for o google devolve um token de autenticação no browser
// 3 - precisa pegar esse token e redirecionar o usuario de volta para a aplicação
//  console.log(AuthSession.makeRedirectUri({ useProxy: true })); // mostra o caminho de redirecionamento 
// para configurar no google  