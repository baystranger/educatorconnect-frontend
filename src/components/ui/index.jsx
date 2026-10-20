import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { avatarTone, fileSize } from '../../utils/format.js';
import Icon from './Icon.jsx';

export { default as Icon } from './Icon.jsx';

/** Button or link styled as a button. Pass `to` for router links, `href` for external. */
export function Button({ variant = 'primary', size, block, to, href, className = '', loading, children, disabled, ...props }) {
  const classes = ['ec-btn', `ec-btn-${variant}`, size && `ec-btn-${size}`, block && 'ec-btn-block', className].filter(Boolean).join(' ');
  if (to) return <Link className={classes} to={to} {...props}>{children}</Link>;
  if (href) return <a className={classes} href={href} {...props}>{children}</a>;
  return (
    <button className={classes} type="button" disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {children}
    </button>
  );
}

export function Pill({ tone = 'gray', size, children, className = '' }) {
  return <span className={`ec-pill ${size === 'sm' ? 'ec-pill-sm' : ''} tone-${tone} ${className}`}>{children}</span>;
}

export function Tag({ tone = 'gray', children }) {
  return <span className={`ec-tag tone-${tone}`}>{children}</span>;
}

/** Initials avatar with a stable colour per name; shows the image when available. */
export function Avatar({ name, initials, src, size = 44, round = false, tone, radius }) {
  const resolvedTone = tone || avatarTone(name || initials || '');
  return (
    <span
      className={`ec-avatar ${round ? 'ec-avatar-round' : ''} tone-${resolvedTone}`}
      style={{ width: size, height: size, fontSize: size >= 60 ? size * 0.36 : size * 0.32, borderRadius: radius }}
      aria-hidden="true"
    >
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
}

export function Switch({ checked, onChange, label, size, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked ? 'true' : 'false'}
      aria-label={label}
      disabled={disabled}
      className={`ec-switch ${size === 'sm' ? 'ec-switch-sm' : ''}`}
      onClick={() => onChange(!checked)}
    />
  );
}

export function Checkmark({ checked }) {
  return (
    <span className="ec-check" data-checked={checked ? 'true' : 'false'} aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </span>
  );
}

/** Label + control + inline validation message. */
export function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`ec-label ${className}`}>
      <span>{label}{hint && <> <span className="ec-hint">{hint}</span></>}</span>
      {children}
      {error && <span className="ec-field-error" role="alert">{error}</span>}
    </label>
  );
}

export function Input({ invalid, className = '', ...props }) {
  return <input className={`ec-input ${className}`} aria-invalid={invalid ? 'true' : undefined} {...props} />;
}

export function Select({ invalid, options = [], placeholder, className = '', ...props }) {
  return (
    <select className={`ec-select ${className}`} aria-invalid={invalid ? 'true' : undefined} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.key ?? option.value ?? option} value={option.key ?? option.value ?? option}>
          {option.label ?? option}
        </option>
      ))}
    </select>
  );
}

export function Textarea({ invalid, className = '', ...props }) {
  return <textarea className={`ec-textarea ${className}`} aria-invalid={invalid ? 'true' : undefined} {...props} />;
}

/** Single- or multi-select pill group (role=radio / checkbox). */
export function ChoiceChips({ options = [], value, onChange, multiple = false, tone, label }) {
  const selected = multiple ? new Set(value || []) : null;
  return (
    <div className="ec-chips" role={multiple ? 'group' : 'radiogroup'} aria-label={label}>
      {options.map((option) => {
        const on = multiple ? selected.has(option.key) : value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={on ? 'true' : 'false'}
            className={`ec-chip ${tone === 'green' ? 'ec-chip-green' : ''}`}
            onClick={() => {
              if (!multiple) return onChange(option.key);
              const next = new Set(selected);
              if (next.has(option.key)) next.delete(option.key); else next.add(option.key);
              return onChange([...next]);
            }}
          >
            {tone === 'green' && (on ? '✓ ' : '+ ')}{option.label}
          </button>
        );
      })}
    </div>
  );
}

