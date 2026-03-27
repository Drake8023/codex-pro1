import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Dictionary } from "../../i18n";
import { Button } from "../../shared/components/Button";
import { StatusText } from "../../shared/components/StatusText";
import { ImageUploader } from "../../features/uploads/components/ImageUploader";
import { useImageUpload } from "../../features/uploads/hooks/useImageUpload";
import { useCreatePost } from "../../features/posts/hooks/usePosts";
import { useSession } from "../../features/auth/hooks/useSession";
import type { UploadedImage } from "../../features/uploads/types";

const MAX_IMAGES = 9;

export function CreatePage({ t }: { t: Dictionary }) {
  const navigate = useNavigate();
  const { currentUser } = useSession();
  const uploadImages = useImageUpload();
  const createPost = useCreatePost();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [status, setStatus] = useState("");

  const handleUpload = async (files: File[]) => {
    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) {
      setStatus(t.uploadTip);
      return;
    }
    const nextFiles = files.slice(0, availableSlots);
    setStatus(nextFiles.length < files.length ? t.uploadTip : "");
    try {
      const result = await uploadImages.mutateAsync(nextFiles);
      setImages((current) => [...current, ...result.images]);
    } catch {
      setStatus(t.uploadFailed);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setStatus(t.signInBeforePublish);
      return;
    }
    try {
      await createPost.mutateAsync({ content: content.trim(), imageUrls: images.map((image) => image.url) });
      setContent("");
      setImages([]);
      setStatus("");
      navigate("/");
    } catch {
      setStatus(t.publishFailed);
    }
  };

  return (
    <section className="page page--create">
      <div className="page-header glass-panel glass-panel--strong">
        <div>
          <p className="eyebrow">{t.createEyebrow}</p>
          <h1>{t.createTitle}</h1>
        </div>
        <StatusText>{t.createHint}</StatusText>
      </div>
      {!currentUser ? (
        <div className="auth-prompt glass-panel">
          <h2>{t.signInBeforePublish}</h2>
          <p>{t.publishAuthHint}</p>
          <Link className="app-link-button app-link-button--primary" to="/login">{t.goToLogin}</Link>
        </div>
      ) : (
        <div className="composer glass-panel">
          <label className="field">
            <span>{t.text}</span>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder={t.textPlaceholder} rows={8} />
          </label>
          <ImageUploader
            images={images}
            onUpload={handleUpload}
            onRemove={(index) => setImages((current) => current.filter((_, currentIndex) => currentIndex !== index))}
            t={t}
            disabled={uploadImages.isPending}
          />
          <div className="composer__footer">
            <StatusText>
              {uploadImages.isPending
                ? t.uploadInProgress
                : createPost.isPending
                  ? t.publishing
                  : status || (images.length > 0 ? t.uploadReady : "")}
            </StatusText>
            <Button
              variant="primary"
              onClick={() => void handleSubmit()}
              disabled={createPost.isPending || uploadImages.isPending || (!content.trim() && images.length === 0)}
            >
              {createPost.isPending ? t.publishing : t.publish}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
