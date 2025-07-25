import os
import numpy as np
import tensorflow as tf
from src.utils import load_and_preprocess_data, evaluate_model
from src.generator import build_generator
from src.discriminator import build_discriminator
from src.loss import generator_loss, discriminator_loss

# Hyperparameters
IMG_SIZE = 256
BATCH_SIZE = 4
EPOCHS = 1

# Load data
train_noisy, train_clean = load_and_preprocess_data("data/train/noisy", "data/train/clean", img_size=IMG_SIZE)
val_noisy, val_clean = load_and_preprocess_data("data/val/noisy", "data/val/clean", img_size=IMG_SIZE)

# Pre-trained VGG16 model for perceptual loss
vgg16 = tf.keras.applications.VGG16(include_top=False, weights='imagenet', input_shape=(256, 256, 3))
vgg16.trainable = False  # Freeze the pre-trained model

# Function to build and train the GAN model
def train_and_evaluate_model(LAMBDA_L1, LAMBDA_PERCEPTUAL):
    print(f"Training with LAMBDA_L1={LAMBDA_L1}, LAMBDA_PERCEPTUAL={LAMBDA_PERCEPTUAL}")
    
    # Build models
    generator = build_generator()
    discriminator = build_discriminator()

    # Optimizers
    gen_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)
    disc_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)

    @tf.function
    def train_step(noisy_image, clean_image):
        with tf.GradientTape() as gen_tape, tf.GradientTape() as disc_tape:
            # Generate denoised image
            generated_image = generator(noisy_image, training=True)

            # Discriminator outputs
            real_output = discriminator(clean_image, training=True)
            fake_output = discriminator(generated_image, training=True)

            # Calculate losses
            gen_loss = generator_loss(
                fake_output, generated_image, clean_image,
                lambda_l1=LAMBDA_L1, lambda_perceptual=LAMBDA_PERCEPTUAL, vgg16=vgg16
            )
            disc_loss = discriminator_loss(real_output, fake_output)

        # Compute gradients
        gen_gradients = gen_tape.gradient(gen_loss, generator.trainable_variables)
        disc_gradients = disc_tape.gradient(disc_loss, discriminator.trainable_variables)

        # Apply gradients
        gen_optimizer.apply_gradients(zip(gen_gradients, generator.trainable_variables))
        disc_optimizer.apply_gradients(zip(disc_gradients, discriminator.trainable_variables))

    # Training loop
    best_psnr = -float('inf')
    for epoch in range(EPOCHS):
        print(f"Epoch {epoch+1}/{EPOCHS}")

        # Train on batches
        for i in range(0, len(train_noisy), BATCH_SIZE):
            noisy_batch = train_noisy[i:i+BATCH_SIZE]
            clean_batch = train_clean[i:i+BATCH_SIZE]
            train_step(noisy_batch, clean_batch)

        # Evaluate on validation set
        val_psnr = evaluate_model(generator, val_noisy, val_clean)
        print(f"Validation PSNR: {val_psnr:.4f}")

        # Track the best PSNR
        if val_psnr > best_psnr:
            best_psnr = val_psnr

    return best_psnr

# Perform cross-validation for lambda values
LAMBDA_L1_VALUES = [50, 100, 150, 200]  # Test different L1 loss weights
LAMBDA_PERCEPTUAL_VALUES = [5, 10, 15, 20]  # Test different perceptual loss weights

best_lambda_l1 = None
best_lambda_perceptual = None
best_psnr = -float('inf')

for lambda_l1 in LAMBDA_L1_VALUES:
    for lambda_perceptual in LAMBDA_PERCEPTUAL_VALUES:
        psnr = train_and_evaluate_model(lambda_l1, lambda_perceptual)
        print(f"Completed training with LAMBDA_L1={lambda_l1}, LAMBDA_PERCEPTUAL={lambda_perceptual}, PSNR={psnr:.4f}")
        
        # Update best hyperparameters
        if psnr > best_psnr:
            best_psnr = psnr
            best_lambda_l1 = lambda_l1
            best_lambda_perceptual = lambda_perceptual

print("\nCross-validation completed.")
print(f"Best LAMBDA_L1: {best_lambda_l1}")
print(f"Best LAMBDA_PERCEPTUAL: {best_lambda_perceptual}")
print(f"Best Validation PSNR: {best_psnr:.4f}")