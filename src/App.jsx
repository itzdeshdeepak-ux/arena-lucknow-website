import React from 'react';
import {App as Homepage} from './Prototype.jsx';
import {CoursePage} from './CoursePage.jsx';
import {courseForPath} from './catalog.js';
import {ScholarshipPage} from './ScholarshipPage.jsx';
import './surfaces.css';

export function App({pathname=typeof window==='undefined'?'/':window.location.pathname}){
 if(pathname==='/')return <Homepage/>;
 if(pathname.replace(/\/$/,'')==='/scholarship')return <ScholarshipPage/>;
 const course=courseForPath(pathname);
 if(course)return <CoursePage course={course}/>;
 return <main className="not-found section-width"><h1>This page has moved<br/>out of the picture.</h1><p>Find a course or speak with our Indira Nagar team.</p><a className="split-button" href="/">Explore Arena Lucknow</a></main>;
}
