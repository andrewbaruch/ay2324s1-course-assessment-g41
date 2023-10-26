import esbuild from 'esbuild'
import fs from 'fs/promises'
import { glob } from 'glob'

const microserviceFiles = await glob('microservices/collaboration/src/**/*.ts', { ignore: 'node_modules/**' })
const sharedFiles = await glob('shared/**/*.ts', { ignore: 'node_modules/**' })

const allFiles = [...microserviceFiles, ...sharedFiles]

const pkg = await fs.readFile('package.json').then(JSON.parse)

const result = await esbuild.build({
  entryPoints: allFiles,
  bundle: true,
  outdir: 'dist',
  metafile: true,
  external: [...Object.keys(pkg.dependencies)],
  jsx: 'automatic',
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  banner: {
    js: [
      `import { createRequire as topLevelCreateRequire } from 'module';`,
      `global.require = topLevelCreateRequire(import.meta.url);`,
    ].join('\n'),
  },
  outExtension: {
    '.js': '.mjs',
  },
})

console.log('Built')
