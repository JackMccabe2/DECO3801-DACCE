# DECO3801-DACCE

### Starting the DACCE Project in dev mode

Welcome to Cool Hack Game!

To run the game there are a couple of dependencies:
- Firstly, a functioning database (refer to README in Database folder)
- Secondly, Docker must be installed

To run the game, enter this in command line:
- create a '.env' file in this directory with the following structure:

    POSTGRES_USER=user
    POSTGRES_PASSWORD=password
    POSTGRES_DB=database

    import your values created from the database initialization.

- next, run the following command in the terminal:

    docker-compose up --build

    Which will run the game on your local computer.
    To access the game, click on or type in: 
        "http://localhost:5173/"

# AI-Driven Cryptographic Puzzle Generator

This project is a Python-based adaptive learning system that generates cryptographic puzzles to teach real-world cybersecurity concepts such as AES, RSA, Caesar Ciphers, Base64 encoding, and more.

Puzzles are generated through a combination of handcrafted logic and an AI model (a Variational Autoencoder, or VAE) that adapts difficulty based on user performance.

## Features

- AES encryption components: SubBytes, ShiftRows, MixColumns, XOR
- Classic ciphers: Caesar, Vigenère, Substitution
- Modern decryption challenges: RSA, Base64 token decoding
- Adaptive difficulty using a trained AI model
- Each puzzle includes UUID metadata, question prompts, and answers
- Integration with PostgreSQL for gameplay data and difficulty calibration

## AI Integration

A trained Variational Autoencoder (VAE) is used to:

- Encode puzzle performance into a latent difficulty space
- Generate new puzzles based on a difficulty vector
- Continuously update based on game data

# VAE Puzzle Difficulty Model

This module defines and trains a **Variational Autoencoder (VAE)** to model and generate puzzle difficulty vectors based on historical gameplay data. It is a key component of an adaptive learning system for generating cryptographic puzzles with personalized difficulty levels.

## Purpose

- Learn a compact latent representation of puzzle difficulty using game-related features.
- Generate new difficulty vectors to drive puzzle generation logic in `game_ai.py`.
- Integrate with a PostgreSQL database to fetch gameplay data.
- Save trained model weights for later inference.

## Core Components

### Classes

- `Encoder`: Encodes input data into a latent mean and log variance.
- `Decoder`: Decodes latent vectors back to the input feature space.
- `VAE`: Full Variational Autoencoder combining the encoder, decoder, and reparameterization trick.

### Key Functions

- `train_vae(model, data_loader, epochs, lr)`: Trains the VAE on game data.
- `generate_puzzle(model, difficulty_vector)`: Uses the decoder to generate a difficulty vector.
- `fetch_puzzle_data()`: Connects to a PostgreSQL database and fetches relevant game result data.
