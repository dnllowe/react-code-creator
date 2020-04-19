const fs = require('fs')
const path = require('path')

try {
    const filePath = path.resolve(process.cwd(), '..', '..', 'plop-react.config.yaml')

    if (!fs.existsSync(filePath)) {
        console.log('Creating plop-react.config.yaml')

        const config = `useTypescript: false # true or false. Default is false
cssExtension: "css" # "css", "scss", "sass", or "less". Default is "css"
root: "./src" # Any filepath string. Default is "./src"
viewPath: "views" # Any filepath string. Default is "views"
modelPath: "models" # Any filepath string. Default is "models"
servicePath: "services" # Any filepath string. Default is "services"
contextPath: "contexts" # Any filepath string. Default is "contexts"
fileCase: "camel" # "camel", "dash", "pascal", "snake", or "dot". Default is "camel"
pathCase: "camel" # "camel", "dash", "pascal", or "snake". Default is "camel"`

        fs.writeFileSync(filePath,config)
    } else {
        console.log('plop-react.config.yaml found')
    }
}
catch(e) {
    console.warn('Error creating plop-react.config.yaml')
    console.error(e)
}

try {
    const packageJsonPath = path.resolve(process.cwd(), '../', '../', 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const scripts = { ...packageJson.scripts }

    if (!scripts.new) {
        console.log('Adding plop-react "new" script to package.json')
        scripts.new = 'new'
        packageJson.scripts = scripts
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4))
    }
}
catch(e) {
    console.warn('Error adding plop-react "new" script to package.json')
    console.error(e)
}