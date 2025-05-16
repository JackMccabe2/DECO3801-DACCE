import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torch.utils.data import DataLoader, TensorDataset
import psycopg2
import os
from dotenv import load_dotenv, dotenv_values 

# Takes input data and maps it to a lower-dimensional latent space,
# outputting the mean and log variance of the latent space distribution.
class Encoder(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(Encoder, self).__init__()
        self.fc1 = nn.Linear(input_dim, 128)
        self.fc2_mean = nn.Linear(128, latent_dim)
        self.fc2_logvar = nn.Linear(128, latent_dim)
    
    # forward pass
    # x: input data
    def forward(self, x):
        h = torch.relu(self.fc1(x))
        mean = self.fc2_mean(h)
        logvar = self.fc2_logvar(h)
        return mean, logvar

# Takes a point from the latent space and maps it back to the original data space.
class Decoder(nn.Module):
    def __init__(self, latent_dim, output_dim):
        super(Decoder, self).__init__()
        self.fc1 = nn.Linear(latent_dim, 128)
        self.fc2 = nn.Linear(128, output_dim)

    # forward pass.
    # z: a point sampled from the latent space
    def forward(self, z):
        h = torch.relu(self.fc1(z))
        return torch.sigmoid(self.fc2(h))  #normalised

# VAE
# Combines an Encoder and a Decoder to learn a compressed representation (latent space)
# of the input data and then reconstruct the data from this representation.
class VAE(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(VAE, self).__init__()
        self.encoder = Encoder(input_dim, latent_dim)
        self.decoder = Decoder(latent_dim, input_dim)

    # Implements the reparameterization trick.
    # This allows backpropagation through the sampling process by introducing a deterministic
    # transformation of a random variable.
    # mean: mean of the latent distribution from the encoder
    # logvar: log variance of the latent distribution from the encoder
    def reparameterize(self, mean, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mean + eps * std

    # forward pass for the entire VAE model.
    # x: input data
    def forward(self, x):
        mean, logvar = self.encoder(x)
        z = self.reparameterize(mean, logvar)
        return self.decoder(z), mean, logvar
    
# Calculates the loss function.
# Loss here is composed of two parts:
# 1. Reconstruction loss: How well the decoder reconstructs the input data (MSE).
# 2. KL divergence: A regularizer that measures how much the learned latent distribution
#    diverges from a prior distribution (typically a standard normal distribution).
# recon_x: reconstructed data from the decoder
# x: original input data
# mean: mean of the latent distribution
# logvar: log variance of the latent distribution
def loss_function(recon_x, x, mean, logvar):
    # Mean Squared Error for reconstruction loss
    recon_loss = nn.functional.mse_loss(recon_x, x, reduction='sum')
    # divergence between the learned latent distribution and a standard normal distribution
    kl_loss = -0.5 * torch.sum(1 + logvar - mean.pow(2) - logvar.exp())
    return recon_loss + kl_loss # Total loss

# trains the model
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
        #print(f"Epoch {epoch+1}, Loss: {epoch_loss / len(data_loader)}")

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

    load_dotenv()

    print(os.getenv("DB_HOST"))
    print(os.getenv("DB_NAME"))
    print(os.getenv("DB_USER"))
    print(os.getenv("DB_PASSWORD"))
    print(os.getenv("DB_PORT"))
    
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
    
    cur = conn.cursor()
    # Need to select games info per session too.
    # update this, a few changes in the way database stuff is stored 
    query = """ 
        SELECT
            opponent_score,
            played_at,
            difficulty_rating,
            result_id
        FROM game_results 
    """
    query = """
        SELECT
            answers_right
            answers_wrong
            wrong_answer_question_type
            """
    cur.execute(query) 
    rows = cur.fetchall() # store

    #for row in rows:
        #print(row)  # test for if prints like the sample puzzle_data below

    cur.close()
    conn.close()

    # will adjust puzzle rows to be model-parseable here.
    #print(rows)
    return rows

#fetch_puzzle_data()
#print(fetch_puzzle_data())
# passes an array atm 
# [[],[],[]]
# [("strings", int), (etc)] 

# Sample dataset 
puzzle_data = np.array([
    [1, 0.5, 0.2, 0.7, 0.4, 0.3],  
    [0, 0.8, 0.5, 0.6, 0.2, 0.1],
    [1, 0.4, 0.3, 0.9, 0.6, 0.7],
    [0, 0.6, 0.4, 0.8, 0.3, 0.5]
], dtype=np.float32)

# convert to PyTorch TensorDataset
puzzle_tensor = torch.tensor(puzzle_data)
dataset = TensorDataset(puzzle_tensor) # will change to fetch_puzzle_data()
data_loader = DataLoader(dataset, batch_size=BATCH_SIZE)

# initialize model
vae_model = VAE(INPUT_DIM, LATENT_DIM)

# train
# need to add a periodic if statement on this to ensure the model isn't trained every time.
#print("Training VAE...")
train_vae(vae_model, data_loader, epochs=EPOCHS, lr=LEARNING_RATE)
# Save trained VAE model
torch.save(vae_model.state_dict(), "vae_model.pth")
