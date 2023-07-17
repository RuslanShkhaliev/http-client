import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import minify from 'rollup-plugin-esbuild';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

export const browserBundle = {
    input: 'src/browser.ts',
    output: [
        {
            format: 'esm',
            file: './dist/esm/browser.mjs',
            sourcemap: true,
            plugins: [
                minify({target: 'es2016'}),
            ],
        },
    ],
    plugins: [
        peerDepsExternal({includeDependencies: true}),
        typescript({
            tsconfig: 'tsconfig.json',
        }),
        resolve({
            module: true,
            main: true,
            browser: true,
        }),
    ],
}

export const browserDts = {
    input: './src/browser.ts',
    output: [
        {
            format: 'esm',
            file: 'dist/esm/index.d.ts',
        },
    ],
    plugins: [dts()]
}
