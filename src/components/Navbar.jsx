import React, { useState, useRef, useEffect } from "react";
import { Home, ArchiveX, ChevronDown, ListCheck } from "lucide-react";
import "./Navbar.css";
import { t } from "../i18n-simple";
import { useLanguage } from "../contexts/LanguageContext";
import { NavLink } from "react-router-dom";
import { PATHS } from "../paths";

function RegularMenuItem({ item, handleKeyDown }) {
  return (
    <NavLink
      data-item-id={item.id}
      to={item.href}
      className="navbar-link"
      role="menuitem"
      onKeyDown={(e) => handleKeyDown(e, item.id, false)}
    >
      <item.icon className="navbar-icon" />
      {item.label}
    </NavLink>
  );
}

function DropdownMenuItem({
  handleSubmenuKeyDown,
  handleKeyDown,
  activeDropdown,
  setActiveDropdown,
  item,
}) {
  return (
    <>
      <button
        data-item-id={item.id}
        className="navbar-button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={activeDropdown === item.id}
        onKeyDown={(e) => handleKeyDown(e, item.id, true)}
        onClick={() =>
          setActiveDropdown(activeDropdown === item.id ? null : item.id)
        }
        onMouseEnter={() => setActiveDropdown(item.id)}
      >
        <item.icon className="navbar-icon" />
        {item.label}
        <ChevronDown
          className={`navbar-chevron ${activeDropdown === item.id ? "navbar-chevron--rotated" : ""}`}
        />
      </button>

      {activeDropdown === item.id && (
        <DropDownMenu
          handleSubmenuKeyDown={handleSubmenuKeyDown}
          setActiveDropdown={setActiveDropdown}
          item={item}
        />
      )}
    </>
  );
}

function DropDownMenu({ handleSubmenuKeyDown, setActiveDropdown, item }) {
  return (
    <div
      data-submenu={item.id}
      className="navbar-dropdown"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={`menu-button-${item.id}`}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="navbar-dropdown-content">
        {item.children.map((child, index) => (
          <NavLink
            key={child.id}
            data-submenu-index={index}
            to={child.href}
            className="navbar-dropdown-item"
            role="menuitem"
            onKeyDown={(e) =>
              handleSubmenuKeyDown(e, item.id, item.children, index)
            }
          >
            {child.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const menubarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { forceUpdate } = useLanguage();

  // Configuration des éléments de navigation
  const navItems = [
    {
      ...PATHS.HOME,
      icon: Home,
      label: t("Accueil"),
    },
    {
      ...PATHS.TODOS,
      icon: ListCheck,
      label: t("Tâches"),
      children: [
        {
          ...PATHS.TODOS,
          label: t("Tâches"),
        },
        {
          ...PATHS.ARCHIVES,
          label: t("Tâches archivées"),
        },
      ],
    },
  ];

  // Navigation clavier principale
  const handleKeyDown = (event, itemId, hasChildren = false) => {
    const items = navItems;
    const currentIndex = items.findIndex((item) => item.id === itemId);

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        const nextItem = menubarRef.current?.querySelector(
          `[data-item-id="${items[nextIndex].id}"]`,
        );
        nextItem?.focus();
        break;

      case "ArrowLeft":
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        const prevItem = menubarRef.current?.querySelector(
          `[data-item-id="${items[prevIndex].id}"]`,
        );
        prevItem?.focus();
        break;

      case "ArrowDown":
        if (hasChildren) {
          event.preventDefault();
          setActiveDropdown(itemId);
          setTimeout(() => {
            const firstSubmenuItem = document.querySelector(
              `[data-submenu="${itemId}"] [role="menuitem"]:first-child`,
            );
            firstSubmenuItem?.focus();
          }, 0);
        }
        break;

      case "Enter":
      case " ":
        if (hasChildren) {
          event.preventDefault();
          setActiveDropdown(activeDropdown === itemId ? null : itemId);
        }
        break;

      case "Escape":
        event.preventDefault();
        setActiveDropdown(null);
        break;
    }
  };

  // Navigation clavier dans les sous-menus
  const handleSubmenuKeyDown = (event, parentId, children, currentIndex) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        const nextIndex = currentIndex < children.length - 1 ? currentIndex + 1 : 0;
        const nextItem = document.querySelector(
          `[data-submenu="${parentId}"] [data-submenu-index="${nextIndex}"]`,
        );
        nextItem?.focus();
        break;

      case "ArrowUp":
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : children.length - 1;
        const prevItem = document.querySelector(
          `[data-submenu="${parentId}"] [data-submenu-index="${prevIndex}"]`,
        );
        prevItem?.focus();
        break;

      case "ArrowLeft":
      case "Escape":
        event.preventDefault();
        setActiveDropdown(null);
        const parentItem = menubarRef.current?.querySelector(
          `[data-item-id="${parentId}"]`,
        );
        parentItem?.focus();
        break;

      case "Tab":
        setActiveDropdown(null);
        break;
    }
  };

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menubarRef.current && !menubarRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Toggle menu"]')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div
          ref={menubarRef}
          className="navbar-menubar"
          role="menubar"
          aria-label="Main menu"
        >
          {navItems.map((item) => (
            <div key={item.id} className="navbar-item">
              {item.children ? (
                <DropdownMenuItem
                  handleKeyDown={handleKeyDown}
                  handleSubmenuKeyDown={handleSubmenuKeyDown}
                  item={item}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                />
              ) : (
                <RegularMenuItem item={item} handleKeyDown={handleKeyDown} />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
