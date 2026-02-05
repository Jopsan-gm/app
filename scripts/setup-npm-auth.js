const fs = require('fs')
const path = require('path')

let token = process.env.NPM_TOKEN_GOOGLE_SIGN_IN

if (!token) {
  const envLocalPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8')
    const match = envContent.match(/NPM_TOKEN_GOOGLE_SIGN_IN=(.+)/)
    if (match) {
      token = match[1].trim().replace(/^["']|["']$/g, '')
    }
  }
}

if (!token) {
  console.error('NPM_TOKEN_GOOGLE_SIGN_IN is not set')
  process.exit(1)
}

const npmrcContent = `//npm.pkg.github.com/:_authToken=${token}
@react-native-google-signin:registry=https://npm.pkg.github.com/
`

const yarnrcContent = `npmScopes:
  "@react-native-google-signin":
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAuthToken: "${token}"

npmRegistryServer: "https://registry.npmjs.org"

npmRegistries:
  "https://npm.pkg.github.com":
    npmAuthToken: "${token}"
`

fs.writeFileSync(path.join(process.cwd(), '.npmrc'), npmrcContent)
fs.writeFileSync(path.join(process.cwd(), '.yarnrc.yml'), yarnrcContent)
