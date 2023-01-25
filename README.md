# Dia 1
# NATIVE BASE

É uma biblioteca que disponibiliza componentes padronizados para facilitar a produção do desenvolvedor.

## Instalação e Configuração:
Podemos instalar de várias formas, na criação do projeto, com o create react app, com next, etc. Nesse caso, nos interessa a instalação em um projeto Expo `já existente` (ver na documentação)

```javascript
    $ npm install native-base
    $ expo install react-native-svg@12.1.1
    $ expo install react-native-safe-area-context@3.3.2
```

Para usar no projeto, precisamos englobar todo o nosso app no componente `<NativeBaseProvider>` importado do próprop native-base.

## Usando no Projeto:
Para usar os componentes do Native base no projeto, basta importar os componentes da própria lib `native-base`, e usá-los dentro dos nossos próprios componentes, vide o `Loading.tsx`.
Em alguns casos, ainda podemos passar estilizações adicionais a esse componente, de maneira inline. Obviamente, tudo isso tá lá na doc. 
Podemos também ver os valores de cores, por exemplo, lá na seção `THEME` da documentação.

## Modificando o Tema Padrão do Native Base:
Na realidade estamos criando um tema que extende as estilizações e cores do próprio native base, veja o arquivo `src/theme`. Aqui podemos apenas "selecionar" as cores, tamanhos, fontes, etc, como também podemos adicionar novos valores para essas estilizações, como é o caso do tamanho 14, lá em `sizes` do nosso arquivo theme. Esse tamanho não existe por padrão no Native Base, mas no nosso tema, que extende o tema dele, existe.

Uma vez definidos todos os tema, precisamos passá-lo para a nossa aplicação:

```javascript
    import {THEME} from './src/theme';

    <NativeBaseProvider>
        // Aplicação theme = {THEME}
    </NativeBaseProvider>
```

## Posicionando Imagem ao fundo (Sem background-image)
Basicamente, usando a própria tag `Image do native-base`, podemos usar o `position = 'absolute'`. Dessa forma, ela fica bem alinhada ao topo, e também fica atrás de tudo que vier depois. Também tem várias propriedadezinhas que podemos alterar nessa tag, veja no componente `screens/SignIn.tsx`.

## Utilizando Logo SVG:
Na instalação do Native-Base, fizemos uma utilização de uma dependência com o svg, mas também instalaremos uma outra: `react native svg transformer`.

```shell
    $ npm i --save-dev react-native-svg-transformer
```

E também, configurá-lo, criando o arquivo `metro.config.js` e colocando aquele conteúdo lá dentro.
Depois, também podemos tipá-lo, conforme no arquivo `svg.d.ts`, para não dar erro na hora da importação

Feito isso, podemos importar o arquivo da mesma forma como importamos a imagem, mas dessa vez, usaremos essa importação como um elemetno React mesmo:

```javascript
    import LogoSVG from '@assets/logo.svg';

    // Dentro do retorno do componente:
    <LogoSVG />
```

## Variants
É uma maneira de pegar os "tipos" do botão. Podemos ter o mesmo componente mas com certos tipos diferentes, como um botão do tipo LIGHT e DARK. Para fazer essas diferenciações, não criamos uma prop específica pra isso, usamos a prop variant, que já vem estabelecidade o `IButtonProps do Native-Base`.

```javascript
    <Button title = 'Texto do botao' variant = 'outline'/>
``` 

No componente em si, pegamos como se fosse uma prop normal, e podemos usá-la para fazer verificações nas nossas estilizações

```javascript
    type Props = IButtonProps & {
        title: string
    }

    const Button = ({ title, variant, ...rest }) => {
        return (
            <ButtonNativeBase
                color = {variant === 'outline' ? '#000' : "#fff"} // por exemplo
            >
            </ButtonNativeBase>
        )
    }
``` 

E, como sempre, podemos limitar essas variaçoes, se adicionarmos a variant à tipagem do botão:

```javascript
    type Props = IButtonProps & {
        title: string,
        variant = 'solid' | 'outline'
    }
```
A partir daí, o céu é o limite

# Dia 2
# Rotas
Dessa vez, neste projeto, teremos 2 tipos de rotas, uma stack navigation, que vai migrar da tela de login, pra tela de cadastro, e vice-versa. E uma outra rota de Tab Navigation que vai existir dentro da aplicação em si. Portanto, vamos tipar as rotas de uma maneira diferente. No projeto anterior tipamos as rotas de maneira global, mas agora queremos separar uma rota da outra:

## Tipando as rotas de maneira NÃO GLOBAL
Agora, vamos criar esses tipos dentro dos arquivos de maneira específica. Primeiro criamos um tipo um as rotas que existirão naquele arquivo, no caso das rotas de autenticação (Login e Cadastro), teremos as duas rotas, que seguem:

```javascript
    type AuthRoutes = {
        signIn: undefined;
        singUp: undefined
    }
```

Basicamente estamos dizendo que existem essas duas rotas (que são os nomes/`names` das rotas existentes), e usaremos essa tipagem para tipar as props da navegação, como segue:

```javascript
    export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;
``` 

Esse tipo define os tipos das rotas de navegação em Pilha (em Stack). O elemento `NativeStackNavigationProp` é importado de `@react-navigation/native-stack`. Além disso, também podemos tipar os elementos usados na criação do createNativeStackNavigation():

```javascript
    const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();
``` 

Para a tipagem das rotas ficar completa, e de maneira não global, precisamos passar o atributo `AuthNavigatorRoutesProps` para o useNavigation, quando formos criar o objeto navigate, que nos permitirá fazer a navegação entre rotas:

```javascript
    const navigate = useNavigation<AuthNavigatorRoutesProps>();
``` 

## Criando o contexto das Rotas:
No arquivo `index.tsx` da pasta `routes`, podemos colocar todos os nossos componentes de rotas, como fihos do `NavigationContainer`, e colocar esse elemento Routes como filho do App.

## Modificando os Temas do React Navigation: 
O React Navigation tem algumas propriedades de estilização por padrão nela, que podemos modificar através do objedo `DefaulTheme`. Isso tudo facilita a estilização pois agora não precisamos mais definir a cor de fundo para todas as telas individualmente, sendo que todas tem a mesma cor:

```javascript
    import { DefaultTheme } from '@react-navigation/native';

    // Dentro do elemento Routes, no routes/index.tsx:
    const theme = DefaultTheme;
    theme.colors.background = 'red' // Assim mudamos a cor padrão do background para vermelho em todas as telas.
```
Além dessa definição, precisamos passar esse tema para o elemento `NavigationContainer` pela propriedade `theme`. Podemos também usar as propriedades do nosso próprio tema (que extende o tema do native base) para alterar essas propriedades

```javascript
    import { DefaultTheme } from '@react-navigation/native';
    import { useTheme } from 'native-base';

    const nativeBaseTheme = useTheme();

    // Dentro do elemento Routes, no routes/index.tsx:
    const theme = DefaultTheme;
    theme.colors.background = nativeBaseTheme.colors[700] // Assim, mudamos a cor para o cinza no tom 700 do nosso tema.
```

Porém, ainda é possível que tenhamos algum tipo de glitch no momento da navegação, onde a tela fica branca ou algo do tipo, para isso podemos envolver o nosso NavigationContainer com um `Box`, que é um elemento do `native-base`, e definir a cor de fundo dele como o mesmo cinza das telas

```javascript
    import { Box } from 'native-base';

    // Dentro do elemento Routes:
    <Box flex = {1} bg = 'gray.700'>
        <NavigationContainer>
            ...
        </NavigationContainer>
    </Box>
```

## Rotas com TabsNavigation
Basicamente a mesma coisa, mas ainda mais fácil, pois agora já temos a instalação do Core do react-navigation e suas dependências. Basta agora seguir os passos da documentação lá em `Guides > Tab navigation`. Esses, basicamente, são a instalação da deps do tab navigation:

```shell
    $ npm install @react-navigation/bottom-tabs
```

Criar as rotas para a tab navigation é exatamente a mesma coisa.

## Removendo Label das Rotas:
Além da opção de tirar os headers da páginas, no tab navigation podemos também tirar o label das rotas. Para tirar o nomezinho dela, baste definir `tabBarShowLabel: false` dentro do objeto `screenOptions` do `<Navigator>`.

## Adicionando Ícones para as Rotas:
Primeior importamos os SVGS que queremos usar como ícones, depois, nas screens, acessamos a prop options, dentro desse objeto, definiremos a chave `tabBarIcon` e lá definimos uma função anônima que retorna o svg como um elemento jsx.

```javascript
    <Screen 
        name = 'home'
        component = {Home}
        options = {{
            tabBarIcon: ({ color }) => (
                <HomeSvg fill = {color}/>
            )
        }}
    />
```

A partir disso, podemos modificar tamanhos e outras propriedades nessa tag svg, como fazíamos com qualquer outro elemento.

## Alterando cor do ícone da tela selecionada:
Lá no `screenOptions` do elemento `<Navigator>`, podemos definir essa cor na chave `tabBarActiveTintColor`.
O mesmo é para a cor dos ícones das telas que não estão selecionadas, basta definir essa cor na propriedade `tabBarInactiveTintColor`.

## Estilizando a barra de menu:
Ainda dentro do elemento `<Navigator>`, alteramos a propriedade `barStyle`, que também é um objeto com esses valores de estilização:

```javascript
    tabBarStyle: {
        backgroundColor: colors.gray[600],
        borderTopWidth: 0,
        height: Platform.OS === 'android' ? 'auto' : 96,
        paddingBottom: sizes[10],
        paddingTop: sizes[6]
    }
```

Ainda usamos o `Platform`, importado direto do `react-native` para verificar em qual SO estamos, e definir a altura a partir daí. Por algum motivo isso dá uma bugada na view, e por isso colocamos aqueles paddings a mais.

## Retirando o ícone de uma Rota do Menu:
No nosso caso, queremos retirar o botão da rota Exercise, mas ainda queremos que ela seja uma rota disponível para nós, com a exceção de que ela será acessada de outra forma, não através desse menu, então esconderemos esse ícone. 

```javascript
    <Screen 
        name = 'exercise'
        component = {Exercise}
        options = {{tabBarButton: () => null}}
    />
```

# Usando Ícones com o Native Base:
Podemos nos basear nas bibliotecas do vector icons normalmente, mas dessa vez usamos a tag `Icon`, importada do `native-base`, e passamos a biblioteca o vector icon na propriedade `as`.

```javascript
import { MaterialIcons } from '@expo/vector-icon';
import { Icon } from 'native-base';

// Dentro do componente:
    <Icon
        as = {MaterialIcon}
        size = {7}
        color = 'gray.200'
        .
        .
        .  
    />

```

Dessa forma sim, as propriedades são interpretadas da maneira correta.

# Cliques com Native Base:
Para fazer um elemento clicável/tocável, podemos usar o elemento `Pressed`, mas ele não possui nenhum indicador visual quando é tocado, pra isso, podemos adicionar nas suas estilizações, além das configurações que podemos definir em todos os outros elementos, um objeto com todas as estilizações que serão aplicadas no momento do toque. E esse objeto deve ser colocado na propriedade `_pressed`:

```javascript
    <Pressable 
        {...rest}
        mr = {3}
        w = {24}
        h = {10}
        bg = 'gray.600'
        rounded = 'md'
        justifyContent = 'center'
        alignItems = 'center'
        overflow = 'hidden'
        isPressed = {isActive}
        _pressed = {{
            borderColor: 'green.500',
            borderWidth: 1
        }}
        {...rest}
    >

```

Além desse atributo, podemos usar a propriedade `isPressed`, que é um booleano e, quando for verdadeiro, aplicará ao elemento as mesmas estilizações que são definidas no _pressed, ou seja, no momento do toque.

# Section List
Cria uma lista com seções separadas dentro delas. Sua estrutura e seus dados são bastante semelhantes à FlatList, mas o dado que fornecemos pra ela no `data`, já precisa ser separado por objetos, como no exemplo. AS CHAVES DESSES OBJETOS PRECISAM SER `TITLE` E `DATA`:

```javascript
    const [exercises, setExercises] = useState([
        {
            title: "26.08.22",
            data: ["Puxada frontal", "Remada unilateral"]
        }, 
        {
            title: "27.08.22",
            data: ["Puxada frontal"]
        }
    ]);
```

Nesse caso, cada objeto do array define uma seção diferente, e cada seção terá seu título, que aqui é a data. Passando esses dados pra SectionList fica:

```javascript
    <SectionList 
        sections = {exercises}
        keyExtractor = {item => item}
        renderItem = {({ item }) => (
            <HistoryCard />
        )}
        renderSectionHeader = {({ section }) => (
            <Heading color = 'gray.200' fontSize = 'md' mt = {10} mb = {3}> 
                {section.title}
            </Heading>
        )}
    />
```

Bastante parecido mas, ao invés de só determinar o item que será renderizado, determinamos também o cabeçalho daquela seção no `renderSectionHeader`.

# Feedback para o Usuário (Skeleton):
Esse componente é importado diretamente do `native-base` e basta colocarmos ele na aplicação, e definir sua `altura e largura`. Basicamente está feito o Skeleton, mas além disso podemos também definir um `rounded` para deixar ele mais arrendodado, podemso definir as propriedades `startColor` e `endColor` para definir as cores entre as quais ele fica variando... Bastante simples e bastante eficaz para dar a impressão de loading.

Ver aplicação na tela `screen/Profile.tsx`.

## Impedindo quebra de layout quando o texto é muito grande:
Podemos usar um `flexShrink = {1}` no elemento que está extrapolando seu tamanho

# Dia 3
# Buscando foto na galeria de imagens do celular
Para isso, usaremos a biblioteca `ImagePicker`. Para usá-la precisamos obviamente fazer sua instalação:

```shell
    $ expo install expo-image-picker
```

E também fazer as configurações necessárias que são colocar o seguinte trecho de código dentro do arquivo `app.json`, em algum lugar dentro da chave `expo`:
```javascript
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ]
    ]
```

