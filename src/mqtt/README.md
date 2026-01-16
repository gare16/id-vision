# MQTT Topic System

This directory contains the MQTT topic handling system for the RFID application.

## Topics

### `rfid/check`
- Used for checking RFID tag validity and getting access information
- Publish data in the format defined by `RFIDPayloadSchema`
- The system responds with validation results

### `rfid/logs`
- Used for creating visitor logs automatically when RFID tags are scanned
- Publish RFID event data to automatically create log entries in the database
- The system responds with log creation status

## Architecture

- `topic-handler.interface.ts`: Defines the interface for topic handlers
- `rfid-check-topic.handler.ts`: Handles the rfid/check topic
- `rfid-logs-topic.handler.ts`: Handles the rfid/logs topic with automatic log creation
- `topic-manager.ts`: Manages multiple topic handlers
- `publish-utils.ts`: Utility functions for publishing messages to topics

## Usage

The system is integrated into the MQTT context and automatically handles messages when published to the respective topics.