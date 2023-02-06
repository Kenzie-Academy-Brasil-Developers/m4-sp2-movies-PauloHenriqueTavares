import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import {
  IMoviesRequest,
  IMoviesResponse,
  TQueryGetMoviesResult,
} from "./interfaces";

export const getMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  let page = Number(request.query.page) || 1;
  let perPage = Number(request.query.perPage) || 5;

  const query: string = `
    SELECT * FROM movies
    OFFSET $1 LIMIT $2;
      `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [perPage * (page - 1), perPage],
  };

  const queryResult = await client.query(queryConfig);

  return response.status(201).json(queryResult.rows);
};

export const postMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const newMovie: IMoviesRequest = request.body;
  const database = request.DataBase.queryResult;

  const dataBaseIncluds: boolean = database.rows.every((e: IMoviesResponse) => {
    console.log(e);
    if (e.name === newMovie.name) {
      return false;
    } else {
      return true;
    }
  });

  if (!dataBaseIncluds) {
    return response.status(400).json({ message: "Name alredy exists" });
  }

  const queryString: string = `
INSERT INTO 
   movies(name, description, duration,price)
VALUES 
    ($1, $2, $3, $4)
RETURNING *;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: Object.values(newMovie),
  };

  const queryResult: TQueryGetMoviesResult = await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

export const deleteMovie = async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
  DELETE FROM 
      movies
    WHERE
    id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return response.status(404).json({ message: "movie not found" });
  }

  return response.status(200).json({ message: "movie deleted" });
};

export const patchMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const newData = Object.values(request.body);
  const keysData = Object.keys(request.body);

  const formatString: string = format(
    `
UPDATE 
   movies
SET(%I) = ROW(%L)
WHERE 
    id = $1
RETURNING *;
`,
    keysData,
    newData
  );

  const queryConfig: QueryConfig = {
    text: formatString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return response.status(404).json({ message: "movie not found" });
  }
  console.log(queryResult.rows[0]);

  return response.json(queryResult.rows[0]);
};
