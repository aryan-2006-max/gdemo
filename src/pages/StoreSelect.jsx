import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import stores from '../data/stores';

export default function StoreSelect() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [selectedStore, setSelectedStore] = useState(null);
  const [branchId, setBranchId] = useState('');

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setBranchId('');
  };

  const handleContinue = () => {
    const branch = selectedStore.branches.find(b => b.id === branchId);

    dispatch({
      type: 'SELECT_STORE',
      payload: {
        ...selectedStore,
        branch,
      },
    });

    navigate('/scan');
  };

  return (
    <div className="page store-page">
      <p className="page-subtitle">Choose your supermarket to begin scanning</p>

      <div className="store-grid">
        {stores.map((store) => (
          <button
            key={store.id}
            className="store-card"
            style={{ borderColor: store.color }}
            onClick={() => handleStoreClick(store)}
          >
            <span className="store-logo">{store.logo}</span>
            <h3 className="store-name">{store.name}</h3>
            <p className="store-desc">{store.description}</p>
          </button>
        ))}
      </div>

      {selectedStore && (
        <div className="branch-select">
          <h3>Select a branch for {selectedStore.name}</h3>

          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            <option value="">Select location</option>
            {selectedStore.branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          <button
            className="primary-btn"
            disabled={!branchId}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}