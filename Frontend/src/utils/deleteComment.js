
function deleteComments(commentId, setComments) {
    setComments(prev => prev.filter(val => val._id.toString() !== commentId.toString() ));
}

export default deleteComments;