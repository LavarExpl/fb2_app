from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# SQLite database initialization
conn = sqlite3.connect('database.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)')
conn.commit()
conn.close()
@app.route('/posts', methods=['POST'])
def create_post():
    try:
        content = request.json.get('content')
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO posts (content) VALUES (?)', (content,))
        conn.commit()
        post_id = cursor.lastrowid
        conn.close()
        return jsonify({'message': 'Post created successfully', 'postId': post_id})
    except Exception as e:
        return jsonify({'error': f'Failed to create post - {str(e)}'}), 500
@app.route('/posts', methods=['GET'])
def get_posts():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM posts')
        posts = cursor.fetchall()
        conn.close()
        return jsonify(posts)
    except Exception as e:
        return jsonify({'error': f'Failed to fetch posts - {str(e)}'}), 500
@app.route('/posts/<int:post_id>', methods=['PUT', 'DELETE'])
def edit_or_delete_post(post_id):
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        if request.method == 'PUT':
            content = request.json.get('content')
            if not content:
                return jsonify({'error': 'Content is required'}), 400
            cursor.execute('UPDATE posts SET content = ? WHERE id = ?', (content, post_id))
        elif request.method == 'DELETE':
            cursor.execute('DELETE FROM posts WHERE id = ?', (post_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Post edited/deleted successfully'})
    except Exception as e:
        return jsonify({'error': f'Failed to edit/delete post - {str(e)}'}), 500
if __name__ == '__main__':
    app.run(debug=True)