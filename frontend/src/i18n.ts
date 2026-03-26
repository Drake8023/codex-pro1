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
    navFeed: "??",
    navCreate: "??",
    navProfile: "??",
    login: "??",
    logout: "??",
    join: "??",
    refresh: "??",
    language: "??",
    languageZhLabel: "??",
    feedEyebrow: "????",
    feedTitle: "??????????????????",
    signedInAs: (name) => `?????${name}`,
    joinPrompt: "???????????????????",
    loadingPosts: "??????...",
    feedUnavailable: "?????????",
    noPostsEyebrow: "?????",
    noPostsTitle: "???????????????",
    noPostsBody: "????????????????????",
    postMediaAlt: "????",
    loginEyebrow: "??",
    loginTitle: "???????",
    loginHint: "????????????????",
    signingIn: "????...",
    loginFailed: "????",
    working: "???",
    email: "??",
    password: "??",
    loginButton: "??",
    registerEyebrow: "??",
    registerTitle: "????????????",
    registerHint: "??????????????",
    creatingAccount: "??????...",
    registerFailed: "????",
    displayName: "??",
    createAccount: "????",
    createEyebrow: "??",
    createTitle: "?????????",
    createHint: "???????????????",
    uploadInProgress: "??????...",
    uploadReady: "???????",
    uploadFailed: "????",
    publishing: "????...",
    publishFailed: "????",
    signInBeforePublish: "?????????",
    publishAuthHint: "?????????????????",
    goToLogin: "???",
    text: "??",
    textPlaceholder: "?????????????????",
    addImages: "????",
    publish: "??",
    uploadedPreviewAlt: "????",
    remove: "??",
    profileEyebrow: "????",
    noSessionTitle: "??????",
    noSessionHint: "??????????????????",
    posts: "???",
    joined: "????",
    emptyArchiveEyebrow: "?????",
    emptyArchiveTitle: "?????????",
    emptyArchiveBody: "????????????????",
    longingMode: "????",
    zenMode: "???",
    longingTitle: "???????",
    zenTitle: "??????",
    longingCount: "????",
    painReduced: "????",
    painMinusOne: "?? -1",
    count: "??",
    strikeMokugyo: "???",
    tryAgain: "???",
    saved: "???",
    rituals: "???",
    close: "??",
    longing: "??",
    zen: "?",
    apiUnavailable: "?????",
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
