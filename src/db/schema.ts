import { relations } from 'drizzle-orm';
import {
  integer,
  serial,
  text,
  varchar,
  timestamp,
  primaryKey,
  pgTable,
} from 'drizzle-orm/pg-core';

//users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone_number', { length: 256 }),
  address: varchar('address', { length: 256 }),
  score: integer('score'),
});

//one to one relationship
//profiels table
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  bio: text('bio'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

//one to many relationship
//posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
  text: varchar('text', { length: 256 }),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

//many to many relationship
//categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

//join table
//postCategories table
export const postOnCategories = pgTable(
  'post_categories',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey(t.postId, t.categoryId),
  })
);

//relationships

//relations users to one profile and many posts
export const userRelations = relations(users, ({ one, many }) => ({
  //one to one relationship
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  //one to many relationship
  posts: many(posts),

  //many to many relationship
}));

//relations posts to one user and many categories
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  //many to many relationship
  categories: many(postOnCategories),
}));

//relations categories to many posts
export const categoriesRelations = relations(categories, ({ many }) => ({
  //many to many relationship
  posts: many(postOnCategories),
}));

//relations postOnCategories to one post and one category
export const postOnCategoriesRelations = relations(postOnCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postOnCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postOnCategories.categoryId],
    references: [categories.id],
  }),
}));
