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
