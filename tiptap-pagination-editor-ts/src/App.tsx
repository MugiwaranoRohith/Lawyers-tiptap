import React, { useRef, useEffect, useState } from "react";

const FONT_FAMILIES = [
  "Avenir Next",
  "Arial",
  "Times New Roman",
  "Courier New",
];
const FONT_SIZES = [8, 10, 12, 14, 16, 18, 24, 32];

export default function App() {
  const pageRefs = useRef<HTMLDivElement[]>([]);
  const [previewHTML, setPreviewHTML] = useState("");
  const [docTitle, setDocTitle] = useState("Untitled Document");
  const [pages, setPages] = useState([""]);

  // Toolbar states
  const [fontFamily, setFontFamily] = useState("Avenir Next");
  const [fontSize, setFontSize] = useState(12);
  const [heading, setHeading] = useState("p");

  // Current page number state (1-based)
  const [currentPage, setCurrentPage] = useState(1);

  // Update preview when pages or title change
  useEffect(() => {
    const combinedHTML = pageRefs.current
      .map((ref, i) => {
        if (!ref) return "";
        return `
          <div style="
            width: 794px;
            min-height: 1123px;
            box-sizing: border-box;
            padding: 60px 40px 60px 40px;
            background: white;
            position: relative;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          ">
            <div style="
              position: absolute;
              top: 20px;
              left: 40px;
              right: 40px;
              font-size: 14px;
              color: #999;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              user-select: none;
            ">${docTitle}</div>
            <div style="flex: 1; padding-top: 40px; padding-bottom: 40px;">
              ${ref.innerHTML}
            </div>
            <div style="
              position: absolute;
              bottom: 20px;
              left: 40px;
              right: 40px;
              font-size: 14px;
              color: #999;
              border-top: 1px solid #ddd;
              padding-top: 5px;
              text-align: center;
              user-select: none;
            ">
              Page ${i + 1}
            </div>
          </div>
        `;
      })
      .join("");
    setPreviewHTML(combinedHTML);
  }, [pages, docTitle]);

  const handleAddPage = () => {
    setPages([...pages, ""]);
    setCurrentPage(pages.length + 1); // Jump to new page
  };

  const handlePageChange = (value: string, index: number) => {
    const updated = [...pages];
    updated[index] = value;
    setPages(updated);
  };

  // Toolbar execCommand helper
  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    setHeading(tag);
    execCmd("formatBlock", tag);
  };

  // Change page with bounds
  const changePage = (newPage: number) => {
    if (newPage < 1) newPage = 1;
    else if (newPage > pages.length) newPage = pages.length;
    setCurrentPage(newPage);
  };

  // Export entire document as an HTML file
  const exportAsHTML = () => {
    const htmlContent = `
      <html>
        <head>
          <title>${docTitle}</title>
          <style>
            body {
              font-family: ${fontFamily};
              font-size: ${fontSize}px;
              margin: 0; padding: 20px;
              background: #f5f5f5;
            }
            .page {
              width: 794px;
              min-height: 1123px;
              padding: 60px 40px;
              background: white;
              box-shadow: 0 0 5px rgba(0,0,0,0.1);
              margin-bottom: 20px;
              box-sizing: border-box;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .header, .footer {
              font-size: 14px;
              color: #999;
              user-select: none;
              padding: 5px 0;
              border-bottom: 1px solid #ddd;
              text-align: center;
            }
            .footer {
              border-top: 1px solid #ddd;
              border-bottom: none;
              position: absolute;
              bottom: 20px;
              width: calc(100% - 80px);
              left: 40px;
            }
            .header {
              position: absolute;
              top: 20px;
              width: calc(100% - 80px);
              left: 40px;
            }
            .content {
              padding-top: 40px;
              padding-bottom: 40px;
              flex: 1;
            }
          </style>
        </head>
        <body>
          ${pages
            .map(
              (page, i) => `
            <div class="page">
              <div class="header">${docTitle}</div>
              <div class="content">${page}</div>
              <div class="footer">Page ${i + 1}</div>
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docTitle || "document"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Left Sidebar */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#1E1E2F",
          color: "#ffffff",
          padding: "24px 16px",
          boxSizing: "border-box",
          fontFamily: "'Segoe UI', sans-serif",
          borderRight: "1px solid #2D2D44",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div
            style={{
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "22px" }}>⚖️</span>
            <h1
              style={{
                fontSize: "18px",
                color: "#f3f4f6",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Hopper.AI
            </h1>
          </div>

          {/* Nav Items */}
          <nav>
            {[
              { icon: "🏠", label: "Dashboard" },
              { icon: "📄", label: "Documents" },
              { icon: "⚙️", label: "Settings" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  color: "#d1d5db",
                  fontSize: "14px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2E2E44";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ marginRight: "12px", fontSize: "16px" }}>
                  {icon}
                </span>
                {label}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            textAlign: "center",
            paddingTop: "20px",
          }}
        >
          © 2025 Hopper.AI
        </div>
      </aside>

      {/* Main layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Header with editable title */}

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            backgroundColor: "#f4f6f8",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            userSelect: "none",
          }}
        >
          {/* Font size */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "6px 32px 6px 12px",
              fontSize: "14px",
              color: "#333",
              cursor: "pointer",
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg fill="%23666" height="12" width="12" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 12,0 6,6"/></svg>\')',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "12px",
              outline: "none",
            }}
          >
            {[8, 10, 12, 14, 16, 18, 20, 24].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Heading selector */}
          <select
            value={heading}
            onChange={handleHeadingChange}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "6px 32px 6px 12px",
              fontSize: "14px",
              color: "#333",
              cursor: "pointer",
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg fill="%23666" height="12" width="12" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 12,0 6,6"/></svg>\')',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              backgroundSize: "12px",
              outline: "none",
              width: "130px",
            }}
          >
            <option value="p">Paragraph</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
            <option value="h5">H5</option>
            <option value="h6">H6</option>
          </select>

          {["bold", "italic", "underline", "strike"].map((style) => (
            <button
              key={style}
              onClick={() => execCmd(style)}
              style={{
                border: "none",
                backgroundColor: "#fff",
                padding: "6px 12px",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer",
                fontWeight: style === "bold" ? "700" : "400",
                color: style === "bold" ? "#111" : "#444",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e2e8f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
              aria-label={style}
              title={style.charAt(0).toUpperCase() + style.slice(1)}
            >
              {style === "bold" ? "B" : style.charAt(0).toUpperCase()}
            </button>
          ))}

          <button
            onClick={exportAsHTML}
            style={{
              marginLeft: "auto",
              backgroundColor: "#4f46e5",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 3px 8px rgba(79, 70, 229, 0.4)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4338ca")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4f46e5")
            }
          >
            Export
          </button>
        </div>

        {/* Page Navigator UI */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontFamily: "'Segoe UI', Tahoma, sans-serif",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
            width: "fit-content",
            margin: "16px auto",
            marginLeft: "20px",
          }}
        >
          <span style={{ fontWeight: 500, color: "#333" }}>Page</span>

          {/* Up arrow */}
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: currentPage <= 1 ? "#f0f0f0" : "#ffffff",
              color: currentPage <= 1 ? "#aaa" : "#333",
              fontSize: "14px",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            title="Previous Page"
          >
            ▲
          </button>

          {/* Page number input */}
          <input
            type="number"
            min={1}
            max={pages.length}
            value={currentPage}
            onChange={(e) => changePage(Number(e.target.value))}
            style={{
              width: "44px",
              height: "28px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
              color: "#333",
            }}
          />

          {/* Down arrow */}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= pages.length}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor:
                currentPage >= pages.length ? "#f0f0f0" : "#ffffff",
              color: currentPage >= pages.length ? "#aaa" : "#333",
              fontSize: "14px",
              cursor: currentPage >= pages.length ? "not-allowed" : "pointer",
              transition: "all 0.2s ease-in-out",
            }}
            title="Next Page"
          >
            ▼
          </button>

          <span style={{ fontWeight: 500, color: "#333" }}>
            of {pages.length}
          </span>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Editor Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#eaeaea",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <button
              onClick={handleAddPage}
              style={{
                marginBottom: "20px",
                padding: "10px 16px",
                backgroundColor: "#4a4a6a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              ➕ Insert Page Break
            </button>

            {/* Render only the current page */}
            {pages.length > 0 && (
              <div
                key={currentPage - 1}
                ref={(el) => {
                  if (el) pageRefs.current[currentPage - 1] = el;
                }}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) =>
                  handlePageChange(
                    (e.target as HTMLDivElement).innerHTML,
                    currentPage - 1
                  )
                }
                style={{
                  width: "794px",
                  minHeight: "1123px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  padding: "60px 40px",
                  marginBottom: "30px",
                  boxSizing: "border-box",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontFamily,
                  fontSize: fontSize + "px",
                  borderRadius: "6px",
                }}
              >
                {/* Header */}
                <div
                  contentEditable={false}
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "40px",
                    right: "40px",
                    fontSize: "14px",
                    color: "#333",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "5px",
                    userSelect: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="Enter Document Title"
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#444",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      flex: 1,
                    }}
                  />
                </div>

                {/* Editable Content */}
                <div
                  style={{ flex: 1, paddingTop: "40px", paddingBottom: "40px" }}
                ></div>

                {/* Footer */}
                <div
                  contentEditable={false}
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "40px",
                    right: "40px",
                    fontSize: "14px",
                    color: "#999",
                    borderTop: "1px solid #ddd",
                    paddingTop: "5px",
                    textAlign: "center",
                    userSelect: "none",
                  }}
                >
                  Page {currentPage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
