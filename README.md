# Sveltlana

✨ **Beautiful headless Svelte components** - Build stunning UIs with unstyled, accessible components.

Sveltlana provides a collection of headless Svelte components built primarily with Tailwind CSS classes and tailwind-merge for styling utilities, offering maximum flexibility while maintaining excellent accessibility and developer experience. Style them using Tailwind CSS utility classes and merge functions for full control.

## 🚀 Quick Start

### Install components via CLI

```bash
# List available components
npx sveltlana list

# Add a single component
npx sveltlana add Dropdown

# Add multiple components
npx sveltlana add Accordion Dropdown

# Remove a component
npx sveltlana remove Dropdown
# or use the alias
npx sveltlana rm Dropdown

# Remove multiple components
npx sveltlana rm Accordion Dropdown
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
- **🧩 Marquee** - Continuously scrolling, looping content banners
- **📦 Dropdown** - Flexible dropdown menus
- **📦 AlertDialog** - Confirmation dialogs
- **📦 Combobox** - Searchable selection controls
- **📦 Popover** - Floating content containers
- **📦 Swipable** - Touch-friendly swipe interactions
- **📦 Navbar** - Sticky navigation bar
- **🧩 TextInput** - Styled form input
- **⚡ Actions** - Utility actions (clickOutside, intersectionObserver, resizeObserver)

## 🎯 Usage Examples

### Using the CLI (Recommended)

```bash
# Add a single component
npx sveltlana add Dropdown

# Use in your Svelte component
<script>
  import Dropdown from '$lib/sveltlana/components/Dropdown/index.js';
</script>

<Dropdown>
  <Dropdown.Trigger>Open menu</Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item>First option</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
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

### Scrolling marquee

```svelte
<script>
  import Marquee from 'sveltlana/Marquee';
</script>

<Marquee duration={24} gap="2rem" aria-label="Featured brands">
  <span>Brand one</span>
  <span>Brand two</span>
  <span>Brand three</span>
</Marquee>
```

## 🛠️ CLI Commands

```bash
# List all available components
npx sveltlana list

# Add a single component
npx sveltlana add Dropdown

# Add multiple components
npx sveltlana add Accordion Dropdown

# Remove a single component
npx sveltlana remove Dropdown
# or use the alias
npx sveltlana rm Dropdown

# Remove multiple components
npx sveltlana rm Accordion Dropdown

# Add component with dependencies
npx sveltlana add Dropdown --deps

# Custom output directory
npx sveltlana add Dropdown --output ./src/components
npx sveltlana rm Dropdown --output ./src/components
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
