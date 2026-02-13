"use client";

import {FormEvent, useEffect, useState} from "react";
import {CalendarSync, RefreshCw} from "lucide-react";
import {UIFieldClientComponent, UIFieldClientProps} from "payload";
import {usePayloadAPI} from '@payloadcms/ui'

import styles from './SyncEvents.module.scss';

export const SyncEvents: UIFieldClientComponent = ({ path }: UIFieldClientProps) => {
  const [{ data: processingJobs, isError, isLoading }, { setParams }] = usePayloadAPI(
    '/payload-api/payload-jobs?where[queue][equals]=sync-events&where[processing][equals]=true&limit=10',
    {},
  );
  const isProcessing = processingJobs?.docs?.length > 0;

  const [syncing, setSyncing] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // const disabled = isLoading || isError || syncing;

  useEffect(() => {
    console.log(processingJobs)
  }, [processingJobs]);

  useEffect(() => {
    console.log(isProcessing);

    setSyncing(isProcessing);
    setDisabled(isProcessing);
  }, [isProcessing]);

  const handleClick = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    console.log('Client-side request to sync events...');
    setSyncing(true);
    setDisabled(true)

    try {
      const response = await fetch('/api/sync-events', {
        method: 'POST',
      });

      if (!response.ok) {
        return new Error('Failed to sync events');
      }

      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.error('Error syncing events:', error);
    } finally {
      setSyncing(false);
      setDisabled(false);
    }
  }

  if (isLoading) return null;

  return (
    <div className={`${styles.syncEvents} field-type`}>
      <button onClick={handleClick} disabled={disabled} className={`btn btn--icon btn--size-small btn--style-primary btn--no-margin btn--icon-style-without-border btn--icon-position-left${disabled ? ' btn--disabled' : ''}`}>
        <span className={'btn__content'}>
          <span className={'btn__label'}>{syncing ? 'Syncing Events…' : 'Manual Sync'}</span>
          <span className={'btn__icon'}>
            {syncing ?
              <RefreshCw className={styles.syncAnimation} />
              :
              <CalendarSync />
            }
          </span>
        </span>
      </button>
    </div>
  )
}
