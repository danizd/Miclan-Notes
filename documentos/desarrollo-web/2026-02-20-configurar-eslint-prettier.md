# Configurar ESLint + Prettier en VS Code

## Instalación
```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier
```

## .eslintrc.json
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ]
}
```

## .prettierrc
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## Extensiones VS Code
- ESLint
- Prettier - Code formatter
