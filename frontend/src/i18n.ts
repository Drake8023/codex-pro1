export type Language = "en" | "zh";

export type Dictionary = {
  navFeed: string;
  navCreate: string;
  navProfile: string;
  login: string;
  logout: string;
  join: string;
  refresh: string;
  language: string;
  languageZhLabel: string;
  feedEyebrow: string;
  feedTitle: string;
  signedInAs: (name: string) => string;
  joinPrompt: string;
  loadingPosts: string;
  feedUnavailable: string;
  noPostsEyebrow: string;
  noPostsTitle: string;
  noPostsBody: string;
  postMediaAlt: string;
  loginEyebrow: string;
  loginTitle: string;
  loginHint: string;
  signingIn: string;
  loginFailed: string;
  working: string;
  email: string;
  password: string;
  loginButton: string;
  registerEyebrow: string;
  registerTitle: string;
  registerHint: string;
  creatingAccount: string;
  registerFailed: string;
  displayName: string;
  createAccount: string;
  createEyebrow: string;
  createTitle: string;
  createHint: string;
  uploadInProgress: string;
  uploadReady: string;
  uploadFailed: string;
  uploadTip: string;
  uploadCardPrimary: string;
  uploadCardSecondary: string;
  selectedImages: (count: number) => string;
  noImagesSelected: string;
  publishing: string;
  publishFailed: string;
  signInBeforePublish: string;
  publishAuthHint: string;
  goToLogin: string;
  text: string;
  textPlaceholder: string;
  addImages: string;
  publish: string;
  uploadedPreviewAlt: string;
  remove: string;
  profileEyebrow: string;
  noSessionTitle: string;
  noSessionHint: string;
  posts: string;
  joined: string;
  emptyArchiveEyebrow: string;
  emptyArchiveTitle: string;
  emptyArchiveBody: string;
  longingMode: string;
  zenMode: string;
  longingTitle: string;
  zenTitle: string;
  longingCount: string;
  painReduced: string;
  painMinusOne: string;
  count: string;
  strikeMokugyo: string;
  tryAgain: string;
  saved: string;
  rituals: string;
  close: string;
  longing: string;
  zen: string;
  apiUnavailable: string;
  like: string;
  liked: string;
  comments: string;
  addComment: string;
  publishComment: string;
  sendingComment: string;
  commentPlaceholder: string;
  signInToComment: string;
  noComments: string;
  loadingComments: string;
  likeFailed: string;
  commentFailed: string;
  commentsLoadFailed: string;
  authRequiredAction: string;
  reply: string;
  replyTo: (name: string) => string;
  replyingTo: (name: string) => string;
  cancelReply: string;
  replyPlaceholder: (name: string) => string;
  previous: string;
  next: string;
  goToImage: (index: number) => string;
};

