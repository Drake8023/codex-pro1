export type Language = "en" | "zh";

export type Dictionary = {
  navFeed: string;
  navCreate: string;
  navFeatures: string;
  navProfile: string;
  login: string;
  logout: string;
  join: string;
  refresh: string;
  language: string;
  languageZhLabel: string;
  settings: string;
  appearance: string;
  themeDark: string;
  themeLight: string;
  apiStatus: string;
  editAvatar: string;
  avatarEditorTitle: string;
  currentAvatar: string;
  avatarPickerHint: string;
  defaultAvatars: string;
  uploadAvatar: string;
  uploadCustomAvatar: string;
  avatarUpdateFailed: string;
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
  notifications: string;
  activityCenter: string;
  unread: string;
  loadingNotifications: string;
  noNotifications: string;
  openMessages: (count: number) => string;
  hideMessages: string;
  messageLiked: string;
  messageCommented: string;
  messageReplied: string;
  messageReplyContent: string;
  messageReplyTarget: string;
  messagePostContext: string;
  viewPost: string;
  likedBy: string;
  featuresEyebrow: string;
  featuresTitle: string;
  featuresBody: string;
  featureRitualsTitle: string;
  featureRitualsBody: string;
  featureLongingLabel: string;
  featureZenLabel: string;
  featureMoreTitle: string;
  featureMoreBody: string;
  featureHubLabel: string;
  featureShortcutTitle: string;
  featureShortcutBody: string;
  featurePulseTitle: string;
  featurePulseLonging: string;
  featurePulseZen: string;
  featurePulseNotifications: string;
  featureExploreTitle: string;
  featureExploreBody: string;
  featurePlaceholderTag: string;
  feedFeatureEntry: string;
  feedCreateEntry: string;
  feedMobileHint: string;
  profileSloganTitle: string;
  profileSloganHint: string;
  profileSloganPlaceholder: string;
  profileSloganSave: string;
  profileSloganSaveFailed: string;
};

export const buildTag = "i18n-refresh-20260327-5";

