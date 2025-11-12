import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Main from './pages/Main';
import SocialIssue from './pages/SocialIssue';
import EnvironmentalProblem from './pages/EnvironmentalProblem';
import WritingIdea from './pages/WritingIdea';
import Science from './pages/Science';
import Event from './pages/Event';
import WritePost from './pages/WritePost';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/social-issue" element={<SocialIssue />} />
          <Route path="/environmental-problem" element={<EnvironmentalProblem />} />
          <Route path="/writing-idea" element={<WritingIdea />} />
          <Route path="/science" element={<Science />} />
          <Route path="/event" element={<Event />} />
          <Route path="/write" element={<WritePost />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

