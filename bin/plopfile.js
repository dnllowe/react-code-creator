const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

config = null

try {
    config = fs.readFileSync(path.join(process.cwd(), 'plop-react.config.yaml'), 'utf8')
}
catch(e) {
    throw "Error reading react-plop.config.json. Make sure you have created a react-plop.config.json file at the root of your project"
}

config = yaml.safeLoad(config)

const root = config.root ? config.root : './src'
const useTypescript = config.useTypescript ? true : false
const generateCss = config.generateCss ? true : false
const generateTests = config.generateTests ? true : false
const fileExt = useTypescript ? 'ts' : 'js'
const reactExt = useTypescript ? 'tsx' : 'jsx'
const cssExt = config.cssExtension ? config.cssExtension : 'css'
const testExt = config.testExtension ? config.testExtension : 'spec'
const viewPath = config.viewPath ? config.viewPath : 'views'
const modelPath = config.modelPath ? config.modelPath : 'models'
const servicePath = config.servicePath ? config.servicePath : 'services'
const contextPath = config.contextPath ? config.contextPath : 'contexts'
let fileCase = 'camelCase'
let pathCase = 'camelCase'
let varCase = 'camelCase'

switch (config.fileCase) {
    case 'camel':
        fileCase = 'camelCase'
        break
    case 'dot':
        fileCase = 'dotCase'
        break
    case 'snake':
        fileCase = 'snakeCase'
        break
    case 'dash':
    case 'kebab':
        fileCase = 'dashCase'
        break
    case 'proper':
    case 'pascal':
        fileCase = 'pascalCase'
        break
    default:
        fileCase = 'camelCase'
        break
}

switch (config.pathCase) {
    case 'camel':
        pathCase = 'camelCase'
        break
    case 'dash':
    case 'kebab':
        pathCase = 'dashCase'
        break
    case 'snake':
        pathCase = 'snakeCase'
        break
    case 'proper':
    case 'pascal':
        pathCase = 'pascalCase'
        break
    default:
        pathCase = 'camelCase'
        break
}

switch (config.fileCase) {
    case 'camel':
        varCase = 'camelCase'
        break
    case 'snake':
        varCase = 'snakeCase'
        break
    case 'proper':
    case 'pascal':
        varCase = 'pascalCase'
        break
    default:
        varCase = 'camelCase'
        break
}

