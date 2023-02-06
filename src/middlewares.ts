import { NextFunction, Request, Response } from "express";
import { client } from "./database";

export const middlewareGetDataBase = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const query: string = `
    SELECT
        *
    FROM
        movies
      `;
  const queryResult = await client.query(query);

  request.DataBase = {
    queryResult: queryResult,
  };

  return next();
};
