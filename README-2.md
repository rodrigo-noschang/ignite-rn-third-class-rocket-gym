# Dia 1
# Context:
Assim como no React para web, basta criarmos uma pasta separada para o contexto, no caso `src/context/AuthContext.tsx`. Aqui colocaremos os dados referentes à autenticação.

```js
    import { createContext } from 'react';

    const AuthContext = createContext(); 
``` 

Assim, já criamos o contexto, porém sem criar um estado para ele, sem função nem nada. Para passarmos esses valores para o retante da aplicação, precisamos colocar um `Provider` dela no contexto mais global possível, como por exemplo, envolvendo o componente `Routes` lá no `App.tsx`:

Dentro do App, temos o seguinte retorno, basta envolver ele com o `AuthContext.Provider`, e passar também quais valores serão compartilhados entre todos os componentes:

```jsx
    return (
		<NativeBaseProvider theme = {THEME}>
			<StatusBar barStyle = {'light-content'} backgroundColor = {'transparent'} translucent/>
            <AuthContext.Provider value = {{}}>
                {fontsLoaded ? 
                    <Routes />
                :
                    <Loading />
                }
            </AuthContext.Provider>
		</NativeBaseProvider>
	);
```

Agora, para que possamos recuperar os valores passados dentro de `value`, fazemos o seguinte, em qualquer componente:

```js
    import { useContext } from 'react';
    import { AuthContext } from 'src/context/AuthContext';

    // Dentro do componente:
    const contextData = useContext(AuthContext)
```

## Tipando o Contexto:
Para podermos definir o tipo de um contexto, primeiro é importante definir um `DTO` (Data Transfer Object) para moldá-lo. No caso do AuthContext, estaremos lidando com um user e suas informações, por isso, criaremos um DTO para o user, em uma pasta `@dtos/UserDTO.ts`:

```js
    export type UserDTO = {
        id: string, 
        name: string, 
        email: string,
        avatar: string
    }
```

Agora, no nosso arquivo de context, podemos criar uma tipagem que englobar o tipo de TUDO que estará presente nesse contexto, no caso as informações do usuário, e também funções relacionadas a ele que serão implementadas futuramente. Agora nosso context ficará da seguinte forma: 

```js
    import { createContext } from "react";

    import { UserDTO } from "@dtos/UserDTO";

    export type AuthContextDataProps = {
        user: UserDTO
    }

    export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);
```

## Refatorando:
Para que o App.tsx não fique muito poluído, podemos deixar o Provider daquele determinado context dentro do próprio Context. Então, dentro do arquivo `AuthContext.tsx`, na continuação do código acima, fazemos a criação desse Provider: 

```js
    export const AuthContextProvder = ({ children }: AuthContextProviderProps) => {
        return (
            <AuthContext.Provider value = {{
                user: {
                    id: '1',
                    name: 'Rodrigo Noschang',
                    email: 'rodrigo@mail1.com',
                    avatar: 'rodrigo_avatar.png'
                }
            }}>
                {children}
            </AuthContext.Provider>
        )
    }
```

E agora, no nosso App.tsx, englobaremos nossa aplicação apenas com o `AuthContextProvider`. Posteriormente, ainda podemos centralizar todos os providers em um Arquivo separado, e englobal nossa aplicação com um único `Provider`, que será o encapsulamento de todos os providers.

## Criando Hooks (centralizando o useContext):
Para facilitar o uso dos context, podemos fazer a parte do `useContext` em um arquivo separado. A função é basicamente realizar o useContext, e retornar o valor do dado buscado, como segue:

```js
    import { useContext } from 'react';

    import { AuthContext } from 'src/context/AuthContext';

    export const useAuth = () => {
    const context = useContext(AuthContext);

    return context;
    }
```

Agora, o uso do Context nos componentes fica muito mais fácil:

```js
    import { useAuth } from '@hooks/useAuth';

    // Dentro do componente
    const { user } = useAuth();
```

# Anexando o Token ao header de todas as requisições:
Para evitar de ter que inserir o token em todas as requisições de rotas privadas, podemos inserí-lo de maneira "global" por padrão com o seguinte comando:

```js
    api.deafults.headers.common['Authorization'] = `Bearer ${token}`;
```

Dessa forma, o token já está automaticamente anexado aos headers das requisições futuras.

## Buscando imagem pela URL da API:
No caso dessa API com a qual estamos trablhando, a imagem de thumb do exercício é composta apenas pelo nome da imagem, sem a uri toda. Pelo padrão dessa API, usamos a url base dessa API, e ao final adicionamos `/exercise/thumb/nome-da-image.png`. E podemos usar o axios para nos auxiliar nisso:

```js
import { api } from '@services/api';

// Dentro do componente:
<Image
    ...
    source = {{uri: `${api.defaults.baseULR/exercise/thumb/${data.thumb}}`}};
/>

No caso, `data.thumb` é onde está salvo o nome da imagem.

```

## Tratando dados com o Yup:
Quando digitamos algo no input e depois apagamos, o yup coloca isso como uma string vazia, ao invés de um `undefined` ou `null`. Algo que poderia ser jogado direto para o banco. Para nos assegurar de que um valor nullable desse será mantido, ao invés de trocado, podemos adicionar essa regra dentro do schema:

```js
    newPassword:  ....nullable().transform((value) => !!value ? value : null),
```

E se quiser que um campo `passe a ser obrigatório` dependendo do valor de outro campo, podemos usar a validação com o `when`:

```js
    confirmNewPassowrd: ...
        .when('newPassword', {
            is: (Field: any) => Field,
            then: yup.string().nullable().required('Informe a confirmação da senha')
        })
```

Nesse caso, quando o campo `newPassword` tiver algo de válido dentro dele, esse mesmo input `confirmNewPassword` passa a ser required, por exemplo. 

# Refresh Token:
