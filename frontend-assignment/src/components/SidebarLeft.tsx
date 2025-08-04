import React from "react";
import { FileText, Layers, Book, PenTool } from "lucide-react";

const SidebarLeft: React.FC = () => (
  <aside className="sidebar-left">
    <div className="app-logo">
      <FileText size={40} />
    </div>
    <h2>Vettam.AI</h2>
    <nav>
      <ul>
        <li><Layers size={18} /> Workspace</li>
        <li><Book size={18} /> Research</li>
        <li><PenTool size={18} /> Write</li>
      </ul>
    </nav>
  </aside>
);

export default SidebarLeft;
