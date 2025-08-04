import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaBold, FaItalic } from "react-icons/fa";

// === Initial Pages (A4 styled content) ===
const initialPages = [
  {
    id: 1,
    content: `<p>Type your first page content here...</p>`,
  },
  {
    id: 2,
    content: `<p>Continue your document on the second page...</p>`,
  },
];

const PaginationEditor: React.FC = () => {
  const [pages] = useState(initialPages);
  const [currentPage, setCurrentPage] = useState(0);

  // Create editor for each page
  const editors = pages.map((p) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEditor({
      extensions: [StarterKit],
      content: p.content,
    })
  );

  const toggleBold = () =>
    editors[currentPage]?.chain().focus().toggleBold().run();

  const toggleItalic = () =>
    editors[currentPage]?.chain().focus().toggleItalic().run();

  const nextPage = () =>
    setCurrentPage((prev) => (prev < pages.length - 1 ? prev + 1 : prev));

  const prevPage = () =>
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="main-area">
      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={toggleBold}>
          <FaBold />
        </button>
        <button onClick={toggleItalic}>
          <FaItalic />
        </button>
      </div>

      {/* Page Content */}
      <motion.div
        key={pages[currentPage].id}
        className="page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="editor">
          {editors[currentPage] && (
            <EditorContent editor={editors[currentPage]} />
          )}
        </div>
        <div className="footer">Page {currentPage + 1}</div>
      </motion.div>

      {/* Pagination Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button onClick={prevPage} disabled={currentPage === 0}>
          <FaArrowLeft /> Prev
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PaginationEditor;
