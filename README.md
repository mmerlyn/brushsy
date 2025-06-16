# 𓂃🖊 Brushsy: Your Canvas, Unleashed

## About the Project
Ever wish you had an endless digital whiteboard that just *works*? Brushsy is a modern, interactive drawing application built with React and TypeScript, designed to make your creative process smooth and intuitive. Whether you're sketching out ideas, taking visual notes, or just doodling, Brushsy offers a seamless experience across multiple pages, packed with smart tools and effortless management.

## What You Can Do (Key Features)

* **Drawing Tools:** Select from versatile tools: **Brush (B), Eraser (E), Rectangle (R), Circle (C), and Line (L)**. Navigate with the **Pan (H)** tool, or use **Select (V)** for future enhancements. Each tool is just a single keypress away.
* **Brush Customization:** Adjust your brush's **`Size` (1px to 50px)** and **`Opacity` (1% to 100%)** for precise control over your strokes.
* **Color Palette:** Choose from a **beautifully curated set of predefined colors** or pick **any custom shade** with the intuitive color picker.
* **Quick Actions:** Easily `Undo` (`Ctrl+Z` / `Cmd+Z`) and `Redo` (`Ctrl+Y` / `Cmd+Y`) your strokes. `Toggle Grid` (`G`) visibility for alignment.
* **Page Management:** Create, switch between, and manage an **unlimited number of distinct drawing pages**. A handy indicator shows your current position (e.g., "Page 1 of 5").
* **Undo/Redo History:** Each page maintains its **independent undo/redo history**, tracking **over 500 individual drawing states**. Experiment freely and revert as needed.
* **Export Options:**
    * **PNG Export:** Save your **current active page as a high-fidelity PNG image** (`Ctrl+S` / `Cmd+S`).
    * **PDF Export:** Compile **all whiteboard pages into one professional PDF document** (`Ctrl+P` / `Cmd+P`), perfect for sharing. Powered by `html2canvas` and `jsPDF`.
* **Responsive Design:** Enjoy a clean, intuitive interface that adapts beautifully to any screen size.
* **Theming Options:** Switch between **light and dark modes** to match your preference.
* **Optimized Performance:** Fine-tuned canvas rendering with `willReadFrequently` and optimized drawing logic ensures **smooth interactions**, even with complex content.
* **Title Editing:** Easily **edit and save your artwork's title** directly from the top-left corner.

## Tech Stack

* **React** - The heart of the user interface.
* **TypeScript** - For robust, type-safe code.
* **Tailwind CSS** - For lightning-fast, utility-first styling.
* **HTML Canvas API** - The engine behind the drawing capabilities.
* **jspdf & html2canvas** - Powering seamless PDF generation.
* **uuid** - For generating those all-important unique page IDs.
* **lucide-react** - Providing crisp, customizable icons.


## How to Use Brushsy

* **Drawing:** Head to the left "Tools" panel and pick your weapon of choice (Brush, Eraser, Rectangle, Circle, Line). Adjust `Size` and `Opacity` from the right "Controls" panel. Choose a `Color` from the palette or pick a custom one. Click and drag on the canvas to draw.
* **Panning:** Select the `Pan` tool (H key) and drag the canvas to navigate your workspace.
* **Pages:** The "Pages" section in the right Control panel is your command center. Easily `Add Page`, `Delete` the current page, or click on any page number to jump directly to it.
* **Undoing & Redoing:** Found in the right "Quick Actions" section, or just hit `Ctrl+Z` (`Cmd+Z`) for undo and `Ctrl+Y` (`Cmd+Y`) for redo. (`Ctrl+Shift+Z` also works for redo!)
* **Grid View:** Need to line things up? Just click "Show Grid" in the right panel.
* **Exporting Your Work:**
    * **PNG:** Click "Export PNG" (or `Ctrl+S` / `Cmd+S`) to save the active page as a crisp image.
    * **PDF:** Click "Export PDF" (or `Ctrl+P` / `Cmd+P`) to compile all your beautiful pages into one handy PDF document.
* **Titling Your Masterpiece:** See "Untitled Page" at the top-left? Click it, type your desired title, then hit `Enter` to save or `Escape` to revert.


### Power-User Keyboard Shortcuts

Speed up your workflow with these handy shortcuts:

* **Tools:**
    * `B`: Brush
    * `E`: Eraser
    * `R`: Rectangle
    * `C`: Circle
    * `L`: Line
    * `H`: Pan
    * `V`: Select
* **Actions:**
    * `Ctrl + Z` / `Cmd + Z`: Undo
    * `Ctrl + Y` / `Cmd + Y` (or `Ctrl + Shift + Z` / `Cmd + Shift + Z`): Redo
    * `Ctrl + N` / `Cmd + N`: Add New Page
    * `Ctrl + S` / `Cmd + S`: Export Current Page (PNG)
    * `Ctrl + P` / `Cmd + P`: Export All Pages (PDF)
    * `G`: Toggle Grid
    * `T`: Toggle Tools Panel (left)
    * `C`: Toggle Controls Panel (right)
    * `Escape`: Close any open panels (Tools, Controls, or Title Editor)

## 📄 License

This project is open-source and released under the delightful [MIT License](LICENSE).