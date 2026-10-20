import { useRef, useState } from 'react';
import { Button, Field, FilterPills, Icon, Input, Select, Switch, UploadProgress, VideoPlayer } from '../../../components/ui/index.jsx';
import VideoRecorder from '../../../components/ui/VideoRecorder.jsx';
import { VIDEO_MAX_MB, videoSizeError } from '../../../constants/uploads.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useOptions } from '../../../hooks/useOptions.js';
import { useUploadProgress } from '../../../hooks/useUploadProgress.js';
import { isAbortError } from '../../../lib/api.js';
import {
  addGalleryPhotos, deleteGalleryItem, removeWelcomeVideo, setGalleryCover, updateGalleryItem, uploadCentreLogo, uploadWelcomeVideo,
} from '../../../services/centreApi.js';
import { StepTitle, useStepForm } from './shared.jsx';

const transform = (form) => ({ ...form, virtual_tour_url: form.virtual_tour_url || null, welcome_video_title: form.welcome_video_title || null });

function PhotoEditor({ photo, categories, onSaved, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState({ caption: photo.caption || '', alt_text: photo.alt_text || '', category: photo.category?.key || 'classrooms' });
  const [busy, setBusy] = useState(null);

  async function run(kind, action) {
    setBusy(kind);
    try {
      const response = await action();
      onSaved(response.data);
      toast.success(response.message);
      if (kind === 'delete') onClose();
    } catch (error) {
      toast.error(error);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="cb-photo-editor">
      <Field label="Caption"><Input value={form.caption} onChange={(event) => setForm({ ...form, caption: event.target.value })} maxLength={150} placeholder="Toddler room — morning light" /></Field>
      <Field label="Alt text" hint="for screen readers"><Input value={form.alt_text} onChange={(event) => setForm({ ...form, alt_text: event.target.value })} maxLength={200} placeholder="Bright toddler room with low shelves" /></Field>
      <Field label="Category"><Select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} options={categories} /></Field>
      <div className="ec-actions">
        {!photo.is_cover && <Button size="sm" variant="outline" style={{ color: '#42007B' }} loading={busy === 'cover'} onClick={() => run('cover', () => setGalleryCover(photo.id))}>Set as cover photo</Button>}
        <Button size="sm" variant="danger" loading={busy === 'delete'} onClick={() => run('delete', () => deleteGalleryItem(photo.id))}>Delete</Button>
        <Button size="sm" loading={busy === 'save'} onClick={() => run('save', () => updateGalleryItem(photo.id, form))}>Save photo details</Button>
      </div>
    </div>
  );
}

const toForm = (centre) => ({
  welcome_video_title: centre.form.welcome_video_title || '',
  welcome_video_captions: Boolean(centre.form.welcome_video_captions),
  virtual_tour_url: centre.form.virtual_tour_url || '',
});

export default function MediaStep({ centre, onSaved, ...handlers }) {
  const toast = useToast();
  const options = useOptions();
  const categories = options.gallery_categories || [];

  const { form, set, setForm, errors } = useStepForm('media', toForm, centre, { onSaved, ...handlers, transform });
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(centre.gallery.find((item) => item.is_cover)?.id ?? centre.gallery[0]?.id ?? null);
  const [uploading, setUploading] = useState(null);
  const uploader = useUploadProgress();
  const [recording, setRecording] = useState(false);
  const [dragging, setDragging] = useState(false);
  const photoInput = useRef(null);
  const videoInput = useRef(null);
  const logoInput = useRef(null);

  const photos = centre.gallery.filter((item) => item.type === 'image');
  const shown = photos.filter((item) => filter === 'all' || item.category?.key === filter);
  const counts = Object.fromEntries(categories.map((category) => [category.key, photos.filter((p) => p.category?.key === category.key).length]));
  const selectedPhoto = photos.find((item) => item.id === selected);

  async function upload(kind, run) {
    setUploading(kind);
    try {
      const response = await run();
      onSaved(response.data);
      toast.success(response.message);
      return response.data;
    } catch (error) {
      if (isAbortError(error)) toast.info('Upload cancelled.');
      else toast.error(Object.values(error.errors || {})[0]?.[0] || error.message);
      return null;
    } finally {
      setUploading(null);
    }
  }

  function uploadVideo(file) {
    if (videoSizeError(file)) {
      toast.error(videoSizeError(file));
      return null;
    }
    return upload('video', () => uploader.run(file.name || 'your video', (options) => uploadWelcomeVideo(file, form.welcome_video_title, options)));
  }

  async function addPhotos(fileList) {
    const files = [...fileList].filter((file) => file.type.startsWith('image/')).slice(0, 12);
    if (!files.length) return;
    const label = files.length === 1 ? files[0].name : `${files.length} photos`;
    const updated = await upload('photos', () => uploader.run(label, (options) => addGalleryPhotos(files, filter === 'all' ? 'classrooms' : filter, options)));
    if (updated && !selected) setSelected(updated.gallery[0]?.id ?? null);
  }

  return (
    <>
      <StepTitle number={4} title="Photos & video" description="Show your spaces and people. Profiles with a video and 12+ photos get the most tour requests." />
      <input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(event) => { addPhotos(event.target.files); event.target.value = ''; }} />
      <input ref={videoInput} type="file" accept="video/mp4,video/quicktime,video/webm" hidden onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) uploadVideo(file); }} />
      <input ref={logoInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) upload('logo', () => uploadCentreLogo(file)); }} />

      <section className="cb-card">
        <div className="cb-card-head"><h3>Welcome video</h3><span>30–90 seconds · MP4, MOV or WebM · up to {VIDEO_MAX_MB} MB</span></div>
        <div className="cb-video">
          {uploading === 'video' ? (
            <div className="cb-video-stage cb-video-empty">
              <Icon name="video" size={28} />
              <UploadProgress progress={uploader.progress} onCancel={uploader.cancel} />
            </div>
          ) : centre.welcome_video ? (
            <VideoPlayer className="cb-video-stage" src={centre.welcome_video.url} label="your welcome video" />
          ) : (
            <div className="cb-video-stage cb-video-empty">
              <Icon name="video" size={28} />
              <span>No welcome video yet</span>
              <span className="ec-row-flex" style={{ gap: 8 }}>
                <Button size="xs" onClick={() => videoInput.current?.click()} disabled={uploader.busy}>Upload</Button>
                <Button size="xs" variant="outline" onClick={() => setRecording(true)} disabled={uploader.busy}>Record</Button>
              </span>
            </div>
          )}
          <div className="ec-stack-sm">
            <Field label="Video title" error={errors.welcome_video_title}><Input value={form.welcome_video_title} onChange={set('welcome_video_title')} placeholder="A welcome from our director" maxLength={120} /></Field>
            <div className="ec-row-flex ec-wrap" style={{ gap: 10 }}>
              <span className="ec-row-flex" style={{ gap: 8, fontWeight: 600, fontSize: 14 }}>
                <Switch size="sm" checked={form.welcome_video_captions} onChange={(value) => setForm((current) => ({ ...current, welcome_video_captions: value }))} label="Auto-captions" />Auto-captions
              </span>
              {centre.welcome_video && uploading !== 'video' && (
                <>
                  <Button size="sm" variant="outline" disabled={uploader.busy} onClick={() => videoInput.current?.click()}>Replace</Button>
                  <Button size="sm" variant="danger" disabled={uploader.busy} loading={uploading === 'remove'} onClick={() => upload('remove', removeWelcomeVideo)}>Remove</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="cb-card">
        <div className="cb-card-head"><h3>Photo gallery <span className="ec-muted" style={{ fontWeight: 500, fontSize: 15 }}>· {photos.length} {photos.length === 1 ? 'photo' : 'photos'}</span></h3><span>JPG, PNG or WebP · up to 10 MB each · aim for 12+</span></div>
        <FilterPills label="Photo categories" value={filter} onChange={setFilter}
          options={[{ key: 'all', label: `All · ${photos.length}` }, ...categories.map((category) => ({ key: category.key, label: `${category.label} · ${counts[category.key] || 0}` }))]} />
        {uploading === 'photos' && <UploadProgress progress={uploader.progress} onCancel={uploader.cancel} />}
        <div className="cb-gallery">
          <button
            type="button"
            className={`cb-photo cb-photo-add ${dragging ? 'is-drag' : ''}`}
            onClick={() => photoInput.current?.click()}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); addPhotos(event.dataTransfer.files); }}
            disabled={uploader.busy}
          >
            <Icon name="plus" size={20} />
            {uploading === 'photos' ? 'Uploading…' : 'Add photos'}
            <small>or drag &amp; drop</small>
          </button>
          {shown.map((photo) => (
            <button key={photo.id} type="button" className="cb-photo" aria-pressed={selected === photo.id ? 'true' : 'false'} aria-label={photo.alt_text || photo.caption || 'Gallery photo'} style={{ backgroundImage: `url(${photo.url})` }} onClick={() => setSelected(photo.id)}>
              {photo.is_cover && <span className="cb-cover-badge">Cover</span>}
              {!photo.alt_text && <span className="cb-alt-badge">Needs alt text</span>}
            </button>
          ))}
        </div>
        {selectedPhoto && <PhotoEditor key={selectedPhoto.id} photo={selectedPhoto} categories={categories} onSaved={onSaved} onClose={() => setSelected(null)} />}
        <span className="ec-muted" style={{ fontSize: 13.5 }}>Avoid photos where children’s faces are identifiable unless you have parent consent.</span>
      </section>

      <section className="cb-card">
        <Field label="Virtual tour link" hint="optional · Matterport, YouTube 360 or similar" error={errors.virtual_tour_url}>
          <Input type="url" value={form.virtual_tour_url} onChange={set('virtual_tour_url')} placeholder="https://" invalid={errors.virtual_tour_url} />
        </Field>
        <div className="cb-media-row">
          <div className="cb-media-tile">
            <span className="cb-media-thumb">{centre.logo_url ? <img src={centre.logo_url} alt="" /> : centre.initials}</span>
            <span><strong>Logo</strong><Button size="xs" variant="outline" style={{ color: '#42007B' }} loading={uploading === 'logo'} onClick={() => logoInput.current?.click()}>{centre.logo_url ? 'Change' : 'Upload'}</Button></span>
          </div>
          <div className="cb-media-tile">
            <span className="cb-media-thumb" style={{ backgroundImage: centre.cover_url ? `url(${centre.cover_url})` : undefined }} />
            <span><strong>Cover photo</strong><span className="ec-muted" style={{ fontSize: 13.5 }}>{centre.cover_url ? 'Pick any gallery photo and “Set as cover”' : 'Pick any gallery photo'}</span></span>
          </div>
        </div>
      </section>
      <VideoRecorder open={recording} title="Record your welcome video" onClose={() => setRecording(false)} onRecorded={uploadVideo} />
    </>
  );
}
