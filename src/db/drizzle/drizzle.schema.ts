import { relations, sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, boolean, pgEnum, text, index, integer, uuid } from "drizzle-orm/pg-core";
import { generateRandomString } from "src/lib/id-generate";
export const roleEnum = pgEnum('role', ['admin', 'user']);
export const friendshipStatusEnum = pgEnum('friendship_status', ['pending', 'accepted', 'rejected', 'blocked', 'deleted']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);

export const UserSchema = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username').notNull().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: varchar('password').notNull(),
    profilePicture: varchar('profile_picture'),
    bio: text('bio'),
    roles: roleEnum('roles').array().notNull().default(sql`ARRAY['user']::role[]`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    isVerified: boolean('is_verified').notNull().default(false),
    isPrivate: boolean('is_private').notNull().default(false),
}, (users) => ({
    emailIdx: index('email_idx').on(users.email),
    usernameIdx: index('username_idx').on(users.username),
    emailUsernameIdx: index('email_username_idx').on(users.email, users.username)
}))

export const FriendshipSchema = pgTable('friendships', {
    id: uuid('id').defaultRandom().primaryKey(),
    followingUsername: varchar('following_username').notNull().references(() => UserSchema.username, { onDelete: 'cascade', onUpdate: 'cascade' }),
    followingUserId: uuid('following_user_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    authorUsername: varchar('author_username').notNull().references(() => UserSchema.username, { onDelete: 'cascade', onUpdate: 'cascade' }),
    authorUserId: uuid('author_user_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    status: friendshipStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    // additional fields
    isFeedFavorite: boolean('is_feed_favorite').default(false),
    isCloseFriends: boolean('is_close_friends').default(false),
    // block
    blocking: boolean('blocking').default(false),
    isRestricted: boolean('is_restricted').default(false),
    // notification
    notificationPost: boolean('notification_post').default(true),
    notificationStory: boolean('notification_story').default(true),
    isNotificationReel: boolean('is_notification_reel').default(true),
    // mute options
    isMutingNotification: boolean('is_muting_notification').default(false),
    isMutingPost: boolean('is_muting_post').default(false),
    isMutingStory: boolean('is_muting_story').default(false),
    isMutingReel: boolean('is_muting_reel').default(false),
    // request inboxes
    outgoingRequest: boolean('outgoing_request').default(false),
    incomingRequest: boolean('incoming_request').default(false),
}, (friendships) => ({
    followingIdx: index('following_idx').on(friendships.followingUsername),
    authorIdIdx: index('author_id_idx').on(friendships.authorUsername),
    followingAuthorIdIdx: index('following_author_id_idx').on(friendships.followingUsername, friendships.authorUsername)
}))

// post

export const PostSchema = pgTable('posts', {
    id: text('id').$defaultFn(() => generateRandomString({ length: 40, type: "lowernumeric" })).primaryKey(),
    title: varchar('title'),
    content: text('content'),
    fileUrl: varchar('file_url').array(),
    username: varchar('username').notNull().references(() => UserSchema.username, { onDelete: 'cascade' }),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    tags: text('tags')
        .array()
        .notNull()
        .default(sql`'{}'::text[]`),
    locations: text('locations')
        .array()
        .notNull()
        .default(sql`ARRAY[]::text[]`),
    status: postStatusEnum('status').notNull().default('draft'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
}, (posts) => ({
    authorIdIdx: index('post_author_id_idx').on(posts.authorId),
    statusIdx: index('post_status_idx').on(posts.status),
    authorStatusIdx: index('post_author_status_idx').on(posts.authorId, posts.status)
}))


export const CommentSchema = pgTable('comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    postId: text('post_id').notNull().references(() => PostSchema.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
}, (comments) => ({
    authorIdIdx: index('comment_author_id_idx').on(comments.authorId),
    postIdIdx: index('comment_post_id_idx').on(comments.postId),
    authorPostIdx: index('comment_author_post_idx').on(comments.authorId, comments.postId)
}))


export const LikeSchema = pgTable('likes', {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    postId: text('post_id').references(() => PostSchema.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id').references(() => CommentSchema.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (likes) => ({
    authorIdIdx: index('like_author_id_idx').on(likes.authorId),
    postIdIdx: index('like_post_id_idx').on(likes.postId),
    commentIdIdx: index('like_comment_id_idx').on(likes.commentId),
    authorPostIdx: index('like_author_post_idx').on(likes.authorId, likes.postId),
    authorCommentIdx: index('like_author_comment_idx').on(likes.authorId, likes.commentId)
}));

export const StorySchema = pgTable('stories', {
    id: text('id').$defaultFn(() => generateRandomString({ length: 40, type: "lowernumeric" })).primaryKey(),
    content: text('content').notNull(),
    mediaUrl: varchar('media_url'),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    viewCount: integer('view_count').notNull().default(0),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
});

export const ReelSchema = pgTable('reels', {
    id: text('id').$defaultFn(() => generateRandomString({ length: 40, type: "lowernumeric" })).primaryKey(),
    caption: text('caption'),
    videoUrl: varchar('video_url').notNull(),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    likeCount: integer('like_count').notNull().default(0),
    commentCount: integer('comment_count').notNull().default(0),
    isPublic: boolean('is_public').notNull().default(true),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export const commentReplySchema = pgTable('comment_replies', {
    id: uuid('id').defaultRandom().primaryKey(),
    content: text('content').notNull(),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    commentId: uuid('comment_id').notNull().references(() => CommentSchema.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').default(sql`now()`),
}, (replies) => ({
    authorIdIdx: index('reply_author_id_idx').on(replies.authorId),
    commentIdIdx: index('reply_comment_id_idx').on(replies.commentId),
    authorCommentIdx: index('reply_author_comment_idx').on(replies.authorId, replies.commentId)
}));

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
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const ConversationSchema = pgTable('conversations', {
    id: uuid('id').defaultRandom().primaryKey(),
    members: uuid('members').array().notNull(),
    isGroup: boolean('is_group').default(false),
    groupName: varchar('group_name'),
    groupImage: varchar('group_image'),
    groupDescription: varchar('group_description'),
    authorId: uuid('author_id').notNull().references(() => UserSchema.id, { onDelete: 'cascade' }),
    userId: uuid('user_id'),
    lastMessageContent: varchar('last_message_content'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const userRelations = relations(UserSchema, ({ many }) => ({
    posts: many(PostSchema),
    comments: many(CommentSchema),
    replyComments: many(commentReplySchema),
    stories: many(StorySchema),
    reels: many(ReelSchema),
    friendship: many(FriendshipSchema),
    messages: many(MessagesSchema),
    conversations: many(ConversationSchema),
}));

export const postsRelations = relations(PostSchema, ({ one, many }) => ({
    author: one(UserSchema, { fields: [PostSchema.authorId], references: [UserSchema.id] }),
    comments: many(CommentSchema),
}));

export const commentsRelations = relations(CommentSchema, ({ one, many }) => ({
    post: one(PostSchema, { fields: [CommentSchema.postId], references: [PostSchema.id] }),
    author: one(UserSchema, { fields: [CommentSchema.authorId], references: [UserSchema.id] }),
    likes: many(LikeSchema),
    replies: many(commentReplySchema),
}));

export const likesRelations = relations(LikeSchema, ({ one }) => ({
    post: one(PostSchema, { fields: [LikeSchema.postId], references: [PostSchema.id] }),
    comment: one(CommentSchema, { fields: [LikeSchema.commentId], references: [CommentSchema.id] }),
    author: one(UserSchema, { fields: [LikeSchema.authorId], references: [UserSchema.id] }),
}));

export const commentReplyRelations = relations(commentReplySchema, ({ one }) => ({
    author: one(UserSchema, {
        fields: [commentReplySchema.authorId],
        references: [UserSchema.id],
    }),
    comment: one(CommentSchema, {
        fields: [commentReplySchema.commentId],
        references: [CommentSchema.id],
    }),
}));

export const storyRelations = relations(StorySchema, ({ one }) => ({
    author: one(UserSchema, {
        fields: [StorySchema.authorId],
        references: [UserSchema.id],
    }),
}));

export const reelRelations = relations(ReelSchema, ({ one }) => ({
    author: one(UserSchema, {
        fields: [ReelSchema.authorId],
        references: [UserSchema.id],
    }),
}));

export const followersRelations = relations(FriendshipSchema, ({ one }) => ({
    follower: one(UserSchema, { fields: [FriendshipSchema.authorUsername], references: [UserSchema.username] }),
    following: one(UserSchema, { fields: [FriendshipSchema.followingUsername], references: [UserSchema.username] }),
}));


export const messagesRelations = relations(MessagesSchema, ({ one }) => ({
    author: one(UserSchema, {
        fields: [MessagesSchema.authorId],
        references: [UserSchema.id],
    }),
    conversation: one(ConversationSchema, {
        fields: [MessagesSchema.conversationId],
        references: [ConversationSchema.id],
    }),
}));

export const conversationsRelations = relations(ConversationSchema, ({ one, many }) => ({
    author: one(UserSchema, {
        fields: [ConversationSchema.authorId],
        references: [UserSchema.id],
    }),
    messages: many(MessagesSchema),
}));