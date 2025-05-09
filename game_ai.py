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
        print("Success! You've decrypted the message.")
        return True
    else:
        print(f"Incorrect! The correct plaintext was: {plaintext.decode()}")
        return False
    
def caesar_cipher_puzzle():
    print("\n Caesar Cipher Puzzle\n")

    shift = random.randint(1, 25)
    answer = "SECURE"
    ciphertext = ''.join(chr(((ord(c) - 65 + shift) % 26) + 65) for c in answer)

    print(f"Encrypted Message: {ciphertext}")
    guess = input("Enter the original word: ").strip().upper()

    if guess == answer:
        print("Nice job! You cracked the Caesar cipher.")
    else:
        print(f"Nope! The correct answer was: {answer}")

# the following puzzles of AES aim to break up the steps used in AES decryption
# and teach them seperately

def subbytes_aes():
    print("\nSubBytes Puzzle - Learn AES Byte Substitution\n")
    # the scale for this question is too large right now!! (too difficult)
    s_box = [
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
        0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76
    ]

    # Generate a short 4-byte input for simplicity
    input_block = bytes([random.randint(0, 15) for _ in range(4)])
    expected = bytes([s_box[b] for b in input_block])
    question = {
        "instruction": "Apply the SubBytes step using the AES S-box. Enter the substituted output (in hex, 8 characters).",
        "input_bytes": input_block.hex(),
        "s_box": s_box
    }
    return {
        "question": question,
        "answer": expected.hex()
    }

def shiftrows_aes():
    print("\n🌀 ShiftRows Puzzle - Learn AES Row Shifting!\n")
    # the scale for this question is too large right now!! (too difficult)
    block = [i for i in range(16)] 
    # 16-byte block as a 4x4 matrix
    print("Original 4x4 state matrix (row-major order):")
    for i in range(4):
        print(block[i::4])  # print as matrix

    # e.g. rows shifted left by 0, 1, 2, 3
    state = [block[i::4] for i in range(4)]  # columns -> rows
    for r in range(4):
        state[r] = state[r][r:] + state[r][:r]  # shifting row

    # back into state
    shifted = [state[i % 4][i // 4] for i in range(16)]

    print("\nAfter ShiftRows, enter the new block as hex characters (no spaces):")
    answer = input("Your answer: ").strip().lower()
    expected = ''.join([format(b, '02x') for b in shifted])

    if answer == expected:
        print("Correct!")
    else:
        print("Incorrect. Expected:", expected)

def mixcolumns_aes():
    print("\nMix Columns Puzzle\n")
    # note: simplify to addition modulo 256 instead of full AES field math, will fix more for
    # appropriate difficulty
    # 1 column = 4 bytes
    column = [random.randint(0, 255) for _ in range(4)]
    mix_vector = [2, 1, 1, 3]  # a matrix

    print("Input column: ", column)
    print("Mix vector:   ", mix_vector)
    mixed = [(column[i] + mix_vector[i]) % 256 for i in range(4)]

    print("Enter the resulting column as 8 hex digits (e.g. 'asdfghjk'):")
    answer = input("Your answer: ").strip().lower()
    expected = ''.join([format(b, '02x') for b in mixed])

    if answer == expected:
        print("Correct!")
    else:
        print("Incorrect. Expected:", expected)

def xor_aes():
    import random
    # can change the range here as a difficulty parameter
    plaintext = bytes([random.randint(0, 255) for _ in range(2)])
    key = bytes([random.randint(0, 255) for _ in range(2)])
    expected = bytes([p ^ k for p, k in zip(plaintext, key)])
    
    question = "instruction: Enter the hex result of XOR-ing each byte \nplaintext: ", plaintext.hex(), "\nkey: ", key.hex()
    

    #answer = input("Your answer: ").strip().lower()
    #return question, answer
    return {
        "question": question,
        "answer": expected.hex()
    }

def play_puzzle(puzzle_vector):

    key_length = int(1024 + puzzle_vector[1] * 2048)
    steps = int(2 + puzzle_vector[2] * 8)
    entropy = round(puzzle_vector[3], 2)
    solution_length = 4

    #print("\n=== Hacking Challenge ===")
    #print(f"Key Length: {key_length}-bit")
    #print(f"Steps Required: {steps}")
    #print(f"Entropy Level: {entropy}")
    #print(f"Solution Length: {solution_length} bytes")
    question, answer = xor_aes()
    return question, answer

# Generating a new puzzle
def generate_puzzle(model, difficulty_vector):
    with torch.no_grad():
        generated_puzzle = model.decoder(difficulty_vector)
    return generated_puzzle.numpy()

def fetch_puzzle_data():
    """
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="georgiadocherty",
        password="D4t4b4se",
        port=5432
    )"""
    
    
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="jackmccabe",
        password="postgres",
        port=5432
    )

    cur = conn.cursor()
    # Need to select games info per session too.
    query = """ 
        SELECT
            result_id
        FROM game_results
    """
#opponent_score
#played_at
#difficulty_rating
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

#print("\nGenerated Puzzle:", generated_puzzle)
#print(play_puzzle(generated_puzzle) )

if __name__ == "__main__":
    #if len(sys.argv) > 1 and sys.argv[1] == "xor_aes":
        #difficulty_vector = torch.tensor([0.7, 0.6, 0.5])
        #generated_puzzle = generate_puzzle(vae_model, difficulty_vector)
    puzzle = xor_aes()
    output = json.dumps(puzzle)
    print(json.dumps(puzzle))
    #print(json.dumps(puzzle))
        

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

# send to server
# from server, print to frontend terminal