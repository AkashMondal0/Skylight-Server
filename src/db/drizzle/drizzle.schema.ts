import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, boolean, pgEnum, text, uuid, index } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['admin', 'user']);
export const friendshipStatusEnum = pgEnum('friendship_status', ['pending', 'accepted', 'rejected', 'blocked', 'deleted']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);

export const UserSchema = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username').notNull().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    profilePicture: varchar('profile_picture', { length: 255 }),
    bio: text('bio'),
    roles: roleEnum('roles').array().notNull().default(sql`ARRAY['user']::role[]`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`),
    // additional fields
    isVerified: boolean('is_verified').notNull().default(false),
    isPrivate: boolean('is_private').notNull().default(false),
    accessToken: varchar('access_token'),
    loggedDevice: varchar('logged_device').array(),
    // refreshToken: varchar('refresh_token'),
    // salt: varchar('salt').notNull()
}, (users) => ({
    emailIdx: index('email_idx').on(users.email),
}))

export const FriendshipSchema = pgTable('friendships', {
    id: uuid('id').defaultRandom().primaryKey(),
    followingUsername: varchar('following_username').notNull().references(() => UserSchema.username, { onDelete: 'cascade', onUpdate: 'cascade' }),
    authorUsername: varchar('author_username').notNull().references(() => UserSchema.username, { onDelete: 'cascade', onUpdate: 'cascade' }),
    status: friendshipStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`)
}, (friendships) => ({
    followingIdx: index('following_idx').on(friendships.followingUsername),
    authorIdIdx: index('author_id_idx').on(friendships.authorUsername),
    followingAuthorIdIdx: index('following_author_id_idx').on(friendships.followingUsername, friendships.authorUsername)
}))

// post

export const PostSchema = pgTable('posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title'),
    content: text('content'),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    tags: text('tags').array(),
    status: postStatusEnum('status').notNull().default('draft'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`),
});


export const CommentSchema = pgTable('comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => PostSchema.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


export const LikeSchema = pgTable('likes', {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    postId: uuid('post_id').notNull().references(() => PostSchema.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// chat
export const MessagesSchema = pgTable('messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    fileUrl: varchar('file_url').array(),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    deleted: boolean('deleted').default(false),
    seenBy: varchar('seen_by').array(),
    conversationId: uuid('conversation_id').notNull().references(() => ConversationSchema.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`),
});

export const ConversationSchema = pgTable('conversations', {
    id: uuid('id').defaultRandom().primaryKey(),
    members: uuid('members').array().notNull(),
    isGroup: boolean('is_group').default(false),
    groupName: varchar('group_name'),
    groupImage: varchar('group_image'),
    groupDescription: varchar('group_description'),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    lastMessageContent: varchar('last_message_content'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`),
});