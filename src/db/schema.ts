import { InferSelectModel } from 'drizzle-orm';
import { boolean, date, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
export const roleEnum = pgEnum('role', ['SUPER_ADMIN', 'COMPANY_OWNER', 'USER', 'ADMIN']);

export const users = pgTable('user', {
  userId: text('userId')
    .$defaultFn(() => createId())
    .primaryKey(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: date('createdAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  role: roleEnum('role').default('USER').notNull(),
});

export const kudos = pgTable('kudos', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  senderId: text('senderId')
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  receiverId: text('receiverId')
    .references(() => users.userId, { onDelete: 'cascade' })
    .notNull(),
  title: text('title'),
  message: text('message').notNull(),
  createdAt: date('createdAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
  isAnonymous: boolean('isAnonymous').default(false).notNull(),
  isHidden: boolean('isHidden').default(false).notNull(),
});

export type User = Omit<InferSelectModel<typeof users>, 'password'>;
export type TKUDOS = Omit<InferSelectModel<typeof kudos>, 'senderId' | 'receiverId'> & {
  sender: User;
  receiver: User;
};
export type Role = 'SUPER_ADMIN' | 'COMPANY_OWNER' | 'USER' | 'ADMIN';
