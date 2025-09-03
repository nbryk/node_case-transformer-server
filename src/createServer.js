// import http from 'node:http';
// import { convertToCase } from './convertToCase';
const http = require('http');
const { convertToCase } = require('./convertToCase');

function createServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const toCase = url.searchParams.get('toCase');
    const text = url.pathname.slice(1);

    const correctCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];
    const errors = [];

    if (!text) {
      errors.push({
        message: `Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
      });
    }

    if (!toCase) {
      errors.push({
        message: `"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".`,
      });
    } else if (!correctCases.includes(toCase)) {
      errors.push({
        message: `This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.`,
      });
    }

    res.setHeader('Content-type', 'application/json');

    if (errors.length > 0) {
      res.statusCode = 400;

      const errorPayload = { errors: errors };

      res.end(JSON.stringify(errorPayload));

      return;
    }

    const { originalCase, convertedText } = convertToCase(text, toCase);

    const responsePayload = {
      originalCase: originalCase,
      targetCase: toCase,
      originalText: text,
      convertedText: convertedText,
    };

    res.end(JSON.stringify(responsePayload));
  });

  return server;
}

module.exports = { createServer };
