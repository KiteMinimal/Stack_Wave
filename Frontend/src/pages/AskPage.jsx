// src/pages/AskPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // To get token for API call
import MDEditor from '@uiw/react-md-editor'; // Import the editor
// Import your API function later (e.g., createQuestion from '../api/questions')
// import { createQuestion } from '../api/questions';
import axios from 'axios'; // Using axios directly for now
import { BASE_URL } from '../utils/constants';

function AskPage() {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState(''); // Markdown content for the body
  const [tags, setTags] = useState(''); // Simple comma-separated tags for now
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!title.trim() || !body.trim() || !tags.trim()) {
      setError('Please fill in all fields: Title, Body, and Tags.');
      setLoading(false);
      return;
    }

    // Process tags: split by comma, trim whitespace, remove empty tags
    const processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    if (processedTags.length === 0) {
        setError('Please enter at least one valid tag.');
        setLoading(false);
        return;
    }
    if (processedTags.length > 5) { // Example limit
        setError('You can add a maximum of 5 tags.');
        setLoading(false);
        return;
    }


    const questionData = {
      title: title.trim(),
      body: body, // Send the raw Markdown string
      tags: processedTags,
    };

    console.log('Submitting question:', questionData);

    try {
      // --- Replace with your API call ---
      // const response = await createQuestion(questionData, token);

      // Example using axios directly
      const response = await axios.post(`${BASE_URL}/api/questions`, questionData, {
        headers: { Authorization: `bearer ${token}` }
      });
      // --- End API call ---

      console.log('API Response:', response.data);

      // Assuming response.data contains the newly created question with its _id
      const newQuestionId = response.data?.question?._id; // Adjust based on your actual API response

      if (newQuestionId) {
        // Redirect to the newly created question's page
        navigate(`/question/${newQuestionId}`);
      } else {
         // Or redirect to questions page if ID is not returned
         console.warn("New question ID not found in response, redirecting to questions page.");
         navigate('/questions');
      }

    } catch (err) {
      console.error("Error posting question:", err);
      setError(err.response?.data?.message || 'Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

      {/* Main Form Area */}
      <div className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ask a Public Question
        </h1>
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Be specific and imagine you’re asking a question to another person)</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={15} // Example validation
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. How to implement dark mode toggle with Tailwind CSS and React?"
            />
          </div>

          {/* Body Field (Markdown Editor) */}
          <div>
             <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Body
               <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Include all the information someone would need to answer your question)</span>
             </label>
             {/* Use data-color-mode attribute to sync editor theme with your app theme */}
             <div data-color-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                 <MDEditor
                   value={body}
                   onChange={setBody} // Directly updates the state
                   height={400} // Adjust height as needed
                   preview="live" // Options: 'live', 'edit', 'preview'
                   // You can customize the toolbar commands if needed
                 />
             </div>
          </div>

          {/* Tags Field */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
               <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Add up to 5 tags separated by commas)</span>
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. react,javascript,tailwind-css,dark-mode"
            />
             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated tags (e.g., `react, node.js, api`)</p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Your Question'}
            </button>
          </div>
        </form>
      </div>

      {/* Guidance Sidebar */}
       <aside className="lg:w-1/4 flex-shrink-0">
           <div className="sticky top-20 bg-blue-50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 p-4 rounded-lg shadow-sm">
               <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">How to Ask a Good Question</h3>
               <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
                   <li>Summarize the problem in the title.</li>
                   <li>Describe the specific issue in the body.</li>
                   <li>Include relevant code snippets (use Markdown!).</li>
                   <li>Explain what you've already tried.</li>
                   <li>Use descriptive tags.</li>
               </ul>
           </div>
       </aside>
    </div>
  );
}

export default AskPage;