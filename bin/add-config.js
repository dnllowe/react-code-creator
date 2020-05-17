const fs = require('fs')
const path = require('path')

if (fs.existsSync('./.react-code-creator-skip-post-install')) {
    process.exit(0)
}

try {
    const filePath = path.resolve(process.cwd(), '..', '..', 'react-code-creator.config.yaml')

    if (!fs.existsSync(filePath)) {
        console.log('Creating react-code-creator.config.yaml')

        const config = `useTypescript: false # true or false. Default is false
generateCss: true # true or false. Default is true
generateTests: true # true or false. Default is true
generateInterfaces: false # true or false. Default is false
cssExtension: "css" # "css", "scss", "sass", or "less". Default is "css"
testExtension: "spec" # "spec" or "test". Default is "spec"
root: "./src" # Any filepath string. Default is "./src"
viewPath: "views" # Any filepath string. Default is "views"
modelPath: "models" # Any filepath string. Default is "models"
servicePath: "services" # Any filepath string. Default is "services"
contextPath: "contexts" # Any filepath string. Default is "contexts"
reduxPath: "redux" # Any filepath string. Default is "redux"
fileCase: "pascal" # "camel", "dash", "pascal", "snake", or "dot". Default is "pascal"
pathCase: "dash" # "camel", "dash", "pascal", or "snake". Default is "dash"
useSemicolons: true # true or false. Default is true`

        fs.writeFileSync(filePath,config)
    } else {
        console.log('react-code-creator.config.yaml found')
    }
}
catch(e) {
    console.warn('Error creating react-code-creator.config.yaml')
    console.error(e)
}

try {
    const packageJsonPath = path.resolve(process.cwd(), '../', '../', 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const scripts = { ...packageJson.scripts }

    if (!scripts.new) {
        console.log('Adding react-code-creator "new" script to package.json')
        scripts.new = 'react-code-creator'
        packageJson.scripts = scripts
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4))
    }
}
catch(e) {
    console.warn('Error adding react-code-creator "new" script to package.json')
    console.error(e)
}