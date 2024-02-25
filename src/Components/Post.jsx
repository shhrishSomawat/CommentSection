// CommentSection.js

import React, { useState } from 'react';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest', 'oldest', 'mostReplies', 'leastReplies'
    const [showTimestamp, setShowTimestamp] = useState(true);
    const [starredComments, setStarredComments] = useState([]);

    const handlePostComment = () => {
        if (newComment.trim() !== '') {
            setComments([...comments, { id: Date.now(), text: newComment, replies: [], timestamp: Date.now() }]);
            setNewComment('');
        }
    };

    const handleDeleteComment = (commentId) => {
        const updatedComments = comments.filter(comment => {
            if (comment.id === commentId || comment.replies.some(reply => reply.id === commentId)) {
                return false; // Skip deleted comment and its replies
            }
            return true;
        });

        setComments(updatedComments);
    };

    const handleReplyComment = (commentId, replyText) => {
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, replies: [...comment.replies, { id: Date.now(), text: replyText, timestamp: Date.now() }] };
            }
            return comment;
        });

        setComments(updatedComments);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const handleToggleTimestamp = () => {
        setShowTimestamp(!showTimestamp);
    };

    const handleStarComment = (commentId) => {
        const isStarred = starredComments.includes(commentId);
        const updatedStarredComments = isStarred
            ? starredComments.filter(starredId => starredId !== commentId)
            : [...starredComments, commentId];

        setStarredComments(updatedStarredComments);
    };

    const sortedComments = [...comments].sort((a, b) => {
        if (sortOrder === 'latest') return b.timestamp - a.timestamp;
        if (sortOrder === 'oldest') return a.timestamp - b.timestamp;
        if (sortOrder === 'mostReplies') return b.replies.length - a.replies.length;
        if (sortOrder === 'leastReplies') return a.replies.length - b.replies.length;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-2/3 lg:w-1/2 xl:w-1/3">
                <div className="flex items-center space-x-4 mb-6">
                    <label className="flex items-center text-gray-700">
                        Sort By:
                        <select value={sortOrder} onChange={(e) => handleSortChange(e.target.value)} className="ml-2 p-2 border rounded">
                            <option value="latest">Latest</option>
                            <option value="oldest">Oldest</option>
                            <option value="mostReplies">Most Replies</option>
                            <option value="leastReplies">Least Replies</option>
                        </select>
                    </label>
                    <label className="flex items-center text-gray-700">
                        <input type="checkbox" checked={showTimestamp} onChange={handleToggleTimestamp} className="mr-2" />
                        Show Timestamp
                    </label>
                </div>

                <textarea
                    className='border p-3 bg-gray-200 w-full rounded mb-4 focus:outline-none'
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                />
                <button className='px-4 py-2 bg-blue-500 text-white rounded focus:outline-none' onClick={handlePostComment}>Post</button>

                <ul className="mt-4">
                    {sortedComments.map(comment => (
                        <li key={comment.id} className="bg-gray-300 p-4 rounded mb-4">
                            <p>{comment.text}</p>
                            {showTimestamp && <p className="text-sm text-gray-600">{new Date(comment.timestamp).toLocaleString()}</p>}
                            <div className="flex mt-2 space-x-2">
                                <button className='px-4 py-2 bg-red-500 text-white rounded focus:outline-none' onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                <button className={`px-4 py-2 ${starredComments.includes(comment.id) ? 'bg-yellow-500' : 'bg-gray-500'} text-white rounded focus:outline-none`} onClick={() => handleStarComment(comment.id)}>
                                    {starredComments.includes(comment.id) ? 'Unstar' : 'Star'}
                                </button>
                            </div>

                            {/* Reply section */}
                            <ul className="mt-2 ml-4">
                                {comment.replies.map(reply => (
                                    <li key={reply.id} className="bg-gray-200 p-2 rounded mb-2">
                                        <p>{reply.text}</p>
                                        {showTimestamp && <p className="text-xs text-gray-600">{new Date(reply.timestamp).toLocaleString()}</p>}
                                        <button className='px-4 py-2 bg-red-500 text-white rounded focus:outline-none' onClick={() => handleDeleteComment(reply.id)}>Delete Reply</button>
                                    </li>
                                ))}
                            </ul>

                            <textarea
                                className='border p-2 bg-gray-200 w-full rounded mt-2 focus:outline-none'
                                placeholder="Reply to this comment..."
                                onBlur={(e) => handleReplyComment(comment.id, e.target.value)}
                            />
                            <button className='px-4 py-2 bg-blue-500 text-white rounded focus:outline-none mt-2' onClick={() => handleReplyComment(comment.id, newComment)}>Reply</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CommentSection;
