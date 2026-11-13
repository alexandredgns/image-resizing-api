# Image Processing API

An API for resizing images with Node.js, Express, TypeScript, and Sharp.

## Requirements

- Node.js
- npm

## Installation

```bash
npm install
```

## Usage
```bash
npm start
```

## Image Resizing Endpoint
GET http://localhost:3000/api/images?filename=filename&width=width&height=height

### Example
http://localhost:3000/api/images?filename=fjord&width=300&height=300

## Health Check
GET http://localhost:3000/api/health
