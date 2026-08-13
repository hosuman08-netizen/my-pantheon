// SW 등록 — 인라인 <script>가 CSP(script-src 'self')에 차단되던 것을 외부 파일로 분리 (2026-08-06 Morpheus)
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(function (e) { try { console.error('[SW] 등록 실패', e); if (window.legionTrack) legionTrack('sw_register_fail', { msg: String(e).slice(0, 80) }); } catch (_) {} }); }
