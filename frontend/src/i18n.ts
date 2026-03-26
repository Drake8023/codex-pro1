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
};

export const buildTag = "i18n-refresh-20260326-2";
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
    feedTitle: "Feed the gallery with text, images, and small rituals.",
    signedInAs: (name) => `Signed in as ${name}`,
    joinPrompt: "Join to publish and build your own archive.",
    loadingPosts: "Loading posts...",
    feedUnavailable: "Feed is unavailable right now.",
    noPostsEyebrow: "No posts yet",
    noPostsTitle: "Start the archive with the first note.",
    noPostsBody: "Use Create to publish a thought, a scene, or a set of images.",
    postMediaAlt: "Post media",
    loginEyebrow: "Login",
    loginTitle: "Return to your archive.",
    loginHint: "Use your account to keep posting from any session.",
    signingIn: "Signing in...",
    loginFailed: "Could not sign in",
    working: "Working",
    email: "Email",
    password: "Password",
    loginButton: "Log in",
    registerEyebrow: "Join",
    registerTitle: "Open a quiet publishing account.",
    registerHint: "Create a profile before you begin publishing.",
    creatingAccount: "Creating your account...",
    registerFailed: "Could not register",
    displayName: "Display name",
    createAccount: "Create account",
    createEyebrow: "Create",
    createTitle: "Publish a new note.",
    createHint: "Write a short note, add a few images, then publish.",
    uploadInProgress: "Uploading images...",
    uploadReady: "Images are ready.",
    uploadFailed: "Upload failed",
    publishing: "Publishing...",
    publishFailed: "Could not publish",
    signInBeforePublish: "Sign in before you publish.",
    publishAuthHint: "This first version keeps publishing attached to a logged-in account.",
    goToLogin: "Go to login",
    text: "Text",
    textPlaceholder: "Write something brief, personal, or visual.",
    addImages: "Add images",
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
  feedTitle: "用文字、图片与小仪式丰富你的记录空间。",
  signedInAs: (name) => `当前登录：${name}`,
  joinPrompt: "注册后即可发布内容并建立你的专属档案。",

  loadingPosts: "加载中...",
  feedUnavailable: "当前无法获取动态",
  noPostsEyebrow: "暂无内容",
  noPostsTitle: "从第一条记录开始你的档案。",
  noPostsBody: "点击发布，记录想法、场景或上传图片。",

  postMediaAlt: "帖子图片",

  loginEyebrow: "登录",
  loginTitle: "回到你的档案。",
  loginHint: "登录账号，在任意设备继续发布内容。",
  signingIn: "登录中...",
  loginFailed: "登录失败",
  working: "处理中",

  email: "邮箱",
  password: "密码",
  loginButton: "登录",

  registerEyebrow: "注册",
  registerTitle: "开启一个安静的创作空间。",
  registerHint: "创建账号后即可开始发布内容。",
  creatingAccount: "创建账号中...",
  registerFailed: "注册失败",

  displayName: "昵称",
  createAccount: "创建账号",

  createEyebrow: "发布",
  createTitle: "发布一条新内容。",
  createHint: "写点文字，添加图片，然后发布。",
  uploadInProgress: "图片上传中...",
  uploadReady: "图片已准备好",
  uploadFailed: "上传失败",

  publishing: "发布中...",
  publishFailed: "发布失败",
  signInBeforePublish: "请先登录再发布",
  publishAuthHint: "当前版本需登录后才能发布内容",
  goToLogin: "前往登录",

  text: "文字",
  textPlaceholder: "写点简短、私密或富有画面感的内容...",
  addImages: "添加图片",
  publish: "发布",

  uploadedPreviewAlt: "预览图",
  remove: "移除",

  profileEyebrow: "个人",
  noSessionTitle: "当前未登录",
  noSessionHint: "登录后查看你的个人信息和已发布内容",

  posts: "帖子",
  joined: "加入时间",

  emptyArchiveEyebrow: "暂无内容",
  emptyArchiveTitle: "你的档案还是空的。",
  emptyArchiveBody: "从一段文字或一组图片开始吧。",

  longingMode: "思念模式",
  zenMode: "禅意模式",

  longingTitle: "记录情绪的次数。",
  zenTitle: "敲一声木鱼。",

  longingCount: "思念计数",
  painReduced: "痛苦减少",
  painMinusOne: "痛苦 -1",

  count: "计数",
  strikeMokugyo: "敲木鱼",

  tryAgain: "重试",
  saved: "已保存",

  rituals: "仪式",
  close: "关闭",

  longing: "思念",
  zen: "禅",

  apiUnavailable: "接口不可用",
}
};

export function getInitialLanguage(): Language {
  const saved = window.localStorage.getItem("curator-language");
  if (saved === "en" || saved === "zh") return saved;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function formatTimestamp(value: string, language: Language) {
  return new Date(value).toLocaleString(language === "zh" ? "zh-CN" : "en-US", {
    month: language === "zh" ? "numeric" : "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShortDate(value: string, language: Language) {
  return new Date(value).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
    month: language === "zh" ? "numeric" : "short",
    day: "numeric",
  });
}
