import { relations, sql } from "drizzle-orm";
import { pgTable, varchar, uuid, timestamp, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum('Role', ['ADMIN', 'MEMBER']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username').notNull().unique(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    profilePicture: varchar('profile_picture'),
    bio: varchar('bio'),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    isVerified: boolean('is_verified').default(false),
    isPrivate: boolean('is_private').default(false),
    accessToken: varchar('access_token'),
    refreshToken: varchar('refresh_token'),
    loggedDevice: jsonb('logged_device').default([]),
});

export const messages = pgTable('messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    content: varchar('content').notNull(),
    fileUrl: varchar('file_url').array(),
    authorId: uuid('author_id').notNull().references(() => users.id),
    deleted: boolean('deleted').default(false),
    seenBy: varchar('seen_by').array(),
    conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
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

export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    caption: varchar('caption').notNull(),
    fileUrl: varchar('file_url').array(),
    authorId: uuid('author_id').notNull().references(() => users.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    comment: varchar('comment').notNull(),
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: "no action" }),
    postId: uuid('post_id').notNull().references(() => posts.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const likes = pgTable('likes', {
    id: uuid('id').primaryKey().defaultRandom(),
    authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: "no action" }),
    postId: uuid('post_id').notNull().references(() => posts.id),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export const followers = pgTable('followers', {
    id: uuid('id').primaryKey().defaultRandom(),
    followerUserId: uuid('follower_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: "no action" }),
    followingUserId: uuid('following_id').notNull().references(() => users.id, { onDelete: 'no action', onUpdate: 'no action' }),
    followerUsername: varchar('follower_username').notNull().references(() => users.username, { onDelete: 'no action', onUpdate: 'no action' }),
    followingUsername: varchar('following_username').notNull().references(() => users.username, { onDelete: 'no action', onUpdate: 'no action' }),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

// export const notifications = pgTable('notifications', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     content: varchar('content').notNull(),
//     authorId: uuid('author_id').notNull().references(() => users.id),
//     receiverId: uuid('receiver_id').notNull().references(() => users.id),
//     postId: uuid('post_id').notNull().references(() => posts.id),
//     createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// })

// export const stories = pgTable('stories', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     fileUrl: varchar('file_url').array(),
//     caption: varchar('caption').notNull(),
//     authorId: uuid('author_id').notNull().references(() => users.id),
//     createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// })

// export const storyViews = pgTable('story_views', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     viewerId: uuid('viewer_id').notNull().references(() => users.id),
//     storyId: uuid('story_id').notNull().references(() => stories.id),
//     createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// })

// export const storyReplies = pgTable('story_replies', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     content: varchar('content').notNull(),
//     authorId: uuid('author_id').notNull().references(() => users.id),
//     storyId: uuid('story_id').notNull().references(() => stories.id),
//     createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// })

// export const storyLikes = pgTable('story_likes', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     authorId: uuid('author_id').notNull().references(() => users.id),
//     storyId: uuid('story_id').notNull().references(() => stories.id),
//     createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// })

// export const savedPosts = pgTable('saved_posts', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     postId: uuid('post_id').notNull().references(() => posts.id),
//     userId: uuid('user_id').notNull().references(() => users.id),
//     createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
// })


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


export const followersRelations = relations(followers, ({ one }) => ({
    follower: one(users, { fields: [followers.followerUserId], references: [users.id] }),
    following: one(users, { fields: [followers.followingUserId], references: [users.id] }),
}));

export const conversationsRelations = relations(conversations, ({ many, one }) => ({
    messages: many(messages),
    author: one(users, { fields: [conversations.authorId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
    author: one(users, { fields: [messages.authorId], references: [users.id] }),
}));