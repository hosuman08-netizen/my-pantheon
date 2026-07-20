/* Legion 경량 측정 beacon — 개인정보 최소(익명 uuid만), 페이지뷰+핵심액션.
   워커 배포 후 window.LEGION_ANALYTICS_URL 세팅하면 활성. 없으면 무동작(앱 영향0). */
/* CSP note: index.html 의 script-src 는 'unsafe-inline' 미포함 → 인라인 <script> 설정 불가.
   따라서 self-hosted 인 이 파일 상단에서 설정을 세팅한다(설정 없을 때만; 외부 오버라이드 존중). */
(function(){
  if(typeof window!=='undefined'){
    if(!window.LEGION_APP) window.LEGION_APP='my-pantheon';
    if(!window.LEGION_ANALYTICS_URL) window.LEGION_ANALYTICS_URL='https://legion-analytics.hoyashi95.workers.dev';
  }
})();
(function(){
  try{
    var URL = window.LEGION_ANALYTICS_URL;
    var APP = (window.LEGION_APP || document.title || location.pathname).slice(0,40);
    var K='legion_anon';
    var anon = localStorage.getItem(K);
    if(!anon){ anon = (Date.now().toString(36)+Math.random().toString(36).slice(2,8)); localStorage.setItem(K,anon); }
    window.legionTrack = function(type){
      if(!URL) return;
      try{
        var body = JSON.stringify({ app:APP, type:(type||'view').slice(0,24), anon:anon });
        if(navigator.sendBeacon){ navigator.sendBeacon(URL+'/ev', body); }
        else{ fetch(URL+'/ev',{method:'POST',body:body,keepalive:true}).catch(function(){}); }
      }catch(e){}
    };
    // 자동 페이지뷰 1회
    if(document.readyState!=='loading') window.legionTrack('view');
    else document.addEventListener('DOMContentLoaded',function(){window.legionTrack('view');});
  }catch(e){}
})();