export const dictionaries: Record<Language, Dictionary> = {
  en: {
    navFeed: "Feed",
    navCreate: "Create",
    navFeatures: "Features",
    navProfile: "Profile",
    login: "Log in",
    logout: "Log out",
    join: "Join",
    refresh: "Refresh",
    language: "Language",
    languageZhLabel: "ZH",
    settings: "Settings",
    appearance: "Appearance",
    themeDark: "Dark mode",
    themeLight: "Light mode",
    apiStatus: "API",
    editAvatar: "Edit avatar",
    avatarEditorTitle: "Choose your avatar",
    currentAvatar: "Current avatar",
    avatarPickerHint: "Pick a default image or upload your own.",
    defaultAvatars: "Default avatars",
    uploadAvatar: "Upload",
    uploadCustomAvatar: "Upload custom avatar",
    avatarUpdateFailed: "Could not update avatar",
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
    uploadTip: "Choose multiple images at once, up to 9 total",
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
    notifications: "Messages",
    activityCenter: "Activity center",
    unread: "unread",
    loadingNotifications: "Loading notifications...",
    noNotifications: "No activity yet.",
    openMessages: (count) => count > 0 ? `Open messages (${count})` : "Open messages",
    hideMessages: "Hide messages",
    messageLiked: "liked your post",
    messageCommented: "commented on your post",
    messageReplied: "replied to your comment",
    messageReplyContent: "Reply content",
    messageReplyTarget: "In reply to",
    messagePostContext: "Post",
    viewPost: "View",
    likedBy: "Liked by",
    featuresEyebrow: "Feature hub",
    featuresTitle: "Keep the small tools together.",
    featuresBody: "Use this area as the first-level entry for light features. Longing and Zen live here now, and more tools can be added later.",
    featureRitualsTitle: "Ritual tools",
    featureRitualsBody: "Two small counters for Longing and Zen are grouped here for quick access.",
    featureLongingLabel: "Open Longing",
    featureZenLabel: "Open Zen",
    featureMoreTitle: "More tools later",
    featureMoreBody: "Reserve this block for future mini features, experiments, and quick utilities.",
    featureHubLabel: "Feature Center",
    featureShortcutTitle: "Quick launch",
    featureShortcutBody: "Jump straight into small tools without hunting through the feed.",
    featurePulseTitle: "Live pulse",
    featurePulseLonging: "Longing count",
    featurePulseZen: "Zen hits",
    featurePulseNotifications: "Unread messages",
    featureExploreTitle: "Expansion slot",
    featureExploreBody: "Keep space here for future rituals, utilities, and playful side tools.",
    featurePlaceholderTag: "Coming next",
    feedFeatureEntry: "Open features",
    feedCreateEntry: "Start posting",
    feedMobileHint: "A quieter feed on top, quick moves below.",
    profileSloganTitle: "Profile slogan",
    profileSloganHint: "Use one short line to describe your page.",
    profileSloganPlaceholder: "Write a short slogan or personal introduction.",
    profileSloganSave: "Save slogan",
    profileSloganSaveFailed: "Could not save slogan",
  },
  zh: {
    navFeed: "动态",
    navCreate: "发布",
    navFeatures: "功能",
    navProfile: "我的",
    login: "登录",
    logout: "退出登录",
    join: "加入",
    refresh: "刷新",
    language: "语言",
    languageZhLabel: "中",
    settings: "设置",
    appearance: "外观",
    themeDark: "深色模式",
    themeLight: "浅色模式",
    apiStatus: "接口状态",
    editAvatar: "编辑头像",
    avatarEditorTitle: "选择你的头像",
    currentAvatar: "当前头像",
    avatarPickerHint: "可选择默认头像，也可以上传自定义头像。",
    defaultAvatars: "默认头像",
    uploadAvatar: "上传",
    uploadCustomAvatar: "上传自定义头像",
    avatarUpdateFailed: "头像更新失败",
    feedEyebrow: "私人档案",
    feedTitle: "在一条安静的动态流里，发布文字、图集和小小仪式。",
    signedInAs: (name) => `当前登录：${name}`,
    joinPrompt: "加入后即可发布内容，打造属于你自己的私人档案。",
    loadingPosts: "正在加载帖子...",
    feedUnavailable: "当前动态暂时不可用。",
    noPostsEyebrow: "还没有内容",
    noPostsTitle: "从第一条记录开始你的档案。",
    noPostsBody: "使用“发布”来记录一段想法、一个场景，或一组图片。",
    postMediaAlt: "帖子图片",
    loginEyebrow: "登录",
    loginTitle: "回到你的档案。",
    loginHint: "使用账号登录，即可在任意设备继续发布。",
    signingIn: "正在登录...",
    loginFailed: "登录失败",
    working: "处理中...",
    email: "邮箱",
    password: "密码",
    loginButton: "登录",
    registerEyebrow: "加入",
    registerTitle: "创建一个安静的发布账号。",
    registerHint: "开始发布前，先创建你的个人资料。",
    creatingAccount: "正在创建账号...",
    registerFailed: "注册失败",
    displayName: "显示名称",
    createAccount: "创建账号",
    createEyebrow: "发布",
    createTitle: "用文字和图片创建一篇内容。",
    createHint: "点击加号卡片，可在发布前最多添加九张图片。",
    uploadInProgress: "图片上传中...",
    uploadReady: "图片已准备就绪。",
    uploadFailed: "上传失败",
    uploadTip: "可一次选择多张图片，最多 9 张",
    uploadCardPrimary: "添加照片",
    uploadCardSecondary: "点击选择并预览",
    selectedImages: (count) => `已选择 ${count} 张图片`,
    noImagesSelected: "还没有选择图片。",
    publishing: "发布中...",
    publishFailed: "发布失败",
    signInBeforePublish: "发布前请先登录。",
    publishAuthHint: "发布内容需要绑定登录账号。",
    goToLogin: "前往登录",
    text: "文字",
    textPlaceholder: "写一点简短的、私人的，或带有画面感的内容。",
    addImages: "图片",
    publish: "发布",
    uploadedPreviewAlt: "上传预览",
    remove: "移除",
    profileEyebrow: "个人主页",
    noSessionTitle: "当前没有登录会话。",
    noSessionHint: "登录后即可查看你的主页和已发布内容。",
    posts: "帖子",
    joined: "加入时间",
    emptyArchiveEyebrow: "还没有帖子",
    emptyArchiveTitle: "你的档案仍然是空的。",
    emptyArchiveBody: "从一段文字或一组图片开始吧。",
    longingMode: "思念模式",
    zenMode: "禅意模式",
    longingTitle: "数一数这种感觉。",
    zenTitle: "敲一敲木鱼。",
    longingCount: "思念次数",
    painReduced: "痛苦减轻",
    painMinusOne: "痛苦 -1",
    count: "计数",
    strikeMokugyo: "敲木鱼",
    tryAgain: "再试一次",
    saved: "已保存",
    rituals: "仪式",
    close: "关闭",
    longing: "思念",
    zen: "禅意",
    apiUnavailable: "接口不可用",
    like: "点赞",
    liked: "已点赞",
    comments: "评论",
    addComment: "添加评论",
    publishComment: "发表评论",
    sendingComment: "评论发送中...",
    commentPlaceholder: "写点友善、简短或有帮助的话吧。",
    signInToComment: "登录后才能发表评论。",
    noComments: "还没有评论。",
    loadingComments: "评论加载中...",
    likeFailed: "点赞失败",
    commentFailed: "评论发布失败",
    commentsLoadFailed: "评论加载失败",
    authRequiredAction: "请先登录后再互动",
    reply: "回复",
    replyTo: (name) => `回复 ${name}: `,
    replyingTo: (name) => `正在回复 ${name}`,
    cancelReply: "取消回复",
    replyPlaceholder: (name) => `回复 ${name}...`,
    previous: "上一张",
    next: "下一张",
    goToImage: (index) => `前往第 ${index} 张图片`,
    notifications: "消息",
    activityCenter: "消息中心",
    unread: "未读",
    loadingNotifications: "消息加载中...",
    noNotifications: "暂时还没有动态消息。",
    openMessages: (count) => count > 0 ? `打开消息（${count}）` : "打开消息",
    hideMessages: "收起消息",
    messageLiked: "赞了你的帖子",
    messageCommented: "评论了你的帖子",
    messageReplied: "回复了你的评论",
    messageReplyContent: "回复内容",
    messageReplyTarget: "回复对象",
    messagePostContext: "相关帖子",
    viewPost: "查看",
    likedBy: "点赞人",
    featuresEyebrow: "功能中心",
    featuresTitle: "把小功能集中收纳。",
    featuresBody: "这里作为一级功能入口，思念和 Zen 先放在这里，后续更多小功能也继续往这里扩展。",
    featureRitualsTitle: "仪式小功能",
    featureRitualsBody: "把思念计数和 Zen 木鱼放在同一个入口里，方便后续继续扩充。",
    featureLongingLabel: "打开思念",
    featureZenLabel: "打开 Zen",
    featureMoreTitle: "后续功能预留",
    featureMoreBody: "这一块预留给后续的小工具、实验功能和轻量互动入口。",
    featureHubLabel: "功能中心",
    featureShortcutTitle: "快捷入口",
    featureShortcutBody: "把轻量小功能集中放在这里，不需要再去动态里找。",
    featurePulseTitle: "实时状态",
    featurePulseLonging: "思念次数",
    featurePulseZen: "Zen 次数",
    featurePulseNotifications: "未读消息",
    featureExploreTitle: "扩展预留位",
    featureExploreBody: "后续的新仪式、小工具和有趣功能都继续塞到这里。",
    featurePlaceholderTag: "即将加入",
    feedFeatureEntry: "打开功能中心",
    feedCreateEntry: "马上发布",
    feedMobileHint: "上面看动态，下面直接走快捷入口。",
    profileSloganTitle: "主页标语",
    profileSloganHint: "用一句短话介绍你的主页气质。",
    profileSloganPlaceholder: "写一句简短的标语或个人简介。",
    profileSloganSave: "保存标语",
    profileSloganSaveFailed: "标语保存失败",
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
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("curator-language");
  return stored === "zh" ? "zh" : "en";
}
