# Sveltlana

✨ **Beautiful headless Svelte components** - Build stunning UIs with unstyled, accessible components.

Sveltlana provides a collection of headless Svelte components built primarily with Tailwind CSS classes and tailwind-merge for styling utilities, offering maximum flexibility while maintaining excellent accessibility and developer experience. Style them using Tailwind CSS utility classes and merge functions for full control.

## 🚀 Quick Start

### Install components via CLI

```bash
# List available components
npx sveltlana list

# Add a single component
npx sveltlana add Modal

# Add multiple components
npx sveltlana add Accordion Carousel Dropdown

# Remove a component
npx sveltlana remove Modal
# or use the alias
npx sveltlana rm Modal

# Remove multiple components  
npx sveltlana rm Accordion Carousel
```

> **Note**: Some components require `tailwind-merge` for styling utilities. Install it if needed:
> ```bash
> npm install tailwind-merge
> ```

### Install as package

```bash
npm install sveltlana
```

## 📦 Available Components

- **📦 Accordion** - Collapsible content panels
- **📦 Carousel** - Image/content carousel with touch support
- **📦 Dropdown** - Flexible dropdown menus
- **🧩 Modal** - Accessible modal dialogs
- **🧩 ImageModal** - Zoomable image viewer with gestures
- **📦 Popover** - Floating content containers
- **📦 Swipable** - Touch-friendly swipe interactions
- **📦 Navbar** - Sticky navigation bar
- **⚡ Actions** - Utility actions (clickOutside, intersectionObserver, resizeObserver)

## 🎯 Usage Examples

### Using the CLI (Recommended)

```bash
# Add a single component
npx sveltlana add Modal

# Use in your Svelte component
<script>
  import Modal from '$lib/sveltlana/Modal.svelte';
  
  let isOpen = false;
</script>

<Modal {isOpen}>
  <h2>Hello World!</h2>
  <p>This is a modal dialog.</p>
</Modal>
```

### Using as npm package

```bash
npm install sveltlana
```

```svelte
<script>
  import { Accordion } from 'sveltlana/Accordion';
</script>

<Accordion>
  <!-- Your accordion content -->
</Accordion>
```

## 🛠️ CLI Commands

```bash
# List all available components
npx sveltlana list

# Add a single component
npx sveltlana add Modal

# Add multiple components  
npx sveltlana add Accordion Carousel Dropdown

# Remove a single component
npx sveltlana remove Modal
# or use the alias
npx sveltlana rm Modal

# Remove multiple components
npx sveltlana rm Accordion Carousel

# Add component with dependencies
npx sveltlana add Modal --deps

# Custom output directory
npx sveltlana add Modal --output ./src/components
npx sveltlana rm Modal --output ./src/components
```

## ✨ Features

- 🎨 **Completely unstyled** - Bring your own styles
- ♿ **Accessible by default** - ARIA compliant
- 📱 **Mobile-first** - Touch gestures and responsive
- 🔧 **TypeScript support** - Full type safety
- 🚀 **Zero dependencies*** - Lightweight and fast
- 🎯 **Svelte 5 ready** - Built with latest Svelte features

*CLI requires `fs-extra` and `commander` for file operations

## 🏗️ Development

```bash
# Clone repository
git clone https://github.com/MordechaiHadad/sveltlana.git
cd sveltlana

# Install dependencies
bun install

# Start development server
bun run dev

# Build library
bun run package

# Build CLI
bun run build:cli
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to help improve Sveltlana.

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/MordechaiHadad/sveltlana/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/MordechaiHadad/sveltlana/discussions)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/MordechaiHadad/sveltlana/wiki)

---

Built with ❤️ using [Svelte](https://svelte.dev) and [SvelteKit](https://kit.svelte.dev)
