(function(){
var CAP=2200, TITLE="올팍 갈까? — 올림픽공원 방문일 길잡이";
var D=window.DAYS, keys=Object.keys(D).sort(), WD=["월","화","수","목","금","토","일"];
function pct(v){return Math.round(v/CAP*100)}
function grade(v){var p=v/CAP;return p<0.5?"lo":p<0.85?"mid":"hi"}
var GN={lo:"낮음",mid:"보통",hi:"높음"};
function fmt(n){return n.toLocaleString("ko-KR")}
var EV=window.EVENTS||[], PG={"KSPO DOME":"hi"};
function dk(t){return t.getFullYear()+"-"+("0"+(t.getMonth()+1)).slice(-2)+"-"+("0"+t.getDate()).slice(-2)}
function evOn(k,wd){return EV.filter(function(e){return e.from<=k&&k<=e.to&&(!e.days||e.days.indexOf(wd)>=0)})}
function vshort(v){return v.replace("우리금융","").replace("KSPO DOME","DOME").replace("티켓링크 라이브 아레나","아레나")}
var T0=new Date();T0.setHours(0,0,0,0);var NEXT=[];
for(var i=0;i<14;i++){var t=new Date(T0.getFullYear(),T0.getMonth(),T0.getDate()+i),wd=(t.getDay()+6)%7,k=dk(t),es=evOn(k,wd);
 NEXT.push({k:k,t:t,wd:wd,es:es,g:es.some(function(e){return PG[e.venue]})?"hi":es.length?"mid":"lo",warn:wd<5&&es.some(function(e){return PG[e.venue]})})}
function nx(k){for(var i=0;i<NEXT.length;i++)if(NEXT[i].k==k)return NEXT[i]}
var h=(location.hash||"#s1").slice(1).split("&"), scr=h[0]||"s1", sel="2024-07-20";
h.forEach(function(x){if(x.indexOf("d=")==0)sel=x.slice(2)});
if(!D[sel]&&!nx(sel))sel="2024-07-20";
document.title=TITLE;
document.getElementById("t").textContent="「"+TITLE+"」";
var nav=document.getElementById("nav");
[["s1","① 달력"],["s2","② 시간대"],["s3","③ 믿어도 돼요?"]].forEach(function(a){
 var e=document.createElement("a");e.href="#"+a[0]+(a[0]=="s2"?"&d="+sel:"");e.textContent=a[1];if(a[0]==scr)e.className="on";nav.appendChild(e)});
window.addEventListener("hashchange",function(){location.reload()});
var m=document.getElementById("m"),o="";
if(scr=="s1"){
 var wk=keys.filter(function(k){return D[k].wd<5}), we=keys.filter(function(k){return D[k].wd>=5});
 var wmx=wk.map(function(k){return D[k].max}), wemx=we.map(function(k){return D[k].max});
 var big=we.filter(function(k){return D[k].max/CAP>=0.85});
 // 다음 2주: 공연장 규모로 미리 정한 예상(2026-11-17 10시, 기록 보기 전에 고정). 오늘부터 14일, 일정은 매일 자동 갱신
 var a=NEXT[0].t,b=NEXT[13].t;
 o+='<div class="card"><h2>다음 2주 ('+(a.getMonth()+1)+'.'+a.getDate()+'~'+(b.getMonth()+1)+'.'+b.getDate()+') 방문일 예상</h2><div class="cal">';
 WD.forEach(function(w){o+='<div class="h">'+w+'</div>'});
 NEXT.forEach(function(n,i){
  if(i==0)for(var j=0;j<n.wd;j++)o+='<div></div>';
  o+='<a class="d k '+n.g+'" href="#s2&d='+n.k+'">'+(n.warn?'⚠ ':'')+n.t.getDate()+'<small>'+(n.es.length?n.es.map(function(e){return vshort(e.venue)}).join("·"):"공연 없음")+'</small></a>'});
 o+='</div><p class="leg"><span><i style="background:var(--hi)"></i>빨강 DOME 공연</span><span><i style="background:var(--mid)"></i>노랑 다른 공연장</span><span><i style="background:var(--lo)"></i>초록 공연 없음(여유 보장 아님)</span></p>';
 if(NEXT.some(function(n){return n.warn}))o+='<p class="warn">⚠ <b>평일 DOME 공연일</b>: '+NEXT.filter(function(n){return n.warn}).map(function(n){return (n.t.getMonth()+1)+'/'+n.t.getDate()+'('+WD[n.wd]+')'}).join(", ")+' — 평일이라도 지난 기록에서 DOME 공연 평일 4일 중 3일이 만차였습니다. 대중교통을 권합니다.</p>';
 o+='<p class="note">날짜를 누르면 그날 공연·예상·참고 곡선을 봅니다.</p>';
 o+='<table><tr><th>날짜</th><th>공연장</th><th>공연</th></tr>';
 EV.filter(function(e){return e.to>=NEXT[0].k&&e.from<=NEXT[13].k}).forEach(function(e){o+='<tr><td>'+e.from.slice(5).replace("-","/")+'~'+e.to.slice(5).replace("-","/")+'</td><td>'+e.venue+'</td><td>'+e.name+'<br><small>'+e.time+'</small></td></tr>'});
 o+='</table><p class="note"><b>미리 정한 예상 규칙</b>(11/17 10시 고정): KSPO DOME 공연일 = 빨강(혼잡 예상), 다른 공연장만 = 노랑, 공연 없음 = 초록. 공연 일정은 기관 누리집 일정안내('+window.EVENTS_CHECKED+' 확인). 초록은 ‘공연이 없다’는 뜻일 뿐 <b>주차 여유를 보장하지 않습니다</b>(주말·행사·날씨 영향). 11/17부터 실시간 주차값을 10분마다 기록해 이 예상이 맞았는지 화면3에 공개합니다.</p></div>';
 o+='<div class="soon">아래는 <b>2024년 7월 실측</b>입니다(예측이 아니라 그날 실제 최대값).</div>';
 o+='<div class="card"><h2>2024년 7월 하루 최대 동시 주차</h2><div class="cal">';
 WD.forEach(function(w){o+='<div class="h">'+w+'</div>'});
 var first=new Date(2024,6,8), pad=(first.getDay()+6)%7; // 월=0
 for(var i=0;i<pad;i++)o+='<div></div>';
 for(var d=8;d<=31;d++){var k="2024-07-"+(d<10?"0"+d:d),v=D[k];
  o+='<a class="d k '+grade(v.max)+'" href="#s2&d='+k+'">'+d+'<small>'+fmt(v.max)+'</small><small>'+pct(v.max)+'%</small></a>'}
 o+='</div><p class="leg"><span><i style="background:var(--lo)"></i>낮음 50% 미만</span><span><i style="background:var(--mid)"></i>보통 50~85%</span><span><i style="background:var(--hi)"></i>높음 85% 이상</span></p>';
 o+='<p class="note">정원 2,200대는 기관 안내 표기 기준. 날짜를 누르면 시간대 곡선. 7/1~7/7은 6월 입차분이 파일에 없어 제외.</p></div>';
 o+='<div class="card"><h2>날 유형별 등급 (표본 5일 이상일 때만 표시)</h2><table><tr><th>유형</th><th>표본</th><th>하루 최대 범위</th><th>등급</th></tr>';
 o+='<tr><td>평일</td><td>'+wk.length+'일</td><td>'+fmt(Math.min.apply(0,wmx))+'~'+fmt(Math.max.apply(0,wmx))+'</td><td><span class="badge g">낮음</span></td></tr>';
 o+='<tr><td>토·일 전체</td><td>'+we.length+'일</td><td>'+fmt(Math.min.apply(0,wemx))+'~'+fmt(Math.max.apply(0,wemx))+'</td><td><span class="badge w">편차 큼</span></td></tr>';
 o+='<tr><td>토·일 중 고점유일(실측 85%↑)</td><td>'+big.length+'일</td><td>'+big.map(function(k){return fmt(D[k].max)}).join(", ")+'</td><td><span class="badge w">자료 부족</span></td></tr></table>';
 o+='<p class="note">표본이 5일 미만이면 등급을 매기지 않고 실측값만 보여 줍니다. 공연·대관 오픈API는 연동했지만 2024년까지 자료만 있어(화면3 6번) 다음 2주 달력은 누리집 일정을 씁니다. 예측 적중률은 11/30까지 실시간 기록과 맞춰 본 뒤 공개합니다.</p></div>';
}
if(scr=="s2"){
 var F=nx(sel),ref=sel;
 if(F){
  var GT={hi:"빨강 · 혼잡 예상",mid:"노랑 · 다소 붐빔 가능",lo:"초록 · 공연 없음"};
  o+='<div class="card"><h2>'+sel.replace(/-/g,".")+' ('+WD[F.wd]+') 예상</h2><div class="days">';
  NEXT.forEach(function(n){o+='<a class="'+(n.k==sel?"on":"")+'" href="#s2&d='+n.k+'">'+(n.warn?"⚠":"")+n.t.getDate()+'</a>'});
  o+='</div><p><span class="badge '+F.g+'x">'+GT[F.g]+'</span></p>';
  if(F.warn)o+='<p class="warn">⚠ <b>평일이지만 KSPO DOME 공연일</b>입니다. 지난 기록(2025-02~2026-08)에서 DOME 공연이 있던 평일 4일 중 3일이 만차였고, 공연 없는 평일은 19일 중 1일만 만차였습니다. 공연 시작 2~3시간 전부터 붐빌 수 있으니 대중교통을 권합니다.</p>';
  if(F.g=="lo")o+='<p class="warn lo">초록은 <b>여유 보장이 아닙니다</b>. 공연이 없다는 뜻이며, 주말·공원 행사·날씨에 따라 붐빌 수 있습니다(지난 기록의 초록 7일은 만차 0일이었지만 표본이 적습니다).</p>';
  if(F.es.length){o+='<table><tr><th>공연장</th><th>공연</th></tr>';F.es.forEach(function(e){o+='<tr><td>'+e.venue+'</td><td>'+e.name+'<br><small>'+e.time+'</small></td></tr>'});o+='</table>'}
  else o+='<p class="note">이날 누리집 일정안내에 공연이 없습니다.</p>';
  // 같은 요일의 2024-07 실측일(같은 등급 성격: 빨강이면 그 요일 최대, 아니면 중앙값)
  var same=keys.filter(function(k){return D[k].wd==F.wd}).sort(function(x,y){return D[x].max-D[y].max});
  ref=F.g=="hi"?same[same.length-1]:same[Math.floor((same.length-1)/2)];
  o+='<p class="note">아래 곡선은 예측이 아니라 <b>2024년 7월 같은 요일('+WD[F.wd]+') 실측</b> 중 '+(F.g=="hi"?"가장 붐빈 날":"중간 날")+'('+ref.slice(5).replace("-","/")+')입니다. 시간대 감을 잡는 참고로만 보세요.</p></div>';
 }
 var v=D[ref],c=v.curve,L=v.long,wdn=WD[v.wd];
 o+='<div class="card"><h2>'+(F?'참고: ':'')+ref.replace(/-/g,".")+' ('+wdn+') 실측</h2><div class="days">';
 keys.forEach(function(k){o+='<a class="'+(k==ref?"on":"")+'" href="#s2&d='+k+'">'+parseInt(k.slice(8))+'</a>'});
 o+='</div>';
 var W=380,H=200,pl=34,pr=6,pt=10,pb=22,mx=2400;
 function X(i){return pl+(W-pl-pr)*i/47} function Y(n){return pt+(H-pt-pb)*(1-n/mx)}
 var s='<svg viewBox="0 0 '+W+' '+H+'">';
 [0,600,1200,1800,2400].forEach(function(g){s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(g)+'" y2="'+Y(g)+'" stroke="#e3e7ec"/><text x="2" y="'+(Y(g)+4)+'" font-size="9" fill="#5b6775">'+fmt(g)+'</text>'});
 s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(CAP)+'" y2="'+Y(CAP)+'" stroke="#c0392b" stroke-dasharray="4 3"/><text x="'+(W-pr-2)+'" y="'+(Y(CAP)-3)+'" font-size="9" fill="#c0392b" text-anchor="end">정원 2,200</text>';
 [0,6,12,18,24].forEach(function(hh){var i=hh*2;if(i>47)i=47;s+='<text x="'+X(i)+'" y="'+(H-6)+'" font-size="9" fill="#5b6775" text-anchor="middle">'+hh+'시</text>'});
 var pa="",pb2="";c.forEach(function(n,i){pa+=(i?"L":"M")+X(i)+","+Y(n)});L.forEach(function(n,i){pb2+=(i?"L":"M")+X(i)+","+Y(n)});
 s+='<path d="'+pa+'" fill="none" stroke="#1f5fa8" stroke-width="2.2"/><path d="'+pb2+'" fill="none" stroke="#8a8f98" stroke-width="1.5" stroke-dasharray="3 2"/></svg>';
 o+=s+'<p class="note"><span style="color:#1f5fa8">━</span> 동시 주차 대수(30분 단위) &nbsp;<span style="color:#8a8f98">┅</span> 그중 24시간 넘게 머문 차</p>';
 var mi=c.indexOf(Math.max.apply(0,c));
 o+='<p>하루 최대 <span class="big">'+fmt(v.max)+'대</span> ('+v.maxAt+', 정원의 '+pct(v.max)+'%)</p>';
 o+='<table><tr><th>시각</th><th>동시 주차</th><th>정원 대비</th></tr>';
 [[9,18],[12,24],[14,28],[15,30],[17,34],[18,36]].forEach(function(r){o+='<tr><td>'+(r[0]<10?"0":"")+r[0]+':00'+(r[0]==15?" (오후 3시)":"")+'</td><td>'+fmt(c[r[1]])+'대</td><td>'+pct(c[r[1]])+'%</td></tr>'});
 o+='</table><p class="note">도착 시각 판단: 이 날은 오후 3시에 '+pct(c[30])+'%, 최대 시각 '+v.maxAt+'에 '+pct(v.max)+'%입니다. 표본이 모자라는 유형이면 실측값만 보여 줍니다.</p></div>';
 o+='<div class="card"><h2>오늘 실시간 주차대수 <span class="badge w">참고값</span></h2><p><span class="big" id="rt">확인 중…</span></p><p class="note" id="rtn">기관 실시간 주차현황 API(15168686)를 이 화면에서 직접 호출합니다. 값의 정의(기준 시각·정원·장기 주차 포함 여부)가 기관 설명으로 확정되지 않아 위 곡선(2024년 7월)과 같은 선에 겹치지 않고 따로 보여 줍니다.</p></div>';
 var G=window.APICHECK.c008,gs=G.gates.reduce(function(a,g){return a+g[1]},0);
 o+='<div class="card"><h2>어느 문으로 많이 들어오나 <span class="badge w">표본 '+G.sampled+'건</span></h2><table><tr><th>입구</th><th>표본</th><th>비율</th></tr>';
 G.gates.forEach(function(g){o+='<tr><td>'+g[0]+'</td><td>'+g[1]+'건</td><td>'+Math.round(g[1]/gs*100)+'%</td></tr>'});
 o+='</table><p class="note">전체구역 입출차 오픈API('+fmt(G.total)+'건) 가운데 12곳에서 10건씩 뽑은 표본('+G.months+')입니다. 머문 시간 중앙값 약 '+G.medianStayMin+'분. 전량 수집은 호출 제한(2초 1회·하루 1,000건) 때문에 하지 않았고, 날짜별 곡선은 아직 2024년 7월 파일로만 그립니다.</p></div>';
}
if(scr=="s3"){
 o+='<p class="note">기관 데이터를 직접 받아 점검한 결과입니다(1~5번 2026-11-16). 점검 결과를 기관 의견 게시판·이메일로 전달할 계획입니다.</p>';
 var cards=[
 ["실시간 주차현황 API","기관 설명: 장기 주차는 종료일이 없어 실제 주차대수가 정확하지 않을 수 있음. 11/16 16:30~16:31에 20초 간격 4회 호출: 2,034→2,007→2,005→2,004대. 2024년 7월 평일 오후 4시 평균(약 700대)과 차이가 크며 연도·집계 정의가 같은지 알 수 없음.","'참고값' 배지, 신호등 판정에 단독 사용 안 함. 기준 시각·정원·집계 정의 필드 추가를 요청"],
 ["주차장 혼잡도 정보(CSV)","갱신주기 '월간'인데 마지막 등록일 2026-08-12. 699행이 92일에만 있음. 등록시간의 분·초가 등록일의 월·일과 같음(699행 전부). 같은 주차구역 이름이 서로 다른 ID에 걸림.","행이 없는 날을 '원활'로 읽지 않음, 시각 열은 쓰지 않음"],
 ["영문 공연정보(CSV)","286건 중 140건(49%)이 16개 날짜에 몰림(2025-10-28 하루에 13건). 누리집 일정과 맞춰 보니 '공연일자'는 실제 공연일이 아니라 게시일.","공연 일정에 쓰지 않음. 오픈API도 최신 공연이 없어(6번) 누리집 일정안내를 씀"],
 ["월별주차현황(CSV)","2024-07 올림픽공원 59,808인데 같은 달 입출차 파일은 215,528행. '주차대수'가 무엇을 센 값인지 설명 없음.","연간 규모 참고로만 사용, 열 정의 요청"],
 ["입출차 정보(CSV)","열 3개(입차일·입차일시·출차일시)뿐, 주차구역 없음. 24시간 넘게 머문 차 310건(최장 26.1일). 2024년 7월 하루 최대 2,228대가 정원 2,200대를 넘어 집계 범위가 정원 표기와 같은지 알 수 없음.","장기 주차분을 곡선에 점선으로 분리. 주차구역·최근 연도 추가를 요청"]];
 cards.forEach(function(r,i){o+='<div class="card"><h2>'+(i+1)+'. '+r[0]+'</h2><p>'+r[1]+'</p><p class="note"><b>화면 처리</b>: '+r[2]+'</p></div>'});
 var A=window.APICHECK;
 o+='<p class="note">아래 6~9번은 문화공공데이터광장 오픈API 4종을 승인받아 직접 호출한 결과입니다('+A.checked+').</p>';
 [["공연정보 오픈API","전량 "+fmt(A.perf.got)+"건 받음. 적재일이 모두 "+A.perf.loaded+"이고 제목에 적힌 연도는 "+A.perf.titleYearMax+"년이 마지막. 11/21 로이킴·11/27 조용필 등 이달 공연은 없음. 날짜 칸이 빈 것 "+fmt(A.perf.emptyDate)+"건, 연도까지 적힌 것 "+A.perf.yearInDate+"건뿐(대부분 '23(금)~24(토) 19:30'처럼 연·월 없음).","다음 2주 달력은 누리집 일정을 씀. 날짜 칸을 'YYYY-MM-DD' 형식 시작·종료일로 나누고 최신 공연 적재를 요청"],
  ["대관정보 오픈API","전량 "+fmt(A.rent.got)+"건 받음. 날짜 칸이 "+fmt(A.rent.emptyDate)+"건 전부 비어 있고 제목 연도는 "+A.rent.titleYearMax+"년이 마지막. 적재일은 "+A.rent.loaded+".","행사 달력에 쓰지 않음. 대관 기간 칸 채우기를 요청"],
  ["연계정보 오픈API","전체 "+fmt(A.c009.total)+"건 중 12곳 표본 "+A.c009.sampled+"건, 내용 칸(DESCRIPTION)이 "+A.c009.descNull+"건 모두 비어 있음. 공연·날씨와 어떻게 이어지는지 확인할 수 없음.","사용하지 않음. 연계 항목 정의와 내용 채우기를 요청"],
  ["전체구역 입출차 오픈API","전체 "+fmt(A.c008.total)+"건 중 12곳 표본 "+A.c008.sampled+"건 모두 해석됨("+A.c008.months+"). CSV에 없던 입구·출구 이름이 있음. 한 쪽 안에서 날짜가 섞여 있고, 깊은 쪽은 응답 40~60초·시간 초과가 잦으며 2초에 1회·하루 1,000건 제한이라 전량 수집은 어려움.","입구별 비율만 화면2에 표본으로 표시. 날짜 조건 검색 또는 월별 파일 제공을 요청"]
 ].forEach(function(r,i){o+='<div class="card"><h2>'+(i+6)+'. '+r[0]+'</h2><p>'+r[1]+'</p><p class="note"><b>화면 처리</b>: '+r[2]+'</p></div>'});
 o+='<div class="card"><h2>미리 정한 예상, 지난 기록으로 맞춰 보기 <span class="badge w">92일</span></h2><p>기관 혼잡도 기록(2번, 2025-02~2026-08, 92일)에 누리집 지난 공연 일정 206건을 맞추고, 11/17에 고정한 규칙(DOME 공연=빨강·다른 공연장만=노랑·공연 없음=초록)을 고치지 않고 적용했습니다.</p>';
 o+='<table><tr><th>예상</th><th>날 수</th><th>실제 만차</th></tr><tr><td>빨강</td><td>62일</td><td>50일(81%)</td></tr><tr><td>노랑</td><td>23일</td><td>12일(52%)</td></tr><tr><td>초록</td><td>7일</td><td>0일</td></tr></table>';
 o+='<p><b>요일만 보는 규칙과 비교</b>: 주말 69일 중 만차 58일(84%)로 주말에는 차이가 거의 없습니다. 평일에는 DOME 공연일 4일 중 3일이 만차, 나머지 평일은 19일 중 1일만 만차였습니다.</p>';
 o+='<p class="note"><b>한계</b>: 혼잡도 기록은 하루 1~31건이고 92일 중 75%가 주말이라 붐빈 날 위주로 남았을 수 있습니다. 초록 날이 7일뿐입니다. 11/17부터 10분마다 쌓는 실시간 기록으로 11/30에 같은 표를 다시 냅니다.</p></div>';
}
m.innerHTML=o;
if(scr=="s2"){
 var rt=document.getElementById("rt"),rn=document.getElementById("rtn");
 try{fetch("https://www.ksponco.or.kr/online/main/parkingorsApi.do?apiKey=PARKING21803504").then(function(r){return r.text()}).then(function(t){
  var j=JSON.parse(t);rt.textContent=fmt(j[0].parking_sum)+"대";rn.innerHTML+=" <b>방금 호출한 값입니다.</b>"}).catch(fb)}catch(e){fb()}
 function fb(){rt.textContent="2,004대";rn.innerHTML+=" <b>지금은 호출하지 못해 2026-11-16 16:31에 기록한 값을 보여 줍니다.</b>"}
}
})();

