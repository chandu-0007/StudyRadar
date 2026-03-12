const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/resources?subjectId=40184403-bb74-4fec-bf29-caca687c797f',
  method: 'GET',
  headers: {
    // We don't have a token. Instead of trying to fake a token, I can temporarily disable the requireAuth middleware for a single request, or just use a token.
  }
};
