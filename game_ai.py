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
    aes()