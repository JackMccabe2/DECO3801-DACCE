import random
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from VAE import vae_model
from torch.utils.data import DataLoader, TensorDataset
import psycopg2
import Database
import json
import sys

def aes():
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
    import os

    key_word = "cipher"
    key_bytes = key_word.encode('utf-8').ljust(16, b'_')  # pad to 16 bytes
    key_hex_hint = key_word.encode('utf-8').hex()

    plaintext = b'ACCESSGRANTED!' 
    iv = os.urandom(16)

    # Pad plaintext to 16-byte block
    pad_len = 16 - (len(plaintext) % 16)
    padded = plaintext + bytes([pad_len] * pad_len)

    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded) + encryptor.finalize()

    question = (
    f"Decrypt the AES-CBC ciphertext. "
    f"Ciphertext: {ciphertext.hex()} | "
    f"IV: {iv.hex()} \n "
    f"Hint: The key is hex-encoded in this string: {key_hex_hint} | "
    f"Provide the ASCII plaintext."
)

    return {
        "type": "AES",
        "question": question,
        "answer": plaintext.decode()  # "ACCESSGRANTED!"
    }
    
def caesar_cipher_puzzle():
    shift = random.randint(1, 25)
    answer = "SECURE"
    ciphertext = ''.join(chr(((ord(c) - 65 + shift) % 26) + 65) for c in answer)

    question = (
        f"Caesar Cipher Puzzle: Decrypt the following 6-letter ciphertext.\n"
        f"Ciphertext: {ciphertext} | Hint: The shift used is {shift} \n"
        f"Original word is uppercase A–Z only."
    )

    return {
        "type": "ceasar_cipher",
        "question": question,
        "answer": answer
    }

# the following puzzles of AES aim to break up the steps used in AES decryption
# and teach them seperately

def subbytes_aes():
    # the scale for this question is too large right now!! (too difficult)
    s_box = [
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
        0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76
    ]

    # Generate a short 4-byte input for simplicity
    input_block = bytes([random.randint(0, 15) for _ in range(4)])
    expected = bytes([s_box[b] for b in input_block])
    question = (
    f"SubBytes Puzzle: Use the AES S-box to substitute the following 4 bytes.\n"
    f"Input: {input_block.hex()} | "
    f"S-box: {s_box} | "
    f"Return the substituted output as 8 hex characters (no spaces)."
)
    return {
        "type": "AES_sub_bytes",
        "question": question,
        "answer": expected.hex()
    }

def shiftrows_aes():
    # Generate a 16-byte block as a 4x4 matrix (0 to 15)
    block = [i for i in range(16)]

    # Convert columns into rows
    state = [block[i::4] for i in range(4)]

    # Apply AES ShiftRows (row 0 unchanged, row 1 shifted 1 left, etc.)
    for r in range(4):
        state[r] = state[r][r:] + state[r][:r]

    # Flatten back to column-major order
    shifted = [state[i % 4][i // 4] for i in range(16)]
    expected = ''.join([format(b, '02x') for b in shifted])

    question = (
        f"ShiftRows Puzzle: Perform AES ShiftRows on the 4x4 state.\n"
        f"Original block (column-major order): {block}\n"
        f"\nSubmit the result as a hex string."
    )

    return {
        "type": "AES_shift_rows",
        "question": question,
        "answer": expected
    }

def mixcolumns_aes():
    # Generate a simplified AES-style column and mix vector
    column = [random.randint(0, 255) for _ in range(4)]
    mix_vector = [2, 1, 1, 3]  # simplified coefficients

    # Simulate MixColumns using simplified (mod 256) arithmetic
    mixed = [(column[i] + mix_vector[i]) % 256 for i in range(4)]
    expected = ''.join([format(b, '02x') for b in mixed])

    #(add each byte mod 256)
    question = (
        f"MixColumns Puzzle: Apply simplified MixColumns .\n"
        f"Input column: {column} | Mix vector: {mix_vector} | "
        f"Return the result as an 8-character hex string."
    )

    return {
        "type": "AES_mix_columns",
        "question": question,
        "answer": expected
    }

def xor_aes():
    import random
    # can change the range here as a difficulty parameter
    plaintext = bytes([random.randint(0, 255) for _ in range(2)])
    key = bytes([random.randint(0, 255) for _ in range(2)])
    expected = bytes([p ^ k for p, k in zip(plaintext, key)])
    
    question = "instruction: Enter the hex result of XOR-ing each byte \nplaintext: ", plaintext.hex(), "\nkey: ", key.hex()
    
    return {
        "type": "xor",
        "question": question,
        "answer": expected.hex()
    }

def play_puzzle(puzzle_vector):

    key_length = int(1024 + puzzle_vector[1] * 2048)
    steps = int(2 + puzzle_vector[2] * 8)
    entropy = round(puzzle_vector[3], 2)
    solution_length = 4

    # difficulty parameters
    #print(f"Key Length: {key_length}-bit")
    #print(f"Steps Required: {steps}")
    #print(f"Entropy Level: {entropy}")
    #print(f"Solution Length: {solution_length} bytes")
    type, question, answer = xor_aes()
    return type, question, answer

# Generating a new puzzle
def generate_puzzle(model, difficulty_vector):
    with torch.no_grad():
        generated_puzzle = model.decoder(difficulty_vector)
    return generated_puzzle.numpy()

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
            played_at,
            difficulty_rating,
            opponent_score,
            result_id
        FROM game_results
    """

    # ADD GAME INSTANCE STUFFS -> num_incorrect, time_to_complete etc to form difficulty vector 
    cur.execute(query) 
    rows = cur.fetchall() # store

    #for row in rows:
        #print(row)  # test for if prints like the sample puzzle_data below

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

# initialize model
vae_model.load_state_dict(torch.load("vae_model.pth"))
vae_model.eval()
# play
difficulty_vector = torch.tensor([100, 0.6, 0.5]) 
generated_puzzle = generate_puzzle(vae_model, difficulty_vector)

if __name__ == "__main__":
    import json
    import random

    # List of puzzle functions
    puzzle_generators = [
        xor_aes,
        caesar_cipher_puzzle,
        subbytes_aes,
        shiftrows_aes,
        mixcolumns_aes,
        aes
    ]

    # Pick one at random
    selected_puzzle_func = random.choice(puzzle_generators)

    # Generate the puzzle
    puzzle = selected_puzzle_func()
    #print(generate_puzzle(vae_model, difficulty_vector)) prints a list of numbers
    # Output as JSON
    print(json.dumps(puzzle))
        