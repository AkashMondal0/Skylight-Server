import { relations, sql } from "drizzle-orm";
import { pgTable, varchar, uuid, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum('role', ['admin', 'user']);
export const friendshipStatusEnum = pgEnum('friendship_status', ['friends', 'pending']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username').notNull().unique(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    profilePicture: varchar('profile_picture'),
    bio: varchar('bio'),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    isVerified: boolean('is_verified').default(false),
    isPrivate: boolean('is_private').default(false),
    accessToken: varchar('access_token'),
    refreshToken: varchar('refresh_token'),
    loggedDevice: jsonb('logged_device').default([]),
    roles: roleEnum('roles').array().notNull().default(sql`ARRAY['user']::role[]`),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    caption: varchar('caption').notNull().default(''),
    fileUrl: varchar('file_url').array(),
    authorId: uuid('author_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
        .defaultNow()
        .$onUpdate(() => new Date()),
})

export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    comment: varchar('comment').notNull(),
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: "no action" }),
    postId: uuid('post_id').notNull().references(() => posts.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
        .defaultNow()
        .$onUpdate(() => new Date()),
})

export const likes = pgTable('likes', {
    id: uuid('id').primaryKey().defaultRandom(),
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: "no action" }),
    postId: uuid('post_id').notNull().references(() => posts.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const messages = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    content: varchar('content').notNull(),
    fileUrl: varchar('file_url').array(),
    authorId: uuid('author_id').notNull().references(() => users.id),
    deleted: boolean('deleted').default(false),
    seenBy: varchar('seen_by').array(),
    conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const conversations = pgTable('conversations', {
    id: uuid('id').primaryKey().defaultRandom(),
    members: uuid('members').array(),
    isGroup: boolean('is_group').default(false),
    groupName: varchar('group_name'),
    groupImage: varchar('group_image'),
    groupDescription: varchar('group_description'),
    authorId: uuid('author_id').notNull(),
    lastMessageContent: varchar('last_message_content'),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const friendship = pgTable('friendship', {
    id: uuid('id').primaryKey().defaultRandom(),
    followerUserId: uuid('follower_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: "no action" }),
    followingUserId: uuid('following_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: 'no action' }),
    followerUsername: varchar('follower_username').notNull().references(() => users.username, { onDelete: 'no action', onUpdate: 'no action' }),
    followingUsername: varchar('following_username').notNull().references(() => users.username, { onDelete: 'no action', onUpdate: 'no action' }),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    // status: friendshipStatusEnum('status').default('friends'),
})

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, { fields: [posts.authorId], references: [users.id] }),
    comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
    posts: one(posts, { fields: [comments.postId], references: [posts.id] }),
    likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
    post: one(posts, { fields: [likes.postId], references: [posts.id] }),
}));


export const friendshipRelations = relations(friendship, ({ one }) => ({
    follower: one(users, { fields: [friendship.followerUserId], references: [users.id] }),
    following: one(users, { fields: [friendship.followingUserId], references: [users.id] }),
}));

export const conversationsRelations = relations(conversations, ({ many, one }) => ({
    messages: many(messages),
    author: one(users, { fields: [conversations.authorId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
    author: one(users, { fields: [messages.authorId], references: [users.id] }),
}));