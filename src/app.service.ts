import { Injectable } from "@nestjs/common";
import express from "express";
import fetch from "node-fetch";
import proxies from "./proxies.json";

@Injectable()
export class AppService {
  constructor() {
    if (proxies.length === 0)
      throw new Error("Missing proxy configuration");
  }

  async splitRequest(req: express.Request) {
    return await Promise.all(
      proxies.map((proxy: any) => {
        const url = new URL(proxy.target);
        return fetch(
          proxy.ignorePath ? proxy.target : url.origin + req.originalUrl,
          {
            method: req.method,
            headers: {
              ...(req.headers as any),
              host: proxy.rewriteHost ? url.host : req.headers.host,
            },
            body:
              ["GET", "HEAD"].indexOf(req.method) !== -1
                ? undefined
                : req.headers["content-type"]?.includes("application/json")
                ? JSON.stringify(req.body)
                : new URLSearchParams(req.body),
          },
        )
          .then((resp) => resp.status)
          .catch((e) => {
            console.log("fetch failed to", proxy.target, e);
            return -1;
          });
      }),
    );
  }
}
