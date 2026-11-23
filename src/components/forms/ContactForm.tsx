'use client';

import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { mockSubmit } from '@/lib/mock';
import styles from './ContactForm.module.css';

const TOPICS = ['Order help', 'Wholesale', 'Roastery visit', 'Press', 'Something else'];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

function validate(data: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (data.name.trim().length < 2) e.name = 'Please tell us your name.';
  if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = 'That email doesn’t look quite right.';
  if (data.message.trim().length < 10) e.message = 'A few more words, please (10 characters minimum).';
  return e;
}

export function ContactForm() {
  const params = useSearchParams();
  const initialTopic = TOPICS.includes(params.get('topic') ?? '') ? params.get('topic')! : 'Order help';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      topic: String(fd.get('topic') ?? 'Order help'),
      message: String(fd.get('message') ?? ''),
    };
    const v = validate(data);
    setErrors(v);
    if (Object.keys(v).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      await mockSubmit(); // demo: nothing is sent
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setServerError(
        err instanceof Error && err.message !== 'Failed to fetch' && !err.message.includes('signal')
          ? err.message
          : 'We couldn’t send that just now. Please try again, or email hello@kaapii.coffee.',
      );
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.sent} role="status">
        <span className={styles.sentIcon}><Icon name="check" size={28} /></span>
        <p className="h3">Thank you. <em>Message received.</em></p>
        <p className="muted">One of us will reply within a working day, usually sooner, often with coffee opinions.</p>
        <button type="button" className="link-underline" onClick={() => setStatus('idle')}>Send another message</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <div className="field">
          <label htmlFor="c-name">Your name</label>
          <input id="c-name" name="name" className="input" autoComplete="name" aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? 'c-name-err' : undefined} />
          {errors.name && <p id="c-name-err" className="field-error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" className="input" autoComplete="email" aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? 'c-email-err' : undefined} />
          {errors.email && <p id="c-email-err" className="field-error">{errors.email}</p>}
        </div>
      </div>

      <fieldset className={styles.topics}>
        <legend>What’s it about?</legend>
        <div>
          {TOPICS.map((t) => (
            <label key={t} className={styles.topic}>
              <input type="radio" name="topic" value={t} defaultChecked={t === initialTopic} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" className="input" rows={6} aria-invalid={!!errors.message || undefined} aria-describedby={errors.message ? 'c-message-err' : undefined} placeholder="Tell us what you’re brewing, or what went wrong…" />
        {errors.message && <p id="c-message-err" className="field-error">{errors.message}</p>}
      </div>

      {serverError && <p className="field-error" role="alert">{serverError}</p>}

      <div className={styles.submitRow}>
        <button type="submit" className="btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
          <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
        </button>
        <p className="small muted">We never share your details. Ever.</p>
      </div>
    </form>
  );
}
