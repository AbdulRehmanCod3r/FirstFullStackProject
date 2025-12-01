import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRegion } from '../api/Region'; // Import the addRegion function

const AddRegion: React.FC = () => {
    const [regionId, setRegionId] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!description.trim()) {
            setError('Region Description cannot be empty.');
            setLoading(false);
            return;
        }

        try {
            // Call the API function to add the new region
            const success = await addRegion({ regionId: regionId, regionDescription: description.trim() });
            
            if (success) {
                alert('Region added successfully!');
                // Navigate back to the Region list after success
                navigate('/regions'); 
            } else {
                throw new Error('API failed to return a success status.');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to add region: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h5 className="mb-3">Add New Region</h5>
            <div className="card p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="regionId" className="form-label">
                            Region ID
                        </label>
                        <input
                            id="regionId"
                            type="number"
                            className="form-control"
                            value={regionId}
                            onChange={(e) => setRegionId(Number(e.target.value))}
                            required
                        />
                    </div>
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
                            disabled={loading || !description.trim()}
                        >
                            {loading ? 'Adding...' : 'Add Region'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRegion;