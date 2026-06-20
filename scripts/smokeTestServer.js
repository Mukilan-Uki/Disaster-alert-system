const url = process.argv[2] || 'http://localhost:5000/api/weather?city=Colombo';

(async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    if (!json.city) throw new Error('Invalid response body');
    console.log('Smoke test passed:', JSON.stringify(json));
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err.message || err);
    process.exit(1);
  }
})();
