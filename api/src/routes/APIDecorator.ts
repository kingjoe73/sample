import express, { Router } from 'express';

const getRouter = ()=>(router=router||Router());

const ResolveHttpHandler = (method:string, path:string) => {
    return (target:any, key:any) => {
        const r = getRouter();
        (r as any)[method](path, target[key]);
    }
}

export let router:express.Router = null as any;

export const Controller = {
    get:(path:string) => ResolveHttpHandler('get', path),
    post:(path:string) => ResolveHttpHandler('get', path),
    put:(path:string) => ResolveHttpHandler('get', path),
    patch:(path:string) => ResolveHttpHandler('get', path),
    delete:(path:string) => ResolveHttpHandler('get', path),
    routePath:(routePath:string) => {
        return (target:any) => {
            target.router = router;
            target.routePath = routePath;
            router = null as any;
        }
    }
}

export interface IController {
    router: express.Router;
    routePath:string;
}
