import { useCallback, useState } from "react";
import { Icon, useToast, VStack, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../services/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList"; 

export function Pools(){
    const { navigate } = useNavigation();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ pools, setPools ] = useState<PoolCardProps[]>([]);
    const toast = useToast();

    async function fetchPools(){
        try {
            setIsLoading(true);
            const response = await api.get('/pools');
            setPools(response.data.pools)
        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: 'top',
                bgColor: 'red.500',
            })
        } finally {
            setIsLoading(false);
        }
    }

    // useFocusEffect vai executar sempre que a interface receber o foco/entrar
    // useCallback garante que essa função não seja executada múltiplas vezes, guarda uma referencia da função
    useFocusEffect(useCallback(() => {
        fetchPools();
    },[]));

    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" mb={4} pb={4}>
            {/* utilizamos o <Icon/> para ter acesso aos tokens de cores e tamanho do native base */}
                <Button title="BUSCAR BOLÃO POR CÓDIGO" 
                leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />} 
                onPress={() => navigate("find")}
                />
            </VStack>

            {
                isLoading ? <Loading  /> :
                <FlatList 
                data={pools}
                keyExtractor={item => item.id}
                renderItem={({item}) => <PoolCard data={item} onPress={() => navigate("details", { id: item.id })} />}
                px={5}
                showsVerticalScrollIndicator={false}
                _contentContainerStyle={{ pb: 10 }}
                ListEmptyComponent={() => <EmptyPoolList />}
                />
            }
            
        </VStack>
    )
}