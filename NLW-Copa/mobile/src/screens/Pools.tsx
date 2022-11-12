import { Icon, VStack } from "native-base";
import { Octicons } from "@expo/vector-icons";

import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function Pools(){
    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" mb={4} pb={4}>
            {/* utilizamos o <Icon/> para ter acesso aos tokens de cores e tamanho do native base */}
                <Button title="BUSCAR BOLÃO POR CÓDIGO" leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />} />
            </VStack>
        </VStack>
    )
}