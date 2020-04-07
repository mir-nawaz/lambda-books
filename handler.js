'use strict';

import AWS from 'aws-sdk';
import { uuid, isUuid } from 'uuidv4';

const tableName = process.env.TABLE_NAME;
const db = new AWS.DynamoDB.DocumentClient();

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

};

module.exports.add = async event => {
  const body = JSON.parse(event.body);

  // skipping validation for time saving 

  const book = {
    uuid: uuid(),
    name: body.name,
    releaseDate: body.releaseDate,
    authorName: body.authorName
  };

  let res = await db.put({ TableName: tableName, Item: book }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book saved successfully!',
        input: event,
      },
      null,
      2
    ),
  };

};

module.exports.update = async event => {
  const id = event.pathParameters.id;
  const body = JSON.parse(event.body);
  const { name, releaseDate, authorName } = body;

  // skipping validation for time saving 

  const params = {
    Key: {
      uuid: id
    },
    TableName: tableName,
    ConditionExpression: 'attribute_exists(uuid)',
    UpdateExpression: 'SET name = :name, releaseDate = :releaseDate, authorName = :authorName',
    ExpressionAttributeValues: {
      ':name': name,
      ':releaseDate': releaseDate,
      ':authorName': authorName
    },
    ReturnValues: 'ALL_NEW'
  };

  let res = await db.update(params).promise(); 

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book updated successfully!',
        input: event,
      },
      null,
      2
    ),
  };

};

module.exports.delete = async event => {
    // skipping validation for time saving 

  const id = event.pathParameters.id;
  const params = {
    Key: {
      uuid: id
    },
    TableName: tableName
  };

  let res = await db.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book deleted successfully!',
        input: event,
      },
      null,
      2
    ),
  };

};

module.exports.detail = async event => {
  // skipping validation for time saving 

  const id = event.pathParameters.id;

  const params = {
    Key: {
      uuid: id
    },
    TableName: tableName
  };
  
  let res = await db.get(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book detail successfully!',
        book: res
      },
      null,
      2
    ),
  };

};

module.exports.list = async event => {

  // skipping validation for time saving 

  const params = {
    TableName: tableName
  };

  let res = db.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book list successfully!',
        books: res
      },
      null,
      2
    ),
  };

};