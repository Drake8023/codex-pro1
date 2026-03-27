import { useRef, type ChangeEvent } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "../../../shared/components/Button";
import type { Dictionary } from "../../../i18n";
import type { UploadedImage } from "../types";

export function ImageUploader({ images, onUpload, onRemove, t, disabled }: { images: UploadedImage[]; onUpload: (files: File[]) => Promise<void>; onRemove: (index: number) => void; t: Dictionary; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      await onUpload(files);
    }
    event.target.value = "";
  };

  return (
    <div className="uploader">
      <div className="uploader__head">
        <span>{t.addImages}</span>
        <small>{t.uploadTip}</small>
      </div>
      <input ref={inputRef} className="uploader__input" type="file" accept="image/*" multiple onChange={(event) => void handleChange(event)} />
      <div className="uploader__grid uploader__grid--composer">
        {images.length < 9 ? (
          <Button variant="ghost" className="uploader__add" disabled={disabled} onClick={() => inputRef.current?.click()} icon={<PlusOutlined />}>
            <small>{t.uploadCardPrimary}</small>
          </Button>
        ) : null}
        {images.map((image, index) => (
          <article className="uploader__tile" key={`${image.url}-${index}`}>
            <img src={image.url} alt={`${t.uploadedPreviewAlt} ${index + 1}`} />
            <Button variant="ghost" size="sm" className="uploader__remove" onClick={() => onRemove(index)}>{t.remove}</Button>
          </article>
        ))}
      </div>
      <p className="uploader__caption">{images.length > 0 ? t.selectedImages(images.length) : t.noImagesSelected}</p>
    </div>
  );
}
