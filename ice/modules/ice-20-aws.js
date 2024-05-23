/**
 * @file Ingress-ICE, Amazon S3 interface
 * @license MIT
 * @author c2nprds
 */

/*global announce */
/*global config */

const AWS = require('aws-sdk');
const fs = require('fs');

/**
 * Upload AWS S3
 * @see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
 * @see ALC https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
 * @param {String} key - AWS S3 accessKeyId
 * @param {String} secret - AWS S3 secretKeyId
 * @param {String} bucket - AWS S3 bucket name
 * @param {String} acl - AWS S3 access control list
 * @param {String} path - Screenshot filepath
 * @param {Boolean} remove - delete current file
 * @author c2nprds
 */
async function uploadS3(key, secret, bucket, acl, path, remove) {
  AWS.config.update({
    accessKeyId: key,
    secretAccessKey: secret
  });

  const s3 = new AWS.S3();
  const fileContent = fs.readFileSync(path);
  const params = {
    Bucket: bucket,
    Key: path.split('/').pop(),
    Body: fileContent,
    ACL: acl
  };

  try {
    const data = await s3.upload(params).promise();
    announce('Successfully uploaded file to Amazon S3');
    if (remove) {
      fs.unlinkSync(path);
    }
  } catch (err) {
    announce('Failed to upload file to Amazon S3: ' + err.message);
  }
}
