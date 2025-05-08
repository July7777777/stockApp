import {get} from './http.js';

//基础接口
export const ping = p => get('/base/ping', p);