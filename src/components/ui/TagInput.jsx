import { useState } from 'react';

/** Free-text tags (languages, areas of expertise…). Enter or comma adds a tag. */
export default function TagInput({ value = [], onChange, placeholder = 'Type and press Enter', max = 20, label, suggestions = [] }) {
  const [draft, setDraft] = useState('');

  function add(text) {
    const tag = text.trim().replace(/,$/, '');
    if (!tag || value.includes(tag) || value.length >= max) return;
    onChange([...value, tag]);
    setDraft('');
  }

  return (
    <div className="ec-tag-input">
      <div className="ec-tag-list">
        {value.map((tag) => (
          <span key={tag} className="ec-tag-chip">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter((item) => item !== tag))}>×</button>
          </span>
        ))}
        <input
          className="ec-tag-field"
          value={draft}
          aria-label={label}
          placeholder={value.length ? '' : placeholder}
          onChange={(event) => (event.target.value.endsWith(',') ? add(event.target.value) : setDraft(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') { event.preventDefault(); add(draft); }
            if (event.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={() => add(draft)}
        />
      </div>
      {suggestions.filter((item) => !value.includes(item)).length > 0 && (
        <div className="ec-tag-suggestions">
          {suggestions.filter((item) => !value.includes(item)).map((item) => (
            <button key={item} type="button" onClick={() => add(item)}>+ {item}</button>
          ))}
        </div>
      )}
    </div>
  );
}
