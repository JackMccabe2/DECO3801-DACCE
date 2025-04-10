import random
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from VAE import vae_model
from torch.utils.data import DataLoader, TensorDataset
import psycopg2
import Database

def aes():
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
    import os

    key_word = "cipher"
    key_bytes = key_word.encode('utf-8').ljust(16, b'_')  # 16 bytes
    key_hex_hint = key_word.encode('utf-8').hex()

    plaintext = b'ACCESSGRANTED!' 
    iv = os.urandom(16)

    pad_len = 16 - (len(plaintext) % 16)
    padded = plaintext + bytes([pad_len] * pad_len)

    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded) + encryptor.finalize()

    print("\n--- AES Challenge ---")
    print("Ciphertext:", ciphertext.hex())
    print("IV:", iv.hex())
    print(f"Hint: The key is hex-encoded in this string: {key_hex_hint}")
    print("Decode the key!")

    guess = input("Enter the decrypted plaintext: ").strip()
    if guess.encode() == plaintext:
        print("✅ Success! You've decrypted the message.")
        return True
    else:
        print(f"❌ Incorrect! The correct plaintext was: {plaintext.decode()}")
        return False
    
def caesar_cipher_puzzle():
    print("\n Caesar Cipher Puzzle\n")

    shift = random.randint(1, 25)
    answer = "SECURE"
    ciphertext = ''.join(chr(((ord(c) - 65 + shift) % 26) + 65) for c in answer)

    print(f"Encrypted Message: {ciphertext}")
    print("Hint: It's a Caesar cipher (A-Z only), and the original word is a 6-letter word.")
    guess = input("Enter the original word: ").strip().upper()

    if guess == answer:
        print("Nice job! You cracked the Caesar cipher.")
    else:
        print(f"Nope! The correct answer was: {answer}")

def xor_aes():
    import random

    print("\nXOR Puzzle - Learn AddRoundKey!\n")
    # can change the range here as a difficulty parameter
    plaintext = bytes([random.randint(0, 255) for _ in range(2)])
    key = bytes([random.randint(0, 255) for _ in range(2)])
    expected = bytes([p ^ k for p, k in zip(plaintext, key)])

    print(f"Plaintext : {plaintext.hex()}")
    print(f"Key       : {key.hex()}")
    print("Enter the result of XOR-ing each byte:")

    answer = input("Your answer: ").strip().lower()

    if answer == expected.hex():
        print("Correct!")
    else:
        print(f"Not quite! The correct answer was: {expected.hex()}")

def play_puzzle(puzzle_vector):

    key_length = int(1024 + puzzle_vector[1] * 2048)
    steps = int(2 + puzzle_vector[2] * 8)
    entropy = round(puzzle_vector[3], 2)
    solution_length = 6

    print("\n=== Hacking Challenge ===")
    print(f"Key Length: {key_length}-bit")
    print(f"Steps Required: {steps}")
    print(f"Entropy Level: {entropy}")
    print(f"Solution Length: {solution_length} bytes")
    xor_aes()

# Generating a new puzzle
def generate_puzzle(model, difficulty_vector):
    with torch.no_grad():
        generated_puzzle = model.decoder(difficulty_vector)
    return generated_puzzle.numpy()

# Constants
INPUT_DIM = 6     
LATENT_DIM = 3     
EPOCHS = 20
BATCH_SIZE = 16
LEARNING_RATE = 0.001

def fetch_puzzle_data():
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="georgiadocherty",
        password="D4t4b4se",
        port=5432
    )

    cur = conn.cursor()
    # Need to select games info per session too.
    query = """ 
        SELECT
            encipher_skill,
            firewall_skill
        FROM players
    """

    cur.execute(query) 
    rows = cur.fetchall() # store

    for row in rows:
        print(row)  # test for if prints like the sample puzzle_data below

    cur.close()
    conn.close()

    # will adjust puzzle rows to be model-parseable here.
    
    return rows

fetch_puzzle_data()

# Sample dataset 
puzzle_data = np.array([
    [1, 0.5, 0.2, 0.7, 0.4, 0.3],  
    [0, 0.8, 0.5, 0.6, 0.2, 0.1],
    [1, 0.4, 0.3, 0.9, 0.6, 0.7],
    [0, 0.6, 0.4, 0.8, 0.3, 0.5]
], dtype=np.float32)

"""
puzzle_id	UUID	Unique ID for each puzzle
puzzle_type	TEXT	“AES”, “Firewall”, etc.
key_length	INTEGER	Raw key size (e.g., 2048)
steps	INTEGER	Number of encryption/decryption steps
entropy	FLOAT	Complexity rating
solution_length	INTEGER	Length of expected answer
randomness_factor	FLOAT	Randomness factor in generation
time_taken	FLOAT	How long the user took (seconds)
num_incorrect	INTEGER	Number of failed attempts
solved	BOOLEAN	Did the user succeed
"""

# initialize model
vae_model.load_state_dict(torch.load("vae_model.pth"))
vae_model.eval()
# play
difficulty_vector = torch.tensor([0.7, 0.6, 0.5]) 
generated_puzzle = generate_puzzle(vae_model, difficulty_vector)

print("\nGenerated Puzzle:", generated_puzzle)
play_puzzle(generated_puzzle) 