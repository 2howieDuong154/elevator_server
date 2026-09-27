# Elevator Server

An elevator dispatcher and simulation system that models a multi-elevator building and assigns incoming requests to the optimal elevator using a cost-based scheduling algorithm. The server runs a real-time simulation loop and broadcasts elevator states to connected clients via WebSocket.

## Features

- **Multi-Elevator Simulation**: Models multiple elevators with realistic physics and constraints
- **Cost-Based Scheduling**: Intelligent algorithm that assigns requests to the optimal elevator based on distance, current load, and direction
- **Real-Time Simulation**: Continuous simulation loop that updates elevator states
- **WebSocket Communication**: Broadcasts elevator states and building information to connected clients
- **Request Queue Management**: Efficiently handles incoming elevator requests with priority handling

## Technology Stack

- **TypeScript** (97.6%) - Core application logic
- **HTML** (2.4%) - Web interface
- **WebSocket** - Real-time client communication
- **Node.js** - Runtime environment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/2howieDuong154/elevator_server.git
cd elevator_server

# Install dependencies
npm install
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

The server will start on the default port and begin broadcasting elevator states to connected WebSocket clients.

## Architecture

### Core Components

- **Elevator Simulator**: Manages individual elevator behavior including movement, speed, and capacity
- **Dispatcher**: Cost-based algorithm that assigns incoming requests to the optimal elevator
- **Building Model**: Represents the building structure with floors and destinations
- **WebSocket Server**: Handles real-time communication with clients

### Algorithm

The dispatcher uses a cost-based scheduling algorithm that considers:
- Distance to the request floor
- Current direction of travel
- Elevator load/capacity
- Queue size
- Current floor position

## API

### WebSocket Messages

The server broadcasts elevator states and accepts requests through WebSocket messages. Clients receive real-time updates about:
- Elevator positions
- Floor destinations
- Movement direction
- Request queue status

### Requesting an Elevator

Send an elevator request with:
- Source floor
- Destination floor
- Priority level (optional)

## Development

### Project Structure

```
elevator_server/
├── src/              # TypeScript source files
├── dist/             # Compiled JavaScript
├── index.html        # Web interface
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or suggestions, please open an issue on the GitHub repository.
