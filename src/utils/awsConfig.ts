import AWS from 'aws-sdk';

const awsCreds = {
  accessKeyId: process.env.ACCESS_ID,
  SecretAccessKey: process.env.SECRET_ACCESS,
  sessionToken: process.env.SESSION_TOKEN,
  region: process.env.region,
};

AWS.config.update(awsCreds);

export default awsCreds;
