import axios from "axios";

const api = "https://movieapi-production-2474.up.railway.app";

async function getComment(token) {
  try {
    const response = await axios.get(`${api}/api/comment`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error geting comments",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      "Failed to geting comments: " +
        (error.response ? error.response.data : error.message)
    );
  }
}

async function postComment(filmId, token, commentData) {
  try {
    const response = await axios.post(
      `${api}/api/comment/${filmId}`, // filmId'yi URL'ye ekleyin
      commentData, // commentData'yı JSON formatında gönderin
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json-patch+json", // Content-Type'ı application/json-patch+json olarak ayarlayın
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
}
async function getLikedComments(token) {
  try {
    const response = await axios.get(`${api}/api/CommentLikePortfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting liked comments:", error);
    throw error;
  }
}


async function likeComment(commentId,token) {
  try {
    const response = await axios.post(
      `${api}/api/CommentLikePortfolio?IdOfCommand=${commentId}`, // beğenme endpoint'i
      {}, // POST isteği gövdesi boş
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error liking comment:", error);
    throw error;
  }
}

async function dislikeComment(commentId,token) {
  try {
    const response = await axios.delete(
      `${api}/api/CommentLikePortfolio?IdOfCommand=${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error disliking comment:", error);
    throw error;
  }
}

export function likeUserComment(commentId,token) {
  return likeComment(commentId,token);
}
export function dislikeUserComment(commentId,token) {
  return dislikeComment(commentId,token);
}
export function getUserLikedComments(token) {
  return getLikedComments(token);
}
export function postUserComment(filmId, token, commentData) {
  return postComment(filmId, token, commentData);
}
export function getAllComments(token) {
  return getComment(token);
}
