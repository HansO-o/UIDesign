import React, { useId, useRef, useState } from 'react';
import type { SelectionProps } from './types';
import { clamp, nearestEnabled } from './math';
import './styles.css';
export type { Choice, SelectionProps } from './types';

/** Single selection with native radio semantics and keyboard behavior. */
export function SingleSelectList({options, value, onValueChange, label, disabled}: SelectionProps) {
  const name = useId();
  return <fieldset className="selection-list" disabled={disabled}>
    <legend>{label}</legend>
    {options.map(option => <label className="selection-list__item" key={option.value}>
      <input type="radio" name={name} value={option.value} checked={value === option.value} disabled={option.disabled} onChange={() => onValueChange(option.value)} />
      <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
    </label>)}
  </fieldset>;
}

/** Equal-width segments. Pointer dragging previews continuously; selection commits on release. */
export function SegmentedSelector({options, value, onValueChange, label, disabled}: SelectionProps) {
  const name = useId(), root = useRef<HTMLFieldSetElement>(null);
  const dragging = useRef<number | null>(null), startX = useRef(0);
  const [position, setPosition] = useState<number | null>(null);
  const selected = options.findIndex(o => o.value === value);
  const count = options.length;
  const pointerPosition = (clientX: number) => {
    const rect = root.current!.getBoundingClientRect();
    // The fieldset contains a track inset of 4px on either side.
    const width = Math.max(1, rect.width - 8), x = clientX - rect.left - 4;
    return clamp(x / width * count - .5, 0, Math.max(0, count - 1));
  };
  const finish = (event: React.PointerEvent<HTMLDivElement>, commit: boolean) => {
    if (dragging.current !== event.pointerId) return;
    dragging.current = null;
    if (commit) {
      const point = pointerPosition(event.clientX);
      const tapped = Math.round(point);
      const index = Math.abs(event.clientX - startX.current) < 4 && options[tapped]?.disabled ? -1 : nearestEnabled(options, point);
      if (index >= 0) {
        root.current?.querySelectorAll<HTMLInputElement>('input')[index]?.focus();
        if (options[index].value !== value) onValueChange(options[index].value);
      }
    }
    setPosition(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  if (!count) return null;
  return <fieldset ref={root} className="segmented" disabled={disabled} aria-label={label}>
    <div className="segmented__track" onPointerDown={event => {
      if (disabled || event.button !== 0 || options.every(o => o.disabled)) return;
      // Preserve keyboard focus behavior, but let the track own pointer gestures.
      event.preventDefault(); dragging.current = event.pointerId; startX.current = event.clientX;
      event.currentTarget.setPointerCapture(event.pointerId); setPosition(pointerPosition(event.clientX));
    }} onPointerMove={event => { if (dragging.current === event.pointerId) setPosition(pointerPosition(event.clientX)); }}
      onPointerUp={event => finish(event, true)} onPointerCancel={event => finish(event, false)}
      onLostPointerCapture={() => { dragging.current = null; setPosition(null); }}>
      {(position !== null || selected >= 0) && <span aria-hidden="true" className={'segmented__indicator' + (position !== null ? ' is-dragging' : '')}
        style={{width: `${100 / count}%`, left: `${(position ?? selected) * 100 / count}%`}} />}
      {options.map(option => <label className="segmented__option" key={option.value}>
        <input type="radio" name={name} value={option.value} checked={value === option.value} disabled={option.disabled} onChange={() => onValueChange(option.value)} />
        <span>{option.label}</span>
      </label>)}
    </div>
  </fieldset>;
}
