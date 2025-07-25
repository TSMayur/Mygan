import os
import numpy as np
import tensorflow as tf
from src.utils import load_and_preprocess_data, evaluate_model
from src.generator import build_generator
from src.discriminator import build_discriminator
from src.loss import generator_loss, discriminator_loss

# Hyperparameters
best_psnr = -float('inf')
IMG_SIZE = 256
BATCH_SIZE = 4
EPOCHS = 100
LAMBDA_L1 = 100  # Weight for L1 loss in generator
LAMBDA_PERCEPTUAL = 10  # Weight for perceptual loss in generator

# Load data
train_noisy, train_clean = load_and_preprocess_data("data/train/noisy", "data/train/clean", img_size=IMG_SIZE)
val_noisy, val_clean = load_and_preprocess_data("data/val/noisy", "data/val/clean", img_size=IMG_SIZE)

# Build models
generator = build_generator()
discriminator = build_discriminator()

# Optimizers
gen_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)
disc_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)

# Load VGG16 model with pre-trained weights
def load_vgg16():
    try:
        # Attempt to load VGG16 weights from the internet
        vgg16 = tf.keras.applications.VGG16(include_top=False, weights='imagenet', input_shape=(256, 256, 3))
    except Exception as e:
        print(f"Error loading VGG16 weights: {e}")
        print("Attempting to load weights from local file...")
        # Specify the path to the locally downloaded weights
        local_weights_path = "./weights/vgg16_weights_tf_dim_ordering_tf_kernels_notop.h5"
        if os.path.exists(local_weights_path):
            vgg16 = tf.keras.applications.VGG16(include_top=False, weights=None, input_shape=(256, 256, 3))
            vgg16.load_weights(local_weights_path)
            print("VGG16 weights loaded successfully from local file.")
        else:
            raise FileNotFoundError(f"Local weights file not found at: {local_weights_path}")
    vgg16.trainable = False  # Freeze the pre-trained model
    return vgg16

vgg16 = load_vgg16()

@tf.function
def train_step(noisy_image, clean_image):
    with tf.GradientTape() as gen_tape, tf.GradientTape() as disc_tape:
        # Generate denoised image
        generated_image = generator(noisy_image, training=True)

        # Discriminator outputs
        real_output = discriminator(clean_image, training=True)
        fake_output = discriminator(generated_image, training=True)

        # Calculate losses
        gen_loss = generator_loss(fake_output, generated_image, clean_image, lambda_l1=LAMBDA_L1, lambda_perceptual=LAMBDA_PERCEPTUAL)
        disc_loss = discriminator_loss(real_output, fake_output)

    # Compute gradients
    gen_gradients = gen_tape.gradient(gen_loss, generator.trainable_variables)
    disc_gradients = disc_tape.gradient(disc_loss, discriminator.trainable_variables)

    # Apply gradients
    gen_optimizer.apply_gradients(zip(gen_gradients, generator.trainable_variables))
    disc_optimizer.apply_gradients(zip(disc_gradients, discriminator.trainable_variables))

# Training Loop
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

    # Save the best model
    if val_psnr > best_psnr:
        best_psnr = val_psnr
        print(f"New best PSNR: {best_psnr:.4f}. Saving model...")
        generator.save("models/best_model.h5")