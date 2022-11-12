import { useContext } from "react";

import { AuthContext, AuthContextDataProps} from "../contexts/AuthContext";

export function useAuth(): AuthContextDataProps {
    const context = useContext(AuthContext);

    return context;
}

// esse hook é utilizado para não precisar ficar chamando o useContext em varios 
// lugares da aplicação