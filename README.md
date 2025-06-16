# 𓂃🖊 Brushsy: Your Canvas, Unleashed

## About the Project
Ever wish you had an endless digital whiteboard that just *works*? Brushsy is a modern, interactive drawing application built with React and TypeScript, designed to make your creative process smooth and intuitive. Whether you're sketching out ideas, taking visual notes, or just doodling, Brushsy offers a seamless experience across multiple pages, packed with smart tools and effortless management.

## What You Can Do (Key Features)

* **Dive into Diverse Drawing:** Pick your perfect tool from a versatile set including **Brush (B), Eraser (E), Rectangle (R), Circle (C), and Line (L)**. Need to move around? Grab the **Pan (H)** tool, or switch to **Select (V)** for future creative enhancements. Each tool is just a single keypress away!
* **Fine-Tune Your Strokes:** Get exactly the look you want by adjusting your brush's **`Size` (from a precise 1px up to a bold 50px)** and its **`Opacity` (from a delicate 1% to a solid 100%)**.
* **Unleash Your Colors:** Choose from a **beautifully curated palette of predefined colors**, or truly make it your own by picking **any custom shade** with the intuitive color picker. Your canvas, your colors!
* **Effortless Control & Quick Actions:** Mistakes happen – easily `Undo` (`Ctrl+Z` / `Cmd+Z`) and `Redo` (`Ctrl+Y` / `Cmd+Y`) your strokes, and `Toggle Grid` (`G`) visibility to keep everything aligned.
* **Infinite Page Management:** Never run out of space! Create, switch between, and manage an **unlimited number of distinct drawing pages**. A handy indicator always shows which page you're on (e.g., "Page 1 of 5"), making navigation a breeze.
* **Robust Creative History:** Feel free to experiment! Every page keeps its own **independent undo/redo history**, capable of tracking **over 500 individual drawing states**. Revert, refine, and iterate without fear.
* **Smart Export Options:**
    * **Quick PNG:** Export your **current active page as a high-fidelity PNG image** with a simple `Ctrl+S` / `Cmd+S`.
    * **Full PDF Document:** Compile **all your whiteboard pages into one professional PDF document** (`Ctrl+P` / `Cmd+P`), perfect for sharing or archiving. Thanks to `html2canvas` and `jsPDF`, your artwork looks just as good on paper!
* **Sleek & Responsive Design:** Enjoy a clean, intuitive interface that adapts beautifully to any screen size. All controls are right where you need them.
* **Personalized Theming:** Choose between a **crisp light mode and a comfortable dark mode** to match your workspace and preferences.
* **Performance that Keeps Up:** We've fine-tuned the canvas rendering by implementing `willReadFrequently` and optimizing drawing logic. This means **smooth, responsive drawing and interactions**, even when your canvases get packed with detail.
* **Dynamic Document Titles:** Give your masterpiece a name! Easily **edit and save the title of your artwork** directly from the top-left corner.

## Tech Stack

* **React** - The heart of the user interface.
* **TypeScript** - For robust, type-safe code.
* **Tailwind CSS** - For lightning-fast, utility-first styling.
* **HTML Canvas API** - The engine behind the drawing capabilities.
* **jspdf & html2canvas** - Powering seamless PDF generation.
* **uuid** - For generating those all-important unique page IDs.
* **lucide-react** - Providing crisp, customizable icons.


## How to Use Brushsy

* **Drawing:** Head to the left "Tools" panel and pick your weapon of choice (Brush, Eraser, Rectangle, Circle, Line). Adjust `Size` and `Opacity` from the right "Controls" panel. Choose a `Color` from the palette or pick a custom one. Now, simply click and drag on the canvas to unleash your creativity!
* **Moving Around:** Select the `Pan` tool (H key) and drag the canvas to navigate your workspace.
* **Managing Pages:** The "Pages" section in the right Control panel is your command center. Easily `Add Page`, `Delete` the current page, or click on any page number to jump directly to it.
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

## Contributing

Got ideas? Found a bug? We'd love your help! Feel free to open an issue or submit a pull request. Let's make Brushsy even better together!

## 📄 License

This project is open-source and released under the delightful [MIT License](LICENSE).