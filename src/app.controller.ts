import {
  All,
  Controller,
  Query,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import express from "express";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  split(@Query("x-secret") secret: string, @Req() req: express.Request) {
    if (process.env.SECRET && process.env.SECRET !== secret)
      throw new UnauthorizedException();
    return this.appService.splitRequest(req);
  }
}
