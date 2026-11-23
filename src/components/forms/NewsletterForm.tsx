'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { mockSubmit } from '@/lib/mock';
import styles from './NewsletterForm.module.css';

export function NewsletterForm({ tone = 'band', id = 'newsletter' }: { tone?: 'band' | 'page'; id?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get('email') ?? '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setState('loading');
    try {
      await mockSubmit(); // demo: nothing is sent
      setState('done');
      setMessage('You’re on the list. First letter lands on roast day.');
      form.reset();
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'We couldn’t sign you up just now. Please try again.');
    }
  }

  return (
    <form className={styles.form} data-tone={tone} onSubmit={onSubmit} noValidate>
      <label htmlFor={id} className="sr-only">Email address</label>
      <div className={styles.row}>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          className={styles.input}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={`${id}-msg`}
          required
        />
        <button type="submit" className={styles.submit} disabled={state === 'loading'} aria-label="Subscribe">
          {state === 'done' ? <Icon name="check" size={18} /> : <Icon name="arrow" size={18} />}
        </button>
      </div>
      <p id={`${id}-msg`} className={styles.msg} data-state={state} aria-live="polite">
        {message || 'Roast notes, brew guides and first dibs on micro-lots. Twice a month, never more.'}
      </p>
    </form>
  );
}
