# Fold Design

Fold Design is a Node.js project that uses StyleDictionary to generate the design tokens used in Fold. 

This README file is intended to provide developers with the necessary information to get started with the project, contribute, and understand its structure.

## Table of Contents

- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Getting Started

### Prerequisites

Ensure you have the following prerequisites installed:

> The project uses Node v18, however any version 16+ should work.

- [Node](https://nodejs.org/) - v18.17.1
- [Npm](https://www.npmjs.com/) (Node Package Manager) - v9.6.7

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/fold-dev/fold.git
   ```

2. Navigate to the project directory:

   ```bash
   cd fold/packages/design
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

Please see `config.js` for output configuration. More detailed guide coming soon.

## Usage

```bash
# Builds token file
npm run build

# Watch build using nodemon
npm run watch
```

Yarn is also acceptable, but be sure to replace `npm` with `Yarn` in the `package.json` `watch` script.

For more information on how to integrate the generated design tokens, 
please see our [theming](http://fold.dev/docs/theming) guide.

## Contributing

We are not actively looking for contributers at this time, however you are very welcome to contribute by submitting a PR. 

Here is how you can submit a pull request:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License (as part of Fold)

## Acknowledgments

Some tokens, in part, were inspired by other great OSS UI libraries:

- [Symantic UI](https://github.com/Semantic-Org/Semantic-UI)
- [Chakra UI](https://github.com/chakra-ui/chakra-ui)
- [Mantine](https://github.com/mantinedev/mantine)

If you have any questions about this, please  [reach out](https://github.com/fold-dev/fold/discussions) to us.
