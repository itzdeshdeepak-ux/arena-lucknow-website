import React,{useEffect,useRef,useState} from 'react';
import {Pause,Play} from '@phosphor-icons/react';
import './hero-videos.css';

const sources=[1,2,3].map(number=>`/assets/hero-videos/hero-section${number}.webm`);

// Only the background changes. The hero's text and actions remain mounted separately.
export function HeroVideos(){
 const media=useRef([]),container=useRef(null),last=useRef(null),failed=useRef(new Set());
 const[current,setCurrent]=useState(0),[visible,setVisible]=useState(null);
 const[enabled,setEnabled]=useState(false),[wantsPlay,setWantsPlay]=useState(false);
 const[inView,setInView]=useState(true),[tabVisible,setTabVisible]=useState(true);

 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  // Respect an existing motion/data preference; the play control can opt in.
  if(!preference.matches&&!navigator.connection?.saveData){setEnabled(true);setWantsPlay(true);}
  const motionChanged=()=>{if(preference.matches)setWantsPlay(false);};
  const visibilityChanged=()=>setTabVisible(!document.hidden);
  visibilityChanged();
  preference.addEventListener('change',motionChanged);
  document.addEventListener('visibilitychange',visibilityChanged);
  let observer;
  if('IntersectionObserver' in window){
   observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:0});
   observer.observe(container.current);
  }
  return()=>{
   observer?.disconnect();preference.removeEventListener('change',motionChanged);
   document.removeEventListener('visibilitychange',visibilityChanged);
   media.current.forEach(video=>video?.pause());
  };
 },[]);

 useEffect(()=>{
  let cancelled=false;
  media.current.forEach((video,index)=>{if(index!==current)video?.pause();});
  const video=media.current[current];
  if(!video)return;
  if(!enabled||!wantsPlay||!inView||!tabVisible){video.pause();return;}
  if(last.current!==current){video.currentTime=0;last.current=current;}
  video.muted=true;
  video.play()?.catch(()=>{
   // Network/decoding failures advance via onError. Autoplay denial offers play.
   if(!cancelled&&!video.error)setWantsPlay(false);
  });
  return()=>{cancelled=true;};
 },[current,enabled,wantsPlay,inView,tabVisible]);

 function advance(from){
  for(let offset=1;offset<=sources.length;offset++){
   const next=(from+offset)%sources.length;
   if(!failed.current.has(next)){
    if(next===from){const video=media.current[next];video.currentTime=0;video.play()?.catch(()=>setWantsPlay(false));}
    else setCurrent(next);
    return;
   }
  }
  setVisible(null);setWantsPlay(false);
 }
 function playbackError(index){
  failed.current.add(index);
  if(index===current)advance(index);
 }
 function select(index){
  failed.current.delete(index);setEnabled(true);setCurrent(index);setWantsPlay(true);
  if(media.current[index]?.error)media.current[index].load();
 }
 function toggle(){
  if(wantsPlay){setWantsPlay(false);return;}
  failed.current.clear();setEnabled(true);
  media.current.forEach(video=>{if(video?.error)video.load();});
  setWantsPlay(true);
 }

 return <>
  <div className="hero-video-background" ref={container} aria-hidden="true">
   <img className="hero-image" src="/assets/hero-animation.webp" alt="" fetchPriority="high"/>
   {sources.map((src,index)=><video key={src} ref={element=>{media.current[index]=element;}}
    className={`hero-video ${visible===index?'is-visible':''}`}
    src={enabled?src:undefined} muted playsInline disablePictureInPicture tabIndex={-1}
    preload={enabled&&(index===current||index===(current+1)%sources.length)?'auto':'none'}
    onPlaying={()=>{if(index===current)setVisible(index);}}
    onEnded={()=>{if(index===current&&wantsPlay)advance(index);}}
    onError={()=>playbackError(index)}
   />)}
  </div>
  <div className="hero-video-controls" aria-label="Hero background videos">
   <div className="hero-video-choices" role="group" aria-label="Select background video">{sources.map((src,index)=><button key={src} type="button" aria-label={`Play background video ${index+1}`} aria-pressed={current===index} onClick={()=>select(index)}><span/></button>)}</div>
   <button type="button" className="hero-video-toggle" aria-label={wantsPlay?'Pause background videos':'Play background videos'} onClick={toggle}>{wantsPlay?<Pause size={15} weight="fill"/>:<Play size={15} weight="fill"/>}<span>{wantsPlay?'Pause video':'Play video'}</span></button>
  </div>
 </>;
}
