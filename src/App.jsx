import React, { useEffect, useState } from "react";
import { Trash2, NotebookPen, StickyNote, Pencil } from "lucide-react";

const App = () => {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [tasks, setTasks] = useState([]);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetail, setEditDetail] = useState("");

  // Load from localStorage
  useEffect(() => {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    setTasks(JSON.parse(savedNotes));
  }
}, []);

useEffect(() => {
  if (tasks.length > 0) {
    localStorage.setItem("notes", JSON.stringify(tasks));
  } else {
    localStorage.removeItem("notes");
  }
}, [tasks]);


  // Add Note
  const submitHandler = (e) => {
    e.preventDefault();

    if (!title.trim() || !detail.trim()) return;

    const newNote = {
      id: Date.now(),
      title,
      detail,
    };

    setTasks([newNote, ...tasks]);
    setTitle("");
    setDetail("");
  };

  // Delete Note
  const deleteNote = (id) => {
    setTasks(tasks.filter((note) => note.id !== id));
  };

  // Open Edit Modal
  const openEditModal = (note) => {
    setIsEditing(true);
    setEditId(note.id);
    setEditTitle(note.title);
    setEditDetail(note.detail);
  };

  // Update Note
  const updateNote = () => {
    if (!editTitle.trim() || !editDetail.trim()) return;

    const updatedTasks = tasks.map((note) =>
      note.id === editId
        ? { ...note, title: editTitle, detail: editDetail }
        : note
    );

    setTasks(updatedTasks);
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Scrollbar Hide CSS */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* FORM SECTION */}
        <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-10">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <NotebookPen className="text-yellow-400" size={30} />
              <h1 className="text-3xl sm:text-4xl font-bold">Add Notes</h1>
            </div>

            <form
              onSubmit={submitHandler}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-7 backdrop-blur-xl shadow-lg space-y-4"
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm sm:text-base"
                type="text"
                placeholder="Enter Notes Heading"
              />

              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:ring-2 focus:ring-yellow-400 transition min-h-[120px] sm:min-h-[150px] resize-none text-sm sm:text-base"
                placeholder="Write Details..."
              />

              <button className="w-full py-3 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-300 transition active:scale-95">
                Add Note
              </button>

              <p className="text-xs sm:text-sm text-gray-400 text-center">
                Notes saved automatically (LocalStorage enabled).
              </p>
            </form>
          </div>
        </div>

        {/* NOTES SECTION */}
        <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-10 lg:border-l border-white/10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <StickyNote className="text-yellow-400" size={30} />
              <h1 className="text-3xl sm:text-4xl font-bold">Recent Notes</h1>
            </div>

            <div className="h-[60vh] lg:h-[85vh] overflow-auto pr-1 sm:pr-2 hide-scrollbar">
              {tasks.length === 0 ? (
                <div className="text-gray-400 text-sm sm:text-base mt-10 text-center">
                  No notes yet 😭 <br /> Add your first note!
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {tasks.map((elem) => (
                    <div
                      key={elem.id}
                      className="w-full sm:w-[48%] bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-xl hover:scale-[1.02] transition"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-yellow-300 break-words">
                        {elem.title}
                      </h3>

                      <p className="mt-2 text-sm sm:text-base text-gray-300 break-words leading-relaxed">
                        {elem.detail}
                      </p>
<div className="flex gap-2 mt-4">
  <button
    onClick={() => openEditModal(elem)}
    className="w-1/2 py-2 rounded-xl border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black transition font-semibold text-sm flex items-center justify-center gap-2 active:scale-95"
  >
    <Pencil size={16} />
    Edit
  </button>

  <button
    onClick={() => deleteNote(elem.id)}
    className="w-1/2 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold text-sm flex items-center justify-center gap-2 active:scale-95"
  >
    <Trash2 size={16} />
    Delete
  </button>
</div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-5 z-50">
          <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Edit Note
            </h2>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:ring-2 focus:ring-yellow-400 transition text-sm sm:text-base mb-3"
              type="text"
              placeholder="Edit Title"
            />

            <textarea
              value={editDetail}
              onChange={(e) => setEditDetail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none focus:ring-2 focus:ring-yellow-400 transition min-h-[130px] resize-none text-sm sm:text-base"
              placeholder="Edit Details..."
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={updateNote}
                className="w-1/2 py-2 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition active:scale-95"
              >
                Update
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="w-1/2 py-2 rounded-xl bg-gray-700 text-white font-bold hover:bg-gray-600 transition active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
