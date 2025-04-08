

// src/components/rooms/RoomCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function RoomCard({ room }) {
  // Basic card structure - Enhance later
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 dark:text-white truncate mb-1">{room.name || `Room ${room.roomId.substring(0, 6)}`}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Language: {room.language || 'N/A'}</p>
      <Link
        to={`/room/${room.roomId}`}
        className="inline-block w-full text-center px-3 py-1.5 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600">
        Join
      </Link>
    </div>
  );
}
export default RoomCard;