const fs = require('fs').promises
const path = require('path')
const glob = require('glob')
const sass = require('sass')
const babel = require("@babel/core")

const sourceDir = "src"
const distDir = "dist"

const htmlRender = async (file) => {
    const savePath = file.replace(sourceDir, distDir)
    const pathDir = path.dirname(file).replace(sourceDir, distDir)
    const data = await fs.readFile(file, 'utf8')

    try { await fs.access(pathDir) } catch (e) {
        await fs.mkdir(pathDir.replace(sourceDir, distDir), { recursive: true })
    }
    await fs.writeFile(savePath.replace(sourceDir, distDir), data)
    console.log(`${file} has been copied to ${savePath}`)
}

const styleRender = async (file) => {
    const pathDir = path.dirname(file).replace(sourceDir, distDir)
    const savePath = file.replace(sourceDir, distDir).slice(0, -4).concat("css")
    const data = await sass.renderSync({file: file}).css.toString('utf8')

    try { await fs.access(pathDir) } catch (e) {
        await fs.mkdir(pathDir.replace(sourceDir, distDir), { recursive: true })
    }
    await fs.writeFile(savePath.replace(sourceDir, distDir), data)
    console.log(`${file} has been copied to ${savePath}`)
}

const babelConfig = {
    "presets": [
        [
            "@babel/env",
            {
                "targets": {
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1"
                }
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-arrow-functions"
        ],
        [
            "@babel/plugin-transform-react-jsx"
        ]
    ]
}
const scriptRender = async (file) => {
    const savePath = file.replace(sourceDir, distDir)
    const pathDir = path.dirname(file).replace(sourceDir, distDir)
    const data = await fs.readFile(file, 'utf8')
    const babelData = babel.transform(data, babelConfig).code

    try { await fs.access(pathDir) } catch (e) {
        await fs.mkdir(pathDir.replace(sourceDir, distDir), { recursive: true })
    }
    await fs.writeFile(savePath.replace(sourceDir, distDir), babelData)
    console.log(`${file} has been copied to ${savePath}`)
}

const renderer = () => {
    console.log("Start render")
    const htmls = glob.sync(`./${sourceDir}/**/*.html`)
    for (let html of htmls) htmlRender(html)

    const styles = glob.sync(`./${sourceDir}/**/*.{sass,scss}`)
    for (let style of styles) styleRender(style)

    const scripts = glob.sync(`./${sourceDir}/**/*.{js,jsx}`)
    for (let script of scripts) scriptRender(script)
}

try {
    renderer()
} catch (e) {
    console.log(e)
}