module.exports = function (plop) {
    plop.setHelper('lowerCaseInitial', function (text) {
        return text[0].toLowerCase() + text.slice(1)
    });

    plop.setHelper('upperCaseInitial', function (text) {
        return text[0].toUpperCase() + text.slice(1)
    });

    plop.setHelper('varCase', function (text) {
        return plop.getHelper(varCase)(text)
    });

    plop.setHelper('fileCase', function (text) {
        return plop.getHelper(fileCase)(text)
    });

    plop.setHelper('pathCase', function (text) {
        return plop.getHelper(pathCase)(text)
    });

    plop.setHelper('pascalSnakeCase', function (text) {
        const snakeCase = plop.getHelper('snakeCase')(text)
        let pascalSnakeCase = snakeCase[0].toUpperCase()
        for (let i = 1; i < snakeCase.length; i++) {
            let newChar = snakeCase[i]
            if (snakeCase[i - 1] === '_') {
                newChar = newChar.toUpperCase()
            }

            pascalSnakeCase += newChar
        }
        return pascalSnakeCase
    });

    plop.setHelper('classCase', function (text) {
        if (varCase === 'camelCase') {
            const camelCase = plop.getHelper('camelCase')(text)
            return plop.getHelper('upperCaseInitial')(camelCase)
        }
        else if (varCase === 'snakeCase') {
            const snakeCase = plop.getHelper('snakeCase')(text)
            return plop.getHelper('pascalSnakeCase')(snakeCase)
        }
        else {
            return plop.getHelper('pascalCase')(text)
        }
    });

    plop.setHelper('addInterface', function (text) {
        const interfaceText = `${text}-interface`
        return plop.getHelper(fileCase)(interfaceText)
    });

    plop.setHelper('interfaceCase', function (text) {
        const interfaceText = `${text}-interface`
        if (varCase === 'camelCase') {
            const camelCase = plop.getHelper('camelCase')(interfaceText)
            return plop.getHelper('upperCaseInitial')(camelCase)
        }
        else if (varCase === 'snakeCase') {
            const snakeCase = plop.getHelper('snakeCase')(interfaceText)
            return plop.getHelper('pascalSnakeCase')(snakeCase)
        }
        else {
            return plop.getHelper('pascalCase')(interfaceText)
        }
    });

    plop.setGenerator('component', {
        description: 'Create a functional component / view',
        prompts: [
            {
                type: 'input',
                name: 'component',
                message: 'name of component'
            }
        ],
        actions: [
            {
                type: 'add',
                data: { cssExtension: cssExt, generateCss },
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.${reactExt}`,
                templateFile: 'templates/component.hbs'
            },
            {
                type: 'add',
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.${cssExt}`,
                skip: function() {
                    if (!generateCss) {
                        return "Skipping css file generation because generateCss is disabled"
                    }
                }
            },
            {
                type: 'add',
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.${testExt}.${reactExt}`,
                skip: function() {
                    if (!generateTests) {
                        return "Skipping test spec file generation because generateTests is disabled"
                    }
                }
            }
        ]
    });

    plop.setGenerator('class-component', {
        description: 'Create a class component / view',
        prompts: [
            {
                type: 'input',
                name: 'component',
                message: 'name of component'
            }
        ],
        actions: [
            {
                type: 'add',
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.${reactExt}`,
                data: { cssExtension: cssExt, generateCss },
                templateFile: 'templates/class-component.hbs'
            },
            {
                type: 'add',
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.${cssExt}`,
                skip: function() {
                    if (!generateCss) {
                        return "Skipping css file generation because generateCss is disabled"
                    }
                }
            },
            {
                type: 'add',
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.${testExt}.${reactExt}`,
                skip: function() {
                    if (!generateTests) {
                        return "Skipping test spec file generation because generateTests is disabled"
                    }
                }
            }
        ]
    });

    if (useTypescript) {
        plop.setGenerator('model', {
            description: 'Create a model / type',
            prompts: [
                {
                    type: 'input',
                    name: 'model',
                    message: 'name of model'
                }
            ],
            actions: [
                {
                    type: 'add',
                    path: `${root}/${modelPath}/{{${pathCase} model}}/{{${fileCase} model}}.${fileExt}`,
                    templateFile: 'templates/model.hbs'
                }
            ]
        });
    }

    plop.setGenerator('service', {
        description: 'Create a service',
        prompts: [
            {
                type: 'input',
                name: 'service',
                message: 'name of service'
            }
        ],
        actions: [
            {
                type: 'add',
                path: `${root}/${servicePath}/{{${pathCase} service}}/{{${fileCase} service}}.${fileExt}`,
                templateFile: `templates/service.${fileExt}.hbs`,
            },
            {
                type: 'add',
                path: `${root}/${servicePath}/{{${pathCase} service}}/{{addInterface service}}.${fileExt}`,
                templateFile: `templates/service-interface.hbs`,
                skip: function() {
                    if (!useTypescript) {
                        return "Skipping interface generation because typescript is disabled"
                    }
                }
            },
            {
                type: 'add',
                path: `${root}/${servicePath}/{{${pathCase} service}}/{{${fileCase} service}}.${testExt}.${fileExt}`,
                skip: function() {
                    if (!generateTests) {
                        return "Skipping test spec file generation because generateTests is disabled"
                    }
                }
            }
        ]
    });

    plop.setGenerator('context', {
        description: 'Create a context',
        prompts: [
            {
                type: 'input',
                name: 'context',
                message: 'name of context'
            }
        ],
        actions: [
            {
                type: 'add',
                path: `${root}/${contextPath}/{{${pathCase} context}}Context.${reactExt}`,
                templateFile: 'templates/context.hbs'
            }
        ]
    });
};