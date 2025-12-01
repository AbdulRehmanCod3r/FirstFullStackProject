import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRegionById, updateRegion } from '../api/Region'; // Import API functions

const EditRegion: React.FC = () => {
    // Get the ID from the URL parameter
    const { id } = useParams<{ id: string }>(); 
    const regionId = id ? parseInt(id) : null;

    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // Fetch the current region data on component load
    useEffect(() => {
        if (!regionId) {
            setError("Invalid Region ID.");
            setLoading(false);
            return;
        }

        const fetchRegion = async () => {
            try {
                const region = await getRegionById(regionId);
                setDescription(region.regionDescription);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(`Failed to load region: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchRegion();
    }, [regionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!regionId) return;

        setSubmitting(true);
        setError(null);

        if (!description.trim()) {
            setError('Region Description cannot be empty.');
            setSubmitting(false);
            return;
        }

        try {
            const success = await updateRegion(regionId, { regionDescription: description.trim() });
            
            if (success) {
                alert('Region updated successfully!');
                // Navigate back to the Region list after success
                navigate('/regions');
            } else {
                throw new Error('API failed to return a success status.');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to update region: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading region data...</p>;
    if (error && !loading) return <p className="text-danger">Error: {error}</p>;
    if (!regionId) return <p className="text-danger">Region ID not provided.</p>;

    return (
        <div className="container py-4">
            <h5 className="mb-3">Edit Region: {regionId}</h5>
            <div className="card p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Region Description
                        </label>
                        <input
                            id="description"
                            type="text"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-danger">{error}</p>}
                    
                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/regions')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={submitting || !description.trim()}
                        >
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRegion;