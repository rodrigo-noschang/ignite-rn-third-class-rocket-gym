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