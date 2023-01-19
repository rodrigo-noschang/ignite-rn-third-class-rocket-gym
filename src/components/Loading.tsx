import { Spinner, Center } from 'native-base';

const Loading = () => {

    return (
        <Center flex = {1} bgColor = 'gray.700'>
            <Spinner color = 'green.500'/>
        </Center>
    )
}

export default Loading;