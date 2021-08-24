import { Controller } from "../APIDecorator";
import { EC2Services } from '../../services/EC2Services';
import express from 'express';

@Controller.routePath('/aws')
export default class AWSServiceController {

    @Controller.get('/regions')
    public async getAllRegions(req:express.Request, res:express.Response) {
        try{
            const resp = await EC2Services.getAllRegions();
            return res.status(200).send(resp);
        } catch (e) {
            return res.status(500).send({error:e.message});
        }
    }

    @Controller.get('/vpc')
    public async getVpcs(req:express.Request, res:express.Response) {
        try{
            const { region } = req.query;
            if (!region) {
                return res.status(422).send("Missing parameter 'region'");
            }
            const resp = await EC2Services.getVpcs(region as string);
            return res.status(200).send(resp);

        } catch (e) {
            return res.status(500).send({error:e.message});
        }
    }

    @Controller.get('/subnets')
    public async getSubnets(req:express.Request, res:express.Response) {
        try{
            const { region, vpcId } = req.query;
            if (!region) {
                return res.status(422).send({error:"Missing parameter 'region'"});
            }
            if (!vpcId) {
                return res.status(422).send({error:"Missing parameter 'vpcId'"});
            }

            const resp = await EC2Services.getSubnets(region as string, (vpcId as string).split(","));
            return res.status(200).send(resp);

        } catch (e) {
            return res.status(500).send({error:e.message});
        }
    }
}