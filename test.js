const bucket = "s3bucketname";

const AWS = require('aws-sdk');
const S3= new AWS.S3();
exports.handler = async (event, context, callback) => {
    var transcript = await download();
    console.log(transcript);
}

async function download(){
  try {
    // Converted it to async/await syntax just to simplify.
    const data = await S3.getObject(
    {   Bucket: bucket, 
        Key: "Test.json",
        //ResponseContentType: 'application/json'
    }).promise();

    console.log(data,"0000000000000000000000000000000000000000000000000000000000000000000000000000");
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }
  catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: err.message || JSON.stringify(err.message)
    }
  }
}