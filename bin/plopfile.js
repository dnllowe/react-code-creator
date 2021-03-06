const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const args = process.argv.slice(6)

config = null

try {
    config = fs.readFileSync(path.join(process.cwd(), 'react-code-creator.config.yaml'), 'utf8')
}
catch(e) {
    throw "Error reading react-code-creator.config.json. Make sure you have created a react-code-creator.config.json file at the root of your project"
}

config = yaml.safeLoad(config)

const root = config.root ? config.root : './src'
const useTypescript = config.useTypescript !== undefined ? config.useTypescript : false
const generateCss = config.generateCss !== undefined ? config.generateCss : false
const generateTests = config.generateTests  !== undefined? config.generateTests : false
const generateInterfaces = config.generateInterfaces !== undefined ? config.generateInterfaces : false
const generateStories = config.generateStories !== undefined ? config.generateStories : false
const generatePropTypes = config.generatePropTypes !== undefined ? config.generatePropTypes : false
const generateTypescriptProps = config.generateTypescriptProps !== undefined ? (config.generateTypescriptProps && useTypescript) : false
const fileExt = useTypescript ? 'ts' : 'js'
const reactExt = useTypescript ? 'tsx' : 'jsx'
const cssExt = config.cssExtension ? config.cssExtension : 'css'
const testExt = config.testExtension ? config.testExtension : 'spec'
const viewPath = config.viewPath ? config.viewPath : 'views'
const modelPath = config.modelPath ? config.modelPath : 'models'
const servicePath = config.servicePath ? config.servicePath : 'services'
const contextPath = config.contextPath ? config.contextPath : 'contexts'
const reduxPath = config.reduxPath ? config.reduxPath : 'redux'
const useSemicolons = config.useSemicolons !== undefined ? config.useSemicolons : true

let fileCase = 'camelCase'
let pathCase = 'camelCase'
let varCase = 'camelCase'

const [ generator, name ] = args

