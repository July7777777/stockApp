import {get,post} from './http.js';

//基础接口
export const ping = p => get('/ping', p);