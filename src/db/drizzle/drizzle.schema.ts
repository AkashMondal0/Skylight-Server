import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, boolean, pgEnum, text, uuid, index } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['admin', 'user']);
export const friendshipStatusEnum = pgEnum('friendship_status', ['pending', 'accepted', 'rejected', 'blocked', 'deleted']);
const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);

export const UserSchema = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(), // Variable-length string, optimized for usernames
    name: text('name').notNull(), // Variable-length string, optimized for names
    email: text('email').notNull().unique(), // Variable-length string, optimized for email addresses
    password: varchar('password', { length: 255 }).notNull(), // Variable-length string, optimized for hashed passwords
    profilePicture: varchar('profile_picture', { length: 255 }), // Variable-length string for storing URLs to profile pictures
    bio: text('bio'), // Text type, optimized for longer strings such as biographies
    roles: roleEnum('roles').array().notNull().default(sql`ARRAY['user']::role[]`), // Array type for storing user roles
    createdAt: timestamp('created_at').notNull().defaultNow(), // Automatically set to the current timestamp when a row is created
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`), // Automatically updated to the current timestamp when a row is updated
    // additional fields
    isVerified: boolean('is_verified').notNull().default(false), // Boolean type for verification status
    isPrivate: boolean('is_private').notNull().default(false), // Boolean type for privacy status
    accessToken: varchar('access_token', { length: 255 }), // Variable-length string for access tokens
    // refreshToken: varchar('refresh_token', { length: 255 }), // Variable-length string for refresh tokens
    // loggedDevice: varchar('logged_device', { length: 255 }), // Variable-length string for logged device information
    salt: varchar('salt', { length: 255 }).notNull() // Variable-length string for storing salt used in password hashing
}, (users) => ({
    emailIdx: index('email_idx').on(users.email),
}))

export const FriendshipSchema = pgTable('friendships', {
    id: uuid('id').defaultRandom().primaryKey(),
    followingUsername: varchar('following_username', { length: 50 }).notNull().references(() => UserSchema.username, { onDelete: 'cascade', onUpdate: 'cascade' }), // Foreign key reference to user1
    authorUsername: varchar('author_username', { length: 50 }).notNull().references(() => UserSchema.username, { onDelete: 'cascade', onUpdate: 'cascade' }), // Foreign key reference to user2
    status: friendshipStatusEnum('status').notNull().default('pending'), // Friendship status
    createdAt: timestamp('created_at').notNull().defaultNow(), // Automatically set to the current timestamp when a row is created
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`) // Automatically updated to the current timestamp when a row is updated
}, (friendships) => ({
    followingIdx: index('following_idx').on(friendships.followingUsername),
    authorIdIdx: index('author_id_idx').on(friendships.authorUsername),
    followingAuthorIdIdx: index('following_author_id_idx').on(friendships.followingUsername, friendships.authorUsername)
}))

// // post

// const PostSchema = pgTable('posts', {
//     id: integer('id').default(sql`generate_random_id()`).primaryKey().notNull(), // Auto-incrementing integer, used as the primary key
//     title: varchar('title', { length: 255 }).notNull(), // Variable-length string, optimized for post titles
//     content: text('content').notNull(), // Text type, optimized for post content
//     authorId: integer('author_id').notNull().references(() => UserSchema.id,{ onDelete: 'cascade' }), // Integer type for referencing the author's ID // what is number capacity  of integer in postgres ? -> 4 bytes (32 bits) mean 2^32 = 4,294,967,296 values, what is bigint capacity ? -> 8 bytes (64 bits) mean 2^64 = 18,446,744,073,709,551,616 values
//     tags: text('tags'), // Text type for storing tags, potentially as a comma-separated list
//     status: postStatusEnum('status').notNull().default('draft'), // Enum type for post status, defaulting to 'draft'
//     createdAt: timestamp('created_at').notNull().defaultNow(), // Automatically set to the current timestamp when a row is created
//     updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`), // Automatically updated to the current timestamp when a row is updated
// });


// export const CommentSchema = pgTable('comments', {
//     id: integer('id').default(sql`generate_random_id()`).primaryKey().notNull(),
//     content: text('content').notNull(),
//     authorId: integer('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
//     postId: integer('post_id').notNull().references(() => PostSchema.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
// });


// export const LikeSchema = pgTable('likes', {
//     id: integer('id').default(sql`generate_random_id()`).primaryKey().notNull(),
//     authorId: integer('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
//     postId: integer('post_id').notNull().references(() => PostSchema.id, { onDelete: 'cascade' }),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
// });

// // chat
// export const MessagesSchema = pgTable('messages', {
//     id: integer('id').default(sql`generate_random_id()`).primaryKey().notNull(), // Auto-incrementing integer, used as the primary key
//     content: text('content').notNull(),
//     fileUrl: varchar('file_url').array(),
//     authorId: integer('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
//     deleted: boolean('deleted').default(false),
//     seenBy: varchar('seen_by').array(),
//     conversationId: integer('conversation_id').notNull().references(() => ConversationSchema.id),
//     createdAt: timestamp('created_at').notNull().defaultNow(), // Automatically set to the current timestamp when a row is created
//     updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`),
// });

// export const ConversationSchema = pgTable('conversations', {
//     id: integer('id').default(sql`generate_random_id()`).primaryKey().notNull(), // Auto-incrementing integer, used as the primary key
//     members: integer('members').array().notNull(),
//     isGroup: boolean('is_group').default(false),
//     groupName: varchar('group_name'),
//     groupImage: varchar('group_image'),
//     groupDescription: varchar('group_description'),
//     authorId: integer('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
//     lastMessageContent: varchar('last_message_content'),
//     createdAt: timestamp('created_at').notNull().defaultNow(), // Automatically set to the current timestamp when a row is created
//     updatedAt: timestamp('updated_at').notNull().default(sql`now()`).$onUpdate(() => sql`now()`),
// });