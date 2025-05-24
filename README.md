# ntfy-me-mcp 📤

![GitHub Release](https://img.shields.io/github/release/Dieg0ski/ntfy-me-mcp.svg)  
[Download Latest Release](https://github.com/Dieg0ski/ntfy-me-mcp/releases)  

Welcome to **ntfy-me-mcp**, an efficient server designed to send notifications to your self-hosted ntfy server. This project supports secure token authentication and can be run using either `npx` or Docker. 

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

**ntfy-me-mcp** simplifies the process of sending notifications to your self-hosted ntfy server. By leveraging the Model Context Protocol (MCP), it allows for a seamless experience in managing notifications. Whether you are an individual developer or part of a larger team, this tool provides a reliable way to handle notifications.

## Features

- **Secure Token Authentication**: Protect your notifications with token-based security.
- **Easy to Use**: Get started quickly with minimal setup.
- **Docker Support**: Run your server in a containerized environment.
- **Cross-Platform**: Compatible with both Linux and Windows systems.
- **Lightweight**: Designed to use minimal resources while maintaining performance.

## Installation

To get started with **ntfy-me-mcp**, follow these simple steps.

### Prerequisites

Before installing, ensure you have the following:

- Node.js installed (for `npx` usage)
- Docker installed (for container usage)
- Access to a self-hosted ntfy server

### Using npx

1. Open your terminal.
2. Run the following command:

   ```bash
   npx ntfy-me-mcp
   ```

This command will fetch the latest version and run it directly.

### Using Docker

1. Pull the Docker image:

   ```bash
   docker pull dieg0ski/ntfy-me-mcp
   ```

2. Run the Docker container:

   ```bash
   docker run -d dieg0ski/ntfy-me-mcp
   ```

### Configuration

After installation, configure your server settings in the configuration file. Ensure you set the appropriate environment variables for your token authentication.

## Usage

Once installed, you can start sending notifications to your ntfy server.

### Sending a Notification

To send a notification, use the following command:

```bash
npx ntfy-me-mcp send "Your notification message"
```

### Secure Token Authentication

To use secure token authentication, pass your token as an environment variable:

```bash
TOKEN=your_secure_token npx ntfy-me-mcp send "Your notification message"
```

### Docker Usage

If you are using Docker, you can pass the token as an environment variable when running the container:

```bash
docker run -e TOKEN=your_secure_token dieg0ski/ntfy-me-mcp send "Your notification message"
```

## Contributing

We welcome contributions to **ntfy-me-mcp**! If you have suggestions or improvements, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your branch to your forked repository.
5. Create a pull request.

Please ensure your code adheres to our coding standards and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please reach out via GitHub issues or contact the project maintainer directly.

[Download Latest Release](https://github.com/Dieg0ski/ntfy-me-mcp/releases)  

Explore the **Releases** section for the latest updates and changes. If you encounter any issues, feel free to check there for solutions or updates.

---

Thank you for using **ntfy-me-mcp**! We hope it enhances your notification management experience.