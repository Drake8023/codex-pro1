import { useRef, useState } from "react";
import { CameraOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { Avatar } from "../../../shared/components/Avatar";
import { Button } from "../../../shared/components/Button";
import { StatusText } from "../../../shared/components/StatusText";
import type { Dictionary } from "../../../i18n";
import type { User } from "../types";
import { avatarPresetIds, getAvatarPresetUrl } from "../avatarPresets";
import { useUpdateAvatar } from "../hooks/useSession";
import { useImageUpload } from "../../uploads/hooks/useImageUpload";
import { IMAGE_UPLOAD_ACCEPT } from "../../uploads/constants";

export function AvatarPickerModal({ open, onClose, user, t }: { open: boolean; onClose: () => void; user: User; t: Dictionary }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const uploadImages = useImageUpload();
  const updateAvatar = useUpdateAvatar();
  const [status, setStatus] = useState("");

  const handlePreset = async (presetId: (typeof avatarPresetIds)[number]) => {
    setStatus("");
    try {
      await updateAvatar.mutateAsync(getAvatarPresetUrl(presetId));
      onClose();
    } catch {
      setStatus(t.avatarUpdateFailed);
    }
  };

  const handleUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setStatus("");
    try {
      const result = await uploadImages.mutateAsync([file]);
      const uploaded = result.images[0];
      if (!uploaded) throw new Error("missing image");
      await updateAvatar.mutateAsync(uploaded.url);
      onClose();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.avatarUpdateFailed);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title={t.avatarEditorTitle} centered>
      <div className="avatar-picker">
        <div className="avatar-picker__current glass-panel">
          <Avatar user={user} size="lg" />
          <div>
            <strong>{t.currentAvatar}</strong>
            <StatusText>{status || t.avatarPickerHint}</StatusText>
          </div>
        </div>
        <div className="avatar-picker__section">
          <div className="avatar-picker__section-head">
            <strong>{t.defaultAvatars}</strong>
            <Button variant="ghost" size="sm" icon={<CameraOutlined />} onClick={() => inputRef.current?.click()}>
              {t.uploadAvatar}
            </Button>
          </div>
          <input ref={inputRef} type="file" accept={IMAGE_UPLOAD_ACCEPT} className="avatar-picker__input" onChange={(event) => { void handleUpload(event.target.files); event.target.value = ""; }} />
          <div className="avatar-picker__grid">
            {avatarPresetIds.map((presetId) => {
              const presetUrl = getAvatarPresetUrl(presetId);
              return (
                <button key={presetId} type="button" className={`avatar-picker__option ${user.avatarUrl === presetUrl ? "is-active" : ""}`} onClick={() => void handlePreset(presetId)}>
                  <img src={presetUrl} alt={`${presetId} avatar`} />
                </button>
              );
            })}
          </div>
        </div>
        <Button variant="ghost" icon={<UploadOutlined />} onClick={() => inputRef.current?.click()}>
          {t.uploadCustomAvatar}
        </Button>
      </div>
    </Modal>
  );
}
