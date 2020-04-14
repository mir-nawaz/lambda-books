'use strict';

const AWS = require('aws-sdk');
const { uuid } =  require('uuidv4');

const tableName = process.env.BOOKS_TABLE;
const dbEndpoint = process.env.DYNAMODB_ENDPOINT;
const IS_OFFLINE = process.env.IS_OFFLINE;

let options = {};

if (IS_OFFLINE === 'true') {
  options = {
    region: 'localhost',
    endpoint: dbEndpoint,
  }
}

const db = new AWS.DynamoDB.DocumentClient(options);

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!'
      },
      null,
      2
    ),
  };

};

module.exports.add = async event => {
  const body = JSON.parse(event.body);

  // skipping validation for time saving 
  const id = uuid(); 
  
  const book = {
    bookID: id,
    bookName: body.bookName,
    releaseDate: new Date().getTime(),
    authorName: body.authorName
  };
  
  await db.put({ TableName: tableName, Item: book }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book saved successfully!',
        bookID: id
      },
      null,
      2
    ),
  };

};

module.exports.update = async event => {
  const id = event.pathParameters.id;

  // skipping validation for time saving 

  const body = JSON.parse(event.body);
  const { bookName, authorName } = body;
  const releaseDate = new Date().getTime();


  const params = {
    Key: { bookID: id },
    TableName: tableName,
    ConditionExpression: 'attribute_exists(bookID)',
    UpdateExpression: 'SET bookName = :bookName, releaseDate = :releaseDate, authorName = :authorName',
    ExpressionAttributeValues: {
      ':bookName': bookName,
      ':releaseDate': releaseDate,
      ':authorName': authorName
    },
    ReturnValues: 'ALL_NEW'
  };

  let result = await db.update(params).promise(); 

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book updated successfully!',
        book: result.Attributes
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
    Key: { bookID: id },
    TableName: tableName
  };

  await db.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book deleted successfully!',
        uuid: id
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
    Key: { bookID: id },
    TableName: tableName
  };
  
  let results = await db.get(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book detail successfully!',
        book: results.Item || {}
      },
      null,
      2
    ),
  };

};

module.exports.list = async event => {

  let result = await db.scan({TableName: tableName}).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Book list successfully!',
        books: result.Items || []
      },
      null,
      2
    ),
  };

};