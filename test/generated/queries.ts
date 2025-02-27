// Generated code - 2025-02-27T11:38:52.721Z


import { sql, InferModel, eq, and, isNotNull } from 'drizzle-orm'
import * as qstypes from '../../server/db/gen.qtypes'
import { users, posts, comments } from '../../server/db/schema';
import { ulidFactory } from "ulid-workers";
const ulid = ulidFactory();

 // users queries

const createUsersQry = async (obj: qstypes.userstype, db: any) => {
  obj.id = ulid()
  return db.insert(users).values(obj).returning().get();
}

const getAllUsersQry = async (obj: qstypes.userstype, db: any) => {
  return db.select().from(users).where(
    and(
      eq(users.orgId, obj.orgId ? obj.orgId : '')
      isNotNull(users.id)
      )
     ).all();
}

const getOneUsersQry = async (obj: qstypes.userstype, db: any) => {
  return db.select().from(users).where(
    and(
      eq(users.orgId, obj.orgId ? obj.orgId : '')
      eq(users.id, obj.id ? obj.id : '')
  )).get();
}

const updateUsersQry = async (obj: qstypes.userstype, db: any) => {
  return db.update(users).set(obj).where(
    and(
      eq(users.orgId, obj.orgId ? obj.orgId : '')
      eq(users.id, obj.id ? obj.id : '')
  )).returning().get();
}

const deleteUsersQry = async (obj: qstypes.userstype, db: any) => {
  return db.delete(users).where(
    and(
      eq(users.orgId, obj.orgId ? obj.orgId : '')
      eq(users.id, obj.id ? obj.id : '')
  )).returning().get();
}
 // users queries end 

 // posts queries

const createPostsQry = async (obj: qstypes.poststype, db: any) => {
  obj.id = ulid()
  return db.insert(posts).values(obj).returning().get();
}

const getAllPostsQry = async (obj: qstypes.poststype, db: any) => {
  return db.select().from(posts).where(
    and(
      eq(posts.orgId, obj.orgId ? obj.orgId : '')
      isNotNull(posts.id)
      )
     ).all();
}

const getOnePostsQry = async (obj: qstypes.poststype, db: any) => {
  return db.select().from(posts).where(
    and(
      eq(posts.orgId, obj.orgId ? obj.orgId : '')
      eq(posts.id, obj.id ? obj.id : '')
  )).get();
}

const updatePostsQry = async (obj: qstypes.poststype, db: any) => {
  return db.update(posts).set(obj).where(
    and(
      eq(posts.orgId, obj.orgId ? obj.orgId : '')
      eq(posts.id, obj.id ? obj.id : '')
  )).returning().get();
}

const deletePostsQry = async (obj: qstypes.poststype, db: any) => {
  return db.delete(posts).where(
    and(
      eq(posts.orgId, obj.orgId ? obj.orgId : '')
      eq(posts.id, obj.id ? obj.id : '')
  )).returning().get();
}
 // posts queries end 

 // comments queries

const createCommentsQry = async (obj: qstypes.commentstype, db: any) => {
  obj.id = ulid()
  return db.insert(comments).values(obj).returning().get();
}

const getAllCommentsQry = async (obj: qstypes.commentstype, db: any) => {
  return db.select().from(comments).where(
    and(
      eq(comments.orgId, obj.orgId ? obj.orgId : '')
      isNotNull(comments.id)
      )
     ).all();
}

const getOneCommentsQry = async (obj: qstypes.commentstype, db: any) => {
  return db.select().from(comments).where(
    and(
      eq(comments.orgId, obj.orgId ? obj.orgId : '')
      eq(comments.id, obj.id ? obj.id : '')
  )).get();
}

const updateCommentsQry = async (obj: qstypes.commentstype, db: any) => {
  return db.update(comments).set(obj).where(
    and(
      eq(comments.orgId, obj.orgId ? obj.orgId : '')
      eq(comments.id, obj.id ? obj.id : '')
  )).returning().get();
}

const deleteCommentsQry = async (obj: qstypes.commentstype, db: any) => {
  return db.delete(comments).where(
    and(
      eq(comments.orgId, obj.orgId ? obj.orgId : '')
      eq(comments.id, obj.id ? obj.id : '')
  )).returning().get();
}
 // comments queries end 


const performQueryOne = async (db: any, Query: string) => {
  const result = await db.get(sql.raw(Query))
  return result;
}

const performQueryAll = async (db: any, Query: string) => {
  const result = await db.all(sql.raw(Query))
  return result;
}

// export queries
export {


createUsersQry,
getAllUsersQry,
getOneUsersQry,
updateUsersQry,
deleteUsersQry,

createPostsQry,
getAllPostsQry,
getOnePostsQry,
updatePostsQry,
deletePostsQry,

createCommentsQry,
getAllCommentsQry,
getOneCommentsQry,
updateCommentsQry,
deleteCommentsQry,
}