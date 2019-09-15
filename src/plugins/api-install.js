import Vue from 'vue';
import mapKeys from 'lodash/mapKeys';
import Api from '../config/http/request';
import * as Svc from '../service';

export const apiBasic = new Api();
mapKeys(Svc, (ctx, name) => apiBasic.registerApi(name, ctx.url, ctx));

Vue.prototype.$api = apiBasic;
