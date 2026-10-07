import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🪵 ===================================================
  🚀 WOODY HOME BACKEND RUNNING ON http://localhost:${PORT}
  🛒 Cart Session Enabled (with Cookie & Header support)
  📦 Database: Supabase PostgreSQL
  🔍 Predictive Search: /api/search/suggest?q=lamp
  🤖 Model Context Protocol: /api/mcp
  ===================================================
  `);
});