export function FilterPills({ options, value, onChange, label }) {
  return (
    <div className="ec-filters" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          className="ec-filter"
          aria-pressed={value === option.key ? 'true' : 'false'}
          onClick={() => onChange(option.key)}
        >
          {option.label}
          {option.count !== undefined && <span className="ec-filter-count">{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Tabs({ tabs, value, onChange, label }) {
  return (
    <div className="ec-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          className="ec-tab"
          aria-selected={value === tab.key ? 'true' : 'false'}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ec-tab-count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function StepBars({ step, total = 6, closed = false }) {
  return (
    <span className={`ec-steps ${closed ? 'is-closed' : ''}`} aria-label={closed ? 'Closed' : `Step ${step} of ${total}`}>
      {Array.from({ length: total }, (_, index) => <span key={index} className={index < step ? 'is-done' : ''} />)}
    </span>
  );
}

export function Spinner({ label = 'Loading' }) {
  return <span className="ec-spinner" role="status" aria-label={label} />;
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="ec-page-state" aria-live="polite">
      <div className="ec-state"><Spinner label={label} /><span>{label}</span></div>
    </div>
  );
}

export function Skeleton({ height = 16, width = '100%', style }) {
  return <span className="ec-skeleton" style={{ display: 'block', height, width, ...style }} aria-hidden="true" />;
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="ec-state">
      {title && <strong>{title}</strong>}
      {children && <span>{children}</span>}
      {action}
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'We couldn’t load this' }) {
  return (
    <div className="ec-state ec-state-error" role="alert">
      <strong>{title}</strong>
      <span>{error?.message || 'Something went wrong. Please try again.'}</span>
      {onRetry && <Button variant="secondary" size="sm" onClick={() => onRetry()}>Try again</Button>}
    </div>
  );
}

export function Alert({ tone = 'info', children }) {
  return <div className={`ec-alert ec-alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}

/** Video with a large Play button over its first frame; the normal controls take over once it plays. */
export function VideoPlayer({ src, label = 'video', className = '', style }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  useEffect(() => setStarted(false), [src]);

  return (
    <div className={`ec-player ${className}`} style={style}>
      {/* `#t=0.1` makes browsers draw the first frame instead of a black box. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={ref} src={`${src}#t=0.1`} controls={started} playsInline preload="metadata" onPlay={() => setStarted(true)} />
      {!started && (
        <button type="button" className="ec-player-play" aria-label={`Play ${label}`} onClick={() => ref.current?.play()}>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
        </button>
      )}
    </div>
  );
}

/** Upload progress bar fed by useUploadProgress(). At 100% the server is still saving, so it says so. */
export function UploadProgress({ progress, onCancel }) {
  if (!progress) return null;
  const processing = progress.percent >= 100;
  return (
    <div className="ec-upload">
      <div className="ec-upload-head">
        <span className="ec-upload-name">{processing ? 'Processing…' : `Uploading ${progress.label}`}</span>
        <span className="ec-upload-percent">{progress.percent}%</span>
      </div>
      <div className="ec-progress" role="progressbar" aria-label={`Uploading ${progress.label}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}>
        <span className={processing ? 'is-processing' : ''} style={{ width: `${progress.percent}%` }} />
      </div>
      <div className="ec-upload-foot">
        <small>{processing ? 'Almost done — saving your file.' : progress.total ? `${fileSize(progress.loaded) || '0 KB'} of ${fileSize(progress.total)}` : 'Starting…'}</small>
        {onCancel && !processing && <button type="button" className="ec-link-btn" onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

export function Modal({ open, title, onClose, children, footer }) {
  const titleId = useId();
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    ref.current?.querySelector('input, textarea, select, button')?.focus();
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ec-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="ec-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}>
        <div className="ec-modal-head">
          <h2 className="ec-h2" id={titleId}>{title}</h2>
          <button type="button" className="ec-btn-icon ec-btn" aria-label="Close" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>
        {children}
        {footer && <div className="ec-actions" style={{ justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}