if (generator === 'model' && !useTypescript) {
    throw `Could not create model ${name}. Model generator requires typescript. Must set useTypescript to true in react-code-creator.config.yaml to create models.`
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

switch (config.varCase) {
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
    })

    plop.setHelper('upperCaseInitial', function (text) {
        return text[0].toUpperCase() + text.slice(1)
    })

    plop.setHelper('varCase', function (text) {
        return plop.getHelper(varCase)(text)
    })

    plop.setHelper('fileCase', function (text) {
        return plop.getHelper(fileCase)(text)
    })

    plop.setHelper('pathCase', function (text) {
        return plop.getHelper(pathCase)(text)
    })

    plop.setHelper('classCase', function (text) {
        if (fileCase === 'camelCase') {
            const camelCase = plop.getHelper('camelCase')(text)
            return plop.getHelper('upperCaseInitial')(camelCase)
        }
        else {
            return plop.getHelper('pascalCase')(text)
        }
    })

    plop.setHelper('addInterface', function (text) {
        const interfaceText = `${text}-interface`
        return plop.getHelper(fileCase)(interfaceText)
    })

    plop.setHelper('interfaceCase', function (text) {
        const interfaceText = `${text}-interface`
        if (fileCase === 'camelCase') {
            const camelCase = plop.getHelper('camelCase')(interfaceText)
            return plop.getHelper('upperCaseInitial')(camelCase)
        }
        else {
            return plop.getHelper('pascalCase')(interfaceText)
        }
    })

    plop.setHelper('contextCase', function (text) {
        const contextText = `${text}-context`
        return plop.getHelper('classCase')(contextText)
    })

    plop.setHelper('contextProviderCase', function (text) {
        const contextProviderText = `${text}-context-provider`
        return plop.getHelper('classCase')(contextProviderText)
    })

    plop.setHelper('contextProviderVarCase', function (text) {
        const contextProviderText = `${text}-context-provider`
        return plop.getHelper(varCase)(contextProviderText)
    })

    plop.setHelper('contextFileCase', function (text) {
        const contextText = `${text}-context`
        return plop.getHelper(fileCase)(contextText)
    })

    plop.setHelper('addReducer', function (text) {
        const reducerText = `${text}-reducer`
        return plop.getHelper(fileCase)(reducerText)
    })

    plop.setHelper('reducerCase', function (text) {
        const reducerText = `${text}-reducer`
        return plop.getHelper(varCase)(reducerText)
    })

    plop.setHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
            case '==':return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:return options.inverse(this);
        }
    })

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
                data: { cssExtension: cssExt, generateCss, useSemicolons, generatePropTypes, generateTypescriptProps, useTypescript },
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
                data: { useSemicolons },
                templateFile: 'templates/component-spec.hbs',
                skip: function() {
                    if (!generateTests) {
                        return "Skipping test spec file generation because generateTests is disabled"
                    }
                }
            },
            {
                type: 'add',
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.stories.${reactExt}`,
                data: { useSemicolons },
                templateFile: 'templates/story.hbs',
                skip: function() {
                    if (!generateStories) {
                        return "Skipping Storybook story generation because generateStories is disabled"
                    }
                }
            }
        ]
    })

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
                data: { cssExtension: cssExt, generateCss, useSemicolons, generatePropTypes, generateTypescriptProps, useTypescript },
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
                data: { useSemicolons },
                templateFile: 'templates/component-spec.hbs',
                skip: function() {
                    if (!generateTests) {
                        return "Skipping test spec file generation because generateTests is disabled"
                    }
                }
            },
            {
                type: 'add',
                path: `${root}/${viewPath}/{{${pathCase} component}}/{{${fileCase} component}}.stories.${reactExt}`,
                data: { useSemicolons },
                templateFile: 'templates/story.hbs',
                skip: function() {
                    if (!generateStories) {
                        return "Skipping Storybook story generation because generateStories is disabled"
                    }
                }
            }
        ]
    })

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
                data: { useSemicolons },
                path: `${root}/${contextPath}/{{contextFileCase context}}.${reactExt}`,
                templateFile: `templates/context-${reactExt}.hbs`
            }
        ]
    })


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
                    data: { useSemicolons },
                    path: `${root}/${modelPath}/{{${fileCase} model}}.${fileExt}`,
                    templateFile: 'templates/model.hbs'
                }
            ]
        })
    }

    plop.setGenerator('reducer', {
        description: 'Create a Redux reducer',
        prompts: [
            {
                type: 'input',
                name: 'reducer',
                message: 'name of reducer'
            }
        ],
        actions: [
            {
                type: 'add',
                data: { reducers: 'reducers', useTypescript, useSemicolons },
                path: `${root}/${reduxPath}/{{${pathCase} reducers}}/{{addReducer reducer}}.${fileExt}`,
                templateFile: 'templates/reducer.hbs'
            },
            {
                type: 'add',
                data: { store: 'store', useSemicolons },
                path: `${root}/${reduxPath}/{{${fileCase} store}}.${fileExt}`,
                templateFile: 'templates/redux-store.hbs',
                skipIfExists: true
            },
            {
                type: 'add',
                data: { reducers: 'reducers', useSemicolons },
                path: `${root}/${reduxPath}/{{${pathCase} reducers}}/index.${fileExt}`,
                templateFile: 'templates/reducer-index.hbs',
                skipIfExists: true
            },
            {
                type: 'append',
                pattern: /import.*redux['|"]/gi,
                data: { reducers: 'reducers', useSemicolons },
                path: `${root}/${reduxPath}/{{${pathCase} reducers}}/index.${fileExt}`,
                templateFile: 'templates/reducer-index-append-import.hbs'
            },
            {
                type: 'append',
                pattern: /export.*/gi,
                data: { reducers: 'reducers', useSemicolons },
                path: `${root}/${reduxPath}/{{${pathCase} reducers}}/index.${fileExt}`,
                templateFile: 'templates/reducer-index-append-combined-reducers.hbs'
            },
        ]
    })

    if (fs.existsSync(path.join(process.cwd(), root, reduxPath))) {
        const reducers = fs
            .readdirSync(path.join(process.cwd(), root, reduxPath, 'reducers'))
            .map(file => file.replace(`.${fileExt}`, ''))
            .filter(reducer => reducer.toLowerCase() !== 'index')

        plop.setGenerator('redux-action', {
            description: 'Create a Redux action for a reducer',
            prompts: [
                {
                    type: 'input',
                    name: 'action',
                    message: 'name of action'
                },
                {
                    type: 'rawlist',
                    name: 'reducer',
                    message: 'which reducer does the action apply to?',
                    choices: reducers
                }
            ],
            actions: [
                {
                    type: 'add',
                    data: { actions: 'actions', useSemicolons },
                    path: `${root}/${reduxPath}/{{${pathCase} actions}}/{{fileCase action}}.${fileExt}`,
                    templateFile: 'templates/redux-action-creator.hbs'
                },
                {
                    type: 'add',
                    data: { actions: 'actions', useSemicolons },
                    path: `${root}/${reduxPath}/{{${pathCase} actions}}/{{${fileCase} actions}}.${fileExt}`,
                    templateFile: 'templates/redux-action.hbs',
                    skipIfExists: true
                },
                {
                    type: 'append',
                    data: { actions: 'actions', useSemicolons },
                    pattern: /export.*/gi,
                    path: `${root}/${reduxPath}/{{${pathCase} actions}}/{{${fileCase} actions}}.${fileExt}`,
                    templateFile: 'templates/redux-action-append.hbs'
                },
                {
                    type: 'append',
                    data: { actions: 'actions', reducers: 'reducers', useSemicolons },
                    pattern: /^/,
                    path: `${root}/${reduxPath}/{{${pathCase} reducers}}/{{reducer}}.${fileExt}`,
                    templateFile: 'templates/redux-action-append-reducer-import.hbs'
                },
                {
                    type: 'append',
                    data: { reducers: 'reducers', useSemicolons },
                    pattern: /switch.*/gi,
                    path: `${root}/${reduxPath}/{{${pathCase} reducers}}/{{reducer}}.${fileExt}`,
                    templateFile: 'templates/redux-action-append-reducer-case.hbs'
                },
            ]
        })
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
                data: { generateInterfaces, useSemicolons }
            },
            {
                type: 'add',
                path: `${root}/${servicePath}/{{${pathCase} service}}/{{addInterface service}}.${fileExt}`,
                data: { useSemicolons },
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
                data: { useSemicolons },
                templateFile: `templates/service-spec.hbs`,
                skip: function() {
                    if (!generateTests) {
                        return "Skipping test spec file generation because generateTests is disabled"
                    }
                }
            }
        ]
    })
}