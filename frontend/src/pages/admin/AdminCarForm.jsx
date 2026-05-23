import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';

const INITIAL = {
  name: '', brand: '', model: '', year: '',
  price: '', mileage: 0, condition: 'new', transmission: 'automatic',
  fuelType: 'petrol', bodyType: 'sedan', color: '', engineSize: '',
  horsepower: '', topSpeed: '', acceleration: '', description: '',
  features: '', isFeatured: false, isAvailable: true,
};

// Moved outside to prevent re-renders
const Field = ({ label, children, span = 1 }) => (
  <div className={span === 2 ? 'col-span-2' : ''}>
    <label style={{ color: '#6b7280', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: '600' }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  color: '#111827',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  borderRadius: '6px',
};

export default function AdminCarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(INITIAL);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/cars/${id}`)
      .then(({ data }) => {
        const { images, features, ...rest } = data;
        setForm({ ...INITIAL, ...rest, features: features?.join(', ') || '' });
        setExistingImages(images || []);
      })
      .catch(() => toast.error('Failed to load car'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = useCallback((k, v) => setForm((p) => ({ ...p, [k]: v })), []);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    const urls = selected.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      const features = form.features.split(',').map((f) => f.trim()).filter(Boolean);
      Object.entries({ ...form, features: JSON.stringify(features) }).forEach(([k, v]) => {
        if (v !== '') fd.append(k, v);
      });
      files.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await api.put(`/cars/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Car updated!');
      } else {
        await api.post('/cars', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Car added!');
      }
      navigate('/admin/cars');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save car');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <AdminLayout title="Loading...">
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #e5e7eb', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <form onSubmit={handleSubmit}>

        {/* Images */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#000000', fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Vehicle Images</h3>
          <label style={{ display: 'block', border: '2px dashed #e5e7eb', padding: '32px', textAlign: 'center', cursor: 'pointer', borderRadius: '8px' }}>
            <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '4px' }}>Click to upload images</p>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>JPG, PNG, WebP up to 10MB each. Max 10 images.</p>
          </label>

          {previews.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
              {previews.map((url, i) => (
                <img key={i} src={url} alt="" style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
              ))}
            </div>
          )}

          {existingImages.length > 0 && previews.length === 0 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ color: '#6b7280', fontSize: '11px', marginBottom: '12px' }}>Current Images</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {existingImages.map((img, i) => (
                  <img key={i} src={img.url} alt="" style={{ width: '96px', height: '64px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#000000', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand *">
              <input required value={form.brand} onChange={(e) => set('brand', e.target.value)} style={inputStyle} placeholder="e.g. Mercedes-Benz" />
            </Field>
            <Field label="Model *">
              <input required value={form.model} onChange={(e) => set('model', e.target.value)} style={inputStyle} placeholder="e.g. G-Wagon" />
            </Field>
            <Field label="Display Name">
              <input value={form.name} onChange={(e) => set('name', e.target.value)} style={inputStyle} placeholder="e.g. G-Wagon AMG Edition " />
            </Field>
            <Field label="Year *">
              <input type="number" value={form.year} onChange={(e) => set('year', e.target.value)} style={inputStyle} min="1990" max="2030" />
            </Field>
            <Field label="Price (KES) *">
              <input required type="number" value={form.price} onChange={(e) => set('price', e.target.value)} style={inputStyle} placeholder="e.g. 15000000" />
            </Field>
            <Field label="Color *">
              <input required value={form.color} onChange={(e) => set('color', e.target.value)} style={inputStyle} placeholder="e.g. Obsidian Black" />
            </Field>
            <Field label="Condition">
              <select value={form.condition} onChange={(e) => set('condition', e.target.value)} style={inputStyle}>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="certified">Certified Pre-Owned</option>
              </select>
            </Field>
            <Field label="Mileage (km)">
              <input type="number" value={form.mileage} onChange={(e) => set('mileage', e.target.value)} style={inputStyle} />
            </Field>
          </div>
        </div>

        {/* Specs */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#000000', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Body Type">
              <select value={form.bodyType} onChange={(e) => set('bodyType', e.target.value)} style={inputStyle}>
                {['sedan','suv', 'mini-suv','coupe','convertible','wagon','truck','van','hatchback'].map((t) => (
                  <option key={t} value={t} className="capitalize">{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Transmission">
              <select value={form.transmission} onChange={(e) => set('transmission', e.target.value)} style={inputStyle}>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="semi-automatic">Semi-Automatic</option>
                <option value="cvt">CVT</option>
                <option value="e-CVT">e-CVT</option>
              </select>
            </Field>
            <Field label="Fuel Type">
              <select value={form.fuelType} onChange={(e) => set('fuelType', e.target.value)} style={inputStyle}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Field>
            <Field label="Engine Size">
              <input value={form.engineSize} onChange={(e) => set('engineSize', e.target.value)} style={inputStyle} placeholder="e.g. 4.0L V8 BiTurbo" />
            </Field>
            <Field label="Horsepower">
              <input type="number" value={form.horsepower} onChange={(e) => set('horsepower', e.target.value)} style={inputStyle} placeholder="e.g. 630" />
            </Field>
            <Field label="Top Speed (km/h)">
              <input type="number" value={form.topSpeed} onChange={(e) => set('topSpeed', e.target.value)} style={inputStyle} placeholder="e.g. 280" />
            </Field>
            <Field label="0–100 km/h">
              <input value={form.acceleration} onChange={(e) => set('acceleration', e.target.value)} style={inputStyle} placeholder="e.g. 3.9 seconds" />
            </Field>
          </div>
        </div>

        {/* Description & Features */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#000000', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Description & Features</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Description *">
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="Describe this vehicle..."
              />
            </Field>
            <Field label="Features (comma-separated)">
              <input
                value={form.features}
                onChange={(e) => set('features', e.target.value)}
                style={inputStyle}
                placeholder="Panoramic roof, Heated seats, Massage seats..."
              />
            </Field>
          </div>
        </div>

        {/* Settings */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ color: '#000000', fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Listing Settings</h3>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {[
              { key: 'isFeatured', label: 'Featured on Homepage' },
              { key: 'isAvailable', label: 'Available for Sale' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <div
                  onClick={() => set(key, !form[key])}
                  style={{ width: '48px', height: '24px', borderRadius: '12px', backgroundColor: form[key] ? '#000000' : '#e5e7eb', position: 'relative', transition: 'background-color 0.3s', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: '4px', left: form[key] ? '28px' : '4px', width: '16px', height: '16px', backgroundColor: '#ffffff', borderRadius: '50%', transition: 'left 0.3s' }} />
                </div>
                <span style={{ color: '#374151', fontSize: '14px' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#000000', color: '#ffffff', padding: '12px 32px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px' }}
          >
            {loading && <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff40', borderTop: '2px solid #ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
            {isEdit ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/cars')}
            style={{ backgroundColor: '#ffffff', color: '#000000', padding: '12px 32px', fontSize: '13px', fontWeight: '700', border: '1px solid #000000', cursor: 'pointer', borderRadius: '6px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
