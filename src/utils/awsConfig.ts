import AWS from 'aws-sdk';

const awsCreds = {
  accessKeyId: process.env.ACCESS_ID,
  secretAccessKey: process.env.SECRET_ACCESS,
  sessionToken: process.env.SESSION_TOKEN,
  region: process.env.REGION,
};

AWS.config.update(awsCreds);

export default awsCreds;
