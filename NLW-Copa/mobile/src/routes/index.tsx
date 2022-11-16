import { Box } from "native-base";
import { NavigationContainer } from "@react-navigation/native"

import { useAuth } from "../hooks/useAuth" 

import { AppRoutes } from "./app.routes"
import { SignIn } from "../screens/SignIn"

export function Routes(){
    const { user } = useAuth();

    return(
        // essa box em volta garante que não pareça a tela em branco durante uma transição
        <Box flex={1} bg="gray.900"> 
            <NavigationContainer>
                { user.name ? <AppRoutes /> : <SignIn /> }
            </NavigationContainer>
        </Box>
    )
}