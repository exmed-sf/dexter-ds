# Dexter

Design System by Exmed 😎

<img align="right" alt="Logo" src="website/static/logo.png" style="margin-bottom: 16px">

<p align="center">
[![version](https://img.shields.io/npm/v/@exmed/dexter-ds.svg)](https://www.npmjs.com/package/@exmed/dexter-ds)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
</p>

## Como utilizar

Instale no seu projeto:

```bash
npm i @exmed/dexter-ds
```

Neste repositório, você encontrará

- [Cores](#cores)
- [Ícones](#ícones)

### Cores

Utilize as cores individuais ou o conjunto completo:

```js
import { individual } from "@exmed/dexter-ds/colors"

individual[0];	// "#B1EFE8"
...					// ...
individual[40];		// "#D0F5F1"
```

```js
import * as colors from '@exmed/dexter-ds/colors';

colors; // { individual: {...}, empresas: {...}, ... }

colors.empresas[0]; // "#6161FF"
```

### Ícones

Utilize os ícones de acordo com a sua plataforma

### React web

`index.jsx`

```jsx
import { IcClose } from '@exmed/dexter-ds/icons';

<Container>
	<IcClose />
</Container>;
```

`styles.js`

```js
import styled from 'styled-components';
import { neutral } from '@exmed/dexter-ds/colors';

const Container = styled.div`
	color: ${neutral[90]}; // #141414

	svg {
		${neutral[0]}; // #FFFFFF
	}
`;
// A cor do ícone será sempre herdada do seu pai, caso não seja definida diretamente.
```

### React Native

`styles.js`

```js
import styled from "styled-components";
import { neutral } from "@exmed/dexter-ds/colors"
---
import { IcClose } from "@exmed/dexter-ds/icons/svg";

const Icon = styled(Close)`
	color: ${neutral[90]};		// #141414
`
```

### Bons códigos 🧑‍💻🖥️⚙️
