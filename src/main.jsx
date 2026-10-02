import React, {useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts';
import {LayoutDashboard, Video, BellRing, Activity, BarChart3, Map, Bot, Settings, Search, Command, ShieldCheck, Wifi, WifiOff, MoreHorizontal, ChevronDown, AlertTriangle, CheckCircle2, Eye, EyeOff, HardHat, Users, Cpu, Cloud, ArrowUpRight, ArrowDownRight, Clock3, Camera, Crosshair, Radio, Siren, ScanLine, Layers3, ShieldAlert, Menu, X, RefreshCw, Filter, Download, Maximize2, Play, Pause, Volume2, Sparkles, CircleHelp, LockKeyhole, Gauge, Navigation, Zap, Database, CloudCog, CircleDot, ShieldQuestion, LocateFixed} from 'lucide-react';
import './styles.css';

const nav = [
  ['overview','Overview',LayoutDashboard],['cameras','Cameras',Video],['alerts','Alerts',BellRing],['events','Events',Activity],['analytics','Analytics',BarChart3],['map','Site Map',Map],['assistant','Safety Agent',Bot]
];
const metrics = [
  {label:'Active cameras',value:'12 / 14',sub:'85.7% online',trend:'+1 today',icon:Camera,tone:'blue'},
  {label:'People monitored',value:'48',sub:'7 in restricted zones',trend:'+8.2%',icon:Users,tone:'violet'},
  {label:'Open incidents',value:'03',sub:'1 critical · 2 review',trend:'-18.4%',icon:ShieldAlert,tone:'red'},
  {label:'Vision reliability',value:'96.8%',sub:'12 min rolling',trend:'+2.1%',icon:Gauge,tone:'green'},
  {label:'Site uptime',value:'99.94%',sub:'Last 30 days',trend:'+0.3%',icon:Zap,tone:'cyan'}
];
const events = [
  {type:'critical',title:'Worker entered machinery zone',zone:'East Excavation',cam:'CAM-04',time:'2 min ago',confidence:96},
  {type:'warning',title:'Helmet not detected',zone:'Material Yard',cam:'CAM-08',time:'7 min ago',confidence:91},
  {type:'warning',title:'Camera visibility degraded',zone:'North Tower',cam:'CAM-11',time:'11 min ago',confidence:88},
  {type:'info',title:'Worker handoff between cameras',zone:'Loading Bay',cam:'CAM-02 → CAM-03',time:'16 min ago',confidence:99},
  {type:'success',title:'Restricted-zone event resolved',zone:'Concrete Plant',cam:'CAM-06',time:'22 min ago',confidence:97}
];
const chartData = [
  {time:'06:00',incidents:2,people:12},{time:'08:00',incidents:4,people:21},{time:'10:00',incidents:7,people:35},{time:'12:00',incidents:5,people:42},{time:'14:00',incidents:9,people:48},{time:'16:00',incidents:6,people:38},{time:'18:00',incidents:3,people:26},{time:'20:00',incidents:2,people:14}
];
const cameras = [
  {id:'CAM-01',name:'Main Gate',status:'live',zone:'North Entrance',rel:99.2},
  {id:'CAM-02',name:'Loading Bay',status:'live',zone:'Logistics',rel:98.7},
  {id:'CAM-03',name:'Tower Crane',status:'live',zone:'East Tower',rel:96.1},
  {id:'CAM-04',name:'Excavation',status:'alert',zone:'East Excavation',rel:97.9},
  {id:'CAM-05',name:'Concrete Plant',status:'live',zone:'Plant',rel:99.8},
  {id:'CAM-06',name:'Worker Entry',status:'live',zone:'South Gate',rel:98.1},
  {id:'CAM-07',name:'Material Yard',status:'warning',zone:'Yard',rel:88.4},
  {id:'CAM-08',name:'North Tower',status:'warning',zone:'North Tower',rel:71.2},
];
const zones = [
  {name:'North Entrance',risk:18,status:'clear',workers:6},
  {name:'Loading Bay',risk:42,status:'watch',workers:9},
  {name:'East Excavation',risk:86,status:'critical',workers:11},
  {name:'Tower Crane',risk:61,status:'high',workers:7},
  {name:'Material Yard',risk:54,status:'watch',workers:8},
  {name:'Concrete Plant',risk:23,status:'clear',workers:7},
];
function App(){
 const [page,setPage]=useState('overview'); const [menu,setMenu]=useState(false); const [selectedCam,setSelectedCam]=useState(cameras[0]); const [live,setLive]=useState(true); const [filter,setFilter]=useState('All');
 const pageTitle = nav.find(n=>n[0]===page)?.[1] || 'Overview';
 return <div className="app-shell">
   <aside className={`sidebar ${menu?'open':''}`}>
    <div className="brand"><div className="brand-mark"><ShieldCheck size={21}/></div><div><strong>VISION<span>GUARD</span></strong><small>SAFETY INTELLIGENCE</small></div><button className="mobile-close" onClick={()=>setMenu(false)}><X size={18}/></button></div>
    <div className="site-switch"><div><span className="eyebrow">ACTIVE SITE</span><b>Atlas Construction</b><span className="site-state"><i/> Operational</span></div><ChevronDown size={16}/></div>
    <nav>{nav.map(([id,label,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>{setPage(id);setMenu(false)}}><Icon size={18}/><span>{label}</span>{id==='alerts'&&<em>3</em>}</button>)}</nav>
    <div className="side-bottom"><div className="coverage-card"><div className="coverage-head"><span>VISIBILITY COVERAGE</span><b>92%</b></div><div className="progress"><i style={{width:'92%'}}/></div><p><Eye size={13}/> 11 zones visible · 1 degraded</p></div><button className="settings-btn" onClick={()=>setPage('settings')}><Settings size={18}/> Settings</button><div className="profile"><div className="avatar">PK</div><div><b>Safety Admin</b><small>Administrator</small></div><MoreHorizontal size={17}/></div></div>
   </aside>
   <main className="main">
    <header className="topbar"><button className="mobile-menu" onClick={()=>setMenu(true)}><Menu size={20}/></button><div className="crumb"><span>Atlas Construction</span><i>/</i><b>{pageTitle}</b></div><div className="top-actions"><div className="global-search"><Search size={17}/><input placeholder="Search cameras, zones, incidents..."/><kbd>⌘ K</kbd></div><button className="icon-btn"><Command size={18}/></button><button className="icon-btn notif"><BellRing size={18}/><i>3</i></button><div className="top-user"><div className="avatar small">PK</div><ChevronDown size={14}/></div></div></header>
    <div className="content">
      {page==='overview'&&<Overview selectedCam={selectedCam} setSelectedCam={setSelectedCam} live={live} setLive={setLive} filter={filter} setFilter={setFilter}/>} 
      {page==='cameras'&&<Cameras selectedCam={selectedCam} setSelectedCam={setSelectedCam} setPage={setPage}/>} 
      {page==='alerts'&&<Alerts filter={filter} setFilter={setFilter}/>} 
      {page==='events'&&<Events/>}
      {page==='analytics'&&<Analytics/>}
      {page==='map'&&<SiteMap/>}
      {page==='assistant'&&<Assistant/>}
      {page==='settings'&&<SettingsPage/>}
    </div>
   </main>
 </div>
}
function PageHead({eyebrow,title,desc,children}){return <div className="page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{desc&&<p>{desc}</p>}</div>{children&&<div className="head-actions">{children}</div>}</div>}
function Overview({selectedCam,setSelectedCam,live,setLive,filter,setFilter}){
 return <>
  <PageHead eyebrow="LIVE OPERATIONS" title="Safety command center" desc="Real-time site intelligence, visual confidence, and agentic response." >
   <div className="date-pill"><Clock3 size={15}/> Oct 03, 2026 · 10:24:38 PM</div><button className="ghost-btn"><Download size={15}/> Export</button>
  </PageHead>
  <section className="metrics">{metrics.map((m,i)=><Metric key={i} {...m}/>)}</section>
  <section className="hero-grid">
   <CameraPanel cam={selectedCam} live={live} setLive={setLive}/>
   <AgentPanel/>
   <EventsPanel filter={filter} setFilter={setFilter}/>
  </section>
  <section className="middle-grid">
    <div className="panel chart-panel"><PanelHead title="Safety activity" sub="Incidents & monitored people · last 14 hours" action={<button className="tiny-select">Today <ChevronDown size={13}/></button>}/><div className="chart"><ResponsiveContainer width="100%" height={230}><AreaChart data={chartData}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8cff" stopOpacity={.32}/><stop offset="100%" stopColor="#4f8cff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#1b2a3a" vertical={false}/><XAxis dataKey="time" tick={{fill:'#718096',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#718096',fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#0b1624',border:'1px solid #203249',borderRadius:12,color:'#fff'}}/><Area type="monotone" dataKey="people" stroke="#4f8cff" strokeWidth={2.5} fill="url(#g1)"/><Area type="monotone" dataKey="incidents" stroke="#f35b65" strokeWidth={2} fill="none"/></AreaChart></ResponsiveContainer></div><div className="legend"><span><i className="dot blue"/> People</span><span><i className="dot red"/> Incidents</span><span className="muted">Peak traffic 14:00 · 48 people</span></div></div>
    <div className="panel coverage-panel"><PanelHead title="Site safety map" sub="Current risk by monitored zone" action={<button className="tiny-select">Open map <ArrowUpRight size={13}/></button>}/><div className="mini-map"><div className="map-grid"/><div className="road r1"/><div className="road r2"/>{zones.map((z,i)=><div key={z.name} className={`map-node ${z.status}`} style={{left:`${15+(i%3)*34}%`,top:`${25+Math.floor(i/3)*42}%`}}><span>{z.risk}</span></div>)}</div><div className="zone-list">{zones.slice(0,4).map(z=><div key={z.name}><span className={`status-dot ${z.status}`}/><b>{z.name}</b><span>{z.workers} workers</span><strong>{z.risk}%</strong></div>)}</div></div>
  </section>
  <section className="bottom-grid"><div className="panel table-panel"><PanelHead title="Camera fleet" sub="Health, visibility and confidence" action={<button className="tiny-select">View all <ArrowUpRight size={13}/></button>}/><div className="camera-table">{cameras.slice(0,5).map(c=><div className="camera-row" key={c.id} onClick={()=>setSelectedCam(c)}><div className="camera-icon"><Video size={16}/></div><div><b>{c.id} · {c.name}</b><small>{c.zone}</small></div><span className={`live-chip ${c.status}`}>{c.status==='live'?'LIVE':c.status==='alert'?'ALERT':'DEGRADED'}</span><div className="reliability"><span>Reliability</span><b>{c.rel}%</b><div className="progress"><i style={{width:`${c.rel}%`}}/></div></div><MoreHorizontal size={16} className="muted"/></div>)}</div></div><div className="panel insight-panel"><PanelHead title="Agent insight" sub="Generated from verified visual events"/><div className="insight"><div className="spark"><Sparkles size={18}/></div><div><b>East Excavation needs attention</b><p>3 events in 18 minutes. Camera 04 has clear visibility and detected a worker entering the machinery boundary twice.</p><div className="insight-actions"><button className="primary-btn">Review incident</button><button className="ghost-btn">View evidence</button></div></div></div><div className="confidence-row"><span>Evidence confidence</span><b>96%</b><div className="progress"><i style={{width:'96%'}}/></div></div></div></section>
 </>
}
function Metric({label,value,sub,trend,icon:Icon,tone}){return <div className="metric"><div className={`metric-icon ${tone}`}><Icon size={19}/></div><div className="metric-body"><span>{label}</span><b>{value}</b><small>{sub}</small></div><em className={trend.startsWith('-')?'down':''}>{trend.startsWith('-')?<ArrowDownRight size={13}/>:<ArrowUpRight size={13}/>} {trend}</em></div>}
function PanelHead({title,sub,action}){return <div className="panel-head"><div><h3>{title}</h3><p>{sub}</p></div>{action}</div>}
function CameraPanel({cam,live,setLive}){
 const videoRef=React.useRef(null);
 const canvasRef=React.useRef(null);
 const timerRef=React.useRef(null);
 const busyRef=React.useRef(false);
 const rafRef=React.useRef(null);
 const [cameraOn,setCameraOn]=useState(false);
 const [detecting,setDetecting]=useState(false);
 const [detections,setDetections]=useState([]);
 const [visibility,setVisibility]=useState(97);
 const [cameraError,setCameraError]=useState('');
 const [backendOnline,setBackendOnline]=useState(null);
 const [device,setDevice]=useState('—');
 const [inferenceMs,setInferenceMs]=useState(0);

 const apiBase=(import.meta.env.VITE_VISION_API||'http://127.0.0.1:8000').replace(/\/$/,'');

 const stopCamera=()=>{
   if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}
   const v=videoRef.current;
   if(v?.srcObject){v.srcObject.getTracks().forEach(track=>track.stop());v.srcObject=null;}
   setCameraOn(false);setDetecting(false);setDetections([]);
 };

 const startCamera=async()=>{
   try{
     setCameraError('');
     if(!navigator.mediaDevices?.getUserMedia){throw new Error('Browser camera API unavailable');}
     const stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},facingMode:'user'},audio:false});
     const v=videoRef.current;
     v.srcObject=stream;
     await v.play();
     setCameraOn(true);
     setLive(true);
   }catch(e){
     setCameraError(e?.name==='NotAllowedError'?'Camera permission was denied. Allow camera access in the browser and try again.':'Camera is unavailable. Check that another app is not using it.');
     setCameraOn(false);
   }
 };

 const checkBackend=async()=>{
   try{
     const r=await fetch(`${apiBase}/api/health`,{signal:AbortSignal.timeout(2500)});
     if(!r.ok)throw new Error();
     const data=await r.json();
     setBackendOnline(true);setDevice(data.device||'auto');
   }catch{setBackendOnline(false);}
 };

 const detectFrame=async()=>{
   const v=videoRef.current;
   if(!v||v.readyState<2||!cameraOn||!live||busyRef.current)return;
   busyRef.current=true;
   const c=document.createElement('canvas');
   c.width=Math.min(v.videoWidth||960,960);
   c.height=Math.max(1,Math.round(c.width*(v.videoHeight||540)/(v.videoWidth||960)));
   c.getContext('2d').drawImage(v,0,0,c.width,c.height);
   c.toBlob(async blob=>{
     if(!blob){busyRef.current=false;return;}
     try{
       setDetecting(true);
       const r=await fetch(`${apiBase}/api/detect`,{method:'POST',headers:{'Content-Type':'image/jpeg'},body:blob,signal:AbortSignal.timeout(5000)});
       if(!r.ok)throw new Error(`HTTP ${r.status}`);
       const data=await r.json();
       setDetections(data.detections||[]);
       setVisibility(Number.isFinite(data.visibility)?data.visibility:97);
       setInferenceMs(Math.round(data.inference_ms||0));
       setDevice(data.device||device);
       setBackendOnline(true);
     }catch{
       setBackendOnline(false);
     }finally{
       setDetecting(false);busyRef.current=false;
     }
   },'image/jpeg',.72);
 };

 React.useEffect(()=>{checkBackend();const id=setInterval(checkBackend,10000);return()=>clearInterval(id)},[]);
 React.useEffect(()=>{
   if(cameraOn){detectFrame();timerRef.current=setInterval(detectFrame,450);}
   return()=>{if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null;}}
 },[cameraOn,live]);
 React.useEffect(()=>{
   const draw=()=>{
     const v=videoRef.current,cv=canvasRef.current;
     if(v&&cv){
       const w=v.videoWidth||960,h=v.videoHeight||540;
       if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
       const ctx=cv.getContext('2d');ctx.clearRect(0,0,cv.width,cv.height);
       detections.forEach(d=>{
         const [x1,y1,x2,y2]=d.box;
         const stroke=d.label==='person'?'#45d483':'#f2b84b';
         ctx.strokeStyle=stroke;ctx.lineWidth=Math.max(2,w/640);ctx.strokeRect(x1,y1,x2-x1,y2-y1);
         const text=`${String(d.label).toUpperCase()} · ${Math.round(d.confidence*100)}%`;
         ctx.font='600 14px Arial';const tw=ctx.measureText(text).width+16;
         ctx.fillStyle=stroke;ctx.fillRect(x1,Math.max(0,y1-26),tw,26);ctx.fillStyle='#07100d';ctx.fillText(text,x1+8,Math.max(17,y1-8));
       });
     }
     rafRef.current=requestAnimationFrame(draw);
   };
   rafRef.current=requestAnimationFrame(draw);
   return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current)};
 },[detections]);
 React.useEffect(()=>{stopCamera();},[cam.id]);
 React.useEffect(()=>()=>stopCamera(),[]);

 const counts=detections.reduce((acc,d)=>{acc[d.label]=(acc[d.label]||0)+1;return acc},{});
 return <div className="panel camera-panel">
   <div className="camera-top"><div><div className="camera-title"><span className="live-dot"/> {cam.id} · {cam.name}</div><small>{cam.zone} · Browser webcam · YOLO11</small></div><div className="camera-controls"><button className="tiny-select" onClick={cameraOn?stopCamera:startCamera}><Camera size={13}/> {cameraOn?'Stop camera':'Use webcam'}</button><button className="icon-btn mini" onClick={()=>setLive(!live)} disabled={!cameraOn}>{live?<Pause size={15}/>:<Play size={15}/>}</button><button className="icon-btn mini" onClick={()=>setDetections([])}><RefreshCw size={15}/></button></div></div>
   <div className={`feed ${cameraOn?'real-feed':''}`}>
     {cameraOn?<><video ref={videoRef} muted playsInline/><canvas ref={canvasRef} className="detection-layer"/><div className="real-overlay"><span><Radio size={13}/> {live?'LIVE STREAM':'PAUSED'}</span><span><Crosshair size={13}/> {detections.length} objects</span><span><Eye size={13}/> {visibility}% visibility</span>{detecting&&<span>AI SCANNING</span>}</div>{cameraError&&<div className="camera-error">{cameraError}</div>}</>:<><div className="feed-sky"/><div className="feed-building b1"/><div className="feed-building b2"/><div className="feed-ground"/><div className="feed-road"/><div className="person p1"><span>WORKER · 98%</span><i/></div><div className="person p2"><span>WORKER · 94%</span><i/></div><div className="machine"><span>EXCAVATOR</span><i/></div><div className="zone-box"><span>RESTRICTED ZONE</span></div><div className="feed-hud"><span><Radio size={13}/> DEMO STREAM</span><span><Crosshair size={13}/> 12 tracked</span><span><Eye size={13}/> 97% visibility</span></div></>}
     <div className="feed-time">{cam.id} · {cameraOn?'LIVE CAMERA':'DEMO FEED'}</div>
   </div>
   <div className="camera-foot"><div><span className={`tag ${backendOnline===false?'red':'green'}`}>{backendOnline===false?<WifiOff size={12}/>:<CheckCircle2 size={12}/>} {backendOnline===false?'Backend offline':backendOnline===true?'YOLO backend online':'Checking backend...'}</span><span className="tag">{cameraOn?`${detections.length} objects · ${inferenceMs}ms · ${device}`:'Connect webcam to detect'}</span></div><span className="muted">API · {apiBase}</span></div>
   {backendOnline===false&&<div className="camera-error inline-error">Start FastAPI backend on port 8000, then click Use webcam again.</div>}
 </div>;
}

