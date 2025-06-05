import axios from "axios";


export async function fetchComments(answerId, token) {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/${answerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.comments;
    } catch (err) {
        console.error("Error fetching comments:", err);
        return []; // fallback
    }
}

export default fetchComments;