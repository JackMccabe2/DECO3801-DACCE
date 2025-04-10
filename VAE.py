import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torch.utils.data import DataLoader, TensorDataset
import psycopg2
import Database

class Encoder(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(Encoder, self).__init__()
        self.fc1 = nn.Linear(input_dim, 128)
        self.fc2_mean = nn.Linear(128, latent_dim)
        self.fc2_logvar = nn.Linear(128, latent_dim)
        
    def forward(self, x):
        h = torch.relu(self.fc1(x))
        mean = self.fc2_mean(h)
        logvar = self.fc2_logvar(h)
        return mean, logvar

class Decoder(nn.Module):
    def __init__(self, latent_dim, output_dim):
        super(Decoder, self).__init__()
        self.fc1 = nn.Linear(latent_dim, 128)
        self.fc2 = nn.Linear(128, output_dim)

    def forward(self, z):
        h = torch.relu(self.fc1(z))
        return torch.sigmoid(self.fc2(h))  #normalised

# VAE
class VAE(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(VAE, self).__init__()
        self.encoder = Encoder(input_dim, latent_dim)
        self.decoder = Decoder(latent_dim, input_dim)

    def reparameterize(self, mean, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mean + eps * std

    def forward(self, x):
        mean, logvar = self.encoder(x)
        z = self.reparameterize(mean, logvar)
        return self.decoder(z), mean, logvar

def loss_function(recon_x, x, mean, logvar):
    recon_loss = nn.functional.mse_loss(recon_x, x, reduction='sum')
    kl_loss = -0.5 * torch.sum(1 + logvar - mean.pow(2) - logvar.exp())
    return recon_loss + kl_loss

def train_vae(model, data_loader, epochs=20, lr=0.001):
    optimizer = optim.Adam(model.parameters(), lr=lr)
    model.train()
    for epoch in range(epochs):
        epoch_loss = 0
        for batch in data_loader:
            batch = batch[0]  
            batch = batch.to(torch.float32)  

            optimizer.zero_grad()
            recon_x, mean, logvar = model(batch)
            loss = loss_function(recon_x, batch, mean, logvar)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
        print(f"Epoch {epoch+1}, Loss: {epoch_loss / len(data_loader)}")

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

# convert to PyTorch TensorDataset
puzzle_tensor = torch.tensor(puzzle_data)
dataset = TensorDataset(puzzle_tensor)
data_loader = DataLoader(dataset, batch_size=BATCH_SIZE)

# initialize model
vae_model = VAE(INPUT_DIM, LATENT_DIM)

# train
print("Training VAE...")
train_vae(vae_model, data_loader, epochs=EPOCHS, lr=LEARNING_RATE)
# Save trained VAE model
torch.save(vae_model.state_dict(), "vae_model.pth")
