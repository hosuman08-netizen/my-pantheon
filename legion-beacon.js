/* Legion 경량 측정 beacon — 개인정보 최소(익명 uuid만), 페이지뷰+핵심액션.
   워커 배포 후 window.LEGION_ANALYTICS_URL 세팅하면 활성. 없으면 무동작(앱 영향0). */
/* CSP note: index.html 의 script-src 는 'unsafe-inline' 미포함 → 인라인 <script> 설정 불가.
   따라서 self-hosted 인 이 파일 상단에서 설정을 세팅한다(설정 없을 때만; 외부 오버라이드 존중). */
/* 2026-07-29 C5 Morpheus: multi-compatible body — anon+anonId+ts+extra (was type-only, extra dropped) */
(function(){
  if(typeof window!=='undefined'){
    if(!window.LEGION_APP) window.LEGION_APP='my-pantheon';
    if(!window.LEGION_ANALYTICS_URL) window.LEGION_ANALYTICS_URL='https://legion-analytics.hoyashi95.workers.dev';
  }
})();
(function(){
  try{
    var URL = window.LEGION_ANALYTICS_URL;
    var APP = String(window.LEGION_APP || document.title || location.pathname).slice(0,40);
    var K='legion_anon';
    var anon = localStorage.getItem(K);
    if(!anon){ anon = (Date.now().toString(36)+Math.random().toString(36).slice(2,8)); localStorage.setItem(K,anon); }
    window.legionTrack = function(type, extra){
      if(!URL) return;
      try{
        // multi worker: b.anon; ALLOWED workers: ts; p20/p21 parity: anon+anonId+extra
        var body = JSON.stringify(Object.assign({
          app: APP,
          type: String(type || 'view').slice(0, 32),
          anon: anon,
          anonId: anon,
          ts: Date.now()
        }, extra || {}));
        if(navigator.sendBeacon){ navigator.sendBeacon(URL+'/ev', body); }
        else{ fetch(URL+'/ev',{method:'POST',headers:{'content-type':'application/json'},body:body,keepalive:true}).catch(function(){}); }
      }catch(e){}
    };
    // boot: view (multi stats) + session_start + app_open (parity with p20/p21)
    function boot(){
      try{
        var ik = APP + '_installed', first = !localStorage.getItem(ik);
        if(first){ localStorage.setItem(ik,'1'); window.legionTrack('install',{}); }
        window.legionTrack('view');
        window.legionTrack('session_start',{first:first});
        window.legionTrack('app_open',{});
      }catch(e){}
    }
    if(document.readyState!=='loading') boot();
    else document.addEventListener('DOMContentLoaded', boot);
  }catch(e){}
})();
