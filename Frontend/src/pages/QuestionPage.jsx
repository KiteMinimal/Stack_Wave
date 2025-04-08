// src/pages/QuestionPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import QuestionItem from '../components/QuestionItem';


const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

const dummyQuestions = [
  { _id: '1', title: 'How to center a div vertically and horizontally using Tailwind CSS?', author: { _id: 'u1', name: 'Alice', avatarUrl: 'https://placehold.co/40x40/7F9CF5/EBF4FF?text=A' }, tags: ['css', 'tailwind', 'flexbox'], votes: 152, answersCount: 5, views: 2560, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { _id: '2', title: 'What is the difference between useEffect and useLayoutEffect in React?', author: { _id: 'u2', name: 'Bob', avatarUrl: 'https://placehold.co/40x40/A3BFFA/EBF4FF?text=B' }, tags: ['react', 'hooks', 'useeffect'], votes: 98, answersCount: 2, views: 1800, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { _id: '3', title: 'How to handle async operations in Redux Toolkit?', author: { _id: 'u1', name: 'Alice', avatarUrl: 'https://placehold.co/40x40/7F9CF5/EBF4FF?text=A' }, tags: ['react', 'redux', 'async', 'redux-toolkit'], votes: 210, answersCount: 8, views: 3100, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { _id: '4', title: 'Best way to structure Node.js + Express project?', author: { _id: 'u3', name: 'Charlie', avatarUrl: 'https://placehold.co/40x40/C3D7FB/EBF4FF?text=C' }, tags: ['node.js', 'express', 'architecture'], votes: 55, answersCount: 0, views: 950, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];


function QuestionsPage() {
  const [questions, setQuestions] = useState(dummyQuestions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Newest');

  // TODO: useEffect hook here later to fetch questions from API based on activeFilter and page number

  const handleFilterChange = (filter) => {
      setActiveFilter(filter);
      // TODO: Add logic to refetch questions based on the new filter
      console.log("Filter changed to:", filter);
  }

  const FilterButton = ({ filterName }) => (
     <button
        onClick={() => handleFilterChange(filterName)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          activeFilter === filterName
            ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`} >
        {filterName}
     </button>
  );

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          All Questions
        </h1>
          <Link to="/ask" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
            <PlusIcon /> Ask Question
          </Link>
      </div>

      {/* Filter/Sort Area */}
      <div className="flex items-center px-4">
          <div className="flex space-x-1 sm:space-x-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
             <FilterButton filterName="Newest" />
             <FilterButton filterName="Top Voted" />
             <FilterButton filterName="Unanswered" />
          </div>
      </div>

      {/* Question List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading && <div className="p-6 text-center">Loading questions...</div>}
        {error && <div className="p-6 text-center text-red-500">Error loading questions: {error}</div>}
        {!loading && !error && questions.length === 0 && <div className="p-6 text-center text-gray-500">No questions found.</div>}

        {!loading && !error && questions.length > 0 && (
          <div>
            {questions.map((q) => (
              <QuestionItem key={q._id} question={q} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
         {/* TODO: Add Pagination Component */}
         <div className="text-center text-gray-500 dark:text-gray-400">Pagination goes here...</div>
      </div>
    </div>
  );
}

export default QuestionsPage;