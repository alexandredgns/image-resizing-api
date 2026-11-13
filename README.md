# Image Processing API

An API for resizing images using Node.js, Express, TypeScript, and Sharp.

## Installation

```bash
npm install
```

## Running the API

Start the server using the project's start script:

```bash
npm start
```

The examples below assume the server runs on port `3000`.

## Usage

### Resize an image

**Endpoint:** `GET /api/images`

**URL:**

```text
http://localhost:3000/api/images?filename=<filename>&width=<width>&height=<height>
```

**Example:**

```text
http://localhost:3000/api/images?filename=fjord&width=300&height=300
```

The `filename` value should identify an image in the `images` directory. The `width` and `height` values must be positive integers. If the filename does not include an extension, the API looks for a `.jpg` image.

For example, the request above looks for `images/fjord.jpg` and returns the resized image. Processed images are saved in `images/processed`.

### Required query parameters

| Parameter | Description |
| :--- | :--- |
| `filename` | Name of the source image, with or without a supported extension |
| `width` | Target width in pixels; must be a positive integer |
| `height` | Target height in pixels; must be a positive integer |

## Error Responses

The API returns an error response when required parameters are missing or invalid, the source image cannot be found, or image processing fails.
