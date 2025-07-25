import os
import numpy as np
import tensorflow as tf
from src.utils import load_and_preprocess_data
from src.utils import evaluate_model
from src.generator import build_generator
from src.discriminator import build_discriminator
from src.loss import generator_loss, discriminator_loss

# Hyperparameters

best_psnr = -float('inf')
IMG_SIZE = 256
BATCH_SIZE = 4
EPOCHS = 1
LAMBDA = 100

# Load data
train_noisy, train_clean = load_and_preprocess_data("data/train/noisy", "data/train/clean", img_size=IMG_SIZE)
val_noisy, val_clean = load_and_preprocess_data("data/val/noisy", "data/val/clean", img_size=IMG_SIZE)

# Build models
generator = build_generator()
discriminator = build_discriminator()

# Optimizers
gen_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)
disc_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)

@tf.function
def train_step(noisy_image, clean_image):
    with tf.GradientTape() as gen_tape, tf.GradientTape() as disc_tape:
        generated_image = generator(noisy_image, training=True)

        real_output = discriminator(clean_image, training=True)
        fake_output = discriminator(generated_image, training=True)

        gen_loss = generator_loss(fake_output, generated_image, clean_image)
        disc_loss = discriminator_loss(real_output, fake_output)

    gen_gradients = gen_tape.gradient(gen_loss, generator.trainable_variables)
    disc_gradients = disc_tape.gradient(disc_loss, discriminator.trainable_variables)

    gen_optimizer.apply_gradients(zip(gen_gradients, generator.trainable_variables))
    disc_optimizer.apply_gradients(zip(disc_gradients, discriminator.trainable_variables))

# Training loop
for epoch in range(EPOCHS):
    print(f"Epoch {epoch+1}/{EPOCHS}")
    for i in range(0, len(train_noisy), BATCH_SIZE):
        noisy_batch = train_noisy[i:i+BATCH_SIZE]
        clean_batch = train_clean[i:i+BATCH_SIZE]
        train_step(noisy_batch, clean_batch)

    # Save the best model
    val_psnr = evaluate_model(generator, val_noisy, val_clean)
    if val_psnr > best_psnr:
        best_psnr = val_psnr
        generator.save("models/best_model.h5")