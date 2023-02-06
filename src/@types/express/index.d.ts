import * as express from "express";
import { TQueryGetMoviesResult } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      DataBase: {
        queryResult: TQueryGetMoviesResult;
      };
    }
  }
}
