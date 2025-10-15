"use client";

import {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Select from 'react-select';

// Helper function from the original script
function ddmmyyToIso(str: string): string {
  // expects "dd/mm/yy"
  const [dd, mm, yy] = str.split('/');
  const yyyy = Number(yy) < 50 ? '20' + yy : '19' + yy;
  return `${yyyy}-${mm}-${dd}`;
}

const initialOrganizations = [
  { value: "19", label: "Armed Queers Salt Lake City" },
  { value: "2", label: "Bakers for Palestine" },
  { value: "20", label: "BTMC" },
  { value: "13", label: "Cache Valley Mutual Aid" },
  { value: "22", label: "Camping in Color SLC" },
  { value: "16", label: "Comunidades Unidas" },
  { value: "3", label: "DSA" },
  { value: "24", label: "Fish For Garbage" },
  { value: "11", label: "Green Wave Utah" },
  { value: "25", label: "ibikeutah" },
  { value: "1", label: "Indivisible" },
  { value: "8", label: "Ken Sanders Rare Books" },
  { value: "10", label: "MyUEA" },
  { value: "26", label: "Project Rainbow" },
  { value: "27", label: "Salt Lake Area Queer Climbers" },
  { value: "14", label: "Salt Lake Harm Reduction Project" },
  { value: "15", label: "Sierra Club Utah" },
  { value: "4", label: "SLC Mutual Aid" },
  { value: "12", label: "SLCounty Community Exchange" },
  { value: "28", label: "SLC Queer Latin Dance" },
  { value: "9", label: "uhwunited" },
  { value: "30", label: "Under the Umbrella Bookstore" },
  { value: "7", label: "United Mountain Workers" },
  { value: "18", label: "Urban Indian Center of Salt Lake" },
  { value: "17", label: "Utah State Progressive Caucus" },
  { value: "31", label: "Wasatch Community Gardens" },
  { value: "32", label: "Wasatch Trails Collective" },
  { value: "__add_new__", label: "+ Add New Organization" },
];

const OrganizationSigninPage = () => {
  const router = useRouter();

  // Password section state
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Org form state
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [selectedOrg, setSelectedOrg] = useState<{ value: string; label: string } | null>(null);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [orgFormConfirmation, setOrgFormConfirmation] = useState('');

  // Add new org state
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [addOrgMessage, setAddOrgMessage] = useState('');

  // Opportunities state
  const [showNewOpportunity, setShowNewOpportunity] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageOrg, setImageOrg] = useState<{ value: string; label: string } | null>(null);
  const [imageDate, setImageDate] = useState('');
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);


  useEffect(() => {
    if (selectedOrg && selectedOrg.value !== '__add_new__') {
      setShowAddOrg(false);
      setSelectionMode(false);
      fetch(`https://connectutahtoday-1.onrender.com/api/opportunities?organization_id=${selectedOrg.value}`)
        .then(res => res.json())
        .then(data => setOpportunities(data.opportunities || []));
    } else if (selectedOrg && selectedOrg.value === '__add_new__') {
      setShowAddOrg(true);
      setOpportunities([]);
    } else {
      setShowAddOrg(false);
      setOpportunities([]);
    }
  }, [selectedOrg]);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch('https://connectutahtoday-1.onrender.com/api/org-signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsAuthenticated(true);
          setPassword('');
          setPasswordError('');
        } else {
          setPasswordError('Incorrect password. Please try again.');
          setPassword('');
        }
      })
      .catch(() => {
        setPasswordError('Incorrect password. Please try again.');
        setPassword('');
      });
  };

  const handleAddOrg = () => {
    if (!newOrgName.trim()) {
      setAddOrgMessage("Organization name required.");
      return;
    }
    fetch('https://connectutahtoday-1.onrender.com/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newOrgName })
    })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          const newOrg = { value: data.id, label: newOrgName };
          const updatedOrgs = [...organizations.slice(0, -1), newOrg, organizations.slice(-1)[0]];
          setOrganizations(updatedOrgs);
          setSelectedOrg(newOrg);
          setNewOrgName('');
          setAddOrgMessage('');
          setShowAddOrg(false);
        } else {
          setAddOrgMessage(data.error || "Could not add organization.");
        }
      })
      .catch(() => setAddOrgMessage("Could not add organization."));
  };

  const handleSaveNewOpportunity = () => {
    if (newOpportunity.trim() && selectedOrg && selectedOrg.value !== '__add_new__') {
      fetch('https://connectutahtoday-1.onrender.com/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: selectedOrg.value, opportunity: newOpportunity })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOpportunities([...opportunities, newOpportunity]);
            setNewOpportunity('');
            setShowNewOpportunity(false);
          }
        });
    }
  };

  const handleDeleteSelected = async () => {
    const opportunitiesToDelete = Array.from(
      document.querySelectorAll<HTMLInputElement>('.opportunity-select:checked')
    ).map(cb => cb.value);

    if (opportunitiesToDelete.length === 0) {
      alert('Select at least one opportunity to delete.');
      return;
    }
    if (!confirm(`Delete selected opportunities for this organization?`)) return;

    try {
      await fetch('https://connectutahtoday-1.onrender.com/api/opportunities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: selectedOrg?.value, opportunities: opportunitiesToDelete })
      });
      const response = await fetch(`https://connectutahtoday-1.onrender.com/api/opportunities?organization_id=${selectedOrg?.value}`);
      const data = await response.json();
      setOpportunities(data.opportunities || []);
      setSelectionMode(false);
    } catch (err) {
      alert('Failed to delete opportunities. Please try again.');
      console.error(err);
    }
  };

  const handleImageUpload = async (e: FormEvent) => {
    e.preventDefault();
    setImageUploadMessage('');

    if (!imageOrg || imageOrg.value === "__add_new__") {
      setImageUploadMessage("Select an organization before uploading an image.");
      return;
    }
    const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;
    if (!imageDate || !dateRegex.test(imageDate)) {
      setImageUploadMessage("Date is required in dd/mm/yy format.");
      return;
    }
    if (!imageFile) {
      setImageUploadMessage("Choose an image file to upload.");
      return;
    }

    const isoDate = ddmmyyToIso(imageDate);
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('organization', imageOrg.label);
    formData.append('date', isoDate);

    setIsUploading(true);
    setImageUploadMessage('');

    try {
      const response = await fetch('https://cut-images-worker.cutproject.workers.dev/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok && result.url) {
        setImageUploadMessage(`Image uploaded successfully! <br><img src="${result.url}" style="max-width:100%;margin-top:1em;">`);

        fetch('https://connectutahtoday-1.onrender.com/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: result.url,
            organization: imageOrg.label,
            date: isoDate
          })
        })
          .then(res => res.json())
          .then(data => console.log("Saved in DB:", data))
          .catch(err => console.error("Error saving to DB:", err));

      } else {
        setImageUploadMessage(result.error || "Failed to upload image.");
      }
    } catch (err) {
      setImageUploadMessage("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOrgFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) {
      alert('Please select an organization before submitting.');
      return;
    }
    setOrgFormConfirmation('Organization information updated successfully!');
    setTimeout(() => {
      setOrgFormConfirmation('');
    }, 3000);
  };

  if (!isAuthenticated) {
    return (
      <main style={{ maxWidth: '400px', margin: '3em auto', padding: '2em 1em', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div>
          <h2>Organization Signin</h2>
          <form onSubmit={handlePasswordSubmit} autoComplete="off">
            <label htmlFor="org-password">Enter password:</label><br />
            <input
              type="password"
              id="org-password"
              name="org-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginTop: '0.5em', width: '100%', padding: '0.5em' }}
            /><br />
            <button type="submit" className="btn" style={{ marginTop: '1em' }}>Continue</button>
            {passwordError && <div style={{ color: '#b00020', marginTop: '1em' }}>{passwordError}</div>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '400px', margin: '3em auto', padding: '2em 1em', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <div>
        <h2>Organization Form</h2>
        <form onSubmit={handleOrgFormSubmit}>
          <label htmlFor="org-dropdown">Select an organization:</label><br />
          <Select
            id="org-dropdown"
            name="org-dropdown"
            options={organizations}
            value={selectedOrg}
            onChange={(option) => setSelectedOrg(option as any)}
            styles={{ container: (base) => ({ ...base, marginTop: '0.5em', width: '100%' })}}
          /><br />

          {showAddOrg && (
            <div style={{ marginBottom: '1em' }}>
              <label htmlFor="new-org-input">Add a new organization:</label><br />
              <input
                type="text"
                id="new-org-input"
                placeholder="Organization name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                style={{ width: '70%', padding: '0.4em' }}
              />
              <button type="button" onClick={handleAddOrg}>Add Organization</button>
              {addOrgMessage && <div style={{ color: '#b00020', marginTop: '0.5em' }}>{addOrgMessage}</div>}
            </div>
          )}

          {selectedOrg && selectedOrg.value !== '__add_new__' && (
            <>
              <label>Volunteer Opportunities:</label><br />
              <div style={{ marginBottom: '1em' }}>
                {opportunities.map((op, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    {selectionMode && <input type="checkbox" value={op} className="opportunity-select" />}
                    <span>{op}</span>
                  </div>
                ))}
                <button type="button" onClick={() => setShowNewOpportunity(!showNewOpportunity)} style={{ margin: '1em 0 0 0', padding: '0.4em 1em', display: 'block', textAlign: 'left' }}>Add New</button>
                {showNewOpportunity && (
                  <div style={{ margin: '1em 0' }}>
                    <input
                      type="text"
                      placeholder="Enter new opportunity"
                      value={newOpportunity}
                      onChange={(e) => setNewOpportunity(e.target.value)}
                      style={{ width: '70%', padding: '0.4em' }}
                    />
                    <button type="button" onClick={handleSaveNewOpportunity}>Save</button>
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '1em' }}>
                <button type="button" onClick={selectionMode ? handleDeleteSelected : () => setSelectionMode(true)} style={{ marginRight: '0.5em' }}>
                  {selectionMode ? 'Delete Selected' : 'Select'}
                </button>
              </div>
            </>
          )}


          <div style={{ textAlign: 'left' }}>
            <button type="submit" className="btn" style={{ marginTop: '1em' }}>Submit</button>
          </div>
          {orgFormConfirmation && <div style={{ color: 'green', marginTop: '1em' }}>{orgFormConfirmation}</div>}
        </form>

        <div style={{ margin: '2em 0 1em 0', padding: '1em', background: '#f8f8f8', borderRadius: '8px' }}>
          <h3>Event Flyer Upload</h3>
          <form onSubmit={handleImageUpload}>
            <label htmlFor="org-image">Select image:</label><br />
            <input
              type="file"
              id="org-image"
              name="org-image"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setImageFile(e.target.files ? e.target.files[0] : null)}
              style={{ marginTop: '0.5em' }}
            /><br /><br />
            <label htmlFor="org-img-dropdown">Organization:</label><br />
            <Select
              id="org-img-dropdown"
              name="org-img-dropdown"
              options={organizations.filter(o => o.value !== '__add_new__')}
              value={imageOrg}
              onChange={(option) => setImageOrg(option as any)}
              styles={{ container: (base) => ({ ...base, marginTop: '0.5em', width: '100%' })}}
            /><br />
            <label htmlFor="image-date-input">Date (dd/mm/yy):</label><br />
            <input
              type="text"
              id="image-date-input"
              name="image-date-input"
              required
              placeholder="dd/mm/yy"
              pattern="^\d{2}/\d{2}/\d{2}$"
              value={imageDate}
              onChange={(e) => setImageDate(e.target.value)}
              style={{ width: '70%', padding: '0.4em' }}
            /><br /><br />
            <button type="submit" disabled={isUploading} style={{ marginTop: '0.5em' }}>
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
          {imageUploadMessage && <div style={{ color: imageUploadMessage.startsWith('Error') || imageUploadMessage.startsWith('Failed') ? '#b00020' : 'green', marginTop: '0.5em' }} dangerouslySetInnerHTML={{ __html: imageUploadMessage }} />}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2em' }}>
          <button type="button" onClick={() => router.push('/')} className="btn" style={{ padding: '0.7em 2em', fontSize: '1em' }}>Return to Homepage</button>
        </div>
      </div>
    </main>
  );
};

export default OrganizationSigninPage;
