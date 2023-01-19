import { Input as NativeBaseInput, IInputProps } from 'native-base';

const Input = ({ ...rest }: IInputProps) => {
    return (
        <NativeBaseInput 
            bgColor = 'gray.700'
            h = {14}
            px = {4}
            borderWidth = {0}
            fontSize = 'md'
            color = 'white'
            fontFamily = 'body'
            mb = {4}
            placeholderTextColor = 'gray.300'
            _focus = {{
                bgColor: 'gray.700',
                borderWidth: 1,
                borderColor: 'green.500'
            }}
            {...rest}
        />
    )
}

export default Input;