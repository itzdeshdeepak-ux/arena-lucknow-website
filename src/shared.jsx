import React,{useEffect,useRef} from 'react';
import {ArrowRight} from '@phosphor-icons/react';
export const PHONE='916390006309',BRANCH='Arena Animation, Indira Nagar, Lucknow';
export const wa=message=>`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
export {courses,categories,labels,descriptions,coursePath} from './catalog.js';
export function SplitButton({children,onClick,href,light=false,secondary=false}){const content=<><span>{children}</span><span className="button-arrow"><ArrowRight size={21}/></span></>;const cls=`split-button ${light?'light':''} ${secondary?'secondary':''}`;return href?<a className={cls} href={href}>{content}</a>:<button className={cls} onClick={onClick}>{content}</button>;}
export function Modal({open,onClose,label,children,className=''}){const ref=useRef(null);useEffect(()=>{const d=ref.current;if(open&&!d.open)d.showModal();if(!open&&d.open)d.close();document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow='';};},[open]);return <dialog ref={ref} className={className} aria-label={label} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current&&className!=='course-dialog')onClose();}}>{children}</dialog>;}
