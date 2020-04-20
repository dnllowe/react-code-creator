const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const args = process.argv.slice(6)

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
const generateInterfaces = config.generateInterfaces ? true : false
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

const [ generator, name ] = args

if (generator === 'model' && !useTypescript) {
    throw `Could not create model ${name}. Model generator requires typescript. Must set useTypescript to true in plop-react.config.yaml to create models.`
}

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

    plop.setHelper('classCase', function (text) {
        if (fileCase === 'camelCase') {
            const camelCase = plop.getHelper('camelCase')(text)
            return plop.getHelper('upperCaseInitial')(camelCase)
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
        if (fileCase === 'camelCase') {
            const camelCase = plop.getHelper('camelCase')(interfaceText)
            return plop.getHelper('upperCaseInitial')(camelCase)
        }
        else {
            return plop.getHelper('pascalCase')(interfaceText)
        }
    });

    plop.setHelper('contextCase', function (text) {
        const contextText = `${text}-context`
        return plop.getHelper('classCase')(contextText)
    });

    plop.setHelper('contextProviderCase', function (text) {
        const contextProviderText = `${text}-context-provider`
        return plop.getHelper('classCase')(contextProviderText)
    });

    plop.setHelper('contextProviderVarCase', function (text) {
        const contextProviderText = `${text}-context-provider`
        return plop.getHelper(varCase)(contextProviderText)
    });

    plop.setHelper('contextFileCase', function (text) {
        const contextText = `${text}-context`
        return plop.getHelper(fileCase)(contextText)
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
                templateFile: 'templates/component-spec.hbs',
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
                templateFile: 'templates/component-spec.hbs',
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
                    path: `${root}/${modelPath}/{{${fileCase} model}}.${fileExt}`,
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
                message: 'name of service',
            }
        ],
        actions: [
            {
                type: 'add',
                path: `${root}/${servicePath}/{{${pathCase} service}}/{{${fileCase} service}}.${fileExt}`,
                templateFile: `templates/service.${fileExt}.hbs`,
                data: { generateInterfaces }
            },
            {
                type: 'add',
                path: `${root}/${servicePath}/{{${pathCase} service}}/{{addInterface service}}.${fileExt}`,
                templateFile: `templates/service-interface.hbs`,
                skip: function() {
                    if (!useTypescript || !generateInterfaces) {
                        return "Skipping interface generation because typescript or generateInterfaces is disabled"
                    }
                }
            },
            {
                type: 'add',
                path: `${root}/${servicePath}/{{${pathCase} service}}/{{${fileCase} service}}.${testExt}.${fileExt}`,
                templateFile: `templates/service-spec.hbs`,
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
                path: `${root}/${contextPath}/{{contextFileCase context}}.${reactExt}`,
                templateFile: `templates/context-${reactExt}.hbs`
            }
        ]
    });
};