# Whispr

Whispr is an anonymous, self-destructing chat application built with **Next.js**. It prioritizes privacy, real-time communication, and secure user isolation. Conversations self-destruct after use, and user sessions cannot be reused in different browsers — even if tokens are stolen.

## Features

- 🛡️ **Anonymous chat** (no persistent identities)
- ⏳ **Self-destructing messages**
- 🚀 **Real-time messaging** using **[Next WS](https://www.npmjs.com/package/next-ws)**
- 🔐 **End-to-end encryption (E2EE)** powered by **WebCrypto**
- 🔑 **ECDSA key pairs** for session-bound authentication
- 🧪 **Automated testing**
- 📦 **CI/CD builds Docker images**
- ⚙️ **Rate limiting** via Redis
- 🗄️ **PostgreSQL** for persistent storage
- 🐳 **Docker Compose** orchestrates Redis, Postgres, and the app
