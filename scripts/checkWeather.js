const url = process.argv[2] || 'http://localhost:5000/api/weather?city=Colombo';

(async () => {
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(text);
  } catch (err) {
    console.error('Fetch error:', err.message || err);
    process.exitCode = 1;
  }
})();
