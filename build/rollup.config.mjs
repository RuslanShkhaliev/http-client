import {browserBundle, browserDts} from './rollup.browser.mjs';
import {serverBundle, serverDts} from './rollup.server.mjs';


export default [
    browserBundle,
    browserDts,
    serverBundle,
    serverDts,
]
