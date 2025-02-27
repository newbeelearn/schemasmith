// This file is auto-generated and should NOT be edited manually.
export default {
  "users": {
    "tableMeta": {
      "displayName": "Users"
    },
    "columns": {
      "id": {
        "label": "Id",
        "readOnly": false,
        "expose": "inout"
      },
      "email": {
        "label": "Email",
        "readOnly": false,
        "expose": "inout"
      },
      "password": {
        "label": "Password",
        "readOnly": false,
        "expose": "inout"
      },
      "role": {
        "label": "Role",
        "readOnly": false,
        "expose": "inout"
      },
      "createdAt": {
        "label": "CreatedAt",
        "readOnly": false,
        "expose": "inout"
      },
      "updatedAt": {
        "label": "UpdatedAt",
        "readOnly": false,
        "expose": "inout"
      }
    },
    "indexes": {
      "idx_users_email": {
        "unique": true,
        "expose": false
      },
      "sqlite_autoindex_users_1": {
        "unique": true,
        "expose": false
      }
    },
    "constraints": {
      "pk": {
        "type": "PRIMARY KEY",
        "columns": [
          "id"
        ],
        "name": "pk"
      },
      "sqlite_autoindex_users_1": {
        "type": "UNIQUE",
        "columns": [
          "email"
        ],
        "name": "sqlite_autoindex_users_1"
      }
    }
  },
  "posts": {
    "tableMeta": {
      "displayName": "Posts"
    },
    "columns": {
      "id": {
        "label": "Id",
        "readOnly": false,
        "expose": "inout"
      },
      "userId": {
        "label": "UserId",
        "readOnly": false,
        "expose": "inout"
      },
      "title": {
        "label": "Title",
        "readOnly": false,
        "expose": "inout"
      },
      "content": {
        "label": "Content",
        "readOnly": false,
        "expose": "inout"
      },
      "publishedAt": {
        "label": "PublishedAt",
        "readOnly": false,
        "expose": "inout"
      }
    },
    "indexes": {},
    "constraints": {
      "pk": {
        "type": "PRIMARY KEY",
        "columns": [
          "id"
        ],
        "name": "pk"
      },
      "fk_0": {
        "type": "FOREIGN KEY",
        "columns": [
          "userId"
        ],
        "references": {
          "table": "users",
          "columns": [
            "id"
          ]
        },
        "name": "fk_0"
      }
    }
  },
  "comments": {
    "tableMeta": {
      "displayName": "Comments"
    },
    "columns": {
      "id": {
        "label": "Id",
        "readOnly": false,
        "expose": "inout"
      },
      "postId": {
        "label": "PostId",
        "readOnly": false,
        "expose": "inout"
      },
      "userId": {
        "label": "UserId",
        "readOnly": false,
        "expose": "inout"
      },
      "content": {
        "label": "Content",
        "readOnly": false,
        "expose": "inout"
      },
      "createdAt": {
        "label": "CreatedAt",
        "readOnly": false,
        "expose": "inout"
      }
    },
    "indexes": {},
    "constraints": {
      "pk": {
        "type": "PRIMARY KEY",
        "columns": [
          "id"
        ],
        "name": "pk"
      },
      "fk_0": {
        "type": "FOREIGN KEY",
        "columns": [
          "userId"
        ],
        "references": {
          "table": "users",
          "columns": [
            "id"
          ]
        },
        "name": "fk_0"
      },
      "fk_1": {
        "type": "FOREIGN KEY",
        "columns": [
          "postId"
        ],
        "references": {
          "table": "posts",
          "columns": [
            "id"
          ]
        },
        "name": "fk_1"
      }
    }
  }
};