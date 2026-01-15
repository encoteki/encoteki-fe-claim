module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindStylesheet: './src/styles/globals.css',
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  endOfLine: 'auto',
}
