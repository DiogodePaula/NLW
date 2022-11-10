import { Button as ButtonNativeBase, Text, IButtonProps } from "native-base";

// IButtonProps são as propriedades do botão dando extends temos elas no componente
interface Props extends IButtonProps {
  title: string;
  type?: 'PRIMARY' | 'SECONDARY';
}
// ...rest = qualquer outra propriedade quer for implícita pode passar para o componente
// importante que ele venha por ultimo
export function Button({ title, type = 'PRIMARY', ...rest }: Props){
    return (
        <ButtonNativeBase 
        w="full"
        h={14}
        rounded="md"
        fontSize="md"
        textTransform="uppercase"
        bg={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
        _pressed={{
            bg: type === 'SECONDARY' ? 'red.600' : 'yellow.600'
        }}
        _loading={{
            _spinner: { color: 'black'}
        }}
        {...rest}>
            <Text 
            fontSize="sm"
            fontFamily="heading"
            color={type === 'SECONDARY' ? 'white' : 'black'}
            >
                {title}
            </Text>
        </ButtonNativeBase>
    )
}