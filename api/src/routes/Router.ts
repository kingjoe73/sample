import fs from 'fs';
import express from 'express';
import { IController } from './APIDecorator';


const controllerPath = `${__dirname}/controllers`;

const loadController = (app: express.Express, appPath:string) => {
    const controllers = fs.readdirSync(controllerPath, {withFileTypes:true});
    controllers.forEach((file:fs.Dirent) => {
        const fname = file.name.replace(/\.ts$/g,'');
        const controller = require(`./controllers/${fname}`).default as IController;
        if (!controller) {
            console.log(`Missing controller or default export in ${file.name}!`);
        } else {
            if (!controller.routePath) {
                console.log(`RoutePath not defined for ${file.name}`);
            } else {
                const routePath = appPath + controller.routePath.replace(/^\/*/,'/').trim();
                console.log(`>>> Loading controller ${fname} with route ${controller.routePath}`);
                app.use(routePath, controller.router);
            }
        }
    });
}

const injectRoutes = (app: express.Express, appPath:string) => {
    loadController(app, appPath);
}

export default injectRoutes;