module.exports = 
{
  "openapi": "3.0.1",
  "info": {
    "title": "Signal Sense API",
    "description": "This is the API for Signal Sense.<br>",
    "version": "1.0"
  },
  "servers": [
    {
      "url": "http://ip-172-31-13-117.us-west-1.compute.internal:3000/",
      "description": "AWS Prod Backend"
    },
    {
      "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/",
      "description": "Temp Staging server (hosted by Mike)"
    },
    {
      "url": "http://localhost:3000",
      "description": "Development server"
    }
  ],
  "paths": {
    "/api/node/setLights": {
      "patch": {
        "description": "Auto generated using Swagger Inspector",
        "parameters": [
          {
            "name": "node_id",
            "in": "query",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            },
            "example": "1"
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/node_setLights_body"
              },
              "examples": {
                "0": {
                  "value": "{\r\n    \"lights\": [\r\n        {\"id\" : 1, \"light_phase\" : 3, \"state\" : \"GREEN\"},\r\n        {\"id\" : 2, \"light_phase\" : 3, \"state\" : \"GREEN\"},\r\n        {\"id\" : 3, \"light_phase\" : 3, \"state\" : \"GREEN\"}\r\n    ]\r\n}\r\n"
                },
                "1": {
                  "value": "{\r\n    \"lights\": [\r\n        {\"id\" : 1, \"light_phase\" : 3, \"state\" : \"LEFT_GREEN\"},\r\n        {\"id\" : 2, \"light_phase\" : 3, \"state\" : \"GREEN\"},\r\n        {\"id\" : 3, \"light_phase\" : 3, \"state\" : \"GREEN\"}\r\n    ]\r\n}\r\n"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "The server processed the change and already has a photo of this light/state combonation",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/inline_response_200"
                }
              }
            }
          },
          "201": {
            "description": "The server processed the change and has found a new combonation of light/states, and requires a a photo upload.",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/inline_response_201"
                }
              }
            }
          }
        }
      }
    },
    "/api/node/light": {
      "get": {
        "description": "Gets an array of light objects for a node",
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            },
            "example": "1"
          }
        ],
        "responses": {
          "200": {
            "description": "Found node and lights",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "type": "array",
                  "example": [
                    {
                      "id": 1,
                      "light_id": 1,
                      "state": "GREEN",
                      "light_phase": 3
                    },
                    {
                      "id": 2,
                      "light_id": 2,
                      "state": "GREEN",
                      "light_phase": 3
                    },
                    {
                      "id": 3,
                      "light_id": 3,
                      "state": "GREEN",
                      "light_phase": 3
                    }
                  ],
                  "items": {
                    "$ref": "#/components/schemas/light"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "description": "Auto generated using Swagger Inspector",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/node_light_body"
              },
              "examples": {
                "0": {
                  "value": "    {\n        \"node_id\": 2,\n        \"state\": \"GREEN\",\n        \"light_phase\": 0\n    }"
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Auto generated using Swagger Inspector",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/api/node/list": {
      "get": {
        "description": "Gets all nodes in DB",
        "responses": {
          "200": {
            "description": "Array of available nodes returned",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/node"
                },
                "example": [
                  {
                    "id": 1,
                    "location": "SOUTHBOUND State University Dr and College Town Dr",
                    "ipaddress": "192.10.15.1",
                    "isalive": 1
                  },
                  {
                    "id": 2,
                    "location": "NORTHBOUND State University Dr and College Town Dr",
                    "ipaddress": "192.10.15.2",
                    "isalive": 1
                  }
                ]
              }
            }
          }
        }
      }
    },
    "/api/node/admin": {
      "post": {
        "description": "Adds a node to the system",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/node"
              },
              "examples": {
                "0": {
                  "value": "    {\n        \"location\": \"NORTHBOUND HW 88 and Macville\",\n        \"ipaddress\": \"1932.168.1.1\",\n        \"isalive\": 1\n    }"
                },
                "1": {
                  "value": "    {\n        \"location\": \"EASTBOUND HW 88 and Macville\",\n        \"ipaddress\": \"1932.168.1.1\",\n        \"isalive\": 1\n    }"
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Node added and node, id returned",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/node"
                },
                "example": {
                  "id": 1,
                  "location": "NORTHBOUND HW 88 and Macville",
                  "ipaddress": "1932.168.1.1",
                  "isalive": 1
                }
              }
            }
          }
        }
      },
      "delete": {
        "description": "Remove a node and it's lights permanently",
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            },
            "example": "2"
          }
        ],
        "responses": {
          "200": {
            "description": "Node and it's lights removed",
            "content": {
              "text/html; charset=utf-8": {
                "schema": {
                  "type": "string"
                },
                "example": "Node has been removed"
              }
            }
          }
        }
      },
      "patch": {
        "description": "Updates a node's meta data",
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string"
            },
            "example": "1"
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/node_admin_body"
              },
              "examples": {
                "0": {
                  "value": {
                    "id": 1,
                    "location": "NORTHBOUND State University Dr and College Town Dr",
                    "ipaddress": "192.10.15.1",
                    "isalive": 1
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "The updated node was updated and returned",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "$ref": "#/components/schemas/node"
                },
                "example": {
                  "id": 1,
                  "location": "SOUTHBOUND State University Dr and College Town Dr",
                  "ipaddress": "192.10.15.1",
                  "isalive": 1
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
      "node": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "location": {
            "type": "string"
          },
          "ipaddress": {
            "type": "string"
          },
          "isalive": {
            "type": "integer"
          }
        }
      },
      "light": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "node_id": {
            "type": "integer"
          },
          "light_phase": {
            "type": "integer"
          },
          "state": {
            "type": "string"
          }
        }
      },
      "apinodesetLights_lights": {
        "type": "object",
        "properties": {
          "light_phase": {
            "type": "integer"
          },
          "id": {
            "type": "integer"
          },
          "state": {
            "type": "string"
          }
        }
      },
      "node_setLights_body": {
        "type": "object",
        "properties": {
          "lights": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/apinodesetLights_lights"
            }
          }
        }
      },
      "inline_response_200": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "example": {
          "status": "REGISTERD"
        }
      },
      "inline_response_201": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string"
          },
          "node_image": {
            "type": "string"
          }
        },
        "example": {
          "status": "NOT_REGISTERD",
          "node_image": "1_00010001"
        }
      },
      "node_light_body": {
        "type": "object",
        "properties": {
          "light_phase": {
            "type": "integer"
          },
          "state": {
            "type": "string"
          },
          "node_id": {
            "type": "integer"
          }
        }
      },
      "node_admin_body": {
        "type": "object",
        "properties": {
          "ipaddress": {
            "type": "string"
          },
          "isalive": {
            "type": "integer"
          },
          "location": {
            "type": "string"
          }
        }
      }
    }
  }
};