export const buildTag = "i18n-refresh-20260327-1";

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    navFeed: "Feed",
    navCreate: "Create",
    navProfile: "Profile",
    login: "Log in",
    logout: "Log out",
    join: "Join",
    refresh: "Refresh",
    language: "Language",
    languageZhLabel: "ZH",
    feedEyebrow: "Private archive",
    feedTitle: "Publish notes, galleries, and small rituals in one quiet stream.",
    signedInAs: (name) => `Signed in as ${name}`,
    joinPrompt: "Join to publish and shape your own archive.",
    loadingPosts: "Loading posts...",
    feedUnavailable: "Feed is unavailable right now.",
    noPostsEyebrow: "No posts yet",
    noPostsTitle: "Start the archive with the first note.",
    noPostsBody: "Use Create to publish a thought, a scene, or a set of images.",
    postMediaAlt: "post image",
    loginEyebrow: "Login",
    loginTitle: "Return to your archive.",
    loginHint: "Use your account to keep publishing from any session.",
    signingIn: "Signing in...",
    loginFailed: "Could not sign in",
    working: "Working...",
    email: "Email",
    password: "Password",
    loginButton: "Log in",
    registerEyebrow: "Join",
    registerTitle: "Open a calm publishing account.",
    registerHint: "Create a profile before you begin publishing.",
    creatingAccount: "Creating your account...",
    registerFailed: "Could not register",
    displayName: "Display name",
    createAccount: "Create account",
    createEyebrow: "Create",
    createTitle: "Build a post with text and images.",
    createHint: "Tap the plus tile to add up to nine images before publishing.",
    uploadInProgress: "Uploading images...",
    uploadReady: "Images are ready.",
    uploadFailed: "Upload failed",
    uploadTip: "Up to 9 images",
    uploadCardPrimary: "Add photos",
    uploadCardSecondary: "Tap to choose and preview",
    selectedImages: (count) => `${count} image${count === 1 ? "" : "s"} selected`,
    noImagesSelected: "No images selected yet.",
    publishing: "Publishing...",
    publishFailed: "Could not publish",
    signInBeforePublish: "Sign in before you publish.",
    publishAuthHint: "Publishing is attached to a logged-in account.",
    goToLogin: "Go to login",
    text: "Text",
    textPlaceholder: "Write something brief, personal, or visual.",
    addImages: "Images",
    publish: "Publish",
    uploadedPreviewAlt: "Uploaded preview",
    remove: "Remove",
    profileEyebrow: "Profile",
    noSessionTitle: "No active session.",
    noSessionHint: "Log in to see your profile and your published notes.",
    posts: "Posts",
    joined: "Joined",
    emptyArchiveEyebrow: "No posts yet",
    emptyArchiveTitle: "Your archive is still empty.",
    emptyArchiveBody: "Start with a text note or a group of images.",
    longingMode: "Longing Mode",
    zenMode: "Zen Mode",
    longingTitle: "Count the feeling.",
    zenTitle: "Strike the mokugyo.",
    longingCount: "Longing Count",
    painReduced: "Pain Reduced",
    painMinusOne: "Pain -1",
    count: "Count",
    strikeMokugyo: "Strike mokugyo",
    tryAgain: "Try again",
    saved: "Saved",
    rituals: "Rituals",
    close: "Close",
    longing: "Longing",
    zen: "Zen",
    apiUnavailable: "API unavailable",
    like: "Like",
    liked: "Liked",
    comments: "Comments",
    addComment: "Add a comment",
    publishComment: "Post comment",
    sendingComment: "Posting...",
    commentPlaceholder: "Write something kind, quick, or useful.",
    signInToComment: "Sign in to leave a comment.",
    noComments: "No comments yet.",
    loadingComments: "Loading comments...",
    likeFailed: "Could not update like",
    commentFailed: "Could not publish comment",
    commentsLoadFailed: "Could not load comments",
    authRequiredAction: "Sign in to interact",
    reply: "Reply",
    replyTo: (name) => `Reply to ${name}: `,
    replyingTo: (name) => `Replying to ${name}`,
    cancelReply: "Cancel",
    replyPlaceholder: (name) => `Reply to ${name}...`,
    previous: "Prev",
    next: "Next",
    goToImage: (index) => `Go to image ${index}`,
  },
  zh: {
    navFeed: "动态",
    navCreate: "发布",
    navProfile: "我的",
    login: "登录",
    logout: "退出登录",
    join: "注册",
    refresh: "刷新",
    language: "语言",
    languageZhLabel: "中",
    feedEyebrow: "私人档案",
    feedTitle: "把文字、图片和一点点仪式感，放进同一条安静的动态里。",
    signedInAs: (name) => `当前登录：${name}`,
    joinPrompt: "登录后可以发布内容，慢慢搭起自己的记录空间。",
    loadingPosts: "正在加载动态...",
    feedUnavailable: "当前无法获取动态。",
    noPostsEyebrow: "还没有内容",
    noPostsTitle: "从第一条记录开始吧。",
    noPostsBody: "去发布一段想法、一组图片，或者一幕生活片段。",
    postMediaAlt: "动态图片",
    loginEyebrow: "登录",
    loginTitle: "回到你的档案里。",
    loginHint: "登录账号后，可以继续发布和管理内容。",
    signingIn: "正在登录...",
    loginFailed: "登录失败",
    working: "处理中...",
    email: "邮箱",
    password: "密码",
    loginButton: "登录",
    registerEyebrow: "注册",
    registerTitle: "开一个安静的发布账号。",
    registerHint: "先创建个人资料，再开始发布内容。",
    creatingAccount: "正在创建账号...",
    registerFailed: "注册失败",
    displayName: "昵称",
    createAccount: "创建账号",
    createEyebrow: "发布",
    createTitle: "用文字和图片发一条新动态。",
    createHint: "点击加号卡片，最多可添加 9 张图片并即时预览。",
    uploadInProgress: "图片上传中...",
    uploadReady: "图片已准备好。",
    uploadFailed: "上传失败",
    uploadTip: "最多 9 张图片",
    uploadCardPrimary: "添加图片",
    uploadCardSecondary: "点击选择并预览",
    selectedImages: (count) => `已选择 ${count} 张图片`,
    noImagesSelected: "还没有选择图片。",
    publishing: "发布中...",
    publishFailed: "发布失败",
    signInBeforePublish: "请先登录再发布。",
    publishAuthHint: "当前版本需要登录后才能发布内容。",
    goToLogin: "前往登录",
    text: "文字",
    textPlaceholder: "写点简短的、私人的，或者有画面感的内容。",
    addImages: "图片",
    publish: "发布",
    uploadedPreviewAlt: "上传预览",
    remove: "删除",
    profileEyebrow: "个人资料",
    noSessionTitle: "当前未登录。",
    noSessionHint: "登录后可查看你的个人信息和已发布内容。",
    posts: "动态",
    joined: "加入时间",
    emptyArchiveEyebrow: "还没有内容",
    emptyArchiveTitle: "你的档案还是空的。",
    emptyArchiveBody: "先发一段文字，或者先传一组图片。",
    longingMode: "思念模式",
    zenMode: "禅意模式",
    longingTitle: "数一数这份情绪。",
    zenTitle: "敲一下木鱼。",
    longingCount: "思念次数",
    painReduced: "痛苦减轻",
    painMinusOne: "痛苦 -1",
    count: "计数",
    strikeMokugyo: "敲木鱼",
    tryAgain: "请重试",
    saved: "已保存",
    rituals: "仪式",
    close: "关闭",
    longing: "思念",
    zen: "禅意",
    apiUnavailable: "接口不可用",
    like: "点赞",
    liked: "已赞",
    comments: "评论",
    addComment: "发表评论",
    publishComment: "发布评论",
    sendingComment: "评论发送中...",
    commentPlaceholder: "写点友善、简短、有效的内容。",
    signInToComment: "登录后才能评论。",
    noComments: "还没有评论。",
    loadingComments: "正在加载评论...",
    likeFailed: "点赞失败",
    commentFailed: "评论发布失败",
    commentsLoadFailed: "评论加载失败",
    authRequiredAction: "登录后才能操作",
    reply: "回复",
    replyTo: (name) => `回复 ${name}：`,
    replyingTo: (name) => `正在回复 ${name}`,
    cancelReply: "取消回复",
    replyPlaceholder: (name) => `回复 ${name}...`,
    previous: "上一张",
    next: "下一张",
    goToImage: (index) => `查看第 ${index} 张图片`,
  },
};

export function formatTimestamp(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatShortDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem('curator-language');
  return stored === 'zh' ? 'zh' : 'en';
}

