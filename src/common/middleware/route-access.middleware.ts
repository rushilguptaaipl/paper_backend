import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();

export function RouteAccess(req: Request, res: Response, next: NextFunction) {

    console.log("req == >" , req)
    console.log("configService.get('APP_ACCESS_TOKEN') == >" , configService.get('APP_ACCESS_TOKEN'))
    if(!req.headers.app_access_token || (req.headers.app_access_token != configService.get('APP_ACCESS_TOKEN'))){
        next();
        // const unauthorised = new UnauthorizedException('Restricted App');
        // const response  = {
        //     'errors':[{'message':'Restricted App' , 'extensions':{'code' : 'UNAUTHENTICATED' , 'response' : unauthorised.getResponse() }}] , 'data':null}
        // res.send(response)
        
    }else{
        next();
   }
  

};