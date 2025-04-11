
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BASE_URL } from '../utils/constants';
import Loading from '../components/Loading';
import AnswerItem from '../components/AnswerItem';


const UpVoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;
const DownVoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const UserAvatar = ({ src, alt, size = "w-8 h-8" }) => <img className={`rounded-full object-cover ${size}`} src={src} alt={alt} />;

// Markdown Components for rendering Question body and Answer body
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


function QuestionDetailsPage() {
  const { id: questionId } = useParams();
  const { token } = useSelector(state => state.user);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newAnswerBody, setNewAnswerBody] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  const [answerError, setAnswerError] = useState(null);

  const [reloadOnVote, setReloadOnVote] = useState(false);


  useEffect(() => {
    const fetchQuestionDetails = async () => {
      // setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/questions/${questionId}`,{
          headers: {Authorization: `bearer ${token}`}
        });

        if (response.data) {
          setQuestion(response.data.question);
          setAnswers(response.data.answers || []);
        } else {
          setError('Question not found.');
        }
      } catch (err) {
        console.error("Error fetching question details:", err);
        setError(err.response?.data?.message || 'Failed to load question details.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionDetails();
  }, [questionId, reloadOnVote]);

  // Fetch Answers
  useEffect(() => {
    const getAnswers = async () => {
      try{
        const res = await axios.get(BASE_URL + `/api/answers/${questionId}`)
      }
      catch(err){
  
      }
    }

    getAnswers();
  },[answers])


  const handlePostAnswer = async (e) => {
      e.preventDefault();
      if (!newAnswerBody.trim()) {
          setAnswerError('Answer cannot be empty.');
          return;
      }
      setAnswerLoading(true);
      setAnswerError(null);

      try {
        // --- Replace with your API Call ---
        const response = await axios.post(`${BASE_URL}/api/answers/${questionId}`,
           { content: newAnswerBody },
           { headers: { Authorization: `bearer ${token}` } }
        );
        // --- End API Call ---

        // Add the new answer to the list instantly (Optimistic UI or refetch)
        setAnswers([response.data.answer, ...answers]); // Prepend new answer (adjust based on response)
        setNewAnswerBody(''); // Clear the editor

      } catch(err) {
         console.error("Error posting answer:", err);
         setAnswerError(err.response?.data?.message || 'Failed to post answer.');
      } finally {
          setAnswerLoading(false);
      }
  };

  const handleUpVote = async () => {
    axios.post(BASE_URL + "/api/questions/upVote",{id: questionId},{
      headers: {Authorization: `bearer ${token}`}
    })
    .then((res) => {
      console.log(res);
      setReloadOnVote(!reloadOnVote);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const handleDownVote = async () => {
    axios.post(BASE_URL + "/api/questions/downVote",{id: questionId},{
      headers: {Authorization: `bearer ${token}`}
    })
    .then((res) => {
      console.log(res);
      setReloadOnVote(!reloadOnVote);
    })
    .catch((err) => {
      console.log(err);
    })
  }


  if (loading) return <div className="p-6 mt-40 text-center"> <Loading/> </div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  if (!question) return <div className="p-6 text-center">Question not found.</div>;


  const { title, body, authorId: author, tags, votes, views, createdAt } = question;

  return (
    <div className="space-y-8">

      <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {title}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                 <span>Asked {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'N/A'}</span>
                 <span>Viewed {views || 0} times</span>
            </div>
        </div>

         <div className="flex items-start space-x-4">
             <div className="flex flex-col items-center space-y-1 flex-shrink-0 text-gray-600 dark:text-gray-400 pt-1">
                <button onClick={handleUpVote} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Upvote">
                   <UpVoteIcon />
                </button>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{votes || 0}</span>
                <button onClick={handleDownVote} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Downvote">
                   <DownVoteIcon />
                </button>
             </div>

            
             <div className="flex-grow">
                 <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-5">
                     <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                       {body}
                     </ReactMarkdown>
                 </div>

                 <div className="flex flex-wrap gap-1.5 mb-5">
                   {tags?.map((tag) => (
                     <Link key={tag} to={`/questions/tagged/${tag}`} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded px-2 py-0.5 transition-colors">
                       {tag}
                     </Link>
                   ))}
                 </div>

                 
                 <div className="flex justify-end">
                     <div className="flex-shrink-0 bg-blue-50 dark:bg-gray-700 p-2 rounded-md text-xs text-gray-600 dark:text-gray-300 max-w-max">
                       <p className="mb-1">asked by</p>
                       <Link to={`/profile/${author?._id}`} className="flex items-center space-x-1.5 hover:opacity-80">
                         <UserAvatar
                           size="w-6 h-6"
                           src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.username || 'A'}&size=24&background=random`}
                           alt={author?.username || 'Author'}
                         />
                         <span className="font-medium text-blue-700 dark:text-blue-400">{author?.username || 'Unknown User'}</span>
                       </Link>
                     </div>
                 </div>
             </div>
         </div>
      </div>


      {/* Answers Area */}
      <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow">
         {/* Answers Header */}
         <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>
            {/* Add Sort Dropdown later */}
            {/* <div> Sort by: [ Dropdown ] </div> */}
         </div>

         {/* Answer List */}
          {answers.length > 0 ? (
              <div className="space-y-6">
                  {answers.map((answer) => (
                      <AnswerItem key={answer._id} answer={answer} />
                  ))}
              </div>
          ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No answers yet. Be the first to answer!
              </p>
          )}
      </div>

      {/* "Your Answer" Section (Only for logged-in users) */}
         <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow">
             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                 Your Answer
             </h2>
             {answerError && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                  <p>{answerError}</p>
                </div>
             )}
             <form onSubmit={handlePostAnswer}>
                <div data-color-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                   <MDEditor
                     value={newAnswerBody}
                     onChange={setNewAnswerBody}
                     height={250}
                     preview="live"
                   />
                </div>
                <button
                  type="submit"
                  disabled={answerLoading}
                  className="mt-4 inline-flex items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {answerLoading ? 'Posting Answer...' : 'Post Your Answer'}
                </button>
             </form>
         </div>
    </div>
  );
}

export default QuestionDetailsPage;