{
  "openapi": "3.0.0",
  "info": {
    "title": "Generated API",
    "description": "Auto-generated API from database schema",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "/api",
      "description": "API Server"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Retrieve all users records",
        "description": "Returns a list of all users entries",
        "operationId": "getAllUsers",
        "tags": [
          "users"
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsersArrayResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          }
        }
      },
      "post": {
        "summary": "Create a new users record",
        "description": "Creates a new users entry",
        "operationId": "createUsers",
        "tags": [
          "users"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UsersInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsersResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "summary": "Retrieve a users record by ID",
        "description": "Returns a specific users entry",
        "operationId": "getOneUsers",
        "tags": [
          "users"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the users to retrieve",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsersResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "put": {
        "summary": "Update a users record",
        "description": "Updates an existing users entry",
        "operationId": "updateUsers",
        "tags": [
          "users"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the users to update",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UsersInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UsersResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "delete": {
        "summary": "Delete a users record",
        "description": "Deletes an existing users entry",
        "operationId": "deleteUsers",
        "tags": [
          "users"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the users to delete",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deleted successfully"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      }
    },
    "/posts": {
      "get": {
        "summary": "Retrieve all posts records",
        "description": "Returns a list of all posts entries",
        "operationId": "getAllPosts",
        "tags": [
          "posts"
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostsArrayResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          }
        }
      },
      "post": {
        "summary": "Create a new posts record",
        "description": "Creates a new posts entry",
        "operationId": "createPosts",
        "tags": [
          "posts"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostsInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostsResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          }
        }
      }
    },
    "/posts/{id}": {
      "get": {
        "summary": "Retrieve a posts record by ID",
        "description": "Returns a specific posts entry",
        "operationId": "getOnePosts",
        "tags": [
          "posts"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the posts to retrieve",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostsResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "put": {
        "summary": "Update a posts record",
        "description": "Updates an existing posts entry",
        "operationId": "updatePosts",
        "tags": [
          "posts"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the posts to update",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostsInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostsResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "delete": {
        "summary": "Delete a posts record",
        "description": "Deletes an existing posts entry",
        "operationId": "deletePosts",
        "tags": [
          "posts"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the posts to delete",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deleted successfully"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      }
    },
    "/comments": {
      "get": {
        "summary": "Retrieve all comments records",
        "description": "Returns a list of all comments entries",
        "operationId": "getAllComments",
        "tags": [
          "comments"
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentsArrayResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          }
        }
      },
      "post": {
        "summary": "Create a new comments record",
        "description": "Creates a new comments entry",
        "operationId": "createComments",
        "tags": [
          "comments"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CommentsInput"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentsResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          }
        }
      }
    },
    "/comments/{id}": {
      "get": {
        "summary": "Retrieve a comments record by ID",
        "description": "Returns a specific comments entry",
        "operationId": "getOneComments",
        "tags": [
          "comments"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the comments to retrieve",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentsResponse"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "put": {
        "summary": "Update a comments record",
        "description": "Updates an existing comments entry",
        "operationId": "updateComments",
        "tags": [
          "comments"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the comments to update",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CommentsInput"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentsResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid input"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      },
      "delete": {
        "summary": "Delete a comments record",
        "description": "Deletes an existing comments entry",
        "operationId": "deleteComments",
        "tags": [
          "comments"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID of the comments to delete",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Deleted successfully"
          },
          "401": {
            "description": "Unauthorized"
          },
          "403": {
            "description": "Forbidden"
          },
          "404": {
            "description": "Not found"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "UsersResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        },
        "required": [
          "id"
        ]
      },
      "UsersInput": {
        "type": "object",
        "properties": {},
        "required": []
      },
      "UsersArrayResponse": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/UsersResponse"
        }
      },
      "PostsResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        },
        "required": [
          "id"
        ]
      },
      "PostsInput": {
        "type": "object",
        "properties": {},
        "required": []
      },
      "PostsArrayResponse": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/PostsResponse"
        }
      },
      "CommentsResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        },
        "required": [
          "id"
        ]
      },
      "CommentsInput": {
        "type": "object",
        "properties": {},
        "required": []
      },
      "CommentsArrayResponse": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/CommentsResponse"
        }
      }
    },
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ]
}