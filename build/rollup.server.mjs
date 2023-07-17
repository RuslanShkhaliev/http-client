import resolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import minify from 'rollup-plugin-esbuild';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

export const serverBundle = {
    input: 'src/server.ts',
    output: [
        {
            format: 'esm',
            file: './dist/esm/server.mjs',
            sourcemap: true,
            plugins: [
                minify({target: 'es2016'}),
            ],
        },
        {
            format: 'cjs',
            file: './dist/server.js',
            sourcemap: true,
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

export const serverDts = {
    input: './src/server.ts',
    output: [
        {
            format: 'esm',
            file: 'dist/index.d.ts',
        },
    ],
    plugins: [dts()]
}
