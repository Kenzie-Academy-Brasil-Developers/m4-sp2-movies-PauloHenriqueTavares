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
  // let sort = request.query.sort;
  // let order = request.query.sort;

  const query: string = `
    SELECT * FROM movies

    OFFSET $1 LIMIT $2;
      `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [perPage * (page - 1), perPage],
  };

  const baseUrl: string = `http://localhost:3000/movies`;
  const prevPage: string = `${baseUrl}?page=${page - 1}&perPage=${perPage}`;
  const nextPage: string = `${baseUrl}?page=${page + 1}&perPage=${perPage}`;

  const queryResult = await client.query(queryConfig);
  console.log(queryResult.rowCount);
  if (queryResult.rowCount === 0) {
    return response.status(404).json("Movies not found");
  }

  const pagination = {
    prevPage,
    nextPage,
    count: queryResult.rowCount,
    data: queryResult.rows,
  };

  return response.status(201).json(pagination);
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
    return response.status(400).json({ message: "Movie already exists." });
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
    return response.status(404).json({ message: "Movie not found." });
  }

  return response.status(204);
};

export const patchMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const newData = Object.values(request.body);
  const data = request.body;
  const keysData = Object.keys(request.body);
  const dataBase = request.DataBase.queryResult;

  const dataBaseIncluds: boolean = dataBase.rows.every((e: IMoviesResponse) => {
    if (e.name === data.name) {
      return false;
    } else {
      return true;
    }
  });
  if (!dataBaseIncluds) {
    return response.status(400).json("Movie already exists.");
  }
  console.log(dataBaseIncluds);

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
    return response.status(404).json({ message: "Movie not found." });
  }

  return response.json(queryResult.rows[0]);
};