function AgentPanel(){return <div className="panel agent-panel"><PanelHead title="Safety Agent" sub="Perception → reasoning → action" action={<span className="agent-live"><i/> ACTIVE</span>}/><div className="agent-orbit"><div className="orbit-ring r1"/><div className="orbit-ring r2"/><div className="agent-core"><Bot size={28}/><span>AGENT</span></div><div className="orbit-pill p-top"><Eye size={13}/> SEE</div><div className="orbit-pill p-right"><Activity size={13}/> REASON</div><div className="orbit-pill p-bottom"><Siren size={13}/> ACT</div><div className="orbit-pill p-left"><ShieldQuestion size={13}/> VERIFY</div></div><div className="agent-event"><div className="event-icon red"><AlertTriangle size={16}/></div><div><b>High-risk event detected</b><p>Worker entered active machinery zone · CAM-04</p><div className="event-meta"><span>Confidence <b>96%</b></span><span>Duration <b>5.2s</b></span></div></div></div><button className="agent-btn"><Sparkles size={15}/> Ask why this was escalated <ArrowUpRight size={14}/></button></div>}
function EventsPanel({filter,setFilter}){let list=filter==='All'?events:events.filter(e=>filter==='Critical'?e.type==='critical':filter==='Warnings'?e.type==='warning':e.type==='success'); return <div className="panel events-panel"><PanelHead title="Recent AI events" sub="Evidence-backed site activity" action={<button className="tiny-select" onClick={()=>setFilter(filter==='All'?'Critical':'All')}><Filter size={13}/> {filter}</button>}/><div className="event-list">{list.map((e,i)=><div className="event-item" key={i}><div className={`event-icon ${e.type}`}><EventIcon type={e.type}/></div><div className="event-copy"><b>{e.title}</b><span>{e.zone} · {e.cam}</span><small>{e.time} · {e.confidence}% confidence</small></div><MoreHorizontal size={15} className="muted"/></div>)}</div><button className="view-all" onClick={()=>setFilter('All')}>View all events <ArrowUpRight size={14}/></button></div>}
function EventIcon({type}){return type==='critical'?<Siren size={15}/>:type==='warning'?<AlertTriangle size={15}/>:type==='success'?<CheckCircle2 size={15}/>:<Radio size={15}/>}
function Cameras({selectedCam,setSelectedCam,setPage}){return <><PageHead eyebrow="INFRASTRUCTURE" title="Camera fleet" desc="Every camera, its visual confidence, and current operational state."><button className="primary-btn"><Camera size={15}/> Add camera</button></PageHead><div className="camera-grid">{cameras.map(c=><div className={`camera-card ${selectedCam.id===c.id?'selected':''}`} key={c.id} onClick={()=>setSelectedCam(c)}><div className="thumb"><div className="thumb-scene"/><span className={`status-pill ${c.status}`}>{c.status==='live'?'LIVE':c.status==='alert'?'ALERT':'DEGRADED'}</span><div className="thumb-label">{c.id}</div></div><div className="card-body"><div><b>{c.name}</b><span>{c.zone}</span></div><MoreHorizontal size={17}/></div><div className="card-stats"><span><Eye size={13}/> {c.rel}% reliability</span><span><Radio size={13}/> 24 FPS</span></div><button className="camera-open-btn" onClick={(e)=>{e.stopPropagation();setSelectedCam(c);setPage('overview')}}><Camera size={13}/> Open live view</button></div>)}</div><div className="camera-hint">Selected: <b>{selectedCam.id} · {selectedCam.name}</b> — open live view to start the webcam and YOLO detection.</div></>}
function Alerts({filter,setFilter}){return <><PageHead eyebrow="RESPONSE CENTER" title="Alerts" desc="Prioritized incidents requiring review or action."><div className="segmented"><button className={filter==='All'?'on':''} onClick={()=>setFilter('All')}>All</button><button className={filter==='Critical'?'on':''} onClick={()=>setFilter('Critical')}>Critical</button><button className={filter==='Warnings'?'on':''} onClick={()=>setFilter('Warnings')}>Warnings</button></div></PageHead><div className="alert-grid">{events.map((e,i)=><div className={`alert-card ${e.type}`} key={i}><div className="alert-card-head"><span className={`event-icon ${e.type}`}><EventIcon type={e.type}/></span><span className="alert-time">{e.time}</span></div><h3>{e.title}</h3><p>{e.zone} · {e.cam}</p><div className="alert-proof"><div className="proof-box"><ScanLine size={18}/><span>Evidence frame</span></div><div><span>Confidence</span><b>{e.confidence}%</b><div className="progress"><i style={{width:`${e.confidence}%`}}/></div></div></div><div className="alert-actions"><button className="primary-btn">Review</button><button className="ghost-btn">Dismiss</button></div></div>)}</div></>}
function Events(){return <><PageHead eyebrow="AUDIT TRAIL" title="Event timeline" desc="Searchable, explainable record of visual observations and agent actions."><button className="ghost-btn"><Download size={15}/> Export CSV</button></PageHead><div className="panel timeline"><div className="timeline-filters"><button className="tiny-select">Last 24 hours <ChevronDown size={13}/></button><button className="tiny-select">All zones <ChevronDown size={13}/></button><div className="global-search small-search"><Search size={15}/><input placeholder="Search events..."/></div></div>{[...events,...events].map((e,i)=><div className="timeline-row" key={i}><div className={`timeline-line ${e.type}`}/><div className="timeline-dot"><EventIcon type={e.type}/></div><div className="timeline-main"><b>{e.title}</b><span>{e.zone} · {e.cam}</span><p>Vision evidence verified · {e.confidence}% confidence · action logged</p></div><time>{i<5?e.time:'Today · 09:42'}</time><MoreHorizontal size={16}/></div>)}</div></>}
function Analytics(){return <><PageHead eyebrow="SITE INTELLIGENCE" title="Safety analytics" desc="Understand patterns, hotspots, reliability and response performance."><button className="tiny-select">Last 30 days <ChevronDown size={13}/></button></PageHead><div className="analytics-grid"><div className="panel big-chart"><PanelHead title="Incidents vs. site activity" sub="Correlation over time"/><ResponsiveContainer width="100%" height={320}><BarChart data={chartData}><CartesianGrid stroke="#1b2a3a" vertical={false}/><XAxis dataKey="time" tick={{fill:'#718096',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#718096',fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#0b1624',border:'1px solid #203249',borderRadius:12}}/><Bar dataKey="people" fill="#4f8cff" radius={[5,5,0,0]}/><Bar dataKey="incidents" fill="#f35b65" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div><div className="panel score-panel"><PanelHead title="Safety posture" sub="Composite operational signal"/><div className="score-ring"><div><b>82</b><span>/ 100</span></div></div><div className="score-factors"><div><span>Visibility</span><b>94</b></div><div><span>Response</span><b>88</b></div><div><span>Coverage</span><b>92</b></div><div><span>Incidents</span><b>71</b></div></div></div><div className="panel hotspot"><PanelHead title="Recurring hotspots" sub="Zones with repeated events"/><div className="hotspot-list">{zones.sort((a,b)=>b.risk-a.risk).map((z,i)=><div key={z.name}><span className={`rank ${i===0?'red':''}`}>{i+1}</span><div><b>{z.name}</b><small>{Math.round(z.risk/7+2)} incidents · {z.workers} workers</small></div><strong>{z.risk}%</strong></div>)}</div></div></div></>}
function SiteMap(){return <><PageHead eyebrow="SPATIAL INTELLIGENCE" title="Site safety map" desc="Coverage, risk and active observations across the construction site."><button className="tiny-select"><LocateFixed size={14}/> Recenter</button></PageHead><div className="map-layout"><div className="panel full-map"><div className="map-toolbar"><span><span className="live-dot"/> Live site state</span><div><button className="icon-btn mini"><Layers3 size={15}/></button><button className="icon-btn mini"><Maximize2 size={15}/></button></div></div><div className="site-map-big"><div className="map-grid big"/><div className="site-block b-a">MATERIAL YARD</div><div className="site-block b-b">TOWER A</div><div className="site-block b-c">CONCRETE PLANT</div><div className="site-block b-d">EXCAVATION</div>{zones.map((z,i)=><div className={`big-node ${z.status}`} style={{left:`${12+(i%3)*35}%`,top:`${18+Math.floor(i/3)*47}%`}} key={z.name}><span>{z.risk}</span><small>{z.name}</small></div>)}<div className="map-legend"><span><i className="dot green"/> Clear</span><span><i className="dot amber"/> Watch</span><span><i className="dot red"/> Critical</span><span><i className="dot gray"/> No coverage</span></div></div></div><div className="panel zone-panel"><PanelHead title="Zone status" sub="Sorted by risk"/><div className="zone-detail-list">{zones.map(z=><div key={z.name}><div className={`zone-icon ${z.status}`}><Map size={15}/></div><div><b>{z.name}</b><span>{z.workers} workers · camera coverage</span></div><strong>{z.risk}%</strong></div>)}</div></div></div></>}
function Assistant(){const [input,setInput]=useState('');const [messages,setMessages]=useState([{role:'agent',text:'I’m VisionGuard’s Safety Agent. Ask about current hazards, camera reliability, recurring hotspots, or why an incident was escalated.'}]);const send=()=>{if(!input.trim())return;setMessages(m=>[...m,{role:'user',text:input},{role:'agent',text:'Based on the current verified event stream, East Excavation has the highest active risk. CAM-04 reports 97% visibility and a 96% confidence zone violation. I would keep the incident open for supervisor review.'}]);setInput('')};return <><PageHead eyebrow="AGENTIC OPERATIONS" title="Safety Agent" desc="Ask questions against verified site observations, incidents and system state."><span className="agent-live"><i/> Agent online</span></PageHead><div className="assistant-layout"><div className="panel chat-panel"><div className="chat-head"><div className="agent-avatar"><Sparkles size={19}/></div><div><b>VisionGuard Agent</b><span>Grounded in live visual evidence</span></div><span className="verified"><ShieldCheck size={13}/> Verified context</span></div><div className="messages">{messages.map((m,i)=><div className={`message ${m.role}`} key={i}><div className="bubble">{m.text}</div></div>)}</div><div className="prompt-row"><button onClick={()=>setInput('Why was the latest incident escalated?')}>Why was the latest incident escalated?</button><button onClick={()=>setInput('Which zone needs attention?')}>Which zone needs attention?</button><button onClick={()=>setInput('Are any cameras unreliable?')}>Any unreliable cameras?</button></div><div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask the Safety Agent..."/><button onClick={send}><ArrowUpRight size={18}/></button></div></div><div className="panel grounding"><PanelHead title="Agent grounding" sub="Data sources used for responses"/><div className="source"><Database size={17}/><div><b>Event store</b><span>Verified incidents · 5 recent</span></div><CheckCircle2 size={15}/></div><div className="source"><Video size={17}/><div><b>Camera state</b><span>12 live · 1 degraded · 1 offline</span></div><CheckCircle2 size={15}/></div><div className="source"><Map size={17}/><div><b>Site zones</b><span>6 monitored zones · 92% coverage</span></div><CheckCircle2 size={15}/></div><div className="source"><CloudCog size={17}/><div><b>AWS event pipeline</b><span>Operational · 84ms avg latency</span></div><CheckCircle2 size={15}/></div></div></div></>}
function SettingsPage(){return <><PageHead eyebrow="CONTROL PLANE" title="Settings" desc="Configure site policies, notifications, retention and access."><button className="primary-btn">Save changes</button></PageHead><div className="settings-grid"><div className="panel settings-panel"><h3>Safety policies</h3><p>Rules that determine when VisionGuard creates and escalates incidents.</p>{[['Restricted-zone persistence','Require 2.0s before confirmed violation'],['PPE verification','Treat uncertain PPE as unknown, not missing'],['Visibility guard','Pause autonomous decisions below 45% visibility'],['Human escalation','Require review for critical/uncertain events']].map(([a,b],i)=><div className="setting-row" key={i}><div><b>{a}</b><span>{b}</span></div><div className="toggle on"><i/></div></div>)}</div><div className="panel settings-panel"><h3>Privacy & retention</h3><p>Minimize personal data and keep evidence only as long as needed.</p>{[['Face recognition','Disabled by default'],['Evidence retention','30 days'],['Worker identifiers','Pseudonymous IDs'],['Audit log','365 days']].map(([a,b],i)=><div className="setting-row" key={i}><div><b>{a}</b><span>{b}</span></div><ChevronDown size={16}/></div>)}</div></div></>}

createRoot(document.getElementById('root')).render(<App/>);
