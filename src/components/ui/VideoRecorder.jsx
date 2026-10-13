import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from './index.jsx';

const MAX_SECONDS = 90;

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null;
  return ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']
    .find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

/** Records a short intro / welcome video in the browser and hands back a File for upload. */
export default function VideoRecorder({ open, onClose, onRecorded, title = 'Record a video' }) {
  const liveRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [state, setState] = useState('idle'); // idle | ready | recording | recorded | error
  const [seconds, setSeconds] = useState(0);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    const mime = pickMimeType();
    if (mime === null || !navigator.mediaDevices?.getUserMedia) {
      setState('error');
      setError('Your browser can’t record video. Upload a video file instead.');
      return undefined;
    }
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((track) => track.stop()); return; }
        streamRef.current = stream;
        if (liveRef.current) liveRef.current.srcObject = stream;
        setState('ready');
      })
      .catch(() => {
        setState('error');
        setError('We couldn’t access your camera. Check your browser permissions, or upload a video file instead.');
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (state !== 'recording') return undefined;
    const timer = setInterval(() => setSeconds((value) => {
      if (value + 1 >= MAX_SECONDS) recorderRef.current?.stop();
      return value + 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [state]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function start() {
    const mime = pickMimeType();
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, mime ? { mimeType: mime } : undefined);
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      const type = recorder.mimeType.split(';')[0] || 'video/webm';
      const blob = new Blob(chunksRef.current, { type });
      const recorded = new File([blob], `recording.${type.includes('mp4') ? 'mp4' : 'webm'}`, { type });
      setFile(recorded);
      setPreview(URL.createObjectURL(blob));
      setState('recorded');
    };
    recorderRef.current = recorder;
    setSeconds(0);
    recorder.start(1000);
    setState('recording');
  }

  function retake() {
    setFile(null);
    setPreview(null);
    setState('ready');
    if (liveRef.current && streamRef.current) liveRef.current.srcObject = streamRef.current;
  }

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={state === 'recorded' ? (
        <>
          <Button variant="outline" onClick={retake}>Retake</Button>
          <Button onClick={() => { onRecorded(file); onClose(); }}>Use this video</Button>
        </>
      ) : null}
    >
      {state === 'error' ? (
        <div className="ec-alert ec-alert-error">{error}</div>
      ) : (
        <div className="ec-recorder">
          {state === 'recorded'
            ? <video src={preview} controls playsInline />
            : <video ref={liveRef} autoPlay muted playsInline />}
          <div className="ec-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="ec-muted" style={{ fontSize: 14 }}>
              {state === 'recording' ? `● Recording ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} / 1:30` : 'Aim for 30–60 seconds. Good light, quiet room.'}
            </span>
            {state === 'ready' && <Button size="sm" onClick={start}>Start recording</Button>}
            {state === 'recording' && <Button size="sm" variant="danger-solid" onClick={() => recorderRef.current?.stop()}>Stop</Button>}
          </div>
        </div>
      )}
    </Modal>
  );
}
