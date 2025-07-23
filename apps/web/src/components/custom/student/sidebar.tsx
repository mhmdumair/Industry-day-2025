import { useState } from "react";

export default function ExpandableSidebar() {
  const [expanded, setExpanded] = useState(false);

  // Optional icons for thin mode, you can replace with real icons
  const menuItems = [
    { label: "Home", icon: "🏠", href: "#" },
    { label: "News", icon: "📰", href: "#" },
    { label: "Contact", icon: "📞", href: "#" },
    { label: "About", icon: "ℹ️", href: "#" },
  ];

  return (
    <div className="flex h-screen">
      <nav
        className={`
          flex flex-col items-center bg-white shadow-md h-full
          transition-width duration-300 ease-in-out
          overflow-hidden
          ${expanded ? "w-30 p-1" : "w-10 p-1"}
        `}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-2 self-end p-1 rounded hover:bg-gray-200"
          aria-label="Toggle sidebar"
        >
          {expanded ? "⬅️" : "➡️"}
        </button>
        
        <ul className="flex flex-col items-center list-none">
          {menuItems.map(({ label, icon, href }) => (
            <li key={label} className="my-1">
              <a
                href={href}
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 rounded px-1 py-1"
                title={label} // Show full label on tooltip in collapsed mode
              >
                <span className="text-lg">{icon}</span>
                {expanded && <span>{label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

     </div>
  );
}
