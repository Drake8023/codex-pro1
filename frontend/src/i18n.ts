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
    logout: "退出",
    join: "注册",
    refresh: "刷新",
    language: "语言",
    feedEyebrow: "私人档案",
    feedTitle: "用文字、图片和小小仪式填满你的画廊。",
    signedInAs: (name) => `当前登录：${name}`,
    joinPrompt: "注册后就可以发布内容，建立自己的档案。",
    loadingPosts: "正在加载内容...",
    feedUnavailable: "当前无法加载动态。",
    noPostsEyebrow: "还没有内容",
    noPostsTitle: "从第一条记录开始建立你的档案。",
    noPostsBody: "点击发布，写下一段话，或者上传一组图片。",
    postMediaAlt: "帖子图片",
    loginEyebrow: "登录",
    loginTitle: "回到你的档案。",
    loginHint: "登录后，你的发布记录会一直保留。",
    signingIn: "正在登录...",
    loginFailed: "登录失败",
    working: "处理中",
    email: "邮箱",
    password: "密码",
    loginButton: "登录",
    registerEyebrow: "注册",
    registerTitle: "创建一个安静的发布账号。",
    registerHint: "先建立个人资料，再开始发布。",
    creatingAccount: "正在创建账号...",
    registerFailed: "注册失败",
    displayName: "昵称",
    createAccount: "创建账号",
    createEyebrow: "发布",
    createTitle: "发布一条新的记录。",
    createHint: "写一段简短文字，再配几张图片。",
    uploadInProgress: "正在上传图片...",
    uploadReady: "图片已准备好。",
    uploadFailed: "上传失败",
    publishing: "正在发布...",
    publishFailed: "发布失败",
    signInBeforePublish: "请先登录后再发布。",
    publishAuthHint: "当前版本会把内容绑定到登录账号下。",
    goToLogin: "去登录",
    text: "正文",
    textPlaceholder: "写一点简短、私人或有画面感的内容。",
    addImages: "添加图片",
    publish: "发布",
    uploadedPreviewAlt: "上传预览",
    remove: "移除",
    profileEyebrow: "个人资料",
    noSessionTitle: "当前未登录。",
    noSessionHint: "登录后可以查看你的资料和已发布内容。",
    posts: "帖子数",
    joined: "加入时间",
    emptyArchiveEyebrow: "还没有内容",
    emptyArchiveTitle: "你的档案还是空的。",
    emptyArchiveBody: "先发一段文字，或者上传一组图片。",
    longingMode: "思念模式",
    zenMode: "禅模式",
    longingTitle: "记录这份想念。",
    zenTitle: "敲一下木鱼。",
    longingCount: "思念次数",
    painReduced: "疼痛减少",
    count: "记录",
    strikeMokugyo: "敲木鱼",
    tryAgain: "请重试",
    saved: "已保存",
    rituals: "小功能",
    close: "关闭",
    longing: "思念",
    zen: "禅",
    apiUnavailable: "接口不可用",
  },
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
