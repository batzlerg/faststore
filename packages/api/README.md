<h1 align="center">
  Hearst <span class="strikethrough">Faststore</span> API
</h1>

## Installation

From the command line in your project directory, run yarn add `@hearst-e-commerce-tech/hearst-faststore-api`.

```cmd
yarn add @hearst-e-commerce-tech/hearst-faststore-api
```

## Usage

With servers like express:

```ts
import { execute } from 'graphql'
import { getSchema } from '@hearst-e-commerce-tech/hearst-faststore-api'

import express from 'express'

const app = express()

app.get('/graphql', async (req, res) => {
  const { query, operationName, variables } = req.body

  const result = await execute({
    schema: await getSchema(),
    variableValues: variables,
    operationName,
  })

  res.status(200)
  res.send(result)
})
```

## Docs

For more information, please refer to our documentation in the root of the repository.