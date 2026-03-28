import { ExpandOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { Button } from "../../../shared/components/Button";
import type { Dictionary } from "../../../i18n";
import type { PostImage } from "../types";

export function PostImageGallery({ images, postLabel, t }: { images: PostImage[]; postLabel: string; t: Dictionary }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const scrollToIndex = (nextIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(images.length - 1, nextIndex));
    track.scrollTo({ left: track.clientWidth * clamped, behavior: "smooth" });
    setIndex(clamped);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => setIndex(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  if (images.length === 1) {
    return (
      <>
        <div className="post-gallery post-gallery--single">
          <button type="button" className="post-gallery__image-button" onClick={() => setPreviewOpen(true)}>
            <img src={images[0].url} alt={`${postLabel} ${t.postMediaAlt}`} loading="lazy" />
            <span className="post-gallery__zoom-badge">
              <ExpandOutlined />
            </span>
          </button>
        </div>
        <Modal open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={null} centered width="min(92vw, 1080px)" className="post-gallery__modal">
          <img className="post-gallery__modal-image" src={images[0].url} alt={`${postLabel} ${t.postMediaAlt}`} />
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="post-gallery post-gallery--carousel">
        <div className="post-gallery__track" ref={trackRef}>
          {images.map((image, imageIndex) => (
            <div className="post-gallery__slide" key={image.id}>
              <button type="button" className="post-gallery__image-button" onClick={() => { setIndex(imageIndex); setPreviewOpen(true); }}>
                <img src={image.url} alt={`${postLabel} ${t.postMediaAlt}`} loading="lazy" />
                <span className="post-gallery__zoom-badge">
                  <ExpandOutlined />
                </span>
              </button>
            </div>
          ))}
        </div>
        <div className="post-gallery__footer">
          <Button variant="ghost" size="sm" className="post-gallery__arrow" onClick={() => scrollToIndex(index - 1)} disabled={index === 0} icon={<LeftOutlined />}>{t.previous}</Button>
          <div className="post-gallery__dots">
            {images.map((image, imageIndex) => (
              <Button
                key={image.id}
                variant="ghost"
                size="sm"
                className={`post-gallery__dot ${imageIndex === index ? "is-active" : ""}`}
                aria-label={t.goToImage(imageIndex + 1)}
                onClick={() => scrollToIndex(imageIndex)}
              />
            ))}
          </div>
          <Button variant="ghost" size="sm" className="post-gallery__arrow" onClick={() => scrollToIndex(index + 1)} disabled={index === images.length - 1} icon={<RightOutlined />}>{t.next}</Button>
        </div>
      </div>
      <Modal open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={null} centered width="min(92vw, 1080px)" className="post-gallery__modal">
        <div className="post-gallery__modal-shell">
          <img className="post-gallery__modal-image" src={images[index]?.url} alt={`${postLabel} ${t.postMediaAlt}`} />
          {images.length > 1 ? (
            <div className="post-gallery__modal-controls">
              <Button variant="ghost" size="sm" className="post-gallery__arrow" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} icon={<LeftOutlined />}>{t.previous}</Button>
              <span className="post-gallery__modal-count">{index + 1} / {images.length}</span>
              <Button variant="ghost" size="sm" className="post-gallery__arrow" onClick={() => setIndex((value) => Math.min(images.length - 1, value + 1))} disabled={index === images.length - 1} icon={<RightOutlined />}>{t.next}</Button>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
