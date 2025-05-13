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
import uuid

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
        "id": str(uuid.uuid4()),
        "type": "AES",
        "question": question,
        "answer": plaintext.decode()  # "ACCESSGRANTED!"
    }
    
def caesar_cipher_puzzle():
    shift = random.randint(1, 25)
    answer = "SECURE"
    ciphertext = ''.join(chr(((ord(c) - 65 + shift) % 26) + 65) for c in answer)

    question = (
        f"Caesar Cipher Puzzle: \n"
        f"Ciphertext: {ciphertext}" #| Hint: The shift used is {shift} \n"
        #f"Original word is uppercase A–Z only."
        f" Hint: The shift used is {shift} \n"
    )

    return {
        "id": str(uuid.uuid4()),
        "type": "ceasar_cipher",
        "question": question,
        "answer": answer
    }

# the following puzzles of AES aim to break up the steps used in AES decryption
# and teach them seperately

def subbytes_aes():
    # Simplified AES S-box with only 16 entries for this puzzle
    s_box = [
        0x63, 0x7c, 0x77, 0x7b,
        0xf2, 0x6b, 0x6f, 0xc5,
        0x30, 0x01, 0x67, 0x2b,
        0xfe, 0xd7, 0xab, 0x76
    ]

    # Generate a 4-byte input using values from 0 to 15 (indexable into the s_box)
    input_block = bytes([random.randint(0, 15) for _ in range(4)])
    expected = bytes([s_box[b] for b in input_block])

    # Format S-box as a lookup table
    s_box_table = '\n'.join([f"{i:02x}: {s_box[i]:02x}" for i in range(16)])

    # Create question prompt with helper table
    question = (
        f"SubBytes Puzzle:\n"
        f"Input (hex): {input_block.hex()}\n"
        f"Use the S-box below to substitute each byte of the input:\n"
        f"{s_box_table}\n"
       
    )

    return {
        "id": str(uuid.uuid4()),
        "type": "AES_sub_bytes",
        "question": question,
        "answer": expected.hex()
    }

def shiftrows_aes():
    # easy -> do w/o hex, smaller matricies, maybe button for shifting rows
    # Generate a 16-byte block as a 4x4 matrix 
    block = [i for i in range(16)]

    # Convert columns into rows
    state = [block[i::4] for i in range(4)]

    # Apply AES ShiftRows
    for r in range(4):
        state[r] = state[r][r:] + state[r][:r]

    # Flatten back to column-major order
    shifted = [state[i % 4][i // 4] for i in range(16)]
    expected = ''.join([format(b, '02x') for b in shifted])

    # Format the 4 rows for display
    row_view = "\n".join([f"Row {i}: {state[i]}" for i in range(4)])

    question = (
        f"Row Shift Puzzle:\n"
        f"{row_view}\n\n"
        f"Submit the result as a 32-character hex string."
    )

    return {
        "id": str(uuid.uuid4()),
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
        f"Column mixing puzzle:\n"
        f"Input column: {column} | Mix vector: {mix_vector}   \n"
        #f"Return the result as an 8-character hex string."
    )

    return {
        "id": str(uuid.uuid4()),
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
    
    question = "XOR Puzzle: \nplaintext: ", plaintext.hex(), "\nkey: ", key.hex()
    
    return {
        "id": str(uuid.uuid4()),
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
        #aes
    ]

    # Pick one at random
    selected_puzzle_func = random.choice(puzzle_generators)

    # Generate the puzzle
    puzzle = selected_puzzle_func()
    #print(generate_puzzle(vae_model, difficulty_vector)) prints a list of numbers
    # Output as JSON
    print(json.dumps(puzzle))
        