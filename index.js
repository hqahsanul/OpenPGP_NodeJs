const openpgp=require('openpgp');
const fs = require('fs');
const AWS = require('aws-sdk');
require('dotenv').config();

const uploadS3 =   (Key, data, callback)=> {
  if( Key=="" ){
      callback(null, { "nofile":true } );
  }else{ 
    //  var filePath = file.path;
      var params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Body: data,
          Key: 'ID' + "/encrypt.txt",
          ContentType: 'text',
          ACL: 'public-read'
      };

      return new Promise(  (resolve,reject)=>{
          s3.upload(params, function (err, data) {
              if (err) {
                  reject(err);
              } else {
                  resolve(data);
              }
          });
      });
  }
};


const s3download = function (Key) {
  var params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key:Key
};

  return new Promise((resolve, reject) => {
          s3.getObject(params, function (err, data) {
              if (err) {
                  reject(err);
              } else {
                  console.log("Successfully dowloaded data from  bucket");
                  console.log(data,"0000000000000000000000000000000000000000000000000000000000000000000000000000");
                  resolve(data);
              }
          });
  });
}

// async function Test(){
//   let data=await s3download('ID/1661030062141_LaaZy5EyM-fpFCep66915Xa8.txt');
//   console.log(data)
// }

// Test();

const passphrase= process.env.PASSPHRASE;

async function generate() {
  const { privateKey, publicKey } = await openpgp.generateKey({
    userIDs: [{ name: "AHSANUL", email: "test123@example.com" }],
    curve: "ed25519",
    passphrase: passphrase,
  });
//   console.log(privateKey);
//   console.log(publicKey);
const publicKey_ = await openpgp.readKey({ armoredKey: publicKey });
const privateKey_ = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
    passphrase
});

// const TEXT = fs.readFileSync('someText.txt');
 console.log(publicKey_,privateKey_);

let data=await s3download('ID/1661030062141_LaaZy5EyM-fpFCep66915Xa8.txt');
console.log(data)

let TEXT=data.Body;
let OrginalText=(data.Body).toString('utf8');
//console.log("----------------------------------------------------",OrginalText);

const encrypted = await openpgp.encrypt({

   
    message: await openpgp.createMessage({binary: TEXT}), 
    encryptionKeys: publicKey_,
});

//console.log(encrypted)




//console.log((encrypted.data));

let uploadedEncFile=await uploadS3('ID/Encrypted.txt',encrypted);
//console.log("----------------=======================",uploadedEncFile);

let dataEnc=await s3download('ID/encrypt.txt');

let encText=(dataEnc.Body).toString('utf8');

//console.log(encText)

const message = await openpgp.readMessage({
  armoredMessage: encText 
});

const { data: decrypted, signatures } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey_
});

console.log(decrypted);
//console.log(privateKey_)

}

generate();



