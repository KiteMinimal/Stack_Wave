
// src/components/answers/AnswerItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux'; // To check ownership for edit/delete

// Import a Markdown renderer (if not using editor directly)
// We need to render the saved Markdown content
// npm install react-markdown remark-gfm
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, strikethrough etc.)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // For code blocks
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Choose a theme

// Placeholder icons
const UpVoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;
const DownVoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const UserAvatar = ({ src, alt, size = "w-8 h-8" }) => <img className={`rounded-full object-cover ${size}`} src={src} alt={alt} />;


// Markdown components for syntax highlighting
const MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark} // Choose your syntax highlighting theme
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};


function AnswerItem({ answer }) {
  const { content, author, votes, createdAt, _id: answerId } = answer; // Destructure answer
  const { user: loggedInUser } = useSelector(state => state.auth); // Get logged-in user info

  const isOwner = loggedInUser?._id === author?._id; // Check if current user is the author

  // TODO: Add Voting Logic (handleUpvote, handleDownvote) using API calls

  return (
    <div className="flex items-start space-x-4 py-6 border-b border-gray-200 dark:border-gray-700">
      {/* Voting Section */}
      <div className="flex flex-col items-center space-y-1 flex-shrink-0 text-gray-600 dark:text-gray-400">
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Upvote">
          <UpVoteIcon />
        </button>
        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">{votes || 0}</span>
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Downvote">
          <DownVoteIcon />
        </button>
        {/* Add bookmark/other icons later if needed */}
      </div>

      {/* Answer Content Section */}
      <div className="flex-grow">
         {/* Use ReactMarkdown to render the content */}
         <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-4"> {/* prose classes for styling */}
             <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
               {content}
             </ReactMarkdown>
          </div>


        {/* Author Info & Actions */}
        <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
           {/* Edit/Delete Buttons for Owner */}
           <div className="text-xs space-x-3">
              {isOwner && (
                 <>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                  <button className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                 </>
              )}
              {/* Add Share/Comment buttons later */}
           </div>

           {/* Author Card */}
           <div className="flex-shrink-0 bg-blue-50 dark:bg-gray-700 p-2 rounded-md text-xs text-gray-600 dark:text-gray-300">
             <p className="mb-1">answered {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'recently'}</p>
             <Link to={`/profile/${author?._id}`} className="flex items-center space-x-1.5 hover:opacity-80">
                <UserAvatar
                  size="w-6 h-6"
                  src={author?.avatarUrl || `https://ui-avatars.com/api/?name=${author?.name || 'A'}&size=24&background=random`}
                  alt={author?.name || 'Author'}
                />
                <span className="font-medium text-blue-700 dark:text-blue-400">{author?.name || 'Unknown User'}</span>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

export default AnswerItem;