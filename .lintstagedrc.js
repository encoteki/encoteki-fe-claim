import path from 'path'

/**
 * Helper to build the ESLint command for lint-staged
 * @param {string[]} filenames
 */
const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`

const config = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}

export default config
