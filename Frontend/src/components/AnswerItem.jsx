
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BASE_URL } from '../utils/constants';



const UpVoteIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${filled ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);
const DownVoteIcon = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${filled ? 'text-red-600 dark:text-red-400' : ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);
const UserAvatar = ({ src, alt, size = "w-8 h-8" }) => <img className={` ${size}`} src={src} alt={alt} />;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

const MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={`inline-code ${className || ''}`} {...props}>
        {children}
      </code>
    );
  },
  a: ({node, ...props}) => <a className="text-indigo-500 hover:underline" {...props} />,
};

// --- Main Component ---
function AnswerItem({ answer, questionId, loggedInUser, token, onAnswerDeleted }) {

  const {
      content,
      authorId: author,
      vote: initialVotes,
      createdAt,
      _id: answerId,
      upvotedby,
      downvotedby
  } = answer;

  // --- State for Voting ---
  const [currentVotes, setCurrentVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(null); // 'up', 'down', or null
  const [isVoting, setIsVoting] = useState(false);


  useEffect(() => {
      if (loggedInUser) {
          const userId = loggedInUser._id;
          if (upvotedby.some(id => id === userId)) {
              setUserVote('up');
          } else if (downvotedby.some(id => id === userId)) {
              setUserVote('down');
          } else {
              setUserVote(null);
          }
      } else {
          setUserVote(null);
      }
      setCurrentVotes(initialVotes);
  }, [upvotedby, downvotedby, loggedInUser, initialVotes]);


  // --- Voting Handler ---
  const handleVote = useCallback(async (voteType) => {
    if (!loggedInUser) {
        toast.error("Please log in to vote.");
        return;
    }
    if (isVoting) return;

    setIsVoting(true);

    // --- Optimistic UI Update ---
    const previousVotes = currentVotes;
    const previousUserVote = userVote;
    let optimisticVotes = currentVotes;
    let optimisticUserVote = userVote;

    if (voteType === 'up') {
        if (userVote === 'up') {
            optimisticVotes--;
            optimisticUserVote = null;
        } else if (userVote === 'down') {
            optimisticVotes += 2;
            optimisticUserVote = 'up';
        } else {
            optimisticVotes++;
            optimisticUserVote = 'up';
        }
    } else {
        if (userVote === 'down') {
            optimisticVotes++;
            optimisticUserVote = null;
        } else if (userVote === 'up') {
            optimisticVotes -= 2;
            optimisticUserVote = 'down';
        } else { // New downvote
            optimisticVotes--;
            optimisticUserVote = 'down';
        }
    }

    setCurrentVotes(optimisticVotes);
    setUserVote(optimisticUserVote);

    try {
        const apiUrl = `${BASE_URL}/api/answers/${voteType === 'up' ? 'upVote' : 'downVote'}/${answerId}`;
        const response = await axios.post(apiUrl, {}, {
            headers: { Authorization: `bearer ${token}` }
        });

        if (response.data && typeof response.data.newVoteCount === 'number') {
            setCurrentVotes(response.data.newVoteCount);
        }

    } catch (err) {
        console.error(`Error ${voteType}voting answer:`, err);
        toast.error(err.response?.data?.message || `Failed to ${voteType}vote.`);
        setCurrentVotes(previousVotes);
        setUserVote(previousUserVote);
    } finally {
        setIsVoting(false);
    }
  }, [loggedInUser, token, answerId, isVoting, currentVotes, userVote]);


  const isOwner = loggedInUser && author && loggedInUser._id === author._id;

  return (
    <div className="flex items-start space-x-4 py-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0">
      {/* Voting Section */}
      <div className="flex flex-col items-center space-y-1 flex-shrink-0 text-gray-600 dark:text-gray-400 pt-1">
        <button
            onClick={() => handleVote('up')}
            disabled={isVoting || !loggedInUser}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Upvote"
        >
          <UpVoteIcon filled={userVote === 'up'} />
        </button>
        <span className={`text-lg font-bold ${
            userVote === 'up' ? 'text-indigo-600 dark:text-indigo-400' : userVote === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'
        }`}>
            {currentVotes}
        </span>
        <button
            onClick={() => handleVote('down')}
            disabled={isVoting || !loggedInUser}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Downvote"
        >
          <DownVoteIcon filled={userVote === 'down'} />
        </button>
      </div>

      {/* Answer Content Section */}
      <div className="flex-grow min-w-0">
         <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-4">
             <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
               {content}
             </ReactMarkdown>
          </div>

        {/* Author Info & Actions */}
        <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 mt-4">
           {/* Edit/Delete/Comment Buttons */}
           <div className="text-xs space-x-3 flex items-center text-gray-500 dark:text-gray-400">
              {isOwner && (
                 <>
                  <button className="flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                    <EditIcon /> <span className="ml-1">Edit</span>
                  </button>
                  <button className="flex items-center hover:text-red-600 dark:hover:text-red-400">
                    <TrashIcon /> <span className="ml-1">Delete</span>
                  </button>
                 </>
              )}
              {/* Add Share/Comment buttons later */}
              <button className="hover:text-gray-700 dark:hover:text-gray-300">Comment</button>
           </div>

           {/* Author Card */}
           <div className="flex-shrink-0 bg-blue-50 dark:bg-gray-700 p-2 rounded-md text-xs text-gray-600 dark:text-gray-300 shadow-sm"> {/* Added shadow */}
             <p className="mb-1 text-gray-500 dark:text-gray-400">answered {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'recently'}</p>
             <Link to={`/profile/${author?._id}`} className="flex items-center space-x-1.5 group">
                <img className='w-8 h-8 rounded-full object-cover' src={author?.avatar} alt="author_name" />
                <span className="font-medium text-blue-700 dark:text-blue-400 group-hover:underline">{author?.username}</span>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

export default AnswerItem;