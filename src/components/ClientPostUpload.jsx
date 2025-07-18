// src/components/ClientUploadPost.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function ClientPostUpload() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "uploads"),
      where("country", "==", user.countryCode),
      where("email", "==", user.email),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    });

    return () => unsub();
  }, [user]);

  if (!user) return null;

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-lg font-semibold text-[#0b0b5c] mb-4">My Upload Feed</h3>
      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">No posts found.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded shadow">
            <p className="font-bold">{post.title}</p>
            <p className="text-sm text-gray-500 mb-2">{new Date(post.timestamp).toLocaleString()}</p>
            {post.url.includes("cloudinary") && post.url.match(/\.(jpeg|jpg|png|webp|gif)$/i) ? (
              <img src={post.url} alt="Uploaded" className="w-full max-w-md rounded" />
            ) : (
              <a href={post.url} className="text-blue-500 hover:underline" download>
                📄 Download Document
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
