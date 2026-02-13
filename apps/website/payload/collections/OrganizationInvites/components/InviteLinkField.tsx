"use client"
import React from 'react'
import {useFormFields} from '@payloadcms/ui'

const InviteLinkField: React.FC = () => {
  const code = useFormFields(([fields]) => fields.code?.value) as string | undefined

  if (!code) return null

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const inviteLink = `${baseUrl}/register?invite=${code}`

  return (
    <div className="field-type ui" style={{ marginBottom: '20px' }}>
      <label className="field-label" style={{ marginBottom: '10px', display: 'block' }}>Invite Link</label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          readOnly
          value={inviteLink}
          style={{
            flexGrow: 1,
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            // background: '#f5f5f5',
            fontSize: '14px'
          }}
        />
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(inviteLink)
          }}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px',
            border: '1px solid #000',
            background: '#000',
            color: '#fff',
            fontSize: '14px'
          }}
        >
          Copy
        </button>
      </div>
      <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
        Share this link with the organizer you want to invite.
      </p>
    </div>
  )
}

export default InviteLinkField
