import React from 'react';
import { createRoot } from 'react-dom/client';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const options = ['USD', 'EUR', 'ILS'];
const field = (id, label) => (params) => <TextField {...params} label={label} />;

function App() {
  return (
    <div style={{ display: 'grid', gap: 24, width: 320, padding: 24 }}>
      <Autocomplete options={options} renderInput={field('single', 'Currency')} />
      <Autocomplete
        options={options}
        value={null}
        onChange={() => {}}
        renderInput={field('rejecting', 'Rejecting')}
      />
      <Autocomplete multiple options={options} renderInput={field('multi', 'Currencies')} />
      <Autocomplete
        multiple
        options={options}
        value={[]}
        onChange={() => {}}
        renderInput={field('multi-rejecting', 'Rejecting multi')}
      />
    </div>
  );
}
createRoot(document.getElementById('root')).render(<App />);
