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
      "url": "http://localhost:3000",
      "description": "Development server"
    },
    {
      "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/",
      "description": "Temp Staging server (hosted by Mike)"
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
                "type": "object",
                "properties": {
                  "lights": {
                    "type": "array",
                    "items": {
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
                    }
                  }
                }
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
            "description": "Auto generated using Swagger Inspector",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        },
        "servers": [
          {
            "url": "http://localhost:3000"
          },
          {
            "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/"
          }
        ]
      },
      "servers": [
        {
          "url": "http://localhost:3000"
        },
        {
          "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/"
        }
      ]
    },
    "/api/node/light": {
      "get": {
        "description": "Auto generated using Swagger Inspector",
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
            "schema": {
              "type": "string"
            },
            "example": "1"
          }
        ],
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
      },
      "post": {
        "description": "Auto generated using Swagger Inspector",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
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
        },
        "servers": [
          {
            "url": "http://localhost:3000"
          },
          {
            "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/"
          }
        ]
      },
      "servers": [
        {
          "url": "http://localhost:3000"
        },
        {
          "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/"
        }
      ]
    },
    "/api/node/admin": {
      "patch": {
        "description": "Auto generated using Swagger Inspector",
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
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
              },
              "examples": {
                "0": {
                  "value": "    {\n        \"location\": \"EASTBOUND HW 88 and Macville\",\n        \"ipaddress\": \"1932.168.1.1\",\n        \"isalive\": 1\n    }"
                }
              }
            }
          }
        },
        "responses": {
          "201": {
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
      },
      "post": {
        "description": "Auto generated using Swagger Inspector",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
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
            "description": "Auto generated using Swagger Inspector",
            "content": {
              "application/json; charset=utf-8": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        },
        "servers": [
          {
            "url": "http://localhost:3000"
          }
        ]
      },
      "delete": {
        "description": "Auto generated using Swagger Inspector",
        "parameters": [
          {
            "name": "nodeId",
            "in": "query",
            "schema": {
              "type": "string"
            },
            "example": "2"
          }
        ],
        "responses": {
          "200": {
            "description": "Auto generated using Swagger Inspector",
            "content": {
              "text/html; charset=utf-8": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        },
        "servers": [
          {
            "url": "http://localhost:3000"
          },
          {
            "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/"
          }
        ]
      },
      "servers": [
        {
          "url": "http://localhost:3000"
        },
        {
          "url": "http://ec2-3-141-8-69.us-east-2.compute.amazonaws.com:3000/"
        }
      ]
    }
  }
};