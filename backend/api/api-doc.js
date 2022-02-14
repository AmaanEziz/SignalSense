module.exports = 
{
  "openapi": "3.0.0",
  "info": {
    "title": "Phase Sense API",
    "description": "Serverside API for Phase Sense",
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:3000/",
      "description": "Local Host"
    },
    {
      "url": "https://api_url_production",
      "description": "Prod server"
    }
  ],
  "tags": [
    {
      "name": "CRUD Operations",
      "description": "Data input/output"
    },
    {
      "name": "Admin API",
      "description": "Operations for administrating the API"
    }
  ],
  "paths": {
    "/getNodes":{
      "get": {
        "tags": [
          "CRUD Operations"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/nodeArray"
                }
              }
            }
          }
        }
      }
    },
    "/nodelights": {
      "get": {
        "tags": [
          "CRUD Operations"
        ],
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
            "required": true,
            "description": "The location of the node",
            "schema": {
              "type": "integer",
              "example": 1
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/lightArray"
                }
              }
            }
          }
        }
      }
    },
    "/updateLight": {
      "post": {
        "tags": [
          "CRUD Operations"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Light"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "sets the light state"
          }
        }
      }
    },
    "/node":{
      "post": {
        "tags": [
          "Admin API"
        ],
        "parameters": [
          {
            "name": "location",
            "in": "query",
            "required": true,
            "description": "The location of the node",
            "schema": {
              "type": "string",
              "example": "Northbound Lodi Av and Harney"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Node was created",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string",
                  "example": "Added new node"
                }
              }
            }
          }
        }
      }
    },
    "/node":{
      "delete": {
        "tags": [
          "Admin API"
        ],
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
            "required": true,
            "description": "The ID of the node to remove",
            "schema": {
              "type": "integer",
              "example": 1
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Node was removed",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "string",
                  "example": "removed the node"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "location": {
        "type": "string"
      },
      "node_id": {
        "type": "integer"
      },
      "node":{
        "type": "object",
        "properties": {
          "node_id": {
            "$ref": "#/components/schemas/node_id"
          },
          "location": {
            "$ref": "#/components/schemas/location"
          }
        }
      },
      "nodeArray": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/node"
        }
      },
      "lightArray": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/lightArray_inner"
        }
      },
      "Light": {
        "type": "object",
        "properties": {
          "light_id": {
            "type": "integer"
          },
          "node_id": {
            "type": "integer"
          },
          "state": {
            "type": "string"
          },
          "light_phase": {
            "type": "integer"
          }
        },
        "description": "A traffic light object"
      },
      "lightArray_inner": {
        "type": "object",
        "properties": {
          "light": {
            "$ref": "#/components/schemas/Light"
          }
        }
      }
    }
  }
};