import React, { useState } from "react";


function UserNotes() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const response = await fetch('http://localhost:5000/api/auth/post/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Note added successfully', data.newNote);
        } else {
          console.error('Error adding note:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titile"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default UserNotes;