## Utilizando Image Picker
Basta fazer a importação dele (importando tudo com o '*'). Depois disso, basta chamar a função que abre o seletor de imagens:

```javascript
    import * as ImagePicker from 'expo-image-picker';

    // Dentro do componente, na função que é disparada pelo toque em um determinado lugar:

    await ImagePicker.launchImageLibraryAsync();

    // Opcionalmente, também podemos passar alguns parâmetros que vão definir os arquivos buscados por essa função
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Busca apenas imagens
        quality: 1, // Fator de compressão da imagem
        aspect: [4, 4] // Seleciona uma image quadrada, 4x4,
        allowsEditing: true // Permite recortar, reposicionar, etc
    });
```

É importante armazenar essa imagem em uma variável, que carrega todas as informações dessa imagem. Ela retorna várias informações, dentre elas, a mais importante é a uri da imagem que acabamos de "criar". Podemos buscar essa uri dentro de `photoSelected.assets[0].uri` (por enquanto é isso, até que haja outra atualização).

Também podemos limitar o tamanho da imagem que o usuário pode selecionar usando a biblioteca `FileSystem`. Instalaremos ela:

```shell
    $ expo install expo-file-system
```

Para pegarmos as informações do arquivo, basta importar a biblioteca e usar a função `getInfoAsync` passando a uri da imagem como parâmetro:

```javascript
    import * as FileSystem from 'expo-file-system';

    const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);
```

Isso nos retornará várias informações, incluindo o tamanho da imagem em `bytes`.

## Feedback com Toast:
Importamos o `useToast` do próprio `native-base` e usamos da seguinte forma:

```javascript
    const toast = useToast();

    toast.show({
        title: 'Essa imagem é muito grande, escolha uma de até 5MB',
        placement: "top",
        bgColor: 'red.500'
    })
```

Assim, chamamos a função de toast, e ainda definimos algumas propriedades como o texto, o lugar onde será exibida e a cor de fundo.

# Dia 4
# Formulários com React Hook Form
Instalando o react hook form: 
```shell
    $ npm install react-hook-form
```

Para podermos criar esse formulário, primeiro precisamos importar as partes fundamentais do `react-hook-form`, o `Controller` e o `useForm`. Cada inputs deve ser englobado pela tag `<Controller>` da seguinte forma:

```javascript
    import { useForm, Controller } from 'react-hook-form';

    // Dentro do componente:
    const { control } = useForm();

    return (
        <Controller
            control = { control }
            name = 'name' // Nome do input
            render = {( field: { onChange, value } ) => (
                <Input 
                    placeholder = 'Nome'
                    onChangeText = {onChange}
                    value = {value}
                />
            )}
        />
    )
``` 

Assim, os inputs já serão controlados pelo react hook form, agora precisamos pegar esses valores de volta. Para isso, vamos também pegar a função `handleSubmit` do objeto de retorno do `useForm`, e também aproveitaremos para `tipar os campos do formulário`:

```javascript
    type FormDataProps = {
        name: string, 
        email: string,
        password: string,
        confirmPassword: string
    }

    const { control, handleSubmit } = useForm<FormDataProps>();

    // No ultimo input do formulário (OPCIONAL, para que o user possa enviar direto pelo teclado):
    <Input 
        onSubmitEditing = {handleSubmit(submitFunction)}
        returnKeyType = 'send'
    />

    // No botão de envio:
    <Button 
        onPress = {handleSubmit(submitFunction)}
    />

```

## Exibindo Mensagens de Erro:
Para exibir a mensagem de erro, podemos usar o componente `FormControl` do próprio `native-base`. Assim como o Controller, iremos englobal nosso input com esse componente, e passar para ele um atributo `isInvalid`, que será a variável que representa se o nosso input é inválido ou não.

Depois disso, podemos colocar abaixo do input, uma tag `FormControl.ErrorMessage` que tem como filho a própria mensagem de erro. Veja como isso está sendo aplicado no `@component/Input.tsx`, que está sendo usado no `SingUp.tsx`.

## Validando inputs com Yup e YupResolver

Instalando os dois:
```shell
    $ npm install @hookform/resolvers yup
```

Agora criamos o objeto do esquema, assim como no react normal:
```javascript
    const signUpSchema = yup.object({
        name: yup.string().required('Informe o nome'),
        email: yup.string().required('Informe o email').email('Email inválido'),
        password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
        confirmPassword: yup.string().required('Confirme a senha').oneOf([yup.ref('password'), null], 'As senhas não são iguais')
    })
```

Depois, passamos esse esquema para o useForm:
```javascript
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
```

Lembrando de fazer as importações:
```javascript
    import * as yup from 'yup';
    import { yupResolver } from '@hookform/resolvers/yup';
```