// Generated code - 2025-02-25T11:13:42.513Z

export const users = {
  fields: {
  "id": {
    "cid": 0,
    "name": "id",
    "type": "INTEGER",
    "notnull": 0,
    "dflt_value": null,
    "pk": 1
  },
  "email": {
    "cid": 1,
    "name": "email",
    "type": "TEXT",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "password": {
    "cid": 2,
    "name": "password",
    "type": "TEXT",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "role": {
    "cid": 3,
    "name": "role",
    "type": "TEXT",
    "notnull": 1,
    "dflt_value": "'user'",
    "pk": 0
  },
  "createdAt": {
    "cid": 4,
    "name": "createdAt",
    "type": "DATETIME",
    "notnull": 0,
    "dflt_value": "CURRENT_TIMESTAMP",
    "pk": 0
  },
  "updatedAt": {
    "cid": 5,
    "name": "updatedAt",
    "type": "DATETIME",
    "notnull": 0,
    "dflt_value": "CURRENT_TIMESTAMP",
    "pk": 0
  }
},
  tableMetadata: {
  "displayName": "System Users"
},
  columnMetadata: {
  "id": {
    "label": "User ID",
    "readOnly": true
  },
  "email": {
    "label": "Email Address",
    "validation": "email",
    "required": true,
    "uiComponent": "EmailInput",
    "prefix": ""
  }
},
  indexes: {
  "idx_users_email": {
    "seq": 0,
    "name": "idx_users_email",
    "unique": 1,
    "origin": "c",
    "partial": 0,
    "columns": [
      "email"
    ]
  },
  "sqlite_autoindex_users_1": {
    "seq": 1,
    "name": "sqlite_autoindex_users_1",
    "unique": 1,
    "origin": "u",
    "partial": 0,
    "columns": [
      "email"
    ]
  }
},
  indexMetadata: {},
};

export const posts = {
  fields: {
  "id": {
    "cid": 0,
    "name": "id",
    "type": "INTEGER",
    "notnull": 0,
    "dflt_value": null,
    "pk": 1
  },
  "userId": {
    "cid": 1,
    "name": "userId",
    "type": "INTEGER",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "title": {
    "cid": 2,
    "name": "title",
    "type": "TEXT",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "content": {
    "cid": 3,
    "name": "content",
    "type": "TEXT",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "publishedAt": {
    "cid": 4,
    "name": "publishedAt",
    "type": "DATETIME",
    "notnull": 0,
    "dflt_value": null,
    "pk": 0
  }
},
  tableMetadata: {
  "expose": "inout"
},
  columnMetadata: {},
  indexes: {},
  indexMetadata: {},
};

export const comments = {
  fields: {
  "id": {
    "cid": 0,
    "name": "id",
    "type": "INTEGER",
    "notnull": 0,
    "dflt_value": null,
    "pk": 1
  },
  "postId": {
    "cid": 1,
    "name": "postId",
    "type": "INTEGER",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "userId": {
    "cid": 2,
    "name": "userId",
    "type": "INTEGER",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "content": {
    "cid": 3,
    "name": "content",
    "type": "TEXT",
    "notnull": 1,
    "dflt_value": null,
    "pk": 0
  },
  "createdAt": {
    "cid": 4,
    "name": "createdAt",
    "type": "DATETIME",
    "notnull": 0,
    "dflt_value": "CURRENT_TIMESTAMP",
    "pk": 0
  }
},
  tableMetadata: {},
  columnMetadata: {},
  indexes: {},
  indexMetadata: {},
};

