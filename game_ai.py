import random

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