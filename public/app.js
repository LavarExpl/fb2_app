async function createPost() {
    const postContent = document.getElementById('post-content').value;
    if (!postContent) {
      alert('Please enter a post!');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent }),
      });
      if (response.ok) {
        document.getElementById('post-content').value = '';
        fetchPosts();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      alert(error.message);
    }
  }
  async function deletePost(postId) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPosts();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      alert(error.message);
    }
  }
  async function editPost(postId) {
    const postElement = document.getElementById(`post-${postId}`);
    const existingContent = postElement.querySelector('p').innerText;
    const newContent = prompt('Edit your post:', existingContent);
    if (newContent === null) {
      return; // User cancelled editing
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }),
      });
      if (response.ok) {
        fetchPosts();
      } else {
        throw new Error('Failed to edit post');
      }
    } catch (error) {
      alert(error.message);
    }
  }
  async function fetchPosts() {
    try {
      const response = await fetch('http://127.0.0.1:5000/posts');
      if (response.ok) {
        const posts = await response.json();
        const postFeed = document.getElementById('post-feed');
        postFeed.innerHTML = '';
        posts.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.classList.add('post');
          postElement.id = `post-${post.id}`;
          postElement.innerHTML = `
            <p>${post.content}</p>
            <button onclick="editPost(${post.id})">Edit</button>
            <button onclick="deletePost(${post.id})">Delete</button>
          `;
          postFeed.appendChild(postElement);
        });
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      alert(error.message);
    }
  }
  // Additional features or improvements can be added below
  // ... (remaining code)
  
  
  
  
  
  