"use client";

import React from 'react';
import {CopyToClipboard, FieldDescription, FieldLabel, useFormFields} from '@payloadcms/ui';
import {UIFieldClientComponent} from "payload";

export const InviteLinkField: UIFieldClientComponent = ({path}) => {
  const code = useFormFields(([fields]) => fields.code?.value) as string | undefined

  if (!code) return null

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const inviteLink = `${baseUrl}/register?invite=${code}`

  return (
    <div className="field-type ui">
      <FieldLabel label="Invite Link" />
      <div style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'stretch',
        marginTop: '4px',
      }}>
        <input
          readOnly
          value={inviteLink}
          style={{
            flexGrow: 1,
            padding: '12px 8px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-150)',
            background: 'var(--theme-elevation-50)',
            color: 'var(--theme-elevation-800)',
            minWidth: 0,
          }}
        />
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 8px',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150)',
          background: 'var(--theme-elevation-100)',
        }}>
          <CopyToClipboard value={inviteLink} />
        </div>
      </div>
      <FieldDescription path={path} description="Share this link with the organizer you want to invite." />
    </div>
  )
